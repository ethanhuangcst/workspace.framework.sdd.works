import type { Locale } from "@/i18n/t";

const LOCALES: Locale[] = ["en", "zh-Hans", "zh-Hant"];

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (LOCALES as string[]).includes(value);
}

export function getLocaleFromCookieValue(
  value: string | undefined | null,
): Locale {
  return isLocale(value) ? value : "en";
}

const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-Hant",
};

export function formatDate(
  locale: Locale,
  date: Date | string | number,
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value);
}
