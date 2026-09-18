import { afterEach, describe, expect, it } from "vitest";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GET as getVersions } from "./versions/route";
import { GET as getPackage } from "./package/route";
import { GET as getAgentSetup } from "../agent-setup/route";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedCache(): { dir: string; sha: string } {
  const dir = mkdtempSync(join(tmpdir(), "sdd-api-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-v1";
  mkdirSync(unpackedDir(sha), { recursive: true });
  writeFileSync(packageTarPath(sha), "fake-tarball-bytes");
  writeFileSync(join(dir, MANIFEST_FILENAME), JSON.stringify({
    latestCommit: sha,
    latestVersion: "v1.0.0",
    versions: [{ id: "v1.0.0", commitSha: sha }],
    inventory: {
      skills: ["tdd"],
      rules: [],
      agents: [],
      workflows: [],
      other: [],
    },
    syncedAt: "2026-01-01T00:00:00.000Z",
  }));
  return { dir, sha };
}

afterEach(() => {
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("SDD package API", () => {
  it("should_return_versions_after_sync", async () => {
    seedCache();
    const res = await getVersions();
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      latestCommit: string;
      inventory: { skills: string[] };
    };
    expect(body.latestCommit).toBe("sha-v1");
    expect(body.inventory.skills).toContain("tdd");
  });

  it("should_return_sync_pending_before_sync", async () => {
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(join(tmpdir(), "sdd-api-empty-"));
    const res = await getVersions();
    expect(res.status).toBe(409);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("sync_pending");
  });

  it("should_stream_package_tarball", async () => {
    seedCache();
    const req = {
      url: "http://localhost/api/sdd/package?version=latest",
    } as import("next/server").NextRequest;
    const res = await getPackage(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-SDD-Commit")).toBe("sha-v1");
    expect(res.headers.get("X-SDD-Version")).toBe("v1.0.0");
    expect(res.headers.get("Content-Type")).toBe("application/gzip");
  });

  it("should_return_agent_setup_markdown", async () => {
    const res = await getAgentSetup();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    const body = await res.text();
    expect(body).toContain("framework.sdd.works");
    expect(body).toContain("https://framework.sdd.works/mcp");
    expect(body).toContain("sdd_install_framework");
  });

  it("should_return_404_for_unknown_version", async () => {
    seedCache();
    const req = {
      url: "http://localhost/api/sdd/package?version=v9.9.9",
    } as import("next/server").NextRequest;
    const res = await getPackage(req);
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("version_not_found");
  });
});
