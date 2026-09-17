import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { verifyPassword } from "@/auth/password";
import {
  createSessionValue,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/auth/session";
import { db } from "@/lib/db";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
      { error: { key: "errors.login_failed" } },
      { status: 401 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || admin.status !== "ACTIVE") {
    return NextResponse.json(
      { error: { key: "errors.login_failed" } },
      { status: 401 },
    );
  }

  if (!admin.passwordHash) {
    // Seed / invited admin with no password yet: establish session and force set-password.
    const value = createSessionValue(admin.id, admin.sessionVersion);
    const response = NextResponse.json({
      ok: true,
      redirect: "/set-password?reason=password_required",
    });
    response.cookies.set(SESSION_COOKIE, value, sessionCookieOptions());
    return response;
  }

  const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: { key: "errors.login_failed" } },
      { status: 401 },
    );
  }

  const value = createSessionValue(admin.id, admin.sessionVersion);
  const response = NextResponse.json({
    ok: true,
    redirect: "/admin/keys",
  });
  response.cookies.set(SESSION_COOKIE, value, sessionCookieOptions());
  return response;
}
