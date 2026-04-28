import {
  pgTable,
  serial,
  integer,
  text,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export type ShippingAddressRow = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  country: string;
  notes: string | null;
};

export type OrderItemRow = {
  id: number;
  productId: number;
  title: string;
  imageUrl: string;
  vendorName: string;
  price: number;
  currency: string;
  quantity: number;
};

export type TimelineEvent = {
  status: string;
  label: string;
  at: string;
  completed: boolean;
};

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reference: text("reference").notNull().unique(),
  status: text("status").notNull().default("placed"),
  items: jsonb("items").$type<OrderItemRow[]>().notNull().default([]),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  shippingAddress: jsonb("shipping_address")
    .$type<ShippingAddressRow>()
    .notNull(),
  paymentMethod: text("payment_method").notNull(),
  estimatedDelivery: timestamp("estimated_delivery", { withTimezone: true })
    .notNull(),
  timeline: jsonb("timeline").$type<TimelineEvent[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type OrderRow = typeof ordersTable.$inferSelect;
