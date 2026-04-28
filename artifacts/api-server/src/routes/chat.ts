import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import {
  db,
  conversationsTable,
  messagesTable,
} from "@workspace/db";
import {
  ListConversationsResponse,
  StartConversationBody,
  StartConversationResponse,
  GetConversationParams,
  GetConversationResponse,
  SendMessageParams,
  SendMessageBody,
} from "@workspace/api-zod";
import { getCurrentUser } from "../lib/session";
import { getVendorById } from "../lib/serialize";

const router: IRouter = Router();

const VENDOR_REPLIES = [
  "Thanks for reaching out! Let me check that for you.",
  "Yes, that's available — would you like to order it now?",
  "We can ship that within 1-2 business days.",
  "Of course! Which color or size were you thinking?",
  "Great choice! That's one of our best sellers.",
  "Happy to help. I'll send you a payment link in a moment.",
];

async function summarizeConversation(c: typeof conversationsTable.$inferSelect) {
  const vendor = await getVendorById(c.vendorId);
  const lastMessages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, c.id))
    .orderBy(desc(messagesTable.createdAt))
    .limit(1);
  const last = lastMessages[0];
  return {
    id: c.id,
    vendorId: c.vendorId,
    vendorName: vendor?.name ?? "Vendor",
    vendorLogo: vendor?.logoUrl ?? "",
    lastMessage: last?.body ?? "",
    lastMessageAt: last?.createdAt ?? c.updatedAt,
    unreadCount: c.unreadCount,
  };
}

router.get("/conversations", async (_req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.json(ListConversationsResponse.parse([]));
    return;
  }
  const rows = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, user.id))
    .orderBy(desc(conversationsTable.updatedAt));
  const out = [];
  for (const c of rows) out.push(await summarizeConversation(c));
  res.json(ListConversationsResponse.parse(out));
});

router.post("/conversations", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const parsed = StartConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, user.id));
  let convo = existing.find((c) => c.vendorId === parsed.data.vendorId);
  if (!convo) {
    const [created] = await db
      .insert(conversationsTable)
      .values({
        userId: user.id,
        vendorId: parsed.data.vendorId,
        unreadCount: 0,
      })
      .returning();
    convo = created;
  }
  if (parsed.data.message) {
    await db.insert(messagesTable).values({
      conversationId: convo.id,
      author: "me",
      body: parsed.data.message,
    });
    await db
      .update(conversationsTable)
      .set({ updatedAt: new Date() })
      .where(eq(conversationsTable.id, convo.id));
    // Auto-reply
    setTimeout(async () => {
      try {
        await db.insert(messagesTable).values({
          conversationId: convo!.id,
          author: "vendor",
          body: VENDOR_REPLIES[
            Math.floor(Math.random() * VENDOR_REPLIES.length)
          ],
        });
        await db
          .update(conversationsTable)
          .set({
            unreadCount: 1,
            updatedAt: new Date(),
          })
          .where(eq(conversationsTable.id, convo!.id));
      } catch {
        // ignore
      }
    }, 1500);
  }
  res.json(StartConversationResponse.parse(await summarizeConversation(convo)));
});

router.get("/conversations/:id", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const parsed = GetConversationParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [c] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, parsed.data.id));
  if (!c) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, c.id))
    .orderBy(asc(messagesTable.createdAt));
  // Mark read
  if (c.unreadCount > 0) {
    await db
      .update(conversationsTable)
      .set({ unreadCount: 0 })
      .where(eq(conversationsTable.id, c.id));
  }
  res.json(
    GetConversationResponse.parse({
      conversation: await summarizeConversation({ ...c, unreadCount: 0 }),
      messages: messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        author: m.author as "me" | "vendor",
        body: m.body,
        createdAt: m.createdAt,
      })),
    }),
  );
});

router.post("/conversations/:id/messages", async (req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }
  const params = SendMessageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = SendMessageBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [c] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, params.data.id));
  if (!c) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  await db.insert(messagesTable).values({
    conversationId: c.id,
    author: "me",
    body: body.data.body,
  });
  await db
    .update(conversationsTable)
    .set({ updatedAt: new Date() })
    .where(eq(conversationsTable.id, c.id));
  // Auto-reply from vendor after a short delay
  setTimeout(async () => {
    try {
      await db.insert(messagesTable).values({
        conversationId: c.id,
        author: "vendor",
        body: VENDOR_REPLIES[Math.floor(Math.random() * VENDOR_REPLIES.length)],
      });
      await db
        .update(conversationsTable)
        .set({ updatedAt: new Date() })
        .where(eq(conversationsTable.id, c.id));
    } catch {
      // ignore
    }
  }, 2000);

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, c.id))
    .orderBy(asc(messagesTable.createdAt));
  res.status(201).json(
    GetConversationResponse.parse({
      conversation: await summarizeConversation(c),
      messages: messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        author: m.author as "me" | "vendor",
        body: m.body,
        createdAt: m.createdAt,
      })),
    }),
  );
});

export default router;
