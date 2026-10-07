import type { Locale } from "@/i18n/t";

/** Public SDD.works learn hub. All portal locales use this URL until locale pages exist (ADR-110). */
export const SDD_WORKS_LEARN_URL = "https://sdd.works/en/learn/";

export function sddWorksLearnUrl(_locale: Locale): string {
  return SDD_WORKS_LEARN_URL;
}
