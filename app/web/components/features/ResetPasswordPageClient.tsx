"use client";

import { useState } from "react";
import { ResetPasswordPage } from "@web/components/features/ResetPasswordPage";
import type { Locale } from "@shared/i18n/t";

export function ResetPasswordPageClient({
  initialLocale,
}: {
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState(initialLocale);
  return (
    <ResetPasswordPage locale={locale} onLocaleChange={setLocale} />
  );
}
