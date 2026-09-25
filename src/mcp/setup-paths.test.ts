import { describe, expect, it } from "vitest";
import { SETUP_REDIRECTS, SETUP_REWRITES } from "@/mcp/setup-paths";

describe("setup public paths", () => {
  it("should_redirect_agent_setup_to_setup", () => {
    expect(SETUP_REDIRECTS).toEqual([
      {
        source: "/agent-setup",
        destination: "/setup",
        permanent: false,
      },
    ]);
  });

  it("should_rewrite_setup_to_agent_setup_api", () => {
    expect(SETUP_REWRITES).toEqual([
      {
        source: "/setup",
        destination: "/api/agent-setup",
      },
    ]);
  });
});
