import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import {
  db,
  walletsTable,
  walletTransactionsTable,
  sessionTable,
  usersTable,
} from "@workspace/db";
import type { Wallet, WalletTransaction } from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

async function getCurrentUserId(): Promise<number> {
  const [s] = await db.select().from(sessionTable).where(eq(sessionTable.id, "singleton"));
  return s?.userId ?? 1;
}

async function ensureWallet(userId: number): Promise<Wallet> {
  const [w] = await db.select().from(walletsTable).where(eq(walletsTable.userId, userId));
  if (w) return w;
  const [created] = await db
    .insert(walletsTable)
    .values({
      userId,
      balance: "0",
      pending: "0",
      lifetimeEarned: "0",
      currency: "USD",
      payoutMethod: "evc-plus",
      payoutAccount: "",
    })
    .returning();
  return created;
}

function serializeWallet(w: Wallet) {
  return {
    userId: w.userId,
    balance: Number(w.balance),
    pending: Number(w.pending),
    lifetimeEarned: Number(w.lifetimeEarned),
    currency: w.currency,
    payoutMethod: w.payoutMethod,
    payoutAccount: w.payoutAccount,
    updatedAt: w.updatedAt.toISOString(),
  };
}

function serializeTx(t: WalletTransaction) {
  return {
    id: t.id,
    userId: t.userId,
    amount: Number(t.amount),
    type: t.type,
    description: t.description,
    refId: t.refId,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
  };
}

router.get("/wallet", async (_req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const w = await ensureWallet(userId);
  const txs = await db
    .select()
    .from(walletTransactionsTable)
    .where(eq(walletTransactionsTable.userId, userId))
    .orderBy(desc(walletTransactionsTable.createdAt))
    .limit(50);
  res.json({
    wallet: serializeWallet(w),
    transactions: txs.map(serializeTx),
  });
});

const PayoutBody = z.object({
  amount: z.coerce.number().min(1),
  method: z.string().optional(),
  account: z.string().optional(),
});

router.post("/wallet/payout", async (req, res): Promise<void> => {
  const parsed = PayoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const w = await ensureWallet(userId);
  if (Number(w.balance) < parsed.data.amount) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }
  await db
    .update(walletsTable)
    .set({
      balance: sql`${walletsTable.balance} - ${parsed.data.amount.toFixed(2)}`,
      payoutMethod: parsed.data.method ?? w.payoutMethod,
      payoutAccount: parsed.data.account ?? w.payoutAccount,
      updatedAt: new Date(),
    })
    .where(eq(walletsTable.userId, userId));
  await db.insert(walletTransactionsTable).values({
    userId,
    amount: (-parsed.data.amount).toFixed(2),
    type: "payout",
    description: `Payout to ${parsed.data.method ?? w.payoutMethod}`,
    refId: "PYT-" + Math.floor(Math.random() * 9000 + 1000),
    status: "completed",
  });
  const w2 = await ensureWallet(userId);
  res.json({ wallet: serializeWallet(w2) });
});

router.get("/seller/dashboard", async (_req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const w = await ensureWallet(userId);
  const txs = await db
    .select()
    .from(walletTransactionsTable)
    .where(eq(walletTransactionsTable.userId, userId))
    .orderBy(desc(walletTransactionsTable.createdAt))
    .limit(8);

  // Build a 7-day revenue spark
  const days: Array<{ day: string; value: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      day: d.toLocaleDateString("en", { weekday: "short" }),
      value: Math.round(80 + Math.random() * 360),
    });
  }
  res.json({
    user: user ? { id: user.id, name: user.name, role: user.role } : null,
    wallet: serializeWallet(w),
    metrics: {
      todayRevenue: days[days.length - 1]?.value ?? 0,
      weekRevenue: days.reduce((s, d) => s + d.value, 0),
      orders7d: Math.floor(Math.random() * 14) + 6,
      views7d: Math.floor(Math.random() * 600) + 240,
      conversion: 0.034,
      activeListings: 4,
      pendingOffers: 2,
    },
    revenueSeries: days,
    recentActivity: txs.map(serializeTx),
  });
});

export default router;
