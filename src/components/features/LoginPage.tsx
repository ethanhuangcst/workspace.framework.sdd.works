"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { t, type Locale } from "../../i18n/t";
import { AuthShell } from "../layout/AuthShell";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Logo } from "../ui/Logo";
import { PasswordField } from "../ui/PasswordField";

export type LoginPageProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onSubmit: (email: string, password: string) => void | Promise<void>;
  error?: boolean;
  errorKey?: string;
};

/** Login — mockup `02-login.html`. */
export function LoginPage({
  locale,
  onLocaleChange,
  onSubmit,
  error = false,
  errorKey = "errors.login_failed",
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(email, password);
  }

  return (
    <AuthShell locale={locale} onLocaleChange={onLocaleChange} variant="auth">
      <div className="auth-card auth-card-login">
        <Logo size="auth" href="/" />
        <p className="auth-status" role="status" data-testid="register-disabled">
          <span className="auth-status-text">
            {t(locale, "admin.register.disabled_prefix")}
          </span>
          <span className="contact-admin">
            <button
              type="button"
              className="contact-admin-trigger"
              aria-describedby="login-wechat-qr"
              data-testid="contact-admin"
            >
              {t(locale, "admin.register.contact_admin")}
            </button>
            <span
              id="login-wechat-qr"
              className="contact-admin-pop"
              role="tooltip"
              data-testid="contact-admin-qr"
            >
              <Image
                src="/EthanWeChat.png"
                alt={t(locale, "admin.register.wechat_qr_alt")}
                width={180}
                height={180}
              />
              <span className="contact-admin-caption">
                {t(locale, "admin.register.wechat_qr_caption")}
              </span>
            </span>
          </span>
          <span className="auth-status-text">
            {t(locale, "admin.register.disabled_suffix")}
          </span>
        </p>
        <div className="auth-login-panel auth-work">
          <h1>{t(locale, "admin.login.title")}</h1>
          {error ? (
            <p className="error" data-testid="login-error">
              {t(locale, errorKey)}
            </p>
          ) : null}
          <form className="form" onSubmit={handleSubmit}>
            <Field label={t(locale, "admin.login.email")}>
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label={t(locale, "admin.login.password")}>
              <PasswordField
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                locale={locale}
                autoComplete="current-password"
                required
                data-testid="login-password"
              />
            </Field>
            <div className="form-actions">
              <Button type="submit" data-testid="login-submit">
                {t(locale, "admin.login.submit")}
              </Button>
              <Button variant="text" href="/reset-password">
                {t(locale, "admin.login.reset_link")}
              </Button>
            </div>
          </form>
          <Link className="back-link" href="/">
            {t(locale, "admin.common.back_home")}
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
