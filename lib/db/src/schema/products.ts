import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url").notNull().default(""),
  gallery: text("gallery").array().notNull().default([]),
  vendorId: integer("vendor_id").notNull(),
  categorySlug: text("category_slug").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 })
    .notNull()
    .default("4.7"),
  reviewCount: integer("review_count").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  badges: text("badges").array().notNull().default([]),
  shippingDays: integer("shipping_days").notNull().default(3),
  trendingScore: numeric("trending_score", { precision: 6, scale: 2 })
    .notNull()
    .default("0"),
  featured: boolean("featured").notNull().default(false),
  specs: jsonb("specs")
    .$type<Array<{ label: string; value: string }>>()
    .notNull()
    .default([]),
  reviews: jsonb("reviews")
    .$type<
      Array<{
        id: number;
        author: string;
        rating: number;
        body: string;
        createdAt: string;
      }>
    >()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof productsTable.$inferSelect;
