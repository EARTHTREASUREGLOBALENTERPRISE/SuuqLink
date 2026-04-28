import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  code: text("code").notNull(),
  referredName: text("referred_name").notNull().default(""),
  reward: numeric("reward", { precision: 12, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("joined"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tier: text("tier").notNull().default("starter"),
  status: text("status").notNull().default("active"),
  priceMonthly: numeric("price_monthly", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  currency: text("currency").notNull().default("USD"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  renewsAt: timestamp("renews_at", { withTimezone: true }),
});

export type Referral = typeof referralsTable.$inferSelect;
export type Subscription = typeof subscriptionsTable.$inferSelect;
