"use client";

import { useCallback, useTransition } from "react";
import { InstructionsPage } from "@/components/features/InstructionsPage";
import type { Locale } from "@/i18n/t";

export function InstructionsClient({
  initialLocale,
  tab = "setup",
  featuresHtml,
}: {
  initialLocale: Locale;
  tab?: "setup" | "features";
  featuresHtml: string;
}) {
  const [, startTransition] = useTransition();

  const onLocaleChange = useCallback((next: Locale) => {
    startTransition(() => {
      void fetch("/api/admin/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      }).then(() => {
        window.location.reload();
      });
    });
  }, []);

  return (
    <InstructionsPage
      locale={initialLocale}
      onLocaleChange={onLocaleChange}
      tab={tab}
      featuresHtml={featuresHtml}
    />
  );
}
