"use client";

import { useState, type ReactNode } from "react";
import { t, type Locale } from "../../i18n/t";
import { LocaleSwitch } from "../ui/LocaleSwitch";
import { Logo } from "../ui/Logo";
import { SiteFooter } from "./SiteFooter";
import { SkipLink } from "./SkipLink";

export type AppNavId = "keys" | "framework" | "settings" | "admins";

export type AppShellProps = {
  locale: Locale;
  name: string;
  activeNav: AppNavId;
  onLocaleChange: (locale: Locale) => void;
  onSignOut: () => void;
  onMenuToggle?: () => void;
  children: ReactNode;
  className?: string;
  /** Extra classes on `<main class="content">` e.g. `content--keys`. */
  contentClassName?: string;
};

const NAV_ITEMS: Array<{ id: AppNavId; href: string; key: string }> = [
  { id: "keys", href: "/admin/keys", key: "admin.nav.keys" },
  { id: "framework", href: "/admin/framework", key: "admin.nav.framework" },
  { id: "settings", href: "/admin/settings", key: "admin.nav.settings" },
  { id: "admins", href: "/admin/accounts", key: "admin.nav.admins" },
];

export function AppShell({
  locale,
  name,
  activeNav,
  onLocaleChange,
  onSignOut,
  onMenuToggle,
  children,
  className,
  contentClassName,
}: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);

  function handleMenuToggle() {
    setNavOpen((open) => !open);
    onMenuToggle?.();
  }

  const shellClass = [
    "app-shell",
    navOpen ? "is-nav-open" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      <SkipLink locale={locale} />
      <header className="app-header">
        <Logo size="header" href="/admin/keys" />
        <button
          type="button"
          className="menu-toggle"
          onClick={handleMenuToggle}
        >
          {t(locale, "admin.nav.menu")}
        </button>
        <div className="header-end">
          <a
            className="header-guide"
            href="/instructions"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="landing-instructions"
          >
            {t(locale, "admin.landing.instructions_link")}
          </a>
          <p className="hello">{t(locale, "admin.landing.hello", { name })}</p>
          <LocaleSwitch locale={locale} onChange={onLocaleChange} />
        </div>
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={item.id === activeNav ? "active" : undefined}
              >
                {t(locale, item.key)}
              </a>
            ))}
            <a
              className="nav-signout"
              href="#sign-out"
              onClick={(event) => {
                event.preventDefault();
                onSignOut();
              }}
            >
              {t(locale, "admin.nav.sign_out")}
            </a>
          </nav>
        </aside>
        <main
          id="content"
          className={["content", contentClassName ?? ""].filter(Boolean).join(" ")}
        >
          {children}
        </main>
      </div>
      <SiteFooter locale={locale} />
    </div>
  );
}
