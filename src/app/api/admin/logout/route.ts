import { NextRequest, NextResponse } from "next/server";
import { assertCsrf } from "@/auth/csrf";
import { SESSION_COOKIE, sessionCookieOptions } from "@/auth/session";

export async function POST(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json(
      { error: { key: "errors.csrf" } },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
