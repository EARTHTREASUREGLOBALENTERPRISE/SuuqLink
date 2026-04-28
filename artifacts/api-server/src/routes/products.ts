import { Router, type IRouter } from "express";
import { and, eq, gte, lte, ilike, or, desc, asc, sql } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  ListFeaturedProductsResponse,
  ListTrendingProductsResponse,
  GetProductParams,
  GetProductResponse,
  GetRelatedProductsParams,
  GetRelatedProductsResponse,
  GetSearchSuggestionsQueryParams,
  GetSearchSuggestionsResponse,
} from "@workspace/api-zod";
import {
  serializeProduct,
  serializeProductsWithVendor,
  getVendorById,
  productCountMap,
  serializeVendor,
} from "../lib/serialize";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { q, category, vendorId, minPrice, maxPrice, sort, limit } = parsed.data;
  const conditions = [] as Array<ReturnType<typeof eq>>;
  if (category) conditions.push(eq(productsTable.categorySlug, category));
  if (vendorId) conditions.push(eq(productsTable.vendorId, vendorId));
  if (minPrice != null)
    conditions.push(gte(productsTable.price, String(minPrice)) as ReturnType<typeof eq>);
  if (maxPrice != null)
    conditions.push(lte(productsTable.price, String(maxPrice)) as ReturnType<typeof eq>);
  if (q) {
    conditions.push(
      or(
        ilike(productsTable.title, `%${q}%`),
        ilike(productsTable.description, `%${q}%`),
      ) as ReturnType<typeof eq>,
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  let order;
  switch (sort) {
    case "price_asc":
      order = asc(productsTable.price);
      break;
    case "price_desc":
      order = desc(productsTable.price);
      break;
    case "newest":
      order = desc(productsTable.createdAt);
      break;
    case "rating":
      order = desc(productsTable.rating);
      break;
    case "popular":
    default:
      order = desc(productsTable.trendingScore);
  }

  const lim = limit ?? 60;
  const rows = await db
    .select()
    .from(productsTable)
    .where(where)
    .orderBy(order)
    .limit(lim);
  const serialized = await serializeProductsWithVendor(rows);

  const totalRow = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(productsTable)
    .where(where);
  const total = Number(totalRow[0]?.c ?? serialized.length);

  res.json(ListProductsResponse.parse({ items: serialized, total }));
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true))
    .orderBy(desc(productsTable.trendingScore))
    .limit(8);
  res.json(
    ListFeaturedProductsResponse.parse(await serializeProductsWithVendor(rows)),
  );
});

router.get("/products/trending", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.trendingScore))
    .limit(10);
  res.json(
    ListTrendingProductsResponse.parse(await serializeProductsWithVendor(rows)),
  );
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const parsed = GetProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const vendor = await getVendorById(product.vendorId);
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }
  const counts = await productCountMap();
  const base = serializeProduct(product, vendor.name);
  res.json(
    GetProductResponse.parse({
      ...base,
      description: product.description,
      gallery: product.gallery,
      specs: product.specs,
      shippingDays: product.shippingDays,
      vendor: serializeVendor(vendor, counts),
      reviews: product.reviews,
    }),
  );
});

router.get("/products/:id/related", async (req, res): Promise<void> => {
  const parsed = GetRelatedProductsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const rows = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.categorySlug, product.categorySlug),
        sql`${productsTable.id} != ${product.id}`,
      ),
    )
    .limit(8);
  res.json(
    GetRelatedProductsResponse.parse(await serializeProductsWithVendor(rows)),
  );
});

router.get("/search/suggestions", async (req, res): Promise<void> => {
  const parsed = GetSearchSuggestionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const q = (parsed.data.q ?? "").trim().toLowerCase();
  const allProducts = await db.select().from(productsTable).limit(100);
  const filtered = q
    ? allProducts.filter((p) => p.title.toLowerCase().includes(q))
    : allProducts.slice(0, 6);
  const top = filtered.slice(0, 6);
  const serialized = await serializeProductsWithVendor(top);

  const titles = Array.from(new Set(filtered.map((p) => p.title))).slice(0, 6);
  // Suggest a few categories matching the query.
  const allCats = ["fashion", "electronics", "home", "beauty", "groceries", "crafts"];
  const matchedSlugs = q
    ? allCats.filter((c) => c.includes(q))
    : allCats.slice(0, 3);
  const counts = await db
    .select({
      slug: productsTable.categorySlug,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable)
    .groupBy(productsTable.categorySlug);
  const countMap = new Map(counts.map((c) => [c.slug, Number(c.count)]));
  const cats = matchedSlugs.map((slug, i) => ({
    id: i + 1,
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    icon: "Tag",
    accentColor: "#0d9488",
    productCount: countMap.get(slug) ?? 0,
  }));

  res.json(
    GetSearchSuggestionsResponse.parse({
      terms: titles,
      categories: cats,
      products: serialized,
    }),
  );
});

export default router;
