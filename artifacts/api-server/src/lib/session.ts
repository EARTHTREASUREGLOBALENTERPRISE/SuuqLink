import { eq } from "drizzle-orm";
import { db, sessionTable, usersTable } from "@workspace/db";
import type { User } from "@workspace/db";

export async function getCurrentUser(): Promise<User | null> {
  const [session] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.id, "singleton"));
  if (!session) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));
  return user ?? null;
}

export async function setCurrentUserId(userId: number): Promise<void> {
  await db
    .insert(sessionTable)
    .values({ id: "singleton", userId })
    .onConflictDoUpdate({
      target: sessionTable.id,
      set: { userId },
    });
}

export function userToDto(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "buyer" | "seller" | "admin",
    avatarUrl: user.avatarUrl,
    language: user.language,
    currency: user.currency,
    vendorId: user.vendorId ?? null,
    createdAt: user.createdAt,
  };
}
