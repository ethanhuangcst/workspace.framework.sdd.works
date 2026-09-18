import { afterEach, describe, expect, it } from "vitest";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseToolJson } from "./errors";
import { clearListVersionsCache, listVersions } from "./list-versions";
import { MANIFEST_FILENAME, packageTarPath, unpackedDir } from "@/core/sync/paths";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

afterEach(() => {
  clearListVersionsCache();
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("listVersions", () => {
  it("should_read_sync_cache_on_http_channel", async () => {
    clearListVersionsCache();
    const dir = mkdtempSync(join(tmpdir(), "sdd-lv-cache-"));
    process.env.SDD_PACKAGE_CACHE_DIR = dir;
    const sha = "sha-v1";
    mkdirSync(unpackedDir(sha), { recursive: true });
    writeFileSync(packageTarPath(sha), "tar");
    writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: {
        skills: ["tdd"],
        rules: ["dod"],
        agents: [],
        workflows: [],
        other: [],
      },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }));

    const result = await listVersions({ channel: "http" });
    const body = parseToolJson<{
      versions: { id: string }[];
      inventory: { skills: string[] };
    }>(result);
    expect(body.versions[0]?.id).toBe("v1.0.0");
    expect(body.inventory.skills).toContain("tdd");
  });

  it("should_return_package_unavailable_on_http_when_cache_empty", async () => {
    clearListVersionsCache();
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(join(tmpdir(), "sdd-lv-empty-"));
    const result = await listVersions({ channel: "http" });
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("package_unavailable");
  });
});
