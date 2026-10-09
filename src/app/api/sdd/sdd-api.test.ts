import { afterEach, describe, expect, it } from "vitest";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { GET as getVersions } from "./versions/route";
import { GET as getPackage } from "./package/route";
import { GET as getFeatures } from "./features/route";
import { GET as getInstructionsTabs } from "./instructions-tabs/route";
import { GET as getInstructionsFolder } from "./instructions-folder/route";
import { INSTRUCTIONS_TABS_PACK_RELATIVE } from "@/core/seeds/instructions-tabs-config";
import { GET as getLiteFiles } from "./lite/files/route";
import { GET as getLiteFile } from "./lite/file/route";
import { GET as getAgentSetup } from "../agent-setup/route";
import { GET as getLiteInstallSetup } from "../agent-setup/install/route";
import { getLitePartnerSetupSentence } from "@/mcp/brand";
import { GET as getNodeSetup } from "../agent-setup/node/route";
import { GET as getNodeCatalog } from "../setup/node/catalog/route";
import { LITE_PACK_ALLOWLIST_FILENAME } from "@/core/seeds/lite-install-manifest";
import {
  MANIFEST_FILENAME,
  packageTarPath,
  unpackedDir,
} from "@/core/sync/paths";
import { NextRequest } from "next/server";

const originalCacheDir = process.env.SDD_PACKAGE_CACHE_DIR;

