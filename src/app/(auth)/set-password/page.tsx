import { cookies } from "next/headers";
import { SetPasswordPageClient } from "@/components/features/SetPasswordPageClient";
import { isResetTokenLive } from "@/auth/reset-token";
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

  return (
    <SetPasswordPageClient
      initialLocale={locale}
      token={token}
      reason={reason}
      tokenValid={token ? tokenValid : true}
    />
  );
}
