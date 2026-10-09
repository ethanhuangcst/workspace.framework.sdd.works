import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getVisitorPasteOrigin } from "@/mcp/public-origin";

export const PASTE_SENTENCE_KEYS = [
  "lite_install",
  "node_prerequisite",
] as const;

export type PasteSentenceKey = (typeof PASTE_SENTENCE_KEYS)[number];

type PasteSentencesFile = {
  version: number;
  sentences: Record<string, string>;
};

const ORIGIN_PLACEHOLDER = "{origin}";

let cached: PasteSentencesFile | null = null;

function pasteSentencesPath(): string {
  return join(process.cwd(), "public", "agent-setup", "paste-sentences.json");
}

export function loadPasteSentencesFile(): PasteSentencesFile {
  if (cached) return cached;
  const raw = readFileSync(pasteSentencesPath(), "utf8");
  const parsed = JSON.parse(raw) as PasteSentencesFile;
  if (parsed.version !== 1 || typeof parsed.sentences !== "object") {
    throw new Error("paste-sentences.json: invalid version or sentences");
  }
  for (const key of PASTE_SENTENCE_KEYS) {
    const template = parsed.sentences[key];
    if (typeof template !== "string" || !template.includes(ORIGIN_PLACEHOLDER)) {
      throw new Error(`paste-sentences.json: missing or invalid key ${key}`);
    }
    const count = template.split(ORIGIN_PLACEHOLDER).length - 1;
    if (count !== 1) {
      throw new Error(
        `paste-sentences.json: key ${key} must contain exactly one ${ORIGIN_PLACEHOLDER}`,
      );
    }
  }
  cached = parsed;
  return parsed;
}

/** Clear cache (tests). */
export function resetPasteSentencesCacheForTests(): void {
  cached = null;
}

function defaultPublicOrigin(): string {
  return getVisitorPasteOrigin();
}

export function resolvePasteSentence(
  key: PasteSentenceKey,
  origin?: string,
): string {
  const file = loadPasteSentencesFile();
  const template = file.sentences[key];
  const base = (origin ?? defaultPublicOrigin()).replace(/\/$/, "");
  return template.replaceAll(ORIGIN_PLACEHOLDER, base);
}

export function getLitePartnerSetupSentence(): string {
  return resolvePasteSentence("lite_install");
}

export function getNodePrerequisiteSetupSentence(): string {
  return resolvePasteSentence("node_prerequisite");
}
