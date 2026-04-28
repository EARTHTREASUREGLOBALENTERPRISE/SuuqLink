import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("ShoppingBag"),
  accentColor: text("accent_color").notNull().default("teal"),
});

export type Category = typeof categoriesTable.$inferSelect;
