"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { Logo } from "@/components/ui/Logo";
import { LearnScrumEmbedPanel } from "@/components/features/LearnScrumEmbedPanel";
import { SetupGuidePanel } from "@/components/features/SetupGuidePanel";
import {
  contentBodyClassName,
  contentBodyTestId,
  guideTabDomId,
  guideTabTestId,
  type InstructionsPageTab,
} from "@/lib/instructions-tabs-dom";

export function InstructionsPage({
  locale,
  onLocaleChange,
  tabs,
  activeQueryParam: activeFromServer = "setup",
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  tabs: InstructionsPageTab[];
  activeQueryParam?: string;
}) {
  const pathname = usePathname() || "/";
  const setupQueryParam =
    tabs.find((tab) => tab.id === "setup")?.queryParam ?? "setup";
  const [activeQueryParam, setActiveQueryParam] = useState(activeFromServer);
  const [syncedQueryParam, setSyncedQueryParam] = useState(activeFromServer);

  if (activeFromServer !== syncedQueryParam) {
    setSyncedQueryParam(activeFromServer);
    setActiveQueryParam(activeFromServer);
  }

  function tabHref(queryParam: string): string {
    if (queryParam === setupQueryParam) return pathname;
    return `${pathname}?tab=${encodeURIComponent(queryParam)}`;
  }

  return (
    <AuthShell
      locale={locale}
      onLocaleChange={onLocaleChange}
      variant="home"
      className="guide-shell"
      footerVariant="guide"
    >
      <article className="guide" data-testid="instructions-guide">
        <div className="guide-sticky" data-testid="guide-sticky">
          <header className="guide-hero">
            <div className="guide-hero-title">
              <Logo size="header" href="/" />
              <h1>{t(locale, "admin.guide.title")}</h1>
            </div>
            <p className="guide-hero-tag">{t(locale, "admin.guide.lead")}</p>
          </header>

          <div
            className="guide-tabs"
            role="tablist"
            aria-label={t(locale, "admin.guide.tabs_label")}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tabHref(tab.queryParam)}
                scroll={false}
                className={
                  activeQueryParam === tab.queryParam
                    ? "guide-tab is-active"
                    : "guide-tab"
                }
                role="tab"
                id={guideTabDomId(tab.id)}
                aria-selected={activeQueryParam === tab.queryParam}
                aria-controls={tab.panelTestId}
                data-tab={tab.queryParam}
                data-testid={guideTabTestId(tab.id)}
                onClick={() => setActiveQueryParam(tab.queryParam)}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="guide-tab-panel"
            role="tabpanel"
            id={tab.panelTestId}
            aria-labelledby={guideTabDomId(tab.id)}
            data-panel={tab.queryParam}
            hidden={activeQueryParam !== tab.queryParam}
            data-testid={tab.panelTestId}
          >
            {tab.type === "code" && tab.id === "setup" ? (
              <SetupGuidePanel locale={locale} />
            ) : null}
            {tab.type === "embedded_external_page" && tab.embedUrl ? (
              <LearnScrumEmbedPanel locale={locale} embedUrl={tab.embedUrl} />
            ) : null}
            {tab.type === "content" ? (
              <article
                className={contentBodyClassName(tab.id)}
                id={contentBodyTestId(tab.id)}
                data-testid={contentBodyTestId(tab.id)}
                dangerouslySetInnerHTML={{ __html: tab.html ?? "" }}
              />
            ) : null}
          </div>
        ))}
      </article>
    </AuthShell>
  );
}
