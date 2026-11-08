"use client";

import { useState } from "react";
import { SetPasswordPage } from "@web/components/features/SetPasswordPage";
import type { Locale } from "@shared/i18n/t";

export function SetPasswordPageClient(props: {
  initialLocale: Locale;
  token: string | null;
  reason: string | null;
  tokenValid: boolean;
}) {
  const [locale, setLocale] = useState(props.initialLocale);
  return (
    <SetPasswordPage
      locale={locale}
      onLocaleChange={setLocale}
      token={props.token}
      reason={props.reason}
      tokenValid={props.tokenValid}
    />
  );
}
