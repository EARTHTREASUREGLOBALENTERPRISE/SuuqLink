import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const vendorsTable = pgTable("vendors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  about: text("about").notNull().default(""),
  city: text("city").notNull().default(""),
  country: text("country").notNull().default(""),
  rating: numeric("rating", { precision: 3, scale: 2 })
    .notNull()
    .default("4.7"),
  reviewCount: integer("review_count").notNull().default(0),
  logoUrl: text("logo_url").notNull().default(""),
  coverUrl: text("cover_url").notNull().default(""),
  verified: boolean("verified").notNull().default(true),
  badges: text("badges").array().notNull().default([]),
  responseTimeMins: integer("response_time_mins").notNull().default(15),
  fulfillmentRate: numeric("fulfillment_rate", { precision: 4, scale: 3 })
    .notNull()
    .default("0.97"),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("active"),
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Vendor = typeof vendorsTable.$inferSelect;
