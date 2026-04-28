import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import {
  GetCartResponse,
  AddCartItemBody,
  AddCartItemResponse,
  UpdateCartItemParams,
  UpdateCartItemBody,
  UpdateCartItemResponse,
  RemoveCartItemParams,
  RemoveCartItemResponse,
  ClearCartResponse,
} from "@workspace/api-zod";
import { getCurrentUser, getVendorOrFallback } from "../lib/cart-helpers";
import { getVendorById } from "../lib/serialize";

const router: IRouter = Router();

async function buildCart(userId: number) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));
  const out = [] as Array<{
    id: number;
    productId: number;
    title: string;
    imageUrl: string;
    vendorName: string;
    price: number;
    currency: string;
    quantity: number;
    lineTotal: number;
  }>;
  let currency = "USD";
  for (const item of items) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId));
    if (!product) continue;
    const vendor = await getVendorById(product.vendorId);
    const price = Number(product.price);
    currency = product.currency;
    out.push({
      id: item.id,
      productId: product.id,
      title: product.title,
      imageUrl: product.imageUrl,
      vendorName: vendor?.name ?? "Vendor",
      price,
      currency,
      quantity: item.quantity,
      lineTotal: +(price * item.quantity).toFixed(2),
    });
  }
  const subtotal = +out.reduce((s, i) => s + i.lineTotal, 0).toFixed(2);
  const shipping = subtotal > 0 ? (subtotal > 100 ? 0 : 4.99) : 0;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const itemCount = out.reduce((s, i) => s + i.quantity, 0);
  return {
    items: out,
    subtotal,
    shipping,
    tax,
    total,
    currency,
    itemCount,
  };
}

router.get("/cart", async (_req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.json(
      GetCartResponse.parse({
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        currency: "USD",
        itemCount: 0,
      }),
    );
    return;
  }
  res.json(GetCartResponse.parse(await buildCart(user.id)));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const parsed = AddCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.userId, user.id),
        eq(cartItemsTable.productId, parsed.data.productId),
      ),
    );
  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + parsed.data.quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db
      .insert(cartItemsTable)
      .values({
        userId: user.id,
        productId: parsed.data.productId,
        quantity: parsed.data.quantity,
      });
  }
  res.json(AddCartItemResponse.parse(await buildCart(user.id)));
});

router.patch("/cart/items/:id", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateCartItemBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  if (body.data.quantity <= 0) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.id));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity: body.data.quantity })
      .where(eq(cartItemsTable.id, params.data.id));
  }
  res.json(UpdateCartItemResponse.parse(await buildCart(user.id)));
});

router.delete("/cart/items/:id", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const params = RemoveCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, params.data.id));
  res.json(RemoveCartItemResponse.parse(await buildCart(user.id)));
});

router.post("/cart/clear", async (_req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, user.id));
  res.json(ClearCartResponse.parse(await buildCart(user.id)));
});

void getVendorOrFallback;

export default router;
