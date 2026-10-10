import { getVisitorPasteOrigin } from "@/mcp/public-origin";
import {
  getSetupManualPasteContent,
  type SetupManualPasteContent,
} from "@/lib/setup-manual";

export function getSetupGuidePasteSentences(): {
  setupPromptSentence: string;
  manualPaste: SetupManualPasteContent;
} {
  return {
    setupPromptSentence: `Fetch and execute the setup instructions from ${getVisitorPasteOrigin()}/setup`,
    manualPaste: getSetupManualPasteContent(),
  };
}
