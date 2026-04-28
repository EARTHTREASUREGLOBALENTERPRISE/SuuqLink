import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";

export const walletsTable = pgTable("wallets", {
  userId: integer("user_id").primaryKey(),
  balance: numeric("balance", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  pending: numeric("pending", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  lifetimeEarned: numeric("lifetime_earned", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  currency: text("currency").notNull().default("USD"),
  payoutMethod: text("payout_method").notNull().default("evc-plus"),
  payoutAccount: text("payout_account").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const walletTransactionsTable = pgTable("wallet_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(),
  description: text("description").notNull().default(""),
  refId: text("ref_id").notNull().default(""),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Wallet = typeof walletsTable.$inferSelect;
export type WalletTransaction = typeof walletTransactionsTable.$inferSelect;
