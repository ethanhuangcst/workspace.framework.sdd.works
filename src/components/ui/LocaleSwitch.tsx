"use client";

import { LOCALE_SWITCH_LABELS, t, type Locale } from "../../i18n/t";

const LOCALES: Locale[] = ["en", "zh-Hans", "zh-Hant"];

export type LocaleSwitchProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
};

export function LocaleSwitch({ locale, onChange, className }: LocaleSwitchProps) {
  return (
    <div
      className={className ? `locale-switch ${className}` : "locale-switch"}
      role="group"
      aria-label={t(locale, "admin.a11y.locale")}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            className={active ? "is-active" : undefined}
            aria-pressed={active}
            onClick={() => onChange(code)}
          >
            {LOCALE_SWITCH_LABELS[code]}
          </button>
        );
      })}
    </div>
  );
}
