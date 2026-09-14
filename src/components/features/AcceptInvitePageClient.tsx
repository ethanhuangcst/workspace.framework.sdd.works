"use client";

import { useState } from "react";
import { AcceptInvitePage } from "@/components/features/AcceptInvitePage";
import type { Locale } from "@/i18n/t";

export function AcceptInvitePageClient(props: {
  initialLocale: Locale;
  token: string | null;
  email: string | null;
  tokenValid: boolean;
}) {
  const [locale, setLocale] = useState(props.initialLocale);
  return (
    <AcceptInvitePage
      locale={locale}
      onLocaleChange={setLocale}
      token={props.token}
      email={props.email}
      tokenValid={props.tokenValid}
    />
  );
}
