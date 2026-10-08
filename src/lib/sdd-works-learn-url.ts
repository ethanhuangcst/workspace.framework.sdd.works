import type { Locale } from "@/i18n/t";

/** Grid-only embed page on learn.sdd.works. All portal locales use this URL until locale pages exist (ADR-110, ADR-127). */
export const SDD_WORKS_LEARN_URL = "https://learn.sdd.works/en/learn-embedded/";

/** Full course site for open-in-new-tab from the Learn embed panel (ADR-113). */
export const SDD_LEARN_SITE_URL = "https://learn.sdd.works";

export function sddWorksLearnUrl(_locale: Locale): string {
  return SDD_WORKS_LEARN_URL;
}
