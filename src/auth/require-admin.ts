/**
 * Session is checked in App Router pages / admin APIs via requireAdmin().
 * MCP HTTP (/mcp) must never use this gate — call MCP auth separately.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  readSessionValue,
  SESSION_COOKIE,
  type SessionPayload,
} from "@/auth/session";

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  const payload = await getSessionPayload();
  if (!payload) {
    redirect("/login");
  }
  const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
  if (!admin || admin.status !== "ACTIVE") {
    redirect("/login");
  }
  if (admin.sessionVersion !== payload.v) {
    redirect("/login");
  }
  if (!admin.passwordHash) {
    redirect("/set-password?reason=password_required");
  }
  return admin;
}
