import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MANIFEST_FILENAME, packageTarPath, unpackedDir } from "@/core/sync/paths";

const requireAdminApi = vi.fn();

vi.mock("@/auth/require-admin-api", () => ({
  requireAdminApi: () => requireAdminApi(),
}));

const dirs: string[] = [];
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

async function loadGet() {
  const mod = await import("./route");
  return mod.GET;
}

afterEach(() => {
  requireAdminApi.mockReset();
  while (dirs.length > 0) {
    const dir = dirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("GET /api/admin/admin-note", () => {
  it("should_return_401_when_unsigned", async () => {
    const { NextResponse } = await import("next/server");
    requireAdminApi.mockResolvedValue({
      ok: false,
      response: NextResponse.json(
        { error: { key: "errors.unauthorized" } },
        { status: 401 },
      ),
    });
    const GET = await loadGet();
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("should_return_cache_html_when_unpack_has_admin_note", async () => {
    const dir = mkdtempSync(join(tmpdir(), "admin-note-api-"));
    dirs.push(dir);
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-api-note";
    mkdirSync(join(unpackedDir(sha), "content"), { recursive: true });
    writeFileSync(
      join(unpackedDir(sha), "content", ".admin-note.md"),
      "# Notes to the admin\n\n| # | Path |\n| --- | --- |\n| 1 | `lite-pack.allowlist.json` |\n",
    );
    writeFileSync(packageTarPath(sha), "fake-tarball");
    writeFileSync(
      join(dir, MANIFEST_FILENAME),
      JSON.stringify({
        latestCommit: sha,
        latestVersion: "v1",
        versions: [{ id: "v1", commitSha: sha }],
        inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }),
    );

    requireAdminApi.mockResolvedValue({ ok: true, admin: { id: "a" } });
    const GET = await loadGet();
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe("cache");
    expect(body.html).toContain("Notes to the admin");
    expect(body.html).toContain("content-table");
    expect(body.html).toContain("lite-pack.allowlist.json");
    expect(JSON.stringify(body)).not.toMatch(/passwordHash|sessionVersion/i);
  });
});
