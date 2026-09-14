import { messages } from "./messages";

export type Locale = "en" | "zh-Hans" | "zh-Hant";

export const HOST = "framework.sdd.works";

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-Hant",
};

export const LOCALE_SWITCH_LABELS: Record<Locale, string> = {
  en: "EN",
  "zh-Hans": "简",
  "zh-Hant": "繁",
};

export type TVars = Record<string, string | number>;

export function t(locale: Locale, key: string, vars?: TVars): string {
  const catalog = messages[locale] ?? {};
  const fallback = messages.en ?? {};
  let value = catalog[key];
  if (value == null || value === "") {
    value = fallback[key];
  }
  if (value == null || value === "") {
    value = key;
  }
  if (vars) {
    for (const [name, raw] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(raw));
    }
  }
  return value;
}
