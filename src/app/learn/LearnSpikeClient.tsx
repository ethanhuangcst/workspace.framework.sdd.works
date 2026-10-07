"use client";

import { useCallback, useTransition } from "react";
import { AuthShell } from "@/components/layout/AuthShell";
import { LearnScrumEmbedPanel } from "@/components/features/LearnScrumEmbedPanel";
import type { Locale } from "@/i18n/t";
import { sddWorksLearnUrl } from "@/lib/sdd-works-learn-url";

export function LearnSpikeClient({ initialLocale }: { initialLocale: Locale }) {
  const [, startTransition] = useTransition();

  const onLocaleChange = useCallback(
    (next: Locale) => {
      startTransition(() => {
        void fetch("/api/admin/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        }).then(() => {
          window.location.reload();
        });
      });
    },
    [startTransition],
  );

  return (
    <AuthShell
      locale={initialLocale}
      onLocaleChange={onLocaleChange}
      variant="home"
      className="guide-shell learn-spike-shell"
      footerVariant="guide"
    >
      <article className="guide learn-spike" data-testid="learn-spike-page">
        <LearnScrumEmbedPanel
          locale={initialLocale}
          embedUrl={sddWorksLearnUrl(initialLocale)}
        />
      </article>
    </AuthShell>
  );
}
