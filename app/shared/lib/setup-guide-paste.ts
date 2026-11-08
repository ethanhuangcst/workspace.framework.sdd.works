import { getVisitorPasteOrigin } from "@shared/setup/public-origin";
import {
  getSetupManualPasteContent,
  type SetupManualPasteContent,
} from "@shared/lib/setup-manual";

export function getSetupGuidePasteSentences(): {
  setupPromptSentence: string;
  manualPaste: SetupManualPasteContent;
} {
  return {
    setupPromptSentence: `Fetch and execute the setup instructions from ${getVisitorPasteOrigin()}/setup`,
    manualPaste: getSetupManualPasteContent(),
  };
}
