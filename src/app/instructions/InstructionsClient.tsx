"use client";

import { useCallback, useTransition } from "react";
import { InstructionsPage } from "@/components/features/InstructionsPage";
import type { Locale } from "@/i18n/t";
import type { InstructionsPageTab } from "@/lib/instructions-tabs-dom";

export function InstructionsClient({
  initialLocale,
  tabs,
  activeQueryParam = "setup",
  setupPromptSentence,
  nodePrerequisiteSentence,
}: {
  initialLocale: Locale;
  tabs: InstructionsPageTab[];
  activeQueryParam?: string;
  setupPromptSentence: string;
  nodePrerequisiteSentence: string;
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
      tabs={tabs}
      activeQueryParam={activeQueryParam}
      setupPromptSentence={setupPromptSentence}
      nodePrerequisiteSentence={nodePrerequisiteSentence}
    />
  );
}
