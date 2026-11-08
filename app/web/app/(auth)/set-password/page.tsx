import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SetPasswordPageClient } from "@web/components/features/SetPasswordPageClient";
import { isResetTokenLive } from "@shared/auth/reset-token";
import {
  readSessionValue,
  SESSION_COOKIE,
} from "@shared/auth/session";
import { hashToken } from "@shared/auth/token";
import { getRequestLocale } from "@shared/lib/request-locale";
import { db } from "@shared/lib/db";

export default async function SetPasswordRoute({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const cookieStore = await cookies();
  const token = params.token ?? null;
  const reason = params.reason ?? null;

  let tokenValid = false;
  if (token) {
    const row = await db.resetToken.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { admin: true },
    });
    tokenValid = isResetTokenLive(row);
  }

  if (!token) {
    const payload = readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
    if (!payload) {
      redirect("/login");
    }
    const admin = await db.admin.findUnique({
      where: { id: payload.adminId },
    });
    if (
      !admin ||
      admin.status !== "ACTIVE" ||
      admin.sessionVersion !== payload.v
    ) {
      redirect("/login");
    }
    if (admin.passwordHash) {
      redirect("/admin/keys");
    }
  }

  return (
    <SetPasswordPageClient
      initialLocale={locale}
      token={token}
      reason={reason}
      tokenValid={token ? tokenValid : true}
    />
  );
}
