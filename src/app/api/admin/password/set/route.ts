import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { hashPassword } from "@/auth/password";
import {
  createSessionValue,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/auth/session";
import { hashToken } from "@/auth/token";
import { db } from "@/lib/db";

const bodySchema = z.object({
  token: z.string().min(1).optional(),
  password: z.string().min(8),
  confirm: z.string().min(8),
});

export async function POST(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json(
      { error: { key: "errors.csrf" } },
      { status: 403 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  if (parsed.data.password !== parsed.data.confirm) {
    return NextResponse.json(
      { error: { key: "errors.password_mismatch" } },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  if (parsed.data.token) {
    const tokenHash = hashToken(parsed.data.token);
    const row = await db.resetToken.findUnique({
      where: { tokenHash },
      include: { admin: true },
    });
    if (
      !row ||
      row.usedAt ||
      row.expiresAt.getTime() < Date.now() ||
      row.admin.status !== "ACTIVE"
    ) {
      return NextResponse.json(
        { error: { key: "errors.reset_link_expired_title" } },
        { status: 400 },
      );
    }

    await db.$transaction([
      db.admin.update({
        where: { id: row.adminId },
        data: { passwordHash },
      }),
      db.resetToken.update({
        where: { id: row.id },
        data: { usedAt: new Date() },
      }),
    ]);

    const admin = await db.admin.findUniqueOrThrow({
      where: { id: row.adminId },
    });
    const value = createSessionValue(admin.id, admin.sessionVersion);
    const response = NextResponse.json({
      ok: true,
      redirect: "/admin/keys",
    });
    response.cookies.set(SESSION_COOKIE, value, sessionCookieOptions());
    return response;
  }

  // Empty-password session path: require existing session for empty-hash admin.
  const { readSessionValue } = await import("@/auth/session");
  const payload = readSessionValue(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  if (!payload) {
    return NextResponse.json(
      { error: { key: "errors.password_required" } },
      { status: 401 },
    );
  }

  const admin = await db.admin.findUnique({ where: { id: payload.adminId } });
  if (!admin || admin.status !== "ACTIVE" || admin.passwordHash) {
    return NextResponse.json(
      { error: { key: "errors.password_required" } },
      { status: 400 },
    );
  }

  const updated = await db.admin.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
  const value = createSessionValue(updated.id, updated.sessionVersion);
  const response = NextResponse.json({
    ok: true,
    redirect: "/admin/keys",
  });
  response.cookies.set(SESSION_COOKIE, value, sessionCookieOptions());
  return response;
}
