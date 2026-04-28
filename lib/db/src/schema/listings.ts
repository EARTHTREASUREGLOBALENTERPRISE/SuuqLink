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

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  negotiable: boolean("negotiable").notNull().default(true),
  condition: text("condition").notNull().default("used"),
  category: text("category").notNull().default("other"),
  city: text("city").notNull().default(""),
  area: text("area").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  gallery: text("gallery").array().notNull().default([]),
  attributes: jsonb("attributes")
    .$type<Record<string, string | number | boolean>>()
    .notNull()
    .default({}),
  sellerId: integer("seller_id").notNull(),
  sellerName: text("seller_name").notNull().default(""),
  sellerPhone: text("seller_phone").notNull().default(""),
  contactMethods: text("contact_methods").array().notNull().default([]),
  status: text("status").notNull().default("active"),
  featured: boolean("featured").notNull().default(false),
  promoted: boolean("promoted").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  saveCount: integer("save_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Listing = typeof listingsTable.$inferSelect;
