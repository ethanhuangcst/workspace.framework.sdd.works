import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSessionValue, SESSION_COOKIE } from "@/auth/session";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const payload = readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!payload) {
    return NextResponse.json({ admin: null });
  }

  const admin = await db.admin.findUnique({
    where: { id: payload.adminId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      status: true,
      sessionVersion: true,
      passwordHash: true,
    },
  });

  if (
    !admin ||
    admin.status !== "ACTIVE" ||
    admin.sessionVersion !== payload.v
  ) {
    return NextResponse.json({ admin: null });
  }

  return NextResponse.json({
    admin: {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
      username: admin.username,
      passwordSet: Boolean(admin.passwordHash),
    },
  });
}
