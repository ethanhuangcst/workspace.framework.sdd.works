import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { MANIFEST_FILENAME, unpackedDir } from "@/core/sync/paths";

const findUnique = vi.fn();
const requireAdminApi = vi.fn();

vi.mock("@/auth/require-admin-api", () => ({
  requireAdminApi: () => requireAdminApi(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    setting: {
      findUnique: (...args: unknown[]) => findUnique(...args),
    },
  },
}));

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

async function loadGet() {
  const mod = await import("./route");
  return mod.GET;
}

afterEach(() => {
  findUnique.mockReset();
  requireAdminApi.mockReset();
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("GET /api/admin/framework", () => {
  it("should_return_empty_when_no_github_url", async () => {
    requireAdminApi.mockResolvedValue({ ok: true, admin: { id: "a" } });
    findUnique.mockResolvedValue({ githubUrl: null });
    const GET = await loadGet();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ empty: true });
  });

  it("should_return_cache_missing_when_settings_set_but_no_manifest", async () => {
    requireAdminApi.mockResolvedValue({ ok: true, admin: { id: "a" } });
    findUnique.mockResolvedValue({
      githubUrl: "https://github.com/fixture/sdd-framework",
    });
    const GET = await loadGet();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      empty: false,
      source: "github.com/fixture/sdd-framework",
      tree: [],
      cache_missing: true,
    });
  });

  it("should_build_tree_from_unpacked_cache", async () => {
    const cacheDir = mkdtempSync(join(tmpdir(), "sdd-fw-route-"));
    process.env.SDD_PACKAGE_CACHE_DIR = cacheDir;
    const sha = "sha-fixture";
    mkdirSync(join(unpackedDir(sha), "skills/tdd"), { recursive: true });
    writeFileSync(join(unpackedDir(sha), "skills/tdd/SKILL.md"), "# tdd\n");
    writeFileSync(
      join(cacheDir, MANIFEST_FILENAME),
      JSON.stringify({
        latestCommit: sha,
        latestVersion: "main",
        versions: [{ id: "main", commitSha: sha }],
        inventory: { skills: ["tdd"], rules: [], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }),
    );

    requireAdminApi.mockResolvedValue({ ok: true, admin: { id: "a" } });
    findUnique.mockResolvedValue({
      githubUrl: "https://github.com/fixture/sdd-framework",
    });
    const GET = await loadGet();
    const res = await GET();
    const body = await res.json();
    expect(body.cache_missing).toBeUndefined();
    expect(body.tree).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "skills/",
          type: "dir",
          children: expect.arrayContaining([
            expect.objectContaining({ name: "tdd/", type: "dir" }),
          ]),
        }),
      ]),
    );
  });
});
