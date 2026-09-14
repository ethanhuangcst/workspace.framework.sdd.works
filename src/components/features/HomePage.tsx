"use client";

import { t, type Locale } from "../../i18n/t";
import { AuthShell } from "../layout/AuthShell";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

export type HomePageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

/** Public home — mockup `01-home.html`. */
export function HomePage({ locale, onLocaleChange }: HomePageProps) {
  return (
    <AuthShell locale={locale} onLocaleChange={onLocaleChange} variant="home">
      <div className="home-card">
        <Logo size="home" />
        <p className="tagline">{t(locale, "admin.home.tagline")}</p>
        <div className="home-actions">
          <a
            className="home-link"
            href="/instructions"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="admin-home-instructions"
          >
            {t(locale, "admin.home.instructions_link")}
          </a>
          <Button variant="page" href="/login" data-testid="admin-login">
            {t(locale, "admin.home.login")}
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
