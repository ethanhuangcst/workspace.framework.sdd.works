import { InstructionsClient } from "./InstructionsClient";
import { getRequestLocale } from "@/lib/request-locale";
import { buildInstructionsPageModel } from "@/lib/instructions-tabs-page";
import { getSetupGuidePasteSentences } from "@/lib/setup-guide-paste";

export const dynamic = "force-dynamic";

export default async function InstructionsRoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; path?: string; doc?: string }>;
}) {
  const locale = await getRequestLocale();
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
      manualPaste={paste.manualPaste}
    />
  );
}
