import { cookies } from "next/headers";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { LearnSpikeClient } from "./LearnSpikeClient";

/** Spike: embed https://sdd.works/{locale}/learn/ in a standalone page. */
export default async function LearnSpikePage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);

  return <LearnSpikeClient initialLocale={locale} />;
}
