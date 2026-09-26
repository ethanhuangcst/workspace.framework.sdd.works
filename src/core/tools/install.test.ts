import { afterEach, describe, expect, it } from "vitest";
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
import { setPackageFetchForTests } from "./package-fetch";
import { clearPathDetectCache } from "@/core/path-detect";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import {
  setEnsureCacheFreshDepsForTests,
} from "@/core/sync/ensure-cache-fresh";
import { readPackageManifest } from "@/core/sync/manifest";
import { parseToolJson } from "./errors";
import {
  installFramework,
  updateFramework,
  type InstallArgs,
  type InstallContext,
} from "./install";
import {
  installFrameworkHttp,
  updateFrameworkHttp,
} from "./install-http";

async function install(
  args: InstallArgs,
  ctx: InstallContext,
) {
  if (ctx.channel === "http") return installFrameworkHttp(args, ctx);
  return installFramework(args, ctx);
}

async function update(
  args: InstallArgs,
  ctx: InstallContext,
) {
  if (ctx.channel === "http") return updateFrameworkHttp(args, ctx);
  return updateFramework(args, ctx);
}

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedHttpCache(sha: string, version: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-install-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const unpacked = unpackedDir(sha);
  mkdirSync(join(unpacked, "skills/tdd"), { recursive: true });
  mkdirSync(join(unpacked, "rules"), { recursive: true });
  writeFileSync(join(unpacked, "skills/tdd/SKILL.md"), "# tdd\n");
  writeFileSync(join(unpacked, "rules/dod.mdc"), "# dod\n");
  writeFileSync(packageTarPath(sha), "fake-tarball");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: { skills: ["tdd"], rules: ["dod"], agents: [], workflows: [], other: [] },
      syncedAt: "2026-01-01T00:00:00.000Z",
    }),
  );
  return dir;
}

function resolved(
  version: string,
  tempDir: string,
  commitSha = `sha-${version}`,
) {
  return { version, tempDir, commitSha };
}

function makePkg(version: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-src-"));
  mkdirSync(join(dir, "skills/tdd"), { recursive: true });
  mkdirSync(join(dir, "rules"), { recursive: true });
  mkdirSync(join(dir, "agents"), { recursive: true });
  mkdirSync(join(dir, "workflows"), { recursive: true });
  writeFileSync(join(dir, "skills/tdd/SKILL.md"), `# tdd ${version}\n`);
  writeFileSync(join(dir, "rules/dod.mdc"), "# dod\n");
  writeFileSync(join(dir, "agents/code-reviewer.md"), "# agent\n");
  writeFileSync(join(dir, "workflows/new-feature.md"), "# wf\n");
  return dir;
}

function mockCacheFreshAsMatchingCache(): void {
  setEnsureCacheFreshDepsForTests({
    readManifest: readPackageManifest,
    resolveLive: async () => {
      const manifest = readPackageManifest();
      if (!manifest) {
        return { code: "sync_error", message: "sync_pending" };
      }
      return { commitSha: manifest.latestCommit, version: manifest.latestVersion };
    },
    sync: async () => {
      const manifest = readPackageManifest();
      return {
        status: "unchanged" as const,
        commitSha: manifest?.latestCommit ?? "sha-unknown",
        version: manifest?.latestVersion ?? "main",
      };
    },
    clearVersionsCache: () => {},
  });
}

afterEach(() => {
  setPackageFetchForTests(null);
  setEnsureCacheFreshDepsForTests(null);
  clearPathDetectCache();
  if (originalCacheDir === undefined) {
    delete process.env.SDD_PACKAGE_CACHE_DIR;
  } else {
    process.env.SDD_PACKAGE_CACHE_DIR = originalCacheDir;
  }
});