function seedCache(): { dir: string; sha: string } {
  const dir = mkdtempSync(join(tmpdir(), "sdd-api-cache-"));
  process.env.SDD_PACKAGE_CACHE_DIR = dir;
  const sha = "0123456789abcdef0123456789abcdef01234567";
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
    const { sha } = seedCache();
    const res = await getVersions();
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      latestCommit: string;
      inventory: { skills: string[] };
    };
    expect(body.latestCommit).toBe(sha);
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
    const { sha } = seedCache();
    const req = {
      url: "http://localhost/api/sdd/package?version=latest",
    } as import("next/server").NextRequest;
    const res = await getPackage(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-SDD-Commit")).toBe(sha);
    expect(res.headers.get("X-SDD-Version")).toBe("v1.0.0");
    expect(res.headers.get("Content-Type")).toBe("application/gzip");
  });

  it("should_return_agent_setup_markdown", async () => {
    const prevBase = process.env.PUBLIC_BASE_URL;
    delete process.env.PUBLIC_BASE_URL;
    delete process.env.MCP_PUBLIC_URL;
    try {
      const res = await getAgentSetup();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/markdown");
      const body = await res.text();
      expect(body).toContain("framework.sdd.works");
      expect(body).toContain('"url": "https://sdd.works/mcp"');
      expect(body).toContain("https://sdd.works/mcp");
      expect(body).toContain("sdd_install_framework");
      expect(body).toContain("2026-10-09.v10");
      expect(body).toContain("cache_stale");
      expect(body).toContain("fixture_pack");
      expect(body).toContain("path-table folder");
      expect(body).toContain("Follow the `instructions` field");
      expect(body).toContain("Change MCP configuration only for the agent that is running this session");
      expect(body).toContain(
        "When CodeBuddy or CodeBuddy CN is running, do not edit Cursor, TRAE, or TRAE CN MCP files.",
      );
      expect(body).toContain("### CodeBuddy (international)");
      expect(body).toContain("### CodeBuddy CN");
      expect(body).toContain("~/.codebuddy/mcp.json");
      expect(body).toContain("### TRAE (international)");
      expect(body).toContain("~/.trae/mcp.json");
      expect(body).toContain(
        "Confirm the server exposes `sdd_install_framework` and `sdd_update_framework`. On HTTP, it also exposes `sdd_get_key`.",
      );
      expect(body).not.toContain("sdd_list_versions");
      expect(body).toContain("Do not ask the person to copy commands or edit the MCP configuration file by hand");
      expect(body).toContain("When an entry with that name already exists, check it and change it so it is this URL");
      expect(body).toContain("It has no `command`");
      expect(body).not.toContain("sdd-mcp-darwin-arm64");
      expect(body).not.toContain("github.com");
      expect(body).not.toContain("releases/latest/download");
      expect(body).toContain("the pack on this server");
      expect(body).toContain("WorkBuddy");
      expect(body).toContain("WorkBuddy CN");
      expect(body).toContain(
        "Use `.codebuddy/mcp.json` in the current workspace only when the user asked to configure this project.",
      );
      expect(body).toContain(
        "Do not use `~/Library/Application Support/Trae CN/User/mcp.json` or `~/.trae-cn/mcp.json` for this user MCP list.",
      );
      expect(body).toContain("--write");
      expect(body).toContain("--client");
      expect(body).toContain("--os");
      expect(body).toContain("--client-root");
      expect(body).toContain("SDD_SERVER_URL");
      expect(body).toContain("accepted_root");
      expect(body).toContain("Pass `codebuddy` for CodeBuddy (international), WorkBuddy, CodeBuddy CN, and WorkBuddy CN.");
      expect(body).toContain("Pass `trae` for TRAE (international). Pass `trae-cn` for TRAE CN.");
      expect(body).toContain("Pass `--os` as `darwin`, `linux`, or `win32`.");
      expect(body).toContain("Library/Application Support/Trae CN/User/mcp.json");
      expect(body).toContain("Do not write `~/.trae-cn/mcp.json` or `~/.trae/mcp.json` for TRAE CN");
      expect(body).not.toContain("Lite install version:");
    } finally {
      if (prevBase === undefined) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = prevBase;
    }
  });

  it("should_return_lite_install_markdown", async () => {
    const prevBase = process.env.PUBLIC_BASE_URL;
    delete process.env.PUBLIC_BASE_URL;
    delete process.env.MCP_PUBLIC_URL;
    try {
      const res = await getLiteInstallSetup();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/markdown");
      const body = await res.text();
      expect(body).toContain("Lite install version: 2026-10-07.v1");
      expect(body).toContain(getLitePartnerSetupSentence());
      expect(body).toContain("Partner site one-line prompt");
      expect(body).toContain("GET https://sdd.works/api/sdd/lite/files");
      expect(body).toContain("GET https://sdd.works/api/sdd/lite/file?path=");
      expect(body).toContain("{client_root}");
      expect(body).toContain(".sdd-lite-installed.json");
      expect(body).toContain("skills/");
      expect(body).toContain("rules/");
      expect(body).not.toContain("sdd_install_framework");
      expect(body).not.toContain("sdd_update_framework");
      expect(body).not.toContain(".sdd-installed.json");
    } finally {
      if (prevBase === undefined) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = prevBase;
    }
  });

  it("should_return_node_setup_markdown", async () => {
    const prevBase = process.env.PUBLIC_BASE_URL;
    delete process.env.PUBLIC_BASE_URL;
    try {
      const res = await getNodeSetup();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/markdown");
      const body = await res.text();
      expect(body).toContain("Node setup version: 2026-10-08.v1");
      expect(body).toContain("GET https://sdd.works/api/setup/node/catalog");
      expect(body).toContain("node_prerequisite");
      expect(body).toContain('node -e "console.log(\'hello\')"');
      expect(body).toContain("It does not authorize you to:");
      expect(body).not.toContain("GET /api/sdd/lite/files");
    } finally {
      if (prevBase === undefined) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = prevBase;
    }
  });

  it("should_return_node_setup_catalog_json", async () => {
    const res = await getNodeCatalog();
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      node_lts: string;
      downloads: Record<string, string>;
      npm_registries: { default: string; cn_hk: string };
    };
    expect(body.node_lts).toBeTruthy();
    expect(body.downloads["darwin-arm64"]).toMatch(/^https:\/\//);
    expect(body.npm_registries.default).toBe("https://registry.npmjs.org");
    expect(body.npm_registries.cn_hk).toBe("https://registry.npmmirror.com");
  });

  it("should_rewrite_lite_install_origin_when_public_base_is_local", async () => {
    const prevBase = process.env.PUBLIC_BASE_URL;
    process.env.PUBLIC_BASE_URL = "http://127.0.0.1:3040";
    try {
      const res = await getLiteInstallSetup();
      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain("GET http://127.0.0.1:3040/api/sdd/lite/files");
      expect(body).toContain("GET http://127.0.0.1:3040/api/sdd/lite/file?path=");
      expect(body).not.toContain("https://sdd.works/api/sdd/lite/files");
    } finally {
      if (prevBase === undefined) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = prevBase;
    }
  });

  it("should_rewrite_pack_base_and_mcp_url_when_public_base_is_local", async () => {
    const prevBase = process.env.PUBLIC_BASE_URL;
    const prevMcp = process.env.MCP_PUBLIC_URL;
    process.env.PUBLIC_BASE_URL = "http://127.0.0.1:3040";
    delete process.env.MCP_PUBLIC_URL;
    try {
      const res = await getAgentSetup();
      expect(res.status).toBe(200);
      const body = await res.text();
      expect(body).toContain("http://127.0.0.1:3041/mcp");
      expect(body).not.toContain("https://framework.sdd.works/mcp");
      expect(body).not.toContain('"command"');
    } finally {
      if (prevBase === undefined) delete process.env.PUBLIC_BASE_URL;
      else process.env.PUBLIC_BASE_URL = prevBase;
      if (prevMcp === undefined) delete process.env.MCP_PUBLIC_URL;
      else process.env.MCP_PUBLIC_URL = prevMcp;
    }
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

describe("GET /api/sdd/features", () => {
  function featuresRequest(locale: string): NextRequest {
    return new NextRequest(
      `http://localhost/api/sdd/features?locale=${encodeURIComponent(locale)}`,
    );
  }

  function seedFeaturesCache(files: Record<string, string>): void {
    const { sha } = seedCache();
    const featuresDir = join(unpackedDir(sha), "content", "features");
    mkdirSync(featuresDir, { recursive: true });
    for (const [name, body] of Object.entries(files)) {
      writeFileSync(join(featuresDir, name), body);
    }
  }

  it("should_return_cache_english_html", async () => {
    seedFeaturesCache({
      "features.en.md": "## Features\n\n- ethan — Cache EN API.\n",
    });
    const res = await getFeatures(featuresRequest("en"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      locale: string;
      sourceLocale: string;
      source: string;
      html: string;
      key_value?: string;
    };
    expect(body.source).toBe("cache");
    expect(body.sourceLocale).toBe("en");
    expect(body.locale).toBe("en");
    expect(body.html).toContain("Cache EN API");
    expect(body.key_value).toBeUndefined();
    expect(JSON.stringify(body)).not.toMatch(/sk-|api[_-]?key/i);
  });

  it("should_return_cache_chinese_when_present", async () => {
    seedFeaturesCache({
      "features.en.md": "## Features\n\n- ethan — English.\n",
      "features.zh-Hans.md": "## 功能\n\n- ethan — 简体缓存。\n",
    });
    const res = await getFeatures(featuresRequest("zh-Hans"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      source: string;
      sourceLocale: string;
      html: string;
    };
    expect(body.source).toBe("cache");
    expect(body.sourceLocale).toBe("zh-Hans");
    expect(body.html).toContain("简体缓存");
  });

  it("should_return_cache_english_when_zh_Hant_missing", async () => {
    seedFeaturesCache({
      "features.en.md": "## Features\n\n- ethan — Fallback EN.\n",
    });
    const res = await getFeatures(featuresRequest("zh-Hant"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      source: string;
      sourceLocale: string;
      html: string;
    };
    expect(body.source).toBe("cache");
    expect(body.sourceLocale).toBe("en");
    expect(body.html).toContain("Fallback EN");
  });

  it("should_default_to_en_when_locale_query_absent_even_with_accept_language", async () => {
    seedFeaturesCache({
      "features.en.md": "## Features\n\n- ethan — Default EN.\n",
      "features.zh-Hans.md": "## 功能\n\n- ethan — 简体。\n",
    });
    const res = await getFeatures(
      new NextRequest("http://localhost/api/sdd/features", {
        headers: { "accept-language": "zh-CN" },
      }),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { locale: string; sourceLocale: string };
    expect(body.locale).toBe("en");
    expect(body.sourceLocale).toBe("en");
  });

  it("should_return_package_when_cache_missing", async () => {
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(
      join(tmpdir(), "sdd-api-features-empty-"),
    );
    const res = await getFeatures(featuresRequest("en"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      source: string;
      html: string;
    };
    expect(body.source).toBe("package");
    expect(body.html).toContain("ethan");
    expect(body.html).toContain("Local Scrum in SDD coach");
  });

  it("should_escape_raw_html_in_response", async () => {
    seedFeaturesCache({
      "features.en.md":
        '## Features\n\n- ethan — <script>alert(1)</script>\n',
    });
    const res = await getFeatures(featuresRequest("en"));
    const body = (await res.json()) as { html: string };
    expect(body.html).not.toContain("<script>");
    expect(body.html).toContain("&lt;script&gt;");
  });
});

describe("GET /api/sdd/instructions-tabs", () => {
  const bundledConfig = readFileSync(
    join(process.cwd(), "src/content/.instructions-tabs.json"),
    "utf8",
  );

  function tabsRequest(locale: string): NextRequest {
    return new NextRequest(
      `http://localhost/api/sdd/instructions-tabs?locale=${encodeURIComponent(locale)}`,
    );
  }

  function seedTabsCache(files: Record<string, string>): void {
    const { sha } = seedCache();
    const unpacked = unpackedDir(sha);
    for (const [name, body] of Object.entries(files)) {
      const path = join(unpacked, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, body);
    }
  }

  it("should_return_cache_sourced_tabs_with_content_html", async () => {
    seedTabsCache({
      [INSTRUCTIONS_TABS_PACK_RELATIVE]: bundledConfig,
      "content/features/features.en.md":
        "## Features\n\n- ethan — Tabs API cache.\n",
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum\n\nTabs API.\n",
      "content/knowledge/.index.json": readFileSync(
        join(process.cwd(), "src/content/knowledge/.index.json"),
        "utf8",
      ),
    });
    const res = await getInstructionsTabs(tabsRequest("en"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      version: number;
      source: string;
      locale: string;
      tabs: Array<{
        id: string;
        type: string;
        html?: string;
        contentSource?: string;
      }>;
    };
    expect(body.source).toBe("cache");
    expect(body.tabs.map((t) => t.id)).toEqual([
      "setup",
      "features",
      "scrum-in-sdd",
      "knowledge",
      "learn-scrum-in-sdd",
    ]);
    expect(body.tabs.find((t) => t.id === "setup")?.type).toBe("code");
    expect(body.tabs.find((t) => t.id === "features")?.html).toContain(
      "Tabs API cache",
    );
    expect(body.tabs.find((t) => t.id === "features")?.contentSource).toBe(
      "cache",
    );
    expect(JSON.stringify(body)).not.toMatch(/sk-|api[_-]?key/i);
  });

  it("should_use_bundled_config_when_cache_config_is_invalid", async () => {
    const invalid = JSON.parse(bundledConfig) as {
      version: number;
      tabs: Record<string, unknown>[];
    };
    invalid.tabs.push({ ...invalid.tabs[1], id: "dup-features" });
    seedTabsCache({
      [INSTRUCTIONS_TABS_PACK_RELATIVE]: JSON.stringify(invalid),
      "content/features/features.en.md": "## Features\n\n- ethan — Bundled config.\n",
      "content/scrum-in-sdd/scrum-in-sdd.en.md": "# Scrum\n\nBundled config.\n",
      "content/knowledge/.index.json": readFileSync(
        join(process.cwd(), "src/content/knowledge/.index.json"),
        "utf8",
      ),
    });
    const res = await getInstructionsTabs(tabsRequest("en"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { source: string; tabs: { id: string }[] };
    expect(body.source).toBe("bundled");
    expect(body.tabs.some((t) => t.id === "setup")).toBe(true);
  });

  it("should_return_folder_listing_for_knowledge_root", async () => {
    const req = new NextRequest(
      "http://localhost/api/sdd/instructions-folder?locale=en&rootPath=content/knowledge",
    );
    const res = await getInstructionsFolder(req);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      listing: { entries: { id: string }[] };
    };
    expect(body.ok).toBe(true);
    expect(body.listing.entries.map((e) => e.id)).toEqual([
      "invoke-agents",
      "call-skills",
      "archived",
    ]);
  });
});

function writeValidLitePack(unpacked: string): void {
  mkdirSync(join(unpacked, "skills/testing-expert"), { recursive: true });
  mkdirSync(join(unpacked, "rules"), { recursive: true });
  writeFileSync(
    join(unpacked, "skills/testing-expert/SKILL.md"),
    "# testing-expert\n",
  );
  writeFileSync(join(unpacked, "rules/friendly-language.mdc"), "# friendly\n");
  writeFileSync(
    join(unpacked, LITE_PACK_ALLOWLIST_FILENAME),
    JSON.stringify(
      {
        skills: ["skills/testing-expert/SKILL.md"],
        rules: ["rules/friendly-language.mdc"],
      },
      null,
      2,
    ),
  );
}

function seedLiteCache(): { sha: string; unpacked: string } {
  const { sha } = seedCache();
  const unpacked = unpackedDir(sha);
  writeValidLitePack(unpacked);
  return { sha, unpacked };
}

describe("GET /api/sdd/lite/files", () => {
  function liteFilesRequest(): NextRequest {
    return new NextRequest("http://localhost/api/sdd/lite/files");
  }

  it("should_return_file_list_and_same_origin_download_links", async () => {
    const { sha } = seedLiteCache();
    const res = await getLiteFiles(liteFilesRequest());
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      package_version: string;
      package_commit: string;
      cache_synced_at: string;
      files: string[];
      downloads: { path: string; url: string }[];
    };
    expect(body.package_version).toBe("v1.0.0");
    expect(body.package_commit).toBe(sha);
    expect(body.cache_synced_at).toBe("2026-01-01T00:00:00.000Z");
    expect(body.files).toEqual([
      "rules/friendly-language.mdc",
      "skills/testing-expert/SKILL.md",
    ]);
    expect(body.downloads).toHaveLength(2);
    for (const entry of body.downloads) {
      expect(entry.url.startsWith("http://localhost/api/sdd/lite/file?")).toBe(
        true,
      );
      expect(new URL(entry.url).searchParams.get("path")).toBe(entry.path);
    }
  });

  it("should_return_sync_pending_when_cache_empty", async () => {
    process.env.SDD_PACKAGE_CACHE_DIR = mkdtempSync(
      join(tmpdir(), "sdd-api-lite-empty-"),
    );
    const res = await getLiteFiles(liteFilesRequest());
    expect(res.status).toBe(409);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("sync_pending");
  });

  it("should_return_lite_manifest_missing_when_allowlist_absent", async () => {
    seedCache();
    const res = await getLiteFiles(liteFilesRequest());
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("lite_manifest_missing");
  });

  it("should_return_lite_manifest_invalid_when_allowlist_fails_validation", async () => {
    const { unpacked } = seedLiteCache();
    writeFileSync(
      join(unpacked, LITE_PACK_ALLOWLIST_FILENAME),
      JSON.stringify({
        skills: ["skills/testing-expert/SKILL.md"],
        rules: ["rules/missing.mdc"],
      }),
    );
    const res = await getLiteFiles(liteFilesRequest());
    expect(res.status).toBe(422);
    const body = (await res.json()) as {
      error: { code: string };
      downloads?: unknown;
    };
    expect(body.error.code).toBe("lite_manifest_invalid");
    expect(body.downloads).toBeUndefined();
  });
});

describe("GET /api/sdd/lite/file", () => {
  function liteFileRequest(path: string): NextRequest {
    return new NextRequest(
      `http://localhost/api/sdd/lite/file?path=${encodeURIComponent(path)}`,
    );
  }

  it("should_return_unpack_bytes_for_allowlisted_path", async () => {
    seedLiteCache();
    const res = await getLiteFile(
      liteFileRequest("skills/testing-expert/SKILL.md"),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/markdown");
    const text = await res.text();
    expect(text).toBe("# testing-expert\n");
  });

  it("should_reject_path_not_in_allowlist", async () => {
    const { unpacked } = seedLiteCache();
    mkdirSync(join(unpacked, "agents"), { recursive: true });
    writeFileSync(join(unpacked, "agents/ethan.md"), "# ethan\n");
    const res = await getLiteFile(liteFileRequest("agents/ethan.md"));
    expect(res.status).toBe(404);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("path_not_allowed");
  });

  it("should_reject_path_traversal", async () => {
    seedLiteCache();
    const res = await getLiteFile(liteFileRequest("../package.json"));
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("path_invalid");
  });
});
