import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  GetCurrentUserResponse,
  LoginBody,
  LoginResponse,
  RegisterBody,
  SwitchRoleBody,
  SwitchRoleResponse,
} from "@workspace/api-zod";
import { getCurrentUser, setCurrentUserId, userToDto } from "../lib/session";

const router: IRouter = Router();

router.get("/auth/me", async (_req, res): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) {
    res.status(404).json({ error: "Not signed in" });
    return;
  }
  res.json(GetCurrentUserResponse.parse(userToDto(user)));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email));

  // Demo mode: if no match, return the buyer persona.
  let active = user;
  if (!active) {
    const [fallback] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "buyer"));
    active = fallback;
  }
  if (!active) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  await setCurrentUserId(active.id);
  res.json(LoginResponse.parse(userToDto(active)));
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, parsed.data.email));

  let active;
  if (existing.length > 0) {
    active = existing[0];
  } else {
    const [created] = await db
      .insert(usersTable)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(parsed.data.email)}`,
        language: "en",
        currency: "USD",
      })
      .returning();
    active = created;
  }
  await setCurrentUserId(active.id);
  res.status(201).json(GetCurrentUserResponse.parse(userToDto(active)));
});

router.post("/auth/switch-role", async (req, res): Promise<void> => {
  const parsed = SwitchRoleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.role, parsed.data.role));
  if (!user) {
    res.status(404).json({ error: "No user with that role" });
    return;
  }
  await setCurrentUserId(user.id);
  res.json(SwitchRoleResponse.parse(userToDto(user)));
});

export default router;
