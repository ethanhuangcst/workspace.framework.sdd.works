"use client";

import { useCallback, useState, useTransition } from "react";
import { HomePage } from "@/components/features/HomePage";
import type { Locale } from "@/i18n/t";

export type HomePageClientProps = {
  initialLocale: Locale;
};

export function HomePageClient({ initialLocale }: HomePageClientProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
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

  return <HomePage locale={locale} onLocaleChange={onLocaleChange} />;
}
