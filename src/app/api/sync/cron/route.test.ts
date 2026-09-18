import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const runMock = vi.fn();

vi.mock("@/core/sync/run-scheduled-sync", () => ({
  runScheduledSync: (...args: unknown[]) => runMock(...args),
}));

const originalSecret = process.env.CRON_SECRET;

function makeRequest(secret?: string): Request {
  const headers = new Headers();
  if (secret) {
    headers.set("authorization", `Bearer ${secret}`);
  }
  return new Request("http://localhost/api/sync/cron", {
    method: "POST",
    headers,
  });
}

afterEach(() => {
  runMock.mockReset();
  if (originalSecret === undefined) {
    delete process.env.CRON_SECRET;
  } else {
    process.env.CRON_SECRET = originalSecret;
  }
});

describe("cron sync route", () => {
  it("should_run_sync_with_valid_secret", async () => {
    process.env.CRON_SECRET = "cron-test";
    runMock.mockResolvedValue({ status: "unchanged", commitSha: "sha-a", version: "main" });
    const res = await POST(makeRequest("cron-test"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      status: "unchanged",
      commitSha: "sha-a",
      version: "main",
    });
    expect(runMock).toHaveBeenCalledOnce();
  });

  it("should_return_401_on_missing_or_wrong_secret", async () => {
    process.env.CRON_SECRET = "cron-test";
    expect((await POST(makeRequest())).status).toBe(401);
    expect((await POST(makeRequest("wrong"))).status).toBe(401);
    expect(runMock).not.toHaveBeenCalled();
  });

  it("should_return_503_when_cron_secret_unset", async () => {
    delete process.env.CRON_SECRET;
    const res = await POST(makeRequest("anything"));
    expect(res.status).toBe(503);
    expect(runMock).not.toHaveBeenCalled();
  });
});
