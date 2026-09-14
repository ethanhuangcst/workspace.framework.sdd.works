import { writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { checkRateLimit } from "@/auth/rate-limit";
import { generateRawToken, hashToken } from "@/auth/token";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";
import { sendResetMail } from "@/mail/resend";

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
  const rate = checkRateLimit(`reset:${email}`, 5, 15 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: { key: "errors.rate_limited" } },
      { status: 429 },
    );
  }

  const admin = await db.admin.findUnique({ where: { email } });
  if (admin && admin.status === "ACTIVE") {
    const raw = generateRawToken();
    const tokenHash = hashToken(raw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await db.resetToken.create({
      data: {
        adminId: admin.id,
        tokenHash,
        expiresAt,
      },
    });

    const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3040";
    const setUrl = `${base.replace(/\/$/, "")}/set-password?token=${encodeURIComponent(raw)}`;
    const locale = getLocaleFromCookieValue(
      request.cookies.get("sdd_locale")?.value,
    );

    if (process.env.E2E_RESET_FILE) {
      if (process.env.RESEND_API_KEY) {
        console.warn(
          "[mail] E2E_RESET_FILE is set; skipping Resend and writing reset URL to the capture file",
        );
      }
      await writeFile(process.env.E2E_RESET_FILE, setUrl, "utf8");
    } else if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
      const sent = await sendResetMail({ to: email, locale, setUrl });
      if (!sent.ok) {
        return NextResponse.json(
          { error: { key: "errors.reset_mail_send_failed" } },
          { status: 502 },
        );
      }
    } else if (process.env.NODE_ENV !== "production") {
      console.info("[dev] password reset URL:", setUrl);
    } else {
      return NextResponse.json(
        { error: { key: "errors.reset_mail_send_failed" } },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
