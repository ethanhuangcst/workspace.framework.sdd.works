import {
  getAgentSetupUrl,
  getNodePrerequisiteSetupSentence,
} from "@/mcp/brand";

export function getSetupGuidePasteSentences(): {
  setupPromptSentence: string;
  nodePrerequisiteSentence: string;
} {
  return {
    setupPromptSentence: `Fetch and execute the setup instructions from ${getAgentSetupUrl()}`,
    nodePrerequisiteSentence: getNodePrerequisiteSetupSentence(),
  };
}
