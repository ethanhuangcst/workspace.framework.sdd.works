import { afterEach, describe, expect, it } from "vitest";
import {
  cpSync,
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
import { readBundledPack } from "@/core/sync/bundled-pack";
import { readPackageManifest } from "@/core/sync/manifest";
import { parseToolJson } from "./errors";
import {
  installFrameworkHttp,
  updateFrameworkHttp,
} from "./install-http";
import type { InstallArgs, InstallContext } from "./install";
import type { InstallPlan } from "./install-plan";
import {
  applyPlannedFiles,
  writeLedgerFile,
} from "./apply-plan";

async function applyHttpPlan(
  args: InstallArgs,
  ctx: InstallContext,
  result: Awaited<ReturnType<typeof installFrameworkHttp>>,
): Promise<void> {
  if (result.isError) return;
  const body = parseToolJson<{
    plan: InstallPlan;
    manifest?: Parameters<typeof writeLedgerFile>[1];
    root?: string;
    commitSha?: string;
  }>(result);
  const clientRoot =
    body.root ??
    (ctx.home ? join(ctx.home, ".cursor") : "");
  if (!clientRoot) return;
  const manifest = readPackageManifest();
  const sha =
    body.commitSha ??
    manifest?.latestCommit ??
    TEST_PACK_COMMIT;
  const unpacked = unpackedDir(sha);
  if (body.plan.action === "apply") {
    applyPlannedFiles(unpacked, clientRoot, body.plan);
    if (body.manifest) writeLedgerFile(clientRoot, body.manifest);
  } else if (body.plan.action === "rewrite_ledger" && body.manifest) {
    writeLedgerFile(clientRoot, body.manifest);
  }
}

async function install(args: InstallArgs, ctx: InstallContext) {
  const result = await installFrameworkHttp(args, ctx);
  await applyHttpPlan(args, ctx, result);
  return result;
}

async function update(args: InstallArgs, ctx: InstallContext) {
  const result = await updateFrameworkHttp(args, ctx);
  await applyHttpPlan(args, ctx, result);
  return result;
}

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedHttpCache(sha: string, version: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-install-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const unpacked = unpackedDir(sha);
  mkdirSync(join(unpacked, "skills/tdd"), { recursive: true });
  mkdirSync(join(unpacked, "rules"), { recursive: true });
  writeFileSync(join(unpacked, "skills/tdd/SKILL.md"), "# tdd\n");
  writeFileSync(join(unpacked, "rules/sdd-dod.mdc"), "# dod\n");
  writeFileSync(packageTarPath(sha), "fake-tarball");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: { skills: ["tdd"], rules: ["dod"], agents: [], workflows: [], other: [] },
      syncedAt: new Date().toISOString(),
    }),
  );
  return dir;
}

function seedHttpCacheFromPkg(sha: string, version: string, pkgDir: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-install-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const unpacked = unpackedDir(sha);
  mkdirSync(unpacked, { recursive: true });
  cpSync(pkgDir, unpacked, { recursive: true });
  writeFileSync(packageTarPath(sha), "fake-tarball");
  writeFileSync(
    join(dir, MANIFEST_FILENAME),
    JSON.stringify({
      latestCommit: sha,
      latestVersion: version,
      versions: [{ id: version, commitSha: sha }],
      inventory: { skills: ["tdd"], rules: ["dod"], agents: [], workflows: [], other: [] },
      syncedAt: new Date().toISOString(),
    }),
  );
  return dir;
}

const TEST_PACK_COMMIT = "0123456789abcdef0123456789abcdef01234567";

