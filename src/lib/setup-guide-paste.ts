import { getVisitorPasteOrigin } from "@/mcp/public-origin";

export function getSetupGuidePasteSentences(): {
  setupPromptSentence: string;
} {
  return {
    setupPromptSentence: `Fetch and execute the setup instructions from ${getVisitorPasteOrigin()}/setup`,
  };
}
