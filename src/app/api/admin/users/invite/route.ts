import { writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { requireAdminApi } from "@/auth/require-admin-api";
import { checkRateLimit } from "@/auth/rate-limit";
import { generateRawToken, hashToken } from "@/auth/token";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";
import { sendInviteMail } from "@/mail/resend";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  if (!assertCsrf(request)) {
    return NextResponse.json(
      { error: { key: "errors.csrf" } },
      { status: 403 },
    );
  }

  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

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

  const email = parsed.data.email.trim().toLowerCase();
  const rate = checkRateLimit(`invite:${auth.admin.id}`, 20, 60 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: { key: "errors.rate_limited" } },
      { status: 429 },
    );
  }

  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: { key: "errors.invite_email_exists" } },
      { status: 409 },
    );
  }

  const pending = await db.inviteToken.findFirst({
    where: { email, usedAt: null, expiresAt: { gt: new Date() } },
  });
  if (pending) {
    return NextResponse.json(
      { error: { key: "errors.invite_already_pending" } },
      { status: 409 },
    );
  }

  const raw = generateRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.inviteToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
      invitedBy: auth.admin.id,
    },
  });

  const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3040";
  const inviteUrl = `${base.replace(/\/$/, "")}/accept-invite?token=${encodeURIComponent(raw)}`;
  const locale = getLocaleFromCookieValue(
    request.cookies.get("sdd_locale")?.value,
  );

  // Playwright / CI fixture capture wins over live mail (do not export
  // E2E_INVITE_FILE in a long-lived operator `npm run dev` shell).
  if (process.env.E2E_INVITE_FILE) {
    if (process.env.RESEND_API_KEY) {
      console.warn(
        "[mail] E2E_INVITE_FILE is set; skipping Resend and writing invite URL to the capture file",
      );
    }
    await writeFile(process.env.E2E_INVITE_FILE, inviteUrl, "utf8");
  } else if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
    const sent = await sendInviteMail({ to: email, locale, inviteUrl });
    if (!sent.ok) {
      return NextResponse.json(
        { error: { key: "errors.invite_mail_send_failed" } },
        { status: 502 },
      );
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[dev] invite URL:", inviteUrl);
  } else {
    return NextResponse.json(
      { error: { key: "errors.invite_mail_send_failed" } },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
