import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isLocale } from "@/lib/locale";
import { assertCsrf } from "@/auth/csrf";

const bodySchema = z.object({
  locale: z.string(),
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
  if (!parsed.success || !isLocale(parsed.data.locale)) {
    return NextResponse.json(
      { error: { key: "errors.invalid_input" } },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true, locale: parsed.data.locale });
  response.cookies.set("sdd_locale", parsed.data.locale, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
