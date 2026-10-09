import type { Locale } from "@/i18n/t";

const LOCALES: Locale[] = ["en", "zh-Hans", "zh-Hant"];

export const SDD_LOCALE_COOKIE = "sdd_locale";

export const SDD_LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (LOCALES as string[]).includes(value);
}

export function getLocaleFromCookieValue(
  value: string | undefined | null,
): Locale {
  return isLocale(value) ? value : "en";
}

/** Map one language tag (without q) to a portal locale, or null when unsupported. */
export function mapLanguageTag(tag: string): Locale | null {
  const normalized = tag.trim().toLowerCase().replace(/_/g, "-");
  if (!normalized) return null;

  const primary = normalized.split("-")[0] ?? "";
  if (primary === "en") return "en";

  if (primary === "zh") {
    if (
      normalized === "zh" ||
      normalized.startsWith("zh-hans") ||
      normalized.startsWith("zh-cn") ||
      normalized.startsWith("zh-sg")
    ) {
      return "zh-Hans";
    }
    if (
      normalized.startsWith("zh-hant") ||
      normalized.startsWith("zh-tw") ||
      normalized.startsWith("zh-hk") ||
      normalized.startsWith("zh-mo")
    ) {
      return "zh-Hant";
    }
    // Bare zh or unknown zh-* region: Hans (product default).
    return "zh-Hans";
  }

  return null;
}

type AcceptLangEntry = { tag: string; q: number };

function parseAcceptLanguage(header: string): AcceptLangEntry[] {
  const entries: AcceptLangEntry[] = [];
  for (const part of header.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const [rawTag, ...params] = trimmed.split(";");
    const tag = (rawTag ?? "").trim();
    if (!tag) continue;
    let q = 1;
    for (const param of params) {
      const m = /^\s*q\s*=\s*([0-9.]+)\s*$/i.exec(param);
      if (m) {
        const parsed = Number(m[1]);
        if (!Number.isNaN(parsed)) q = parsed;
      }
    }
    entries.push({ tag, q });
  }
  entries.sort((a, b) => b.q - a.q);
  return entries;
}

/**
 * Pick en | zh-Hans | zh-Hant from Accept-Language (q-order).
 * Unsupported tags are skipped; empty or null → en.
 */
export function negotiateLocale(
  acceptLanguage: string | undefined | null,
): Locale {
  if (acceptLanguage == null || acceptLanguage.trim() === "") {
    return "en";
  }
  for (const { tag } of parseAcceptLanguage(acceptLanguage)) {
    const mapped = mapLanguageTag(tag);
    if (mapped) return mapped;
  }
  return "en";
}

/**
 * Valid cookie wins; otherwise negotiate Accept-Language; otherwise en.
 * An invalid cookie is treated as missing (caller may replace the cookie).
 */
export function resolveLocale(params: {
  cookie: string | undefined | null;
  acceptLanguage: string | undefined | null;
}): Locale {
  if (isLocale(params.cookie)) {
    return params.cookie;
  }
  return negotiateLocale(params.acceptLanguage);
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
