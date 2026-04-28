import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import {
  db,
  requestsTable,
  offersTable,
} from "@workspace/db";
import type { RequestRow, Offer } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

function serializeRequest(r: RequestRow) {
  return {
    id: r.id,
    buyerId: r.buyerId,
    buyerName: r.buyerName,
    title: r.title,
    description: r.description,
    category: r.category,
    city: r.city,
    budget: r.budget == null ? null : Number(r.budget),
    currency: r.currency,
    status: r.status,
    offerCount: r.offerCount,
    createdAt: r.createdAt.toISOString(),
  };
}

function serializeOffer(o: Offer) {
  return {
    id: o.id,
    requestId: o.requestId,
    sellerId: o.sellerId,
    sellerName: o.sellerName,
    sellerRating: Number(o.sellerRating),
    price: Number(o.price),
    currency: o.currency,
    message: o.message,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  };
}

router.get("/requests", async (req, res): Promise<void> => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const city = typeof req.query.city === "string" ? req.query.city : undefined;
  const conditions = [];
  if (category) conditions.push(eq(requestsTable.category, category));
  if (city) conditions.push(eq(requestsTable.city, city));
  const rows = conditions.length
    ? await db
        .select()
        .from(requestsTable)
        .where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions[1]}`)
        .orderBy(desc(requestsTable.createdAt))
    : await db.select().from(requestsTable).orderBy(desc(requestsTable.createdAt));
  res.json(rows.map(serializeRequest));
});

router.get("/requests/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db.select().from(requestsTable).where(eq(requestsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Request not found" });
    return;
  }
  const offers = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.requestId, id))
    .orderBy(desc(offersTable.createdAt));
  res.json({
    ...serializeRequest(row),
    offers: offers.map(serializeOffer),
  });
});

const CreateRequestBody = z.object({
  title: z.string().min(3),
  description: z.string().default(""),
  category: z.string().default("other"),
  city: z.string().default(""),
  budget: z.coerce.number().nullable().optional(),
  currency: z.string().default("USD"),
});

router.post("/requests", async (req, res): Promise<void> => {
  const parsed = CreateRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [row] = await db
    .insert(requestsTable)
    .values({
      buyerId: 1,
      buyerName: "You",
      title: d.title,
      description: d.description,
      category: d.category,
      city: d.city,
      budget: d.budget != null ? d.budget.toFixed(2) : null,
      currency: d.currency,
      status: "open",
      offerCount: 0,
    })
    .returning();
  res.status(201).json(serializeRequest(row));
});

const CreateOfferBody = z.object({
  price: z.coerce.number().min(0),
  message: z.string().default(""),
  sellerName: z.string().default("You"),
});

router.post("/requests/:id/offers", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  const parsed = CreateOfferBody.safeParse(req.body);
  if (!Number.isFinite(id) || !parsed.success) {
    res.status(400).json({ error: parsed.success ? "Invalid id" : parsed.error.message });
    return;
  }
  const [row] = await db
    .insert(offersTable)
    .values({
      requestId: id,
      sellerId: 2,
      sellerName: parsed.data.sellerName,
      sellerRating: "4.7",
      price: parsed.data.price.toFixed(2),
      currency: "USD",
      message: parsed.data.message,
      status: "pending",
    })
    .returning();
  await db
    .update(requestsTable)
    .set({
      offerCount: sql`${requestsTable.offerCount} + 1`,
    })
    .where(eq(requestsTable.id, id));
  res.status(201).json(serializeOffer(row));
});

export default router;
