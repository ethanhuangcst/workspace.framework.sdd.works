import { afterEach, describe, expect, it } from "vitest";
import { getAgentSetupUrl, getMcpHttpUrl, getMcpWebsiteUrl } from "@/mcp/brand";
import {
  getLitePartnerSetupSentence,
  getNodePrerequisiteSetupSentence,
  resetPasteSentencesCacheForTests,
} from "@/mcp/paste-sentences";
import { getSddServerUrl } from "@/core/tools/package-fetch";
import { GET as getAgentSetup } from "@/app/api/agent-setup/route";
import { GET as getLiteInstallSetup } from "@/app/api/agent-setup/install/route";
import { GET as getNodeSetup } from "@/app/api/agent-setup/node/route";

const LEGACY_ORIGIN = "https://framework.sdd.works";
const CANONICAL = "https://sdd.works";

const saved: Record<string, string | undefined> = {};

function clearPublicOriginEnv(): void {
  for (const key of ["PUBLIC_BASE_URL", "SDD_SERVER_URL", "MCP_PUBLIC_URL"]) {
    saved[key] = process.env[key];
    delete process.env[key];
  }
  resetPasteSentencesCacheForTests();
}

function restorePublicOriginEnv(): void {
  for (const key of ["PUBLIC_BASE_URL", "SDD_SERVER_URL", "MCP_PUBLIC_URL"]) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  resetPasteSentencesCacheForTests();
}

describe("hostname defaults after ADR-127 (BUG-host regression)", () => {
  afterEach(() => {
    restorePublicOriginEnv();
  });

  it("should_use_sdd_works_for_paste_sentences_when_env_unset", () => {
    clearPublicOriginEnv();
    expect(getMcpWebsiteUrl()).toBe(CANONICAL);
    expect(getAgentSetupUrl()).toBe(`${CANONICAL}/setup`);
    expect(getLitePartnerSetupSentence()).toBe(
      `Fetch and execute the setup instructions from ${CANONICAL}/setup/install`,
    );
    expect(getNodePrerequisiteSetupSentence()).toBe(
      `Fetch and execute the setup instructions from ${CANONICAL}/setup/node`,
    );
    expect(getLitePartnerSetupSentence()).not.toContain(LEGACY_ORIGIN);
    expect(getNodePrerequisiteSetupSentence()).not.toContain(LEGACY_ORIGIN);
  });

  it("should_use_sdd_works_for_mcp_and_package_base_when_env_unset", () => {
    clearPublicOriginEnv();
    expect(getMcpHttpUrl()).toBe(`${CANONICAL}/mcp`);
    expect(getSddServerUrl()).toBe(CANONICAL);
    expect(getMcpHttpUrl()).not.toContain(LEGACY_ORIGIN);
    expect(getSddServerUrl()).not.toContain(LEGACY_ORIGIN);
  });

  it("should_serve_setup_markdown_with_sdd_works_origin_and_mcp_entry_name", async () => {
    clearPublicOriginEnv();
    const res = await getAgentSetup();
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(`${CANONICAL}/mcp`);
    expect(body).toContain('"framework.sdd.works"');
    expect(body).not.toContain(`${LEGACY_ORIGIN}/mcp`);
    expect(body).not.toContain('"command"');
  });

  it("should_serve_lite_and_node_markdown_with_sdd_works_origin", async () => {
    clearPublicOriginEnv();
    const lite = await (await getLiteInstallSetup()).text();
    const node = await (await getNodeSetup()).text();
    expect(lite).toContain(`${CANONICAL}/api/sdd/lite/files`);
    expect(node).toContain(`${CANONICAL}/api/setup/node/catalog`);
    expect(lite).not.toContain(LEGACY_ORIGIN);
    expect(node).not.toContain(LEGACY_ORIGIN);
  });
});
