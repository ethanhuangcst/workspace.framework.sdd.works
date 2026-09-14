import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertCsrf } from "@/auth/csrf";
import { isInviteTokenLive } from "@/auth/invite-token";
import { hashPassword } from "@/auth/password";
import { hashToken } from "@/auth/token";
import { db } from "@/lib/db";

const bodySchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1).max(120),
  username: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[A-Za-z][A-Za-z0-9_-]*$/),
  password: z.string().min(8).max(200),
  confirm: z.string().min(8).max(200),
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

  const tokenHash = hashToken(parsed.data.token);
  const invite = await db.inviteToken.findUnique({ where: { tokenHash } });
  if (!isInviteTokenLive(invite)) {
    return NextResponse.json(
      { error: { key: "errors.invite_link_expired_title" } },
      { status: 400 },
    );
  }

  const usernameTaken = await db.admin.findUnique({
    where: { username: parsed.data.username },
  });
  if (usernameTaken) {
    return NextResponse.json(
      { error: { key: "errors.username_taken" } },
      { status: 409 },
    );
  }

  const emailTaken = await db.admin.findUnique({
    where: { email: invite.email },
  });
  if (emailTaken) {
    return NextResponse.json(
      { error: { key: "errors.invite_email_exists" } },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction(async (tx) => {
    await tx.admin.create({
      data: {
        email: invite.email,
        username: parsed.data.username,
        name: parsed.data.name.trim(),
        passwordHash,
        status: "ACTIVE",
      },
    });
    await tx.inviteToken.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });
  });

  return NextResponse.json({ ok: true });
}

/** Validate invite token without consuming it (for page bootstrap). */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { error: { key: "errors.invite_link_expired_title" } },
      { status: 400 },
    );
  }
  const invite = await db.inviteToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!isInviteTokenLive(invite)) {
    return NextResponse.json(
      { valid: false, error: { key: "errors.invite_link_expired_title" } },
      { status: 400 },
    );
  }
  return NextResponse.json({ valid: true, email: invite!.email });
}