function makePkg(version: string): string {
  const dir = mkdtempSync(join(tmpdir(), "sdd-src-"));
  mkdirSync(join(dir, "skills/tdd"), { recursive: true });
  mkdirSync(join(dir, "rules"), { recursive: true });
  mkdirSync(join(dir, "agents"), { recursive: true });
  mkdirSync(join(dir, "workflows"), { recursive: true });
  writeFileSync(join(dir, "skills/tdd/SKILL.md"), `# tdd ${version}\n`);
  writeFileSync(join(dir, "rules/sdd-dod.mdc"), "# dod\n");
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
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{
      version: string;
      resolution_source: string;
      manifest: { files: { skills: string[] } };
    }>(result);
    expect(body.version).toBe("v1.0.0");
    expect(body.resolution_source).toBe("seed");
    expect(body.manifest.files.skills.length).toBeGreaterThan(0);
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/sdd-dod.mdc"))).toBe(true);
    expect(existsSync(join(home, ".cursor/agents/code-reviewer.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/workflows/new-feature.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/.sdd-installed.json"))).toBe(true);
  });

  it("should_omit_features_markdown_files_from_client_root", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    mkdirSync(join(pkg, "content", "features"), { recursive: true });
    mkdirSync(join(pkg, "content", "scrum-in-sdd"), { recursive: true });
    writeFileSync(join(pkg, "content", "features", "features.en.md"), "## Features\n");
    writeFileSync(join(pkg, "content", "features", "features.zh-Hans.md"), "## 功能\n");
    writeFileSync(join(pkg, "content", "features", "features.zh-Hant.md"), "## 功能\n");
    writeFileSync(
      join(pkg, "content", "scrum-in-sdd", "scrum-in-sdd.en.md"),
      "# Scrum in SDD\n",
    );
    writeFileSync(
      join(pkg, "content", "scrum-in-sdd", "scrum-in-sdd.zh-Hans.md"),
      "# Scrum in SDD\n",
    );
    writeFileSync(
      join(pkg, "content", "scrum-in-sdd", "scrum-in-sdd.zh-Hant.md"),
      "# Scrum in SDD\n",
    );
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(result.isError).toBeFalsy();
    const clientRoot = join(home, ".cursor");
    expect(existsSync(join(clientRoot, "content", "features", "features.en.md"))).toBe(false);
    expect(existsSync(join(clientRoot, "features.en.md"))).toBe(false);
    expect(
      existsSync(join(clientRoot, "content", "scrum-in-sdd", "scrum-in-sdd.en.md")),
    ).toBe(false);
    const manifest = JSON.parse(
      readFileSync(join(clientRoot, ".sdd-installed.json"), "utf8"),
    ) as { files: Record<string, string[]> };
    const allPaths = Object.values(manifest.files).flat();
    expect(allPaths.some((p) => p.includes("features.en.md"))).toBe(false);
    expect(allPaths.some((p) => p.includes("features.zh-Hans.md"))).toBe(false);
    expect(allPaths.some((p) => p.includes("features.zh-Hant.md"))).toBe(false);
    expect(allPaths.some((p) => p.includes("scrum-in-sdd.en.md"))).toBe(false);
    expect(allPaths.some((p) => p.includes("scrum-in-sdd.zh-Hans.md"))).toBe(false);
    expect(allPaths.some((p) => p.includes("scrum-in-sdd.zh-Hant.md"))).toBe(false);
  });

  it("should_reinstall_when_manifest_exists_but_files_deleted", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    const ctx = {
      channel: "http" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await install({ client: "cursor", os: "darwin" }, ctx);
    rmSync(join(home, ".cursor/skills/tdd"), { recursive: true, force: true });
    rmSync(join(home, ".cursor/rules/sdd-dod.mdc"), { force: true });

    const second = await install({ client: "cursor", os: "darwin" }, ctx);
    const body = parseToolJson<{ version: string }>(second);
    expect(body.version).toBe("v1.0.0");
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/sdd-dod.mdc"))).toBe(true);
  });

  it("should_reinstall_when_force_true_even_if_intact", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    const ctx = {
      channel: "http" as const,
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
      channel: "http" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    const pkgV1 = makePkg("main");
    seedHttpCacheFromPkg("sha-main-1", "main", pkgV1);
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
    writeFileSync(join(pkgV2, "rules/sdd-dod.mdc"), "# dod\n");
    seedHttpCacheFromPkg("sha-main-2", "main", pkgV2);

    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const second = await install(
      {
        client: "cursor",
        os: "darwin",
        version: "main",
        inventory: { ledger, missing: [] },
      },
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
      channel: "http" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
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
    expect(saved.package_commit).toBe(TEST_PACK_COMMIT);
  });

  it("should_return_noop_on_same_version_when_inventory_matches", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    const ctx = {
      channel: "http" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    await install({ client: "cursor", os: "darwin" }, ctx);
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const second = await install(
      {
        client: "cursor",
        os: "darwin",
        inventory: { ledger, missing: [] },
      },
      ctx,
    );
    const body = parseToolJson<{ action: string; plan: { action: string } }>(second);
    expect(body.action).toBe("noop");
    expect(body.plan.action).toBe("noop");
  });

  it("should_replace_package_files_and_preserve_user_files", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "http" as const,
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", makePkg("v1.0.0"));
    await install({ client: "cursor", os: "darwin" }, ctx);
    mkdirSync(join(home, ".cursor/skills/my-skill"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/my-skill/SKILL.md"), "mine\n");

    const v2 = makePkg("v2.0.0");
    mkdirSync(join(v2, "skills/atdd"), { recursive: true });
    writeFileSync(join(v2, "skills/atdd/SKILL.md"), "# atdd v2\n");
    seedHttpCacheFromPkg(
      "a0123456789abcdef0123456789abcdef0123456",
      "v2.0.0",
      v2,
    );
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        inventory: { ledger, missing: [] },
      },
      ctx,
    );
    const body = parseToolJson<{ version: string }>(result);
    expect(body.version).toBe("v2.0.0");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toContain(
      "v2.0.0",
    );
    expect(existsSync(join(home, ".cursor/skills/my-skill/SKILL.md"))).toBe(true);
  });

  it("should_reject_unknown_client_without_writes", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await installFrameworkHttp(
      { client: "unknown-cli-xyz", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ error: { code: string; message?: string } }>(
      result,
    );
    expect(body.error.code).toBe("root_required");
    expect(body.error.message).toContain("ask");
    expect(existsSync(join(home, ".cursor"))).toBe(false);
    rmSync(home, { recursive: true, force: true });
  });

  it("should_reject_missing_client_as_client_unknown", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const result = await installFrameworkHttp(
      { os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("client_unknown");
    rmSync(home, { recursive: true, force: true });
  });

  it("should_use_agent_root_for_unknown_client", async () => {
    seedHttpCache("sha-unknown-root", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-unknown-"));
    const clientRoot = join(home, ".my-cli");
    mkdirSync(clientRoot, { recursive: true });
    const result = await installFrameworkHttp(
      {
        client: "unknown-cli",
        os: "darwin",
        root: clientRoot,
        inventory: { ledger: null, missing: [] },
      },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{
      root?: string;
      resolution_source: string;
      plan: { action: string };
      packageUrl?: string;
    }>(result);
    expect(body.root).toBe(clientRoot);
    expect(body.resolution_source).toBe("agent");
    expect(body.plan.action).toBe("apply");
    expect(body.packageUrl).toContain("/api/sdd/package");
    rmSync(home, { recursive: true, force: true });
  });

  it("should_reject_invalid_root_for_unknown_client", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-invalid-"));
    const ctx: InstallContext = {
      channel: "http",
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    const base = { client: "unknown-cli", os: "darwin" as const };

    const outside = await installFrameworkHttp(
      { ...base, root: "/var/tmp/outside-home-cli" },
      ctx,
    );
    expect(parseToolJson<{ error: { code: string } }>(outside).error.code).toBe(
      "path_rejected",
    );

    const escape = await installFrameworkHttp(
      { ...base, root: join(home, "..", "escape-cli") },
      ctx,
    );
    expect(parseToolJson<{ error: { code: string } }>(escape).error.code).toBe(
      "path_rejected",
    );

    const system = await installFrameworkHttp({ ...base, root: "/etc/my-cli" }, ctx);
    expect(parseToolJson<{ error: { code: string } }>(system).error.code).toBe(
      "path_rejected",
    );

    rmSync(home, { recursive: true, force: true });
  });

  it("should_retry_unknown_client_with_valid_root", async () => {
    seedHttpCache("sha-unknown-retry", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-retry-"));
    const ctx: InstallContext = {
      channel: "http",
      home,
      userProfile: home,
      env: { HOME: home },
      skipLlm: true,
    };
    const first = await installFrameworkHttp(
      { client: "unknown-cli", os: "darwin" },
      ctx,
    );
    expect(parseToolJson<{ error: { code: string } }>(first).error.code).toBe(
      "root_required",
    );

    const clientRoot = join(home, ".my-cli");
    mkdirSync(clientRoot, { recursive: true });
    const second = await installFrameworkHttp(
      {
        client: "unknown-cli",
        os: "darwin",
        root: clientRoot,
        inventory: { ledger: null, missing: [] },
      },
      ctx,
    );
    await applyHttpPlan(
      {
        client: "unknown-cli",
        os: "darwin",
        root: clientRoot,
        inventory: { ledger: null, missing: [] },
      },
      ctx,
      second,
    );
    expect(existsSync(join(clientRoot, ".sdd-installed.json"))).toBe(true);
    rmSync(home, { recursive: true, force: true });
  });

  it("should_omit_root_warning_for_unknown_client", async () => {
    seedHttpCache("sha-no-warning", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-nowarn-"));
    const clientRoot = join(home, ".my-cli");
    mkdirSync(clientRoot, { recursive: true });
    const result = await installFrameworkHttp(
      {
        client: "unknown-cli",
        os: "darwin",
        root: clientRoot,
        inventory: { ledger: null, missing: [] },
      },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ root_warning?: unknown }>(result);
    expect(body.root_warning).toBeUndefined();
    rmSync(home, { recursive: true, force: true });
  });

  it("should_return_apply_plan_on_http_without_inventory", async () => {
    seedHttpCache("sha-http-portable", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const result = await installFrameworkHttp(
      { client: "cursor", os: "darwin" },
      { channel: "http" },
    );
    const body = parseToolJson<{
      action: string;
      plan: { action: string };
      packageUrl?: string;
      instructions: string;
      resolution_source: string;
    }>(result);
    expect(body.action).toBe("apply");
    expect(body.plan.action).toBe("apply");
    expect(body.resolution_source).toBe("seed");
    expect(body.packageUrl).toContain("/api/sdd/package");
    expect(body.instructions).toContain("Do not extract the archive into the client root");
    expect(body.instructions).not.toContain("github.com");
  });

  it("should_echo_root_on_http_plan_when_agent_sends_root", async () => {
    seedHttpCache("sha-http-accepted", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-accepted-"));
    const wrongRoot = join(home, "wrong-place");
    mkdirSync(wrongRoot, { recursive: true });
    const seedMapRoot = join(home, ".cursor");
    const result = await installFrameworkHttp(
      {
        client: "cursor",
        os: "darwin",
        root: wrongRoot,
        inventory: { ledger: null, missing: [] },
      },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ root?: string; plan: { action: string } }>(
      result,
    );
    expect(body.root).toBe(seedMapRoot);
    expect(body.plan.action).toBe("apply");
    rmSync(home, { recursive: true, force: true });
  });

  it("should_return_expanded_paths_on_http_with_install_home", async () => {
    seedHttpCache("sha-http-v1", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mockCacheFreshAsMatchingCache();
    const result = await installFrameworkHttp(
      {
        client: "cursor",
        os: "darwin",
        inventory: { ledger: null, missing: [] },
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
      version: string;
      commitSha: string;
      plan: { action: string };
      manifest: { package_version: string; files: { skills: string[] } };
      instructions: string;
    }>(result);
    expect(body.packageUrl).toContain("/api/sdd/package?version=latest");
    expect(body.version).toBe("v1.0.0");
    expect(body.commitSha).toBe("sha-http-v1");
    expect(body.plan.action).toBe("apply");
    expect(body.manifest.package_version).toBe("v1.0.0");
    expect(body.manifest.files.skills).toContain("skills/tdd/SKILL.md");
    expect(body.manifest).toMatchObject({ pack_complete: true });
    expect(body.instructions).toContain("Do not extract the archive into the client root");
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
      {
        client: "cursor",
        os: "darwin",
        inventory: { ledger: previous, missing: [] },
      },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{ plan: { action: string; delete: string[] } }>(result);
    expect(body.plan.action).toBe("apply");
    expect(body.plan.delete).toContain("old-skill");
  });

  it("should_ignore_env_relocation_for_known_client", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const claudeHome = join(home, "relocated-claude");
    mkdirSync(claudeHome, { recursive: true });
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", makePkg("v1.0.0"));
    const result = await install(
      { client: "claude", os: "darwin" },
      {
        channel: "http",
        home,
        userProfile: home,
        env: { HOME: home, CLAUDE_CONFIG_DIR: claudeHome },
        skipLlm: true,
      },
    );
    const body = parseToolJson<{ resolution_source: string }>(result);
    expect(body.resolution_source).toBe("seed");
    expect(existsSync(join(home, ".claude/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(claudeHome, "skills/tdd/SKILL.md"))).toBe(false);
  });

  it("should_refuse_a_fixture_port_commit", async () => {
    const dir = seedHttpCache("sha-v1.0.0", "v1.0.0");
    const unpacked = unpackedDir("sha-v1.0.0");
    mkdirSync(join(unpacked, "skills/atdd"), { recursive: true });
    mkdirSync(join(unpacked, "agents"), { recursive: true });
    mkdirSync(join(unpacked, "workflows"), { recursive: true });
    writeFileSync(join(unpacked, "skills/tdd/SKILL.md"), "# tdd v1.0.0\n");
    writeFileSync(join(unpacked, "skills/atdd/SKILL.md"), "# atdd v1.0.0\n");
    writeFileSync(join(unpacked, "rules/sdd-dod.mdc"), "# dod\n");
    writeFileSync(join(unpacked, "agents/code-reviewer.md"), "# reviewer\n");
    writeFileSync(join(unpacked, "workflows/new-feature.md"), "# workflow\n");
    mockCacheFreshAsMatchingCache();
    const result = await install(
      { client: "cursor", os: "darwin", inventory: { ledger: null, missing: [] } },
      { channel: "http", skipLlm: true },
    );
    const body = parseToolJson<{
      plan: { action: string };
      pack_source: string;
    }>(result);
    expect(body.plan.action).toBe("apply");
    expect(body.pack_source).toBe("bundled");
    rmSync(dir, { recursive: true, force: true });
  });

  it("should_use_cache_pack_source_for_a_real_commit", async () => {
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", makePkg("v1.0.0"));
    mockCacheFreshAsMatchingCache();
    const result = await install(
      { client: "cursor", os: "darwin", inventory: { ledger: null, missing: [] } },
      { channel: "http", skipLlm: true },
    );
    const body = parseToolJson<{
      plan: { action: string };
      pack_source: string;
    }>(result);
    expect(body.plan.action).toBe("apply");
    expect(body.pack_source).toBe("cache");
  });

  it("should_refuse_a_stale_package_cache", async () => {
    const dir = seedHttpCache("sha-http-v1", "v1.0.0");
    writeFileSync(
      join(dir, MANIFEST_FILENAME),
      JSON.stringify({
        latestCommit: "sha-http-v1",
        latestVersion: "v1.0.0",
        versions: [{ id: "v1.0.0", commitSha: "sha-http-v1" }],
        inventory: { skills: ["tdd"], rules: ["dod"], agents: [], workflows: [], other: [] },
        syncedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
    mockCacheFreshAsMatchingCache();
    const result = await install(
      { client: "cursor", os: "darwin", inventory: { ledger: null, missing: [] } },
      { channel: "http", skipLlm: true },
    );
    const body = parseToolJson<{ plan: { action: string } }>(result);
    expect(body.plan.action).toBe("apply");
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

    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const result = await installFrameworkHttp(
      {
        client: "cursor",
        os: "darwin",
        installed_commit: "sha-old",
        installed_version: "main",
        inventory: { ledger, missing: ["tdd"] },
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
      action: string;
      plan: { action: string };
      error?: { code: string };
    }>(result);
    expect(body.error).toBeUndefined();
    expect(body.plan.action).toBe("apply");
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
        inventory: {
          ledger: {
            version: 1,
            package_version: "main",
            package_commit: "sha-old",
            pack_complete: true,
            files: { skills: ["tdd"], rules: [], agents: [], workflows: [] },
          },
          missing: [],
        },
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
      plan: { action: string };
      manifest: { files: { skills: string[] } };
    }>(result);
    expect(body.commitSha).toBe("sha-new");
    expect(body.plan.action).toBe("apply");
    expect(body.manifest.files.skills).toContain("skills/atdd/SKILL.md");
  });

  it("should_alias_updateFramework_to_install", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", makePkg("v1.0.0"));
    const result = await update(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
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
    seedHttpCacheFromPkg("sha-p1", "v1.0.0", pkg);
    const result = await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
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
    seedHttpCache("sha-p2", "main");
    mockCacheFreshAsMatchingCache();
    const result = await install(
      { client: "cursor", os: "darwin", version: "missing-version-xyz" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("invalid_input");
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
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(existsSync(join(home, ".cursor/src"))).toBe(false);
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
  });

  it("P4_should_install_templates_under_client_templates_not_sdd", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const pkg = makePkg("v1.0.0");
    mkdirSync(join(pkg, "templates/framework.sdd.works"), { recursive: true });
    writeFileSync(
      join(pkg, "templates/framework.sdd.works/constants.json"),
      "# pc\n",
    );
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(
      existsSync(
        join(home, ".cursor/templates/framework.sdd.works/constants.json"),
      ),
    ).toBe(true);
    expect(existsSync(join(home, ".cursor/sdd"))).toBe(false);
  });

  it("should_install_real_bundled_pack_nested_templates", async () => {
    const bundled = readBundledPack(process.cwd());
    expect(bundled).not.toBeNull();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-bundled-"));
    seedHttpCacheFromPkg(bundled!.commitSha, bundled!.version, bundled!.unpackedPath);
    mockCacheFreshAsMatchingCache();
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(
      existsSync(
        join(home, ".cursor/templates/framework.sdd.works/EN/architecture.md"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        join(home, ".cursor/templates/framework.sdd.works/constants.json"),
      ),
    ).toBe(true);
  });

  it("P5_should_include_ledger_payload_on_http", async () => {
    seedHttpCache("sha-http-receipt", "v1.0.0");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mockCacheFreshAsMatchingCache();
    const result = await installFrameworkHttp(
      {
        client: "cursor",
        os: "darwin",
        inventory: { ledger: null, missing: [] },
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
      manifest: {
        pack_complete: boolean;
        files: { skills: string[] };
      };
      instructions: string;
    }>(result);
    expect(body.manifest.pack_complete).toBe(true);
    expect(body.manifest.files.skills).toContain("skills/tdd/SKILL.md");
    expect(body.instructions.toLowerCase()).toContain(".sdd-installed.json");
    expect(existsSync(join(home, ".cursor/.sdd-installed.json"))).toBe(false);
  });

  it("P6_should_still_return_packageUrl_and_manifest_when_commit_matches", async () => {
    seedHttpCache("sha-old", "main");
    mockCacheFreshAsMatchingCache();
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mockCacheFreshAsMatchingCache();
    const result = await installFrameworkHttp(
      {
        client: "cursor",
        os: "darwin",
        inventory: {
          ledger: {
            version: 1,
            package_version: "main",
            package_commit: "sha-old",
            pack_complete: true,
            files: { skills: [], rules: [], agents: [], workflows: [], templates: [] },
          },
          missing: [],
        },
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
      packageUrl?: string;
      plan: { action: string };
      manifest: { pack_complete: boolean };
      error?: { code: string };
    }>(result);
    expect(body.error).toBeUndefined();
    expect(body.packageUrl).toBeUndefined();
    expect(body.plan.action).toBe("noop");
    expect(body.manifest.pack_complete).toBe(true);
  });

  it("C1_should_keep_other_skills_and_replace_same_path_on_first_install", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    mkdirSync(join(home, ".cursor/skills/samectx"), { recursive: true });
    mkdirSync(join(home, ".cursor/skills/tdd"), { recursive: true });
    writeFileSync(join(home, ".cursor/skills/samectx/SKILL.md"), "my skill");
    writeFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "my tdd notes");
    const pkg = makePkg("v1.0.0");
    seedHttpCacheFromPkg("sha-c1", "v1.0.0", pkg);
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
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
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
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
    writeFileSync(join(pkg, "Rules/sdd-dod.mdc"), "# dod\n");
    writeFileSync(join(pkg, "agents/code-reviewer.md"), "# agent\n");
    seedHttpCacheFromPkg(TEST_PACK_COMMIT, "v1.0.0", pkg);
    await install(
      { client: "cursor", os: "darwin" },
      { channel: "http", home, userProfile: home, env: { HOME: home }, skipLlm: true },
    );
    expect(existsSync(join(home, ".cursor/skills/tdd/SKILL.md"))).toBe(true);
    expect(existsSync(join(home, ".cursor/rules/sdd-dod.mdc"))).toBe(true);
  });

  it("C5_should_delete_recorded_pack_file_and_keep_unlisted_note", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "http" as const,
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
    seedHttpCacheFromPkg("sha-new", "main", pkg);
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    await update(
      {
        client: "cursor",
        os: "darwin",
        version: "main",
        inventory: { ledger, missing: [] },
      },
      ctx,
    );

    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "new pack tdd",
    );
    expect(existsSync(join(home, ".cursor/skills/tdd/old-step.md"))).toBe(false);
    expect(readFileSync(join(home, ".cursor/skills/tdd/my-notes.md"), "utf8")).toBe(
      "my notes",
    );
    expect(existsSync(join(home, ".cursor/skills/tdd"))).toBe(true);
    const ledgerAfter = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    ) as {
      pack_complete: boolean;
      files: { skills: string[] };
    };
    expect(ledgerAfter.pack_complete).toBe(true);
    expect(ledgerAfter.files.skills).toEqual(["skills/tdd/SKILL.md"]);
  });

  it("C2b_should_not_delete_directory_when_old_ledger_names_folder", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "http" as const,
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
    seedHttpCacheFromPkg("sha-new", "main", pkg);
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("abc", "main", pkg);
    const ledger = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        version: "main",
        inventory: { ledger, missing: [] },
      },
      ctx,
    );
    const body = parseToolJson<{ action: string; plan: { action: string } }>(result);
    expect(body.action).toBe("noop");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "my edited tdd",
    );
  });

  it("C6a_should_rewrite_missing_pack_complete_without_replacing_bytes", async () => {
    const home = mkdtempSync(join(tmpdir(), "sdd-home-"));
    const ctx = {
      channel: "http" as const,
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
    seedHttpCacheFromPkg("abc", "main", pkg);
    const ledgerBefore = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        version: "main",
        inventory: { ledger: ledgerBefore, missing: [] },
      },
      ctx,
    );
    const body = parseToolJson<{ action: string; plan: { action: string } }>(
      result,
    );
    expect(body.action).toBe("rewrite_ledger");
    expect(body.plan.action).toBe("rewrite_ledger");
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("abc", "main", pkg);
    const ledgerBefore = JSON.parse(
      readFileSync(join(home, ".cursor/.sdd-installed.json"), "utf8"),
    );
    const result = await install(
      {
        client: "cursor",
        os: "darwin",
        version: "main",
        inventory: { ledger: ledgerBefore, missing: [] },
      },
      ctx,
    );
    const body = parseToolJson<{ action: string; plan: { action: string } }>(result);
    expect(body.action).toBe("noop");
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("sha-new", "main", pkg);
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("def", "main", pkg);
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("def", "main", pkg);
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
      channel: "http" as const,
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
    seedHttpCacheFromPkg("abc", "main", makePkg("main"));
    mockCacheFreshAsMatchingCache();
    const result = await installFrameworkHttp(
      { client: "cursor", os: "darwin", version: "missing-version-xyz" },
      ctx,
    );
    const body = parseToolJson<{ error: { code: string } }>(result);
    expect(body.error.code).toBe("invalid_input");
    expect(readFileSync(join(home, ".cursor/skills/tdd/SKILL.md"), "utf8")).toBe(
      "pack tdd",
    );
    expect(readFileSync(ledgerPath, "utf8")).toBe(ledgerJsonBefore);
    const ledger = JSON.parse(ledgerJsonBefore) as { pack_complete: boolean };
    expect(ledger.pack_complete).toBe(true);
  });
});
