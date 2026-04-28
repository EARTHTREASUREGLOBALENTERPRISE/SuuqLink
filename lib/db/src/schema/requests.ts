import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const requestsTable = pgTable("requests", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").notNull(),
  buyerName: text("buyer_name").notNull().default(""),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull().default("other"),
  city: text("city").notNull().default(""),
  budget: numeric("budget", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("open"),
  offerCount: integer("offer_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  sellerName: text("seller_name").notNull().default(""),
  sellerRating: numeric("seller_rating", { precision: 3, scale: 2 })
    .notNull()
    .default("4.7"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type RequestRow = typeof requestsTable.$inferSelect;
export type Offer = typeof offersTable.$inferSelect;
