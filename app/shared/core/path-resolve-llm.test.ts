import { afterEach, describe, expect, it } from "vitest";
import {
  discoverPathsWithLlm,
  redactConfigSnippet,
  setLlmPortForTests,
  type LlmPort,
} from "./path-resolve-llm";

function fixturePort(content: string): LlmPort {
  return { complete: async () => content };
}

const happy = JSON.stringify({
  skillsRoot: "~/.cursor/skills/",
  rulesRoot: "~/.cursor/rules/",
  agentsRoot: "~/.cursor/agents/",
  workflowsRoot: "~/.cursor/workflows/",
  confidence: 0.9,
  rationale: "defaults",
});

afterEach(() => {
  setLlmPortForTests(null);
});

describe("redactConfigSnippet", () => {
  it("should_redact_secret_keys_from_json", () => {
    const out = redactConfigSnippet(
      JSON.stringify({ skills: "~/.cursor/skills/", api_key: "sk-secret", token: "abc" }),
    );
    expect(out).toContain("~/.cursor/skills/");
    expect(out).not.toContain("sk-secret");
    expect(out).not.toContain("abc");
    expect(out).toContain("<redacted>");
  });
});

describe("discoverPathsWithLlm", () => {
  it("should_accept_valid_schema_from_fixture", async () => {
    const result = await discoverPathsWithLlm(["{}"], { port: fixturePort(happy) });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.proposal.skillsRoot).toBe("~/.cursor/skills/");
    }
  });

  it("should_return_llm_unavailable_on_low_confidence", async () => {
    const result = await discoverPathsWithLlm(["{}"], {
      port: fixturePort(
        JSON.stringify({
          skillsRoot: "~/.cursor/skills/",
          rulesRoot: "~/.cursor/rules/",
          agentsRoot: "~/.cursor/agents/",
          workflowsRoot: "~/.cursor/workflows/",
          confidence: 0.1,
        }),
      ),
    });
    expect(result).toMatchObject({ ok: false, code: "llm_unavailable" });
  });

  it("should_return_llm_unavailable_on_malformed_json", async () => {
    const result = await discoverPathsWithLlm(["{}"], {
      port: fixturePort("not-json"),
    });
    expect(result).toMatchObject({ ok: false, code: "llm_unavailable" });
  });

  it("should_reject_escaped_paths", async () => {
    const result = await discoverPathsWithLlm(["{}"], {
      port: fixturePort(
        JSON.stringify({
          skillsRoot: "~/.cursor/../etc/",
          rulesRoot: "~/.cursor/rules/",
          agentsRoot: "~/.cursor/agents/",
          workflowsRoot: "~/.cursor/workflows/",
          confidence: 0.99,
        }),
      ),
    });
    expect(result).toMatchObject({ ok: false, code: "path_rejected" });
  });

  it("should_not_send_secrets_in_prompt", async () => {
    let seen = "";
    const port: LlmPort = {
      complete: async (prompt) => {
        seen = prompt;
        return happy;
      },
    };
    await discoverPathsWithLlm(
      [JSON.stringify({ api_key: "sk-live-secret", path: "~/.cursor/" })],
      { port },
    );
    expect(seen).not.toContain("sk-live-secret");
    expect(seen).toContain("<redacted>");
  });

  it("should_return_llm_unavailable_when_port_throws", async () => {
    const result = await discoverPathsWithLlm(["{}"], {
      port: {
        complete: async () => {
          throw new Error("network");
        },
      },
    });
    expect(result).toMatchObject({ ok: false, code: "llm_unavailable" });
  });
});
