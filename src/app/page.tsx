import { cookies } from "next/headers";
import { InstructionsClient } from "./instructions/InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { readFeaturesCatalog } from "@/lib/features-catalog";
import { readScrumInSddCatalog } from "@/lib/scrum-in-sdd-catalog";

function resolveGuideTab(
  raw: string | undefined,
): "setup" | "features" | "scrum-in-sdd" {
  if (raw === "features") return "features";
  if (raw === "scrum-in-sdd") return "scrum-in-sdd";
  return "setup";
}

export default async function HomePageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const params = await searchParams;
  const tab = resolveGuideTab(params.tab);
  const features = readFeaturesCatalog(locale);
  const scrum = readScrumInSddCatalog(locale);

  return (
    <InstructionsClient
      initialLocale={locale}
      tab={tab}
      featuresHtml={features.html}
      scrumHtml={scrum.html}
    />
  );
}
