import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  referralsTable,
  subscriptionsTable,
  sessionTable,
  walletsTable,
  walletTransactionsTable,
} from "@workspace/db";
import type { Referral, Subscription, Wallet } from "@workspace/db";
import { z } from "zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

async function getCurrentUserId(): Promise<number> {
  const [s] = await db.select().from(sessionTable).where(eq(sessionTable.id, "singleton"));
  return s?.userId ?? 1;
}

function serializeReferral(r: Referral) {
  return {
    id: r.id,
    userId: r.userId,
    code: r.code,
    referredName: r.referredName,
    reward: Number(r.reward),
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  };
}

function serializeSubscription(s: Subscription) {
  return {
    id: s.id,
    userId: s.userId,
    tier: s.tier,
    status: s.status,
    priceMonthly: Number(s.priceMonthly),
    currency: s.currency,
    startedAt: s.startedAt.toISOString(),
    renewsAt: s.renewsAt ? s.renewsAt.toISOString() : null,
  };
}

function buildCode(userId: number): string {
  return "SUUQ" + (userId * 7 + 41).toString(36).toUpperCase().slice(0, 4);
}

router.get("/referrals", async (_req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const rows = await db
    .select()
    .from(referralsTable)
    .where(eq(referralsTable.userId, userId))
    .orderBy(desc(referralsTable.createdAt));
  const code = rows[0]?.code || buildCode(userId);
  const earned = rows
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + Number(r.reward), 0);
  const pending = rows.filter((r) => r.status === "pending").length;
  res.json({
    code,
    invitesUrl: `https://suuqlink.app/join?ref=${code}`,
    rewardPerSignup: 5,
    rewardPerSale: 10,
    totals: {
      joined: rows.length,
      completed: rows.filter((r) => r.status === "completed").length,
      pending,
      earnedUsd: earned,
    },
    invites: rows.map(serializeReferral),
  });
});

const SimulateBody = z.object({
  name: z.string().default("Friend"),
});

router.post("/referrals/simulate", async (req, res): Promise<void> => {
  const parsed = SimulateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const code = buildCode(userId);
  const [row] = await db
    .insert(referralsTable)
    .values({
      userId,
      code,
      referredName: parsed.data.name,
      reward: "5.00",
      status: "completed",
    })
    .returning();

  // Credit wallet
  const [w] = await db.select().from(walletsTable).where(eq(walletsTable.userId, userId));
  if (!w) {
    await db.insert(walletsTable).values({
      userId,
      balance: "5.00",
      pending: "0",
      lifetimeEarned: "5.00",
      currency: "USD",
      payoutMethod: "evc-plus",
      payoutAccount: "",
    });
  } else {
    await db
      .update(walletsTable)
      .set({
        balance: sql`${walletsTable.balance} + 5`,
        lifetimeEarned: sql`${walletsTable.lifetimeEarned} + 5`,
      })
      .where(eq(walletsTable.userId, userId));
  }
  await db.insert(walletTransactionsTable).values({
    userId,
    amount: "5.00",
    type: "referral",
    description: `Referral reward — ${parsed.data.name} joined SuuqLink`,
    refId: "REF-" + row.id,
    status: "completed",
  });
  res.status(201).json(serializeReferral(row));
});

router.get("/subscriptions", async (_req, res): Promise<void> => {
  const userId = await getCurrentUserId();
  const [active] = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.startedAt));
  res.json({
    active: active ? serializeSubscription(active) : null,
    tiers: [
      {
        slug: "starter",
        name: "Starter",
        priceMonthly: 0,
        tagline: "Perfect for posting your first listings",
        features: [
          "Up to 5 free listings",
          "Standard placement",
          "In-app chat with buyers",
          "5% platform commission",
        ],
      },
      {
        slug: "growth",
        name: "Growth",
        priceMonthly: 19,
        tagline: "Stand out and sell more",
        features: [
          "Unlimited listings",
          "Promoted on home + category pages",
          "Verified shop badge",
          "Sales analytics dashboard",
          "3% platform commission",
        ],
        popular: true,
      },
      {
        slug: "pro",
        name: "Pro",
        priceMonthly: 49,
        tagline: "For serious shops & dealerships",
        features: [
          "Everything in Growth",
          "Top-of-search placement",
          "Custom shop URL & banner",
          "Priority support, dedicated rep",
          "1.5% platform commission",
          "Wholesale listings & bulk import",
        ],
      },
    ],
  });
});

const SubscribeBody = z.object({
  tier: z.enum(["starter", "growth", "pro"]),
});

router.post("/subscriptions", async (req, res): Promise<void> => {
  const parsed = SubscribeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = await getCurrentUserId();
  const prices: Record<string, string> = {
    starter: "0",
    growth: "19.00",
    pro: "49.00",
  };
  await db
    .delete(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId));
  const [row] = await db
    .insert(subscriptionsTable)
    .values({
      userId,
      tier: parsed.data.tier,
      status: "active",
      priceMonthly: prices[parsed.data.tier] ?? "0",
      currency: "USD",
      renewsAt: new Date(Date.now() + 86400000 * 30),
    })
    .returning();
  res.status(201).json(serializeSubscription(row));
});

export default router;
