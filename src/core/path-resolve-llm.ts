import { z } from "zod";
import { validatePathTemplate } from "@/core/path-policy";

const CONFIDENCE_THRESHOLD = 0.6;

const SECRET_KEY = /key|token|secret|password|authorization|bearer/i;

export type LlmPort = {
  complete: (prompt: string) => Promise<string>;
};

export type LlmPathProposal = {
  skillsRoot: string;
  rulesRoot: string;
  agentsRoot: string;
  workflowsRoot: string;
  confidence: number;
  rationale: string;
};

export type LlmDiscoverError = {
  ok: false;
  code: "llm_unavailable" | "path_rejected";
  message: string;
};

export type LlmDiscoverOk = {
  ok: true;
  proposal: LlmPathProposal;
};

const proposalSchema = z.object({
  skillsRoot: z.string().min(1),
  rulesRoot: z.string().min(1),
  agentsRoot: z.string().min(1),
  workflowsRoot: z.string().min(1),
  confidence: z.number(),
  rationale: z.string().optional().default(""),
});

let injectedPort: LlmPort | null = null;

export function setLlmPortForTests(port: LlmPort | null): void {
  injectedPort = port;
}

export function redactConfigSnippet(raw: string): string {
  try {
    const parsed: unknown = JSON.parse(raw);
    return JSON.stringify(redactValue(parsed));
  } catch {
    return raw.replace(
      /(api[_-]?key|token|secret|password|authorization)\s*[:=]\s*["']?[^"'\\s]+/gi,
      "$1=<redacted>",
    );
  }
}

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactValue);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEY.test(k) ? "<redacted>" : redactValue(v);
    }
    return out;
  }
  return value;
}

function defaultPort(): LlmPort {
  return {
    async complete(prompt: string): Promise<string> {
      const base =
        process.env.QWEN_BASE_URL?.trim() ||
        process.env.QWEN_NATIVE_BASE_URL?.trim();
      const key = process.env.QWEN_API_KEY?.trim();
      const model = process.env.QWEN_CHAT_MODEL?.trim() || "qwen-plus";
      if (!base || !key) {
        throw new Error("QWEN credentials are not configured");
      }
      const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        throw new Error(`Qwen HTTP ${res.status}`);
      }
      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      return json.choices?.[0]?.message?.content ?? "";
    },
  };
}

export async function discoverPathsWithLlm(
  snippets: string[],
  options: { port?: LlmPort } = {},
): Promise<LlmDiscoverOk | LlmDiscoverError> {
  const redacted = snippets.map(redactConfigSnippet);
  const prompt = [
    "Propose local SDD framework install roots as JSON only.",
    "Keys: skillsRoot, rulesRoot, agentsRoot, workflowsRoot, confidence (0-1), rationale.",
    "Use ~ or %USERPROFILE% home-relative paths. Config snippets:",
    ...redacted,
  ].join("\n");

  const port = options.port ?? injectedPort ?? defaultPort();
  let raw: string;
  try {
    raw = await port.complete(prompt);
  } catch (error) {
    return {
      ok: false,
      code: "llm_unavailable",
      message: error instanceof Error ? error.message : "llm_unavailable",
    };
  }

  const jsonText = extractJson(raw);
  let parsed: z.infer<typeof proposalSchema>;
  try {
    parsed = proposalSchema.parse(JSON.parse(jsonText));
  } catch {
    return {
      ok: false,
      code: "llm_unavailable",
      message: "malformed LLM JSON",
    };
  }

  if (parsed.confidence < CONFIDENCE_THRESHOLD) {
    return {
      ok: false,
      code: "llm_unavailable",
      message: "low confidence",
    };
  }

  const roots = [
    parsed.skillsRoot,
    parsed.rulesRoot,
    parsed.agentsRoot,
    parsed.workflowsRoot,
  ];
  for (const rawPath of roots) {
    const err = validatePathTemplate(rawPath);
    if (err) {
      return {
        ok: false,
        code: "path_rejected",
        message: "reason" in err ? err.reason : err.code,
      };
    }
  }

  return {
    ok: true,
    proposal: {
      skillsRoot: parsed.skillsRoot,
      rulesRoot: parsed.rulesRoot,
      agentsRoot: parsed.agentsRoot,
      workflowsRoot: parsed.workflowsRoot,
      confidence: parsed.confidence,
      rationale: parsed.rationale,
    },
  };
}

function extractJson(raw: string): string {
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  return raw;
}
