import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or, sql, asc } from "drizzle-orm";
import { db, listingsTable } from "@workspace/db";
import type { Listing } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

function serialize(l: Listing) {
  return {
    id: l.id,
    kind: l.kind,
    title: l.title,
    description: l.description,
    price: Number(l.price),
    currency: l.currency,
    negotiable: l.negotiable,
    condition: l.condition,
    category: l.category,
    city: l.city,
    area: l.area,
    imageUrl: l.imageUrl,
    gallery: l.gallery,
    attributes: l.attributes,
    sellerId: l.sellerId,
    sellerName: l.sellerName,
    sellerPhone: l.sellerPhone,
    contactMethods: l.contactMethods,
    status: l.status,
    featured: l.featured,
    promoted: l.promoted,
    viewCount: l.viewCount,
    saveCount: l.saveCount,
    createdAt: l.createdAt.toISOString(),
  };
}

const ListQuery = z.object({
  q: z.string().optional(),
  kind: z.string().optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  promoted: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

router.get("/listings", async (req, res): Promise<void> => {
  const parsed = ListQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { q, kind, category, city, sort, featured, promoted, limit } = parsed.data;
  const conditions: ReturnType<typeof eq>[] = [
    eq(listingsTable.status, "active"),
  ];
  if (kind) conditions.push(eq(listingsTable.kind, kind));
  if (category) conditions.push(eq(listingsTable.category, category));
  if (city) conditions.push(eq(listingsTable.city, city));
  if (featured) conditions.push(eq(listingsTable.featured, true));
  if (promoted) conditions.push(eq(listingsTable.promoted, true));
  if (q) {
    conditions.push(
      or(
        ilike(listingsTable.title, `%${q}%`),
        ilike(listingsTable.description, `%${q}%`),
        ilike(listingsTable.city, `%${q}%`),
      ) as ReturnType<typeof eq>,
    );
  }
  const where = and(...conditions);
  let order;
  switch (sort) {
    case "price_asc":
      order = asc(listingsTable.price);
      break;
    case "price_desc":
      order = desc(listingsTable.price);
      break;
    case "popular":
      order = desc(listingsTable.viewCount);
      break;
    case "newest":
    default:
      order = desc(listingsTable.createdAt);
  }
  const rows = await db
    .select()
    .from(listingsTable)
    .where(where)
    .orderBy(order)
    .limit(limit ?? 60);
  res.json({ items: rows.map(serialize), total: rows.length });
});

router.get("/listings/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(listingsTable)
    .where(
      and(eq(listingsTable.status, "active"), eq(listingsTable.featured, true)),
    )
    .orderBy(desc(listingsTable.createdAt))
    .limit(10);
  res.json(rows.map(serialize));
});

router.get("/listings/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(listingsTable).where(eq(listingsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  // Increment view count
  await db
    .update(listingsTable)
    .set({ viewCount: row.viewCount + 1 })
    .where(eq(listingsTable.id, id));
  res.json(serialize({ ...row, viewCount: row.viewCount + 1 }));
});

const CreateListingBody = z.object({
  kind: z.string().default("used"),
  title: z.string().min(3),
  description: z.string().default(""),
  price: z.coerce.number().min(0),
  currency: z.string().default("USD"),
  category: z.string().default("other"),
  condition: z.string().default("used"),
  city: z.string().default(""),
  area: z.string().default(""),
  imageUrl: z.string().default(""),
  gallery: z.array(z.string()).default([]),
  attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
  contactMethods: z.array(z.string()).default(["call", "chat"]),
  sellerName: z.string().default(""),
  sellerPhone: z.string().default(""),
  negotiable: z.boolean().default(true),
});

router.post("/listings", async (req, res): Promise<void> => {
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const main = d.imageUrl || `https://picsum.photos/seed/listing-${Date.now()}/800/600`;
  const [row] = await db
    .insert(listingsTable)
    .values({
      kind: d.kind,
      title: d.title,
      description: d.description,
      price: d.price.toFixed(2),
      currency: d.currency,
      negotiable: d.negotiable,
      condition: d.condition,
      category: d.category,
      city: d.city,
      area: d.area,
      imageUrl: main,
      gallery: d.gallery.length ? d.gallery : [main],
      attributes: d.attributes,
      sellerId: 1,
      sellerName: d.sellerName || "You",
      sellerPhone: d.sellerPhone,
      contactMethods: d.contactMethods,
      status: "active",
      featured: false,
      promoted: false,
      viewCount: 0,
      saveCount: 0,
    })
    .returning();
  res.status(201).json(serialize(row));
});

router.get("/listings/meta/stats", async (_req, res): Promise<void> => {
  const totalRow = await db
    .select({ c: sql<number>`cast(count(*) as int)` })
    .from(listingsTable);
  const byKind = await db
    .select({
      kind: listingsTable.kind,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(listingsTable)
    .groupBy(listingsTable.kind);
  res.json({
    total: Number(totalRow[0]?.c ?? 0),
    byKind: byKind.map((b) => ({ kind: b.kind, count: Number(b.count) })),
  });
});

export default router;
