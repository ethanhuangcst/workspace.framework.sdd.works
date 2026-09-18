import { afterEach, describe, expect, it, vi } from "vitest";
import { runScheduledSync } from "./run-scheduled-sync";

const syncMock = vi.fn();
const clearMock = vi.fn();

vi.mock("./sync-job", () => ({
  syncFrameworkRepo: (...args: unknown[]) => syncMock(...args),
}));

vi.mock("@/core/tools/list-versions", () => ({
  clearListVersionsCache: (...args: unknown[]) => clearMock(...args),
}));

const originalToken = process.env.GITHUB_TOKEN;

afterEach(() => {
  syncMock.mockReset();
  clearMock.mockReset();
  if (originalToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalToken;
  }
});

describe("runScheduledSync", () => {
  it("should_skip_when_github_token_unset", async () => {
    delete process.env.GITHUB_TOKEN;
    const result = await runScheduledSync();
    expect(result).toEqual({ skipped: true, reason: "no_github_token" });
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should_sync_and_clear_versions_cache", async () => {
    process.env.GITHUB_TOKEN = "ghp_test";
    syncMock.mockResolvedValue({ status: "synced", commitSha: "sha", version: "main" });
    const result = await runScheduledSync();
    expect(result).toEqual({ status: "synced", commitSha: "sha", version: "main" });
    expect(clearMock).toHaveBeenCalledOnce();
  });
});
