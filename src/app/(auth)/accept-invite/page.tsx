import { AcceptInvitePageClient } from "@/components/features/AcceptInvitePageClient";
import { isInviteTokenLive } from "@/auth/invite-token";
import { hashToken } from "@/auth/token";
import { getRequestLocale } from "@/lib/request-locale";
import { db } from "@/lib/db";

export default async function AcceptInviteRoute({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale();
  const token = params.token ?? null;

  let tokenValid = false;
  let email: string | null = null;
  if (token) {
    const invite = await db.inviteToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    tokenValid = isInviteTokenLive(invite);
    if (tokenValid && invite) {
      email = invite.email;
    }
  }

  return (
    <AcceptInvitePageClient
      initialLocale={locale}
      token={token}
      email={email}
      tokenValid={tokenValid}
    />
  );
}
