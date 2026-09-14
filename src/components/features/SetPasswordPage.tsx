"use client";

import { FormEvent, useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field } from "@/components/ui/Field";
import { Logo } from "@/components/ui/Logo";
import { PasswordField } from "@/components/ui/PasswordField";

export type SetPasswordPageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  token: string | null;
  reason: string | null;
  tokenValid: boolean;
};

export function SetPasswordPage({
  locale,
  onLocaleChange,
  token,
  reason,
  tokenValid,
}: SetPasswordPageProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(
    reason === "password_required" ? "errors.password_required" : null,
  );
  const [done, setDone] = useState(false);
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

  const showExpired = Boolean(token) && !tokenValid;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    if (password !== confirm) {
      setErrorKey("errors.password_mismatch");
      return;
    }
    const res = await fetch("/api/admin/password/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token ?? undefined,
        password,
        confirm,
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      redirect?: string;
      error?: { key: string };
    };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      return;
    }
    setDone(true);
    if (data.redirect) {
      router.push(data.redirect);
      router.refresh();
    }
  }

  return (
    <AuthShell locale={locale} onLocaleChange={handleLocale} variant="auth">
      <div className="auth-card auth-work">
        <Logo size="auth" href="/" />
        {showExpired ? (
          <div className="callout callout-error" data-testid="set-password-expired">
            <p className="callout-eyebrow">
              {t(locale, "errors.reset_link_expired_eyebrow")}
            </p>
            <p className="callout-title">
              {t(locale, "errors.reset_link_expired_title")}
            </p>
            <p className="callout-body">
              {t(locale, "errors.reset_link_expired_body")}
            </p>
            <div className="callout-action">
              <Button variant="page" href="/reset-password">
                {t(locale, "errors.reset_link_expired_action")}
              </Button>
            </div>
          </div>
        ) : done ? (
          <Callout variant="success">
            {t(locale, "admin.set_password.done_title")}
          </Callout>
        ) : (
          <>
            <h1>{t(locale, "admin.set_password.title")}</h1>
            <p className="lead">
              {token
                ? t(locale, "admin.set_password.reset_lead")
                : t(locale, "admin.set_password.lead")}
            </p>
            {errorKey ? (
              <p className="error" data-testid="set-password-error">
                {t(locale, errorKey)}
              </p>
            ) : null}
            <form className="form" onSubmit={onSubmit}>
              <Field label={t(locale, "admin.set_password.new")}>
                <PasswordField
                  id="new-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  locale={locale}
                  autoComplete="new-password"
                  required
                />
              </Field>
              <Field label={t(locale, "admin.set_password.confirm")}>
                <input
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  data-testid="set-password-confirm"
                />
              </Field>
              <div className="form-actions">
                <Button type="submit" data-testid="set-password-submit">
                  {t(locale, "admin.set_password.submit")}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthShell>
  );
}
