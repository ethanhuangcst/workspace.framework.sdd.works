"use client";

import type { ReactNode } from "react";
import type { Locale } from "../../i18n/t";
import { LocaleSwitch } from "../ui/LocaleSwitch";
import { SiteFooter } from "./SiteFooter";
import { SkipLink } from "./SkipLink";

export type AuthShellVariant = "auth" | "home";

export type AuthShellProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  variant?: AuthShellVariant;
  children: ReactNode;
  className?: string;
  footerVariant?: "default" | "guide";
};

/** Public / auth chrome — mockups `01-home` / `02-login` / reset / invite. */
export function AuthShell({
  locale,
  onLocaleChange,
  variant = "auth",
  children,
  className,
  footerVariant = "default",
}: AuthShellProps) {
  const shellClass = variant === "home" ? "home-shell" : "auth-shell";
  const mainClass = variant === "home" ? "home-main" : "auth-main";
  const rootClass = className ? `${shellClass} ${className}` : shellClass;

  return (
    <div className={rootClass}>
      <SkipLink locale={locale} />
      <div className="shell-locale">
        <LocaleSwitch locale={locale} onChange={onLocaleChange} />
      </div>
      <main id="content" className={mainClass}>
        {children}
      </main>
      <SiteFooter locale={locale} variant={footerVariant} />
    </div>
  );
}
