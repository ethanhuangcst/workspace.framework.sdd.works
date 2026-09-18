"use client";

import { useCallback, useState, useTransition } from "react";
import { InstructionsPage } from "@/components/features/InstructionsPage";
import type { Locale } from "@/i18n/t";

export function InstructionsClient({
  initialLocale,
}: {
  initialLocale: Locale;
}) {
  const [locale, setLocale] = useState(initialLocale);
  const [, startTransition] = useTransition();

  const onLocaleChange = useCallback((next: Locale) => {
    setLocale(next);
    startTransition(() => {
      void fetch("/api/admin/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      }).then(() => {
        document.documentElement.lang =
          next === "zh-Hans" ? "zh-CN" : next === "zh-Hant" ? "zh-Hant" : "en";
      });
    });
  }, []);

  return (
    <InstructionsPage locale={locale} onLocaleChange={onLocaleChange} />
  );
}
