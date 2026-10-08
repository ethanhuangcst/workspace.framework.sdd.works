import { cookies } from "next/headers";
import { InstructionsClient } from "./instructions/InstructionsClient";
import { getLocaleFromCookieValue } from "@/lib/locale";
import { buildInstructionsPageModel } from "@/lib/instructions-tabs-page";
import { getSetupGuidePasteSentences } from "@/lib/setup-guide-paste";

export const dynamic = "force-dynamic";

export default async function HomePageRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; path?: string; doc?: string }>;
}) {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookieValue(cookieStore.get("sdd_locale")?.value);
  const params = await searchParams;
  const { tabs, activeQueryParam } = buildInstructionsPageModel(
    locale,
    params.tab,
    params.path,
    params.doc,
  );
  const paste = getSetupGuidePasteSentences();

  return (
    <InstructionsClient
      initialLocale={locale}
      tabs={tabs}
      activeQueryParam={activeQueryParam}
      setupPromptSentence={paste.setupPromptSentence}
      nodePrerequisiteSentence={paste.nodePrerequisiteSentence}
    />
  );
}
