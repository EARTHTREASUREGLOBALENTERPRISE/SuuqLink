import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import {
  db,
  ordersTable,
  cartItemsTable,
  productsTable,
} from "@workspace/db";
import type { OrderItemRow, TimelineEvent } from "@workspace/db";
import {
  ListOrdersResponse,
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";
import { getCurrentUser } from "../lib/session";
import { getVendorById } from "../lib/serialize";

const router: IRouter = Router();

function serializeOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    reference: o.reference,
    status: o.status as
      | "placed"
      | "confirmed"
      | "packed"
      | "shipped"
      | "out_for_delivery"
      | "delivered"
      | "cancelled",
    items: o.items,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    tax: Number(o.tax),
    total: Number(o.total),
    currency: o.currency,
    shippingAddress: o.shippingAddress,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
    estimatedDelivery: o.estimatedDelivery,
    timeline: o.timeline,
  };
}

router.get("/orders", async (_req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.json(ListOrdersResponse.parse([]));
    return;
  }
  const rows = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, user.id))
    .orderBy(desc(ordersTable.createdAt));
  res.json(ListOrdersResponse.parse(rows.map(serializeOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cartRows = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, user.id));
  if (cartRows.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  const items: OrderItemRow[] = [];
  let subtotal = 0;
  let currency = "USD";
  let nextItemId = 1;
  for (const c of cartRows) {
    const [p] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, c.productId));
    if (!p) continue;
    const vendor = await getVendorById(p.vendorId);
    const price = Number(p.price);
    subtotal += price * c.quantity;
    currency = p.currency;
    items.push({
      id: nextItemId++,
      productId: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
      vendorName: vendor?.name ?? "Vendor",
      price,
      currency,
      quantity: c.quantity,
    });
  }
  subtotal = +subtotal.toFixed(2);
  const shipping = subtotal > 100 ? 0 : 4.99;
  const tax = +(subtotal * 0.05).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const reference = `SQ-${100000 + Math.floor(Math.random() * 900000)}`;
  const now = Date.now();
  const timeline: TimelineEvent[] = [
    {
      status: "placed",
      label: "Order placed",
      at: new Date(now).toISOString(),
      completed: true,
    },
    {
      status: "confirmed",
      label: "Confirmed by seller",
      at: new Date(now + 3600000).toISOString(),
      completed: false,
    },
    {
      status: "packed",
      label: "Packed",
      at: new Date(now + 86400000).toISOString(),
      completed: false,
    },
    {
      status: "shipped",
      label: "Shipped",
      at: new Date(now + 86400000 * 2).toISOString(),
      completed: false,
    },
    {
      status: "out_for_delivery",
      label: "Out for delivery",
      at: new Date(now + 86400000 * 3).toISOString(),
      completed: false,
    },
    {
      status: "delivered",
      label: "Delivered",
      at: new Date(now + 86400000 * 4).toISOString(),
      completed: false,
    },
  ];
  const [created] = await db
    .insert(ordersTable)
    .values({
      userId: user.id,
      reference,
      status: "placed",
      items,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      currency,
      shippingAddress: {
        fullName: parsed.data.shippingAddress.fullName,
        phone: parsed.data.shippingAddress.phone,
        line1: parsed.data.shippingAddress.line1,
        line2: parsed.data.shippingAddress.line2 ?? null,
        city: parsed.data.shippingAddress.city,
        region: parsed.data.shippingAddress.region,
        country: parsed.data.shippingAddress.country,
        notes: parsed.data.shippingAddress.notes ?? null,
      },
      paymentMethod: parsed.data.paymentMethod,
      estimatedDelivery: new Date(now + 86400000 * 4),
      timeline,
    })
    .returning();
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, user.id));
  res.status(201).json(GetOrderResponse.parse(serializeOrder(created)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const parsed = GetOrderParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, parsed.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(GetOrderResponse.parse(serializeOrder(order)));
});

export default router;
