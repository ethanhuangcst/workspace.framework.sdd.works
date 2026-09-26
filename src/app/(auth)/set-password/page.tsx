import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SetPasswordPageClient } from "@/components/features/SetPasswordPageClient";
import { isResetTokenLive } from "@/auth/reset-token";
import {
  readSessionValue,
  SESSION_COOKIE,
} from "@/auth/session";
import { hashToken } from "@/auth/token";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { db } from "@/lib/db";

export default async function SetPasswordRoute({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
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
