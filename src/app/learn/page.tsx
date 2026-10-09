import { getRequestLocale } from "@/lib/request-locale";
import { LearnSpikeClient } from "./LearnSpikeClient";

/** Spike: embed https://sdd.works/{locale}/learn/ in a standalone page. */
export default async function LearnSpikePage() {
  const locale = await getRequestLocale();

  return <LearnSpikeClient initialLocale={locale} />;
}
