/**
 * Tarball content regression — catches stale file bytes when skill names match.
 * Complements freshness-regression.test.ts (F1–F10) which only checked inventory names.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { GET as getPackage } from "@/app/api/sdd/package/route";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { readPackageManifest } from "@/core/sync/manifest";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import { parseToolJson } from "@/core/tools/errors";
import { installFramework } from "@/core/tools/install";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function writeRealTarball(commitSha: string): void {
  const result = spawnSync(
    "tar",
    ["-czf", packageTarPath(commitSha), "-C", unpackedDir(commitSha), "."],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || "tar create failed");
  }
}

function seedCacheWithContent(
  sha: string,
  version: string,
  skills: Record<string, string>,
): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-content-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  mkdirSync(unpackedDir(sha), { recursive: true });
  for (const [skill, body] of Object.entries(skills)) {
    const skillDir = join(unpackedDir(sha), "skills", skill);
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, "SKILL.md"), body);
  }
  writeRealTarball(sha);
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: {
        skills: Object.keys(skills),
        rules: [],
        agents: [],
        workflows: [],
        other: [],
      },
      syncedAt: new Date().toISOString(),
    }),
  );
  return dir;
}

async function extractPackageTarball(version = "latest"): Promise<string> {
  const req = {
    url: `http://localhost/api/sdd/package?version=${encodeURIComponent(version)}`,
  } as import("next/server").NextRequest;
  const res = await getPackage(req);
  expect(res.status).toBe(200);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = mkdtempSync(join(tmpdir(), "sdd-extract-"));
  writeFileSync(join(dest, "pkg.tar.gz"), buf);
  const result = spawnSync(
    "tar",
    ["-xzf", join(dest, "pkg.tar.gz"), "-C", dest, "--strip-components", "1"],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || "tar extract failed");
  }
  return dest;
}

afterEach(() => {
  setEnsureCacheFreshDepsForTests(null);
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("package tarball content", () => {
  it("F11a: tarball extract matches unpacked cache bytes", async () => {
    seedCacheWithContent("sha-content", "main", {
      "a-tdd": "# a-tdd\n",
      tdd: "# tdd\n",
    });

    const extracted = await extractPackageTarball();
    expect(readFileSync(join(extracted, "skills/a-tdd/SKILL.md"), "utf8")).toBe(
      "# a-tdd\n",
    );
    expect(readFileSync(join(unpackedDir("sha-content"), "skills/a-tdd/SKILL.md"), "utf8")).toBe(
      "# a-tdd\n",
    );
    rmSync(extracted, { recursive: true, force: true });
  });

  it("F11b: content-only repo update — new SHA must change tarball bytes", async () => {
    seedCacheWithContent("sha-old-content", "main", { "a-tdd": "# atdd\n" });

    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ commitSha: "sha-new-content", version: "main" }),
      sync: async () => {
        const dir = process.env.SDD_PACKAGE_CACHE_DIR!;
        const newSha = "sha-new-content";
        mkdirSync(join(unpackedDir(newSha), "skills/a-tdd"), { recursive: true });
        writeFileSync(
          join(unpackedDir(newSha), "skills/a-tdd/SKILL.md"),
          "# a-tdd\n",
        );
        writeRealTarball(newSha);
        writeFileSync(
          join(dir, MANIFEST_FILENAME),
          JSON.stringify({
            latestCommit: newSha,
            latestVersion: "main",
            versions: [{ id: "main", commitSha: newSha }],
            inventory: {
              skills: ["a-tdd"],
              rules: [],
              agents: [],
              workflows: [],
              other: [],
            },
            syncedAt: new Date().toISOString(),
          }),
        );
        return {
          status: "synced",
          commitSha: newSha,
          version: "main",
        };
      },
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-f11-"));
    const body = parseToolJson<{
      commitSha: string;
      manifest?: { files: { skills: string[] } };
    }>(
      await installFramework(
        {
          client: "cursor",
          os: "darwin",
          installed_commit: "sha-old-content",
          installed_version: "main",
        },
        {
          channel: "http",
          home,
          userProfile: home,
          env: { HOME: home },
          skipLlm: true,
        },
      ),
    );

    expect(body.commitSha).toBe("sha-new-content");
    expect(body.manifest?.files.skills).toContain("a-tdd");

    const extracted = await extractPackageTarball();
    const skillContent = readFileSync(
      join(extracted, "skills/a-tdd/SKILL.md"),
      "utf8",
    );
    expect(skillContent).toBe("# a-tdd\n");
    expect(skillContent).not.toBe("# atdd\n");
    rmSync(extracted, { recursive: true, force: true });
  });

  it("F11c: same skill name with stale bytes fails if tarball not refreshed", async () => {
    seedCacheWithContent("sha-stale-bytes", "main", { "a-tdd": "# atdd\n" });

    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({
        commitSha: "sha-stale-bytes",
        version: "main",
      }),
      sync: async () => ({
        status: "unchanged" as const,
        commitSha: "sha-stale-bytes",
        version: "main",
      }),
      clearVersionsCache: () => {},
    });

    const extracted = await extractPackageTarball();
    expect(readFileSync(join(extracted, "skills/a-tdd/SKILL.md"), "utf8")).toBe(
      "# atdd\n",
    );
    rmSync(extracted, { recursive: true, force: true });
  });
});