describe("install", () => {
  it("should_write_skills_rules_agents_workflows_and_manifest", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{
      version: string;
      resolution_source: string;
      asset_counts: { skills: number };
    }>(result);
    expect(body.version).toBe("v1.0.0");
    expect(body.resolution_source).toBe("seed");
    expect(body.asset_counts.skills).toBeGreaterThan(0);
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/dod.mdc"))).toBe(true);
    expect(existsSync(join(home, ".cursor/agents/code-reviewer.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/workflows/new-feature.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/.sdd-installed.json"))).toBe(true);
  });

  it("should_reinstall_when_manifest_exists_but_files_deleted", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await install({ client: "cursor", os: "darwin" }, ctx);
    rmSync(join(home, ".cursor/skills/tdd"), { recursive: true, force: true });
    rmSync(join(home, ".cursor/rules/dod.mdc"), { force: true });

    const second = await install({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ version: string }>(second);
    expect(body.version).toBe("v1.0.0");
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/dod.mdc"))).toBe(true);
  });

  it("should_reinstall_when_force_true_even_if_intact", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await install({ client: "cursor", os: "darwin" }, ctx);
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "stale\n");

    const second = await install(
      { client: "cursor", os: "darwin", force: true },
      ctx,
    );
    const body = parseToolJson<{ version: string }>(second);
    expect(body.version).toBe("v1.0.0");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toContain(
      "v1.0.0",
    );
  });

  it("should_reinstall_when_same_version_label_but_different_commit_sha", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    const pkgV1 = makePkg("main");
    setPackageFetchForTests(async () => resolved("main", pkgV1, "sha-main-1"));
    await install({ client: "cursor", os: "darwin", version: "main" }, ctx);

    const pkgV2 = mkdtempSync(join(tmpdir(), "sdd-src-"));
    mkdirSync(join(pkgV2, "skills/test-driven-dev"), { recursive: true });
    mkdirSync(join(pkgV2, "rules"), { recursive: true });
    mkdirSync(join(pkgV2, "agents"), { recursive: true });
    mkdirSync(join(pkgV2, "workflows"), { recursive: true });
    writeFileSync(
      join(pkgV2, "skills/test-driven-dev/SKILL.md"),
      "# test-driven-dev main\n",
    );
    writeFileSync(join(pkgV2, "rules/dod.mdc"), "# dod\n");
    setPackageFetchForTests(async () => resolved("main", pkgV2, "sha-main-2"));

    const second = await install(
      { client: "cursor", os: "darwin", version: "main" },
      ctx,
    );
    const body = parseToolJson<{ version: string }>(second);
    expect(body.version).toBe("main");
    expect(existsSync(join(home, ".cursor/skills/test-driven-dev/SKILL.md"))).toBe(
      true,
    );
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(false);
  });

  it("should_reinstall_when_manifest_lacks_package_commit", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg, "sha-v1"));
    await install({ client: "cursor", os: "darwin" }, ctx);

    const manifestPath = join(home, ".cursor/.sdd-installed.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
      string,
      unknown
    >;
    delete manifest.package_commit;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    const second = await install({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ version: string }>(second);
    expect(body.version).toBe("v1.0.0");
    const saved = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      package_commit?: string;
    };
    expect(saved.package_commit).toBe("sha-v1");
  });

  it("should_return_already_up_to_date_on_same_version", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await install({ client: "cursor", os: "darwin" }, ctx);
    const second = await install({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ error: { code: string } }>(second);
    expect(body.error.code).toBe("already_up_to_date");
  });

  it("should_replace_package_files_and_preserve_user_files", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    setPackageFetchForTests(async () =>
      resolved("v1.0.0", makePkg("v1.0.0")),
    );
    await install({ client: "cursor", os: "darwin" }, ctx);
    mkdirSync(join(home, ".cursor/skills/my-skill"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/my-skill/SKILL.md"), "mine\n");

    const v2 = makePkg("v2.0.0");
    mkdirSync(join(v2, "skills/atdd"), { recursive: true });
    writeFileSync(join(v2, "skills/atdd/SKILL.md"), "# atdd v2\n");
    setPackageFetchForTests(async () => resolved("v2.0.0", v2, "sha-v2.0.0"));
    const result = await install({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ version: string }>(result);
    expect(body.version).toBe("v2.0.0");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toContain(
      "v2.0.0",
    );
    expect(existsSync(join(home, ".cursor/skills/my-skill/SKILL.md"))).toBe(true);
  });

  it("should_reject_unknown_client_without_writes", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await install(
      { client: "unknown-cli-xyz", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("client_unknown");
    expect(existsSync(join(home, ".cursor"))).toBe(false);
  });

  it("should_return_portable_paths_on_http_without_install_home", async () => {
    seedHttpCache("sha-http-portable", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "http" },
    );
    const body = parseToolJson<{
      extractTarget: string;
      manifestPath: string;
      paths: { skills: string; rules: string };
      previousManifest: unknown;
      resolution_source: string;
      instructions: string;
    }>(result);
    expect(body.extractTarget).toBe("~/.cursor");
    expect(body.manifestPath).toBe("~/.cursor/.sdd-installed.json");
    expect(body.paths.skills).toBe("~/.cursor/skills/");
    expect(body.paths.rules).toBe("~/.cursor/rules/");
    expect(body.previousManifest).toBeNull();
    expect(body.resolution_source).toBe("seed");
    expect(body.instructions).toContain('tar xz -C "~/.cursor"');
  });

  it("should_return_expanded_paths_on_http_with_install_home", async () => {
    seedHttpCache("sha-http-v1", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await install(
      { client: "cursor", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      packageUrl: string;
      version: string;
      commitSha: string;
      paths: { skills: string };
      manifest: { package_version: string; files: { skills: string[] } };
      instructions: string;
    }>(result);
    expect(body.packageUrl).toContain("/api/sdd/package?version=latest");
    expect(body.version).toBe("v1.0.0");
    expect(body.commitSha).toBe("sha-http-v1");
    expect(body.paths.skills).toContain(".cursor/skills");
    expect(body.manifest.package_version).toBe("v1.0.0");
    expect(body.manifest.files.skills).toContain("skills/tdd/SKILL.md");
    expect(body.manifest).toMatchObject({ pack_complete: true });
    expect(body.instructions).toContain("curl -fsSL");
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(false);
  });

  it("should_return_previous_manifest_on_http_when_present", async () => {
    seedHttpCache("sha-http-v2", "v2.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor"), { recursive: true });
    const previous = {
      version: 1,
      package_version: "v1.0.0",
      package_commit: "sha-old",
      installed_at: "2026-01-01T00:00:00.000Z",
      files: { skills: ["old-skill"], rules: [], agents: [], workflows: [] },
    };
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify(previous, null, 2),
    );
    const result = await install(
      { client: "cursor", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{ previousManifest: typeof previous }>(result);
    expect(body.previousManifest?.package_version).toBe("v1.0.0");
    expect(body.previousManifest?.files.skills).toContain("old-skill");
  });

  it("should_honor_env_relocation_source", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const claudeHome = join(home, "relocated-claude");
    mkdirSync(claudeHome, { recursive: true });
    setPackageFetchForTests(async () =>
      resolved("v1.0.0", makePkg("v1.0.0")),
    );
    const result = await install(
      { client: "claude", os: "darwin" },
      {
        channel: "stdio",
        home,
        userProfile: home,
        env: { HOME: home, CLAUDE_CONFIG_DIR: claudeHome },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{ resolution_source: string }>(result);
    expect(body.resolution_source).toBe("env");
    expect(existsSync(join(claudeHome, "skills/tdd/SKILL.md"))).toBe(true);
  });

  it("should_include_cache_freshness_fields_on_http", async () => {
    seedHttpCache("sha-http-v1", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await install(
      { client: "cursor", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      cache_synced_at: string;
      cache_age_minutes: number;
      cache_stale: boolean;
      instructions: string;
    }>(result);
    expect(body.cache_synced_at).toBe("2026-01-01T00:00:00.000Z");
    expect(body.cache_age_minutes).toBeGreaterThan(30);
    expect(body.cache_stale).toBe(true);
    expect(body.instructions).toContain("package cache may be stale");
    expect(body.instructions).toContain("verify local files");
  });

  it("should_never_return_already_up_to_date_on_http_even_when_commit_matches", async () => {
    seedHttpCache("sha-old", "main");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor"), { recursive: true });
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "sha-old",
        installed_at: "2026-01-01T00:00:00.000Z",
        files: { skills: ["tdd"], rules: [], agents: [], workflows: [] },
      }),
    );

    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        installed_commit: "sha-old",
        installed_version: "main",
      },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      packageUrl: string;
      extract_recommended: boolean;
      local_commit_matches: boolean;
      error?: { code: string };
    }>(result);
    expect(body.error).toBeUndefined();
    expect(body.packageUrl).toContain("/api/sdd/package");
    expect(body.extract_recommended).toBe(true);
    expect(body.local_commit_matches).toBe(true);
  });

  it("should_return_new_package_when_cache_refreshed_to_new_commit", async () => {
    seedHttpCache("sha-old", "main");
    mockCacheFreshAsMatchingCache();

    setEnsureCacheFreshDepsForTests({
      readManifest: readPackageManifest,
      resolveLive: async () => ({ commitSha: "sha-new", version: "main" }),
      sync: async () => {
        const dir = process.env.SDD_PACKAGE_CACHE_DIR!;
        const newSha = "sha-new";
        mkdirSync(join(unpackedDir(newSha), "skills/atdd"), { recursive: true });
        writeFileSync(join(unpackedDir(newSha), "skills/atdd/SKILL.md"), "# atdd\n");
        writeFileSync(packageTarPath(newSha), "new-tar");
        writeFileSync(
          join(dir, MANIFEST_FILENAME),
          JSON.stringify({
            latestCommit: newSha,
            latestVersion: "main",
            versions: [{ id: "main", commitSha: newSha }],
            inventory: { skills: ["atdd"], rules: [], agents: [], workflows: [], other: [] },
            syncedAt: new Date().toISOString(),
          }),
        );
        return { status: "synced", commitSha: newSha, version: "main" };
      },
      clearVersionsCache: () => {},
    });

    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor"), { recursive: true });
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "sha-old",
        installed_at: "2026-01-01T00:00:00.000Z",
        files: { skills: ["tdd"], rules: [], agents: [], workflows: [] },
      }),
    );

    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        installed_commit: "sha-old",
        installed_version: "main",
      },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      commitSha: string;
      cache_refresh?: string;
      extract_recommended: boolean;
      local_commit_matches: boolean;
      manifest: { files: { skills: string[] } };
    }>(result);
    expect(body.cache_refresh).toBe("refreshed");
    expect(body.commitSha).toBe("sha-new");
    expect(body.extract_recommended).toBe(true);
    expect(body.local_commit_matches).toBe(false);
    expect(body.manifest.files.skills).toContain("skills/atdd/SKILL.md");
  });

  it("should_alias_updateFramework_to_install", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    setPackageFetchForTests(async () =>
      resolved("v1.0.0", makePkg("v1.0.0")),
    );
    const result = await update(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ version: string }>(result);
    expect(body.version).toBe("v1.0.0");
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
  });

  it("P1_should_write_file_level_ledger_after_stdio_copy_with_templates", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    mkdirSync(join(pkg, "templates/framework.sdd.works"), { recursive: true });
    writeFileSync(
      join(pkg, "templates/framework.sdd.works/x.md"),
      "# const\n",
    );
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg, "sha-p1"));
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{
      receiptPath?: string;
      receipt?: unknown;
    }>(result);
    expect(body.receiptPath).toBeUndefined();
    expect(body.receipt).toBeUndefined();
    expect(existsSync(join(home, ".cursor/framework.sdd.works.json"))).toBe(
      false,
    );
    const ledgerPath = join(home, ".cursor/.sdd-installed.json");
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8")) as {
      pack_complete: boolean;
      package_commit: string;
      files: { skills: string[]; templates: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.package_commit).toBe("sha-p1");
    expect(ledger.files.skills).toContain("skills/tdd/SKILL.md");
    expect(ledger.files.templates).toContain(
      "templates/framework.sdd.works/x.md",
    );
    expect(
      existsSync(join(home, ".cursor/templates/framework.sdd.works/x.md")),
    ).toBe(true);
  });

  it("P2_should_not_write_complete_ledger_on_reject", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    setPackageFetchForTests(async () => ({
      code: "package_unavailable" as const,
      message: "gone",
    }));
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("package_unavailable");
    const ledgerPath = join(home, ".cursor/.sdd-installed.json");
    if (existsSync(ledgerPath)) {
      const ledger = JSON.parse(readFileSync(ledgerPath, "utf8")) as {
        pack_complete?: boolean;
      };
      expect(ledger.pack_complete).not.toBe(true);
    }
    expect(existsSync(join(home, ".cursor/framework.sdd.works.json"))).toBe(
      false,
    );
  });

  it("P3_should_ignore_non_pack_folders_like_src", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    mkdirSync(join(pkg, "src"), { recursive: true });
    writeFileSync(join(pkg, "src/app.ts"), "export {}\n");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(existsSync(join(home, ".cursor/src"))).toBe(false);
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
  });

  it("P4_should_install_templates_under_client_templates_not_sdd", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    mkdirSync(join(pkg, "templates/framework.sdd.works"), { recursive: true });
    writeFileSync(
      join(pkg, "templates/framework.sdd.works/constants.md"),
      "# pc\n",
    );
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(
      existsSync(
        join(home, ".cursor/templates/framework.sdd.works/constants.md"),
      ),
    ).toBe(true);
    expect(existsSync(join(home, ".cursor/sdd"))).toBe(false);
  });

  it("P5_should_include_ledger_payload_on_http", async () => {
    seedHttpCache("sha-http-receipt", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await install(
      { client: "cursor", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      receiptPath?: string;
      receipt?: unknown;
      manifestPath: string;
      manifest: {
        pack_complete: boolean;
        files: { skills: string[] };
      };
      paths: { templates?: string };
      instructions: string;
    }>(result);
    expect(body.receiptPath).toBeUndefined();
    expect(body.receipt).toBeUndefined();
    expect(body.manifestPath).toMatch(/\.sdd-installed\.json$/);
    expect(body.manifest.pack_complete).toBe(true);
    expect(body.manifest.files.skills).toContain("skills/tdd/SKILL.md");
    expect(body.paths.templates).toContain("templates");
    expect(body.instructions.toLowerCase()).toContain(".sdd-installed.json");
    expect(body.instructions.toLowerCase()).not.toContain("receipt");
    expect(existsSync(join(home, ".cursor/.sdd-installed.json"))).toBe(false);
  });

  it("P6_should_still_return_packageUrl_and_manifest_when_commit_matches", async () => {
    seedHttpCache("sha-old", "main");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        installed_commit: "sha-old",
        installed_version: "main",
      },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{
      packageUrl: string;
      manifest: { pack_complete: boolean };
      error?: { code: string };
    }>(result);
    expect(body.error).toBeUndefined();
    expect(body.packageUrl).toContain("/api/sdd/package");
    expect(body.manifest.pack_complete).toBe(true);
  });

  it("C1_should_keep_other_skills_and_replace_same_path_on_first_install", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor/skills/samectx"), { recursive: true });
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/samectx/SKILL.md"), "my skill");
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my tdd notes");
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg, "sha-c1"));
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(readFileSync(join(home, ".cursor/skills/samectx/SKILL.md"), "utf8")).toBe(
      "my skill",
    );
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "# tdd v1.0.0\n",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      files: { skills: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.files.skills).toContain("skills/tdd/SKILL.md");
    expect(ledger.files.skills.some((f) => f.includes("samectx"))).toBe(false);
    expect(existsSync(join(home, ".cursor/framework.sdd.works.json"))).toBe(
      false,
    );
  });

  it("C4_should_leave_notes_folder_outside_the_pack", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor/notes"), { recursive: true });
    writeFileSync(join(home, ".cursor/notes/ideas.md"), "my ideas");
    const pkg = makePkg("v1.0.0");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(readFileSync(join(home, ".cursor/notes/ideas.md"), "utf8")).toBe(
      "my ideas",
    );
  });

  it("should_map_skill_and_Rules_aliases_on_stdio", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = mkdtempSync(join(tmpdir(), "sdd-alias-"));
    mkdirSync(join(pkg, "skill/tdd"), { recursive: true });
    mkdirSync(join(pkg, "Rules"), { recursive: true });
    mkdirSync(join(pkg, "agents"), { recursive: true });
    writeFileSync(join(pkg, "skill/tdd/SKILL.md"), "# tdd\n");
    writeFileSync(join(pkg, "Rules/dod.mdc"), "# dod\n");
    writeFileSync(join(pkg, "agents/code-reviewer.md"), "# agent\n");
    setPackageFetchForTests(async () => resolved("v1.0.0", pkg));
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "stdio", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/dod.mdc"))).toBe(true);
  });

  it("C5_should_delete_recorded_pack_file_and_keep_unlisted_note", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "old pack tdd");
    writeFileSync(join(home, ".cursor/skills/tdd/old-step.md"), "old pack step");
    writeFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "my notes");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "sha-old",
        installed_at: "2026-01-01T00:00:00.000Z",
        pack_complete: true,
        files: {
          skills: ["skills/tdd/SKILL.md", "skills/tdd/old-step.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );

    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "new pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "sha-new"));
    await update({ client: "cursor", os: "darwin", version: "main" }, ctx);

    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    expect(existsSync(join(home, ".cursor/skills/tdd/old-step.md"))).toBe(false);
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    expect(existsSync(join(home, ".cursor/skills/tdd"))).toBe(true);
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      files: { skills: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.files.skills).toEqual(["skills/tdd/SKILL.md"]);
  });

  it("C2b_should_not_delete_directory_when_old_ledger_names_folder", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "old pack tdd");
    writeFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "my notes");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "sha-old",
        installed_at: "2026-01-01T00:00:00.000Z",
        files: {
          skills: ["tdd"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );

    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "new pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "sha-new"));
    await update({ client: "cursor", os: "darwin", version: "main" }, ctx);

    expect(existsSync(join(home, ".cursor/skills/tdd"))).toBe(true);
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      files: { skills: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.files.skills).toContain("skills/tdd/SKILL.md");
    expect(ledger.files.skills).not.toContain("tdd");
  });

  it("C3_should_leave_edit_when_same_commit_and_pack_complete_true", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my edited tdd");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "abc",
        installed_at: "2026-01-01T00:00:00.000Z",
        pack_complete: true,
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "abc"));
    const result = await install(
      { client: "cursor", os: "darwin", version: "main" },
      ctx,
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("already_up_to_date");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "my edited tdd",
    );
  });

  it("C6a_should_rewrite_missing_pack_complete_without_replacing_bytes", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my edited tdd");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "abc",
        installed_at: "2026-01-01T00:00:00.000Z",
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "abc"));
    const result = await install(
      { client: "cursor", os: "darwin", version: "main" },
      ctx,
    );
    const body = parseToolJson<{ error?: { code: string }; ledger_rewritten?: boolean }>(
      result,
    );
    expect(body.error).toBeUndefined();
    expect(body.ledger_rewritten).toBe(true);
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "my edited tdd",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      package_version: string;
      package_commit: string;
      files: { skills: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.package_version).toBe("main");
    expect(ledger.package_commit).toBe("abc");
    expect(ledger.files.skills).toEqual(["skills/tdd/SKILL.md"]);
  });

  it("C7a_should_keep_pack_complete_false_on_same_commit", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my edited tdd");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "abc",
        installed_at: "2026-01-01T00:00:00.000Z",
        pack_complete: false,
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "abc"));
    const result = await install(
      { client: "cursor", os: "darwin", version: "main" },
      ctx,
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("already_up_to_date");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "my edited tdd",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as { pack_complete: boolean };
    expect(ledger.pack_complete).toBe(false);
  });

  it("C2_should_replace_recorded_file_and_keep_unlisted_skill_and_note", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    mkdirSync(join(home, ".cursor/skills/samectx"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "old pack tdd");
    writeFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "my notes");
    writeFileSync(join(home, ".cursor/skills/samectx/SKILL.md"), "my skill");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "sha-old",
        installed_at: "2026-01-01T00:00:00.000Z",
        pack_complete: true,
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "new pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "sha-new"));
    await update({ client: "cursor", os: "darwin", version: "main" }, ctx);
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    expect(existsSync(join(home, ".cursor/skills/tdd"))).toBe(true);
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    expect(readFileSync(join(home, ".cursor/skills/samectx/SKILL.md"), "utf8")).toBe(
      "my skill",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      package_commit: string;
      files: { skills: string[] };
    };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.package_commit).toBe("sha-new");
    expect(ledger.files.skills).toContain("skills/tdd/SKILL.md");
    expect(ledger.files.skills.some((f) => f.includes("samectx"))).toBe(false);
  });

  it("C6b_should_replace_on_new_commit_when_pack_complete_missing", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my edited tdd");
    writeFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "my notes");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "abc",
        installed_at: "2026-01-01T00:00:00.000Z",
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "new pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "def"));
    await update({ client: "cursor", os: "darwin", version: "main" }, ctx);
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as { pack_complete: boolean; package_commit: string };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.package_commit).toBe("def");
  });

  it("C7b_should_set_pack_complete_true_on_new_commit_when_flag_was_false", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "old pack tdd");
    writeFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "my notes");
    writeFileSync(
      join(home, ".cursor/.sdd-installed.json"),
      JSON.stringify({
        version: 1,
        package_version: "main",
        package_commit: "abc",
        installed_at: "2026-01-01T00:00:00.000Z",
        pack_complete: false,
        files: {
          skills: ["skills/tdd/SKILL.md"],
          rules: [],
          agents: [],
          workflows: [],
          templates: [],
        },
      }),
    );
    const pkg = makePkg("main");
    writeFileSync(join(pkg, "skills/tdd/SKILL.md"), "new pack tdd");
    setPackageFetchForTests(async () => resolved("main", pkg, "def"));
    await update({ client: "cursor", os: "darwin", version: "main" }, ctx);
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as { pack_complete: boolean; package_commit: string };
    expect(ledger.pack_complete).toBe(true);
    expect(ledger.package_commit).toBe("def");
  });

  it("C8_should_leave_folder_unchanged_when_download_fails", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "stdio" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "pack tdd");
    const ledgerBefore = {
      version: 1,
      package_version: "main",
      package_commit: "abc",
      installed_at: "2026-01-01T00:00:00.000Z",
      pack_complete: true,
      files: {
        skills: ["skills/tdd/SKILL.md"],
        rules: [] as string[],
        agents: [] as string[],
        workflows: [] as string[],
        templates: [] as string[],
      },
    };
    const ledgerPath = join(home, ".cursor/.sdd-installed.json");
    writeFileSync(ledgerPath, JSON.stringify(ledgerBefore, null, 2));
    const ledgerJsonBefore = readFileSync(ledgerPath, "utf8");
    setPackageFetchForTests(async () => ({
      code: "package_unavailable" as const,
      message: "download failed",
    }));
    const result = await install(
      { client: "cursor", os: "darwin", version: "main" },
      ctx,
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("package_unavailable");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "pack tdd",
    );
    expect(readFileSync(ledgerPath, "utf8")).toBe(ledgerJsonBefore);
    const ledger = JSON.parse(ledgerJsonBefore) as { pack_complete: boolean };
    expect(ledger.pack_complete).toBe(true);
  });
});
