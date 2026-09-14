import type { Admin } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  readSessionValue,
  SESSION_COOKIE,
} from "@/auth/session";

export type AdminActor = Admin;

export async function requireAdminApi(): Promise<
  | { ok: true; admin: AdminActor }
  | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const payload = readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { key: "errors.unauthorized" } },
        { status: 401 },
      ),
    };
  }

  const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
  if (
    !admin ||
    admin.status !== "ACTIVE" ||
    admin.sessionVersion !== payload.v ||
    !admin.passwordHash
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { key: "errors.unauthorized" } },
        { status: 401 },
      ),
    };
  }

  return { ok: true, admin };
}
