import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const syncMock = vi.fn();
const clearMock = vi.fn();

vi.mock("@/core/sync/sync-job", () => ({
  syncFrameworkRepo: (...args: unknown[]) => syncMock(...args),
}));

vi.mock("@/core/tools/list-versions", () => ({
  clearListVersionsCache: (...args: unknown[]) => clearMock(...args),
}));

const originalSecret = process.env.GITHUB_WEBHOOK_SECRET;

function sign(body: string, secret: string): string {
  const digest = createHmac("sha256", secret).update(body).digest("hex");
  return `sha256=${digest}`;
}

function makeRequest(
  body: string,
  options?: { signature?: string | null; event?: string },
): Request {
  const headers = new Headers({ "content-type": "application/json" });
  if (options?.signature !== null) {
    headers.set(
      "x-hub-signature-256",
      options?.signature ?? sign(body, process.env.GITHUB_WEBHOOK_SECRET ?? "test-secret"),
    );
  }
  if (options?.event) {
    headers.set("x-github-event", options.event);
  }
  return new Request("http://localhost/api/github/webhook", {
    method: "POST",
    headers,
    body,
  });
}

afterEach(() => {
  syncMock.mockReset();
  clearMock.mockReset();
  if (originalSecret === undefined) {
    delete process.env.GITHUB_WEBHOOK_SECRET;
  } else {
    process.env.GITHUB_WEBHOOK_SECRET = originalSecret;
  }
});

describe("GitHub webhook", () => {
  it("should_sync_on_valid_push_signature", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    syncMock.mockResolvedValue({ status: "synced", commitSha: "sha-new", version: "main" });
    const body = JSON.stringify({ ref: "refs/heads/main" });
    const res = await POST(makeRequest(body, { event: "push" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "synced", commitSha: "sha-new" });
    expect(syncMock).toHaveBeenCalledOnce();
    expect(clearMock).toHaveBeenCalledOnce();
  });

  it("should_return_401_on_bad_signature", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    const body = JSON.stringify({ ref: "refs/heads/main" });
    const res = await POST(
      makeRequest(body, { signature: "sha256=deadbeef", event: "push" }),
    );
    expect(res.status).toBe(401);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should_ignore_non_push_events", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    const body = JSON.stringify({});
    const res = await POST(makeRequest(body, { event: "ping" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ignored", event: "ping" });
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should_return_401_when_secret_unset", async () => {
    delete process.env.GITHUB_WEBHOOK_SECRET;
    const body = JSON.stringify({});
    const res = await POST(makeRequest(body, { event: "push", signature: "sha256=x" }));
    expect(res.status).toBe(401);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it("should_return_sync_error_without_500_on_sync_failure", async () => {
    process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
    syncMock.mockResolvedValue({ code: "sync_error", message: "GitHub down" });
    const body = JSON.stringify({ ref: "refs/heads/main" });
    const res = await POST(makeRequest(body, { event: "push" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "sync_error", message: "GitHub down" });
  });
});
