import { Router, type IRouter } from "express";
import { eq, ilike, sql } from "drizzle-orm";
import { db, vendorsTable, productsTable } from "@workspace/db";
import {
  ListVendorsQueryParams,
  ListVendorsResponse,
  GetVendorParams,
  GetVendorResponse,
  GetVendorProductsParams,
  GetVendorProductsResponse,
} from "@workspace/api-zod";
import {
  serializeVendor,
  serializeProduct,
  productCountMap,
} from "../lib/serialize";

const router: IRouter = Router();

router.get("/vendors", async (req, res): Promise<void> => {
  const parsed = ListVendorsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  let rows = await db.select().from(vendorsTable);
  if (parsed.data.q) {
    const q = parsed.data.q.toLowerCase();
    rows = rows.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q),
    );
  }
  if (parsed.data.featured) {
    rows = rows.filter((v) => v.featured);
  }
  const counts = await productCountMap();
  res.json(
    ListVendorsResponse.parse(rows.map((v) => serializeVendor(v, counts))),
  );
  void ilike;
  void sql;
});

router.get("/vendors/:id", async (req, res): Promise<void> => {
  const parsed = GetVendorParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [vendor] = await db
    .select()
    .from(vendorsTable)
    .where(eq(vendorsTable.id, parsed.data.id));
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.vendorId, vendor.id));
  const counts = await productCountMap();
  const base = serializeVendor(vendor, counts);
  res.json(
    GetVendorResponse.parse({
      ...base,
      about: vendor.about,
      joinedAt: vendor.joinedAt,
      responseTimeMins: vendor.responseTimeMins,
      fulfillmentRate: Number(vendor.fulfillmentRate),
      products: products.map((p) => serializeProduct(p, vendor.name)),
    }),
  );
});

router.get("/vendors/:id/products", async (req, res): Promise<void> => {
  const parsed = GetVendorProductsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.vendorId, parsed.data.id));
  res.json(
    GetVendorProductsResponse.parse(products.map((p) => serializeProduct(p))),
  );
});

export default router;
