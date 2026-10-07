import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { INSTRUCTIONS_TABS_PACK_RELATIVE } from "@/core/seeds/instructions-tabs-config";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import { resolveInstructionsTabs } from "./instructions-tabs";

const dirs: string[] = [];
const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

const defaultTabsConfig = readFileSync(
  join(process.cwd(), "src/content/.instructions-tabs.json"),
  "utf8",
);

function track(dir: string): string {
  dirs.push(dir);
  return dir;
}

function seedCache(files: Record<string, string>): { dir: string; sha: string } {
  const dir = track(mkdtempSync(join(tmpdir(), "instructions-tabs-cache-")));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "sha-tabs";
  const unpacked = unpackedDir(sha);
  mkdirSync(unpacked, { recursive: true });
  writeFileSync(packageTarPath(sha), "fake-tarball");
  for (const [name, body] of Object.entries(files)) {
    const path = join(unpacked, name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, body);
  }
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: "v1.0.0",
      versions: [{ id: "v1.0.0", commitSha: sha }],
      inventory: { skills: [], rules: [], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return { dir, sha };
}

afterEach(() => {
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

describe("resolveInstructionsTabs", () => {
  it("should_use_valid_cache_config_and_cache_markdown", () => {
    seedCache({
      [INSTRUCTIONS_TABS_PACK_RELATIVE]: defaultTabsConfig,
      "content/features/features.en.md": "## Features\n\n- ethan — Cache tabs EN.\n",
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum\n\nCache scrum.\n",
      "content/invoke-agents/invoke-agents.en.md": "# Invoke\n\nCache invoke.\n",
    });

    const result = resolveInstructionsTabs("en");
    expect(result.source).toBe("cache");
    expect(result.tabs.map((t) => t.id)).toEqual([
      "setup",
      "features",
      "scrum-in-sdd",
      "invoke-agents",
    ]);
    const features = result.tabs.find((t) => t.id === "features");
    expect(features?.html).toContain("Cache tabs EN");
    expect(features?.contentSource).toBe("cache");
    expect(result.tabs.find((t) => t.id === "setup")?.html).toBeUndefined();
  });

  it("should_fall_back_to_bundled_config_when_cache_config_invalid", () => {
    const invalid = JSON.parse(defaultTabsConfig) as {
      version: number;
      tabs: unknown[];
    };
    invalid.tabs.push({
      ...(invalid.tabs[1] as object),
      id: "features-dup",
    });
    seedCache({
      [INSTRUCTIONS_TABS_PACK_RELATIVE]: JSON.stringify(invalid),
      "content/features/features.en.md": "## Features\n\nShould not win.\n",
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum\n\nCache scrum.\n",
      "content/invoke-agents/invoke-agents.en.md": "# Invoke\n\nCache invoke.\n",
    });

    const result = resolveInstructionsTabs("en");
    expect(result.source).toBe("bundled");
    const features = result.tabs.find((t) => t.id === "features");
    expect(features?.html).toBeDefined();
    expect(features?.contentSource).toBe("cache");
  });

  it("should_use_english_markdown_when_zh_path_missing_in_cache", () => {
    seedCache({
      [INSTRUCTIONS_TABS_PACK_RELATIVE]: defaultTabsConfig,
      "content/features/features.en.md": "## Features\n\n- ethan — EN fallback.\n",
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum\n\nEN scrum.\n",
      "content/invoke-agents/invoke-agents.en.md": "# Invoke\n\nEN invoke.\n",
    });

    const result = resolveInstructionsTabs("zh-Hant");
    const features = result.tabs.find((t) => t.id === "features");
    expect(features?.sourceLocale).toBe("en");
    expect(features?.html).toContain("EN fallback");
  });
});
