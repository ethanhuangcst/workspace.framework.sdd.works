"use client";

import { FormEvent, useCallback, useState, useTransition } from "react";
import { t, type Locale } from "@/i18n/t";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Logo } from "@/components/ui/Logo";
import { PasswordField } from "@/components/ui/PasswordField";

export type AcceptInvitePageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  token: string | null;
  email: string | null;
  tokenValid: boolean;
};

export function AcceptInvitePage({
  locale,
  onLocaleChange,
  token,
  email,
  tokenValid,
}: AcceptInvitePageProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
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

  const showExpired = !token || !tokenValid;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setErrorKey(null);
    if (password !== confirm) {
      setErrorKey("errors.password_mismatch");
      return;
    }
    const res = await fetch("/api/admin/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        name,
        username,
        password,
        confirm,
      }),
    });
    const data = (await res.json()) as { error?: { key: string } };
    if (!res.ok) {
      setErrorKey(data.error?.key ?? "errors.invalid_input");
      return;
    }
    setDone(true);
  }

  return (
    <AuthShell locale={locale} onLocaleChange={handleLocale} variant="auth">
      <div className="auth-card auth-work">
        <Logo size="auth" href="/" />
        {done ? (
          <div className="callout callout-success" data-testid="accept-invite-done">
            <p className="callout-eyebrow">
              {t(locale, "admin.accept_invite.done_eyebrow")}
            </p>
            <p className="callout-title">
              {t(locale, "admin.accept_invite.done_title")}
            </p>
            <p className="callout-body">
              {t(locale, "admin.accept_invite.done_lead")}
            </p>
            <div className="callout-action">
              <Button
                variant="page"
                href="/login"
                data-testid="accept-invite-sign-in"
              >
                {t(locale, "admin.accept_invite.sign_in")}
              </Button>
            </div>
          </div>
        ) : showExpired ? (
          <div
            className="callout callout-error"
            data-testid="accept-invite-expired"
          >
            <p className="callout-eyebrow">
              {t(locale, "errors.invite_link_expired_eyebrow")}
            </p>
            <p className="callout-title">
              {t(locale, "errors.invite_link_expired_title")}
            </p>
            <p className="callout-body">
              {t(locale, "errors.invite_link_expired_body")}
            </p>
          </div>
        ) : (
          <>
            <h1>{t(locale, "admin.accept_invite.title")}</h1>
            <p className="lead">{t(locale, "admin.accept_invite.lead")}</p>
            <p className="auth-status">
              <span>{t(locale, "admin.accept_invite.email_lead")}</span>{" "}
              <span className="mono" data-testid="invite-email-context">
                {email}
              </span>
            </p>
            {errorKey ? (
              <p className="error" data-testid="accept-invite-error">
                {t(locale, errorKey)}
              </p>
            ) : null}
            <form
              className="form"
              style={{ marginTop: "1.5rem" }}
              onSubmit={onSubmit}
            >
              <Field label={t(locale, "admin.accept_invite.name")}>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="accept-invite-name"
                />
              </Field>
              <Field label={t(locale, "admin.accept_invite.username")}>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="accept-invite-username"
                />
              </Field>
              <Field label={t(locale, "admin.accept_invite.password")}>
                <PasswordField
                  id="invite-password"
                  name="password"
                  locale={locale}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="accept-invite-password"
                />
              </Field>
              <Field label={t(locale, "admin.accept_invite.confirm")}>
                <input
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  data-testid="accept-invite-confirm"
                />
              </Field>
              <div className="form-actions">
                <Button type="submit" data-testid="accept-invite-submit">
                  {t(locale, "admin.accept_invite.submit")}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthShell>
  );
}
