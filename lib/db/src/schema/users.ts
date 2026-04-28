import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("buyer"),
  avatarUrl: text("avatar_url").notNull().default(""),
  language: text("language").notNull().default("en"),
  currency: text("currency").notNull().default("USD"),
  vendorId: integer("vendor_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
