import { pgTable, text, integer } from "drizzle-orm/pg-core";

// Single-row table for the demo's "current user" persona.
export const sessionTable = pgTable("session", {
  id: text("id").primaryKey().default("singleton"),
  userId: integer("user_id").notNull(),
});

export type SessionRow = typeof sessionTable.$inferSelect;
