"use client";

import { FormEvent, useCallback, useState, useTransition } from "react";
import Link from "next/link";
import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field } from "@/components/ui/Field";
import { Logo } from "@/components/ui/Logo";

export type ResetPasswordPageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function ResetPasswordPage({
  locale,
  onLocaleChange,
}: ResetPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleLocale = useCallback(
    (next: Locale) => {
      onLocaleChange(next);
      startTransition(() => {
        void fetch("/api/admin/locale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ locale: next }),
        });
      });
    },
    [onLocaleChange],
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    const res = await fetch("/api/admin/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json()) as { error?: { key: string } };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.reset_mail_send_failed");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell locale={locale} onLocaleChange={handleLocale} variant="auth">
      <div className="auth-card auth-work">
        <Logo size="auth" href="/" />
        <h1>{t(locale, "admin.reset.title")}</h1>
        <p className="lead">{t(locale, "admin.reset.lead")}</p>
        {sent ? (
          <Callout variant="success">{t(locale, "admin.reset.sent")}</Callout>
        ) : null}
        {errorKey ? (
          <p className="error" data-testid="reset-error">
            {t(locale, errorKey)}
          </p>
        ) : null}
        {!sent ? (
          <form className="form" onSubmit={onSubmit}>
            <Field label={t(locale, "admin.reset.email")}>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="reset-email"
              />
            </Field>
            <div className="form-actions">
              <Button type="submit" data-testid="reset-submit">
                {t(locale, "admin.reset.submit")}
              </Button>
            </div>
          </form>
        ) : null}
        <Link className="back-link" href="/">
          {t(locale, "admin.common.back_home")}
        </Link>
      </div>
    </AuthShell>
  );
}
