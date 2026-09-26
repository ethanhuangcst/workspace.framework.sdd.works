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
import { GET as getFeatures } from "./features/route";
import { GET as getAgentSetup } from "../agent-setup/route";
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
    const prevBase = process.env.PUBLIC_BASE_URL;
    delete process.env.PUBLIC_BASE_URL;
    delete process.env.MCP_PUBLIC_URL;
    try {
      const res = await getAgentSetup();
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toContain("text/markdown");
      const body = await res.text();
      expect(body).toContain("framework.sdd.works");
      expect(body).toContain("~/.sdd/sdd-mcp");
      expect(body).toContain("command");
      expect(body).toContain("SDD_SERVER_URL");
      expect(body).toContain("https://framework.sdd.works/mcp");
      expect(body).toContain("sdd_install_framework");
      expect(body).toContain("2026-09-26.v5");
      expect(body).toContain(
        "Confirm the server exposes `sdd_install_framework` and `sdd_update_framework`. On HTTP, it also exposes `sdd_get_key`.",
      );
      expect(body).not.toContain("sdd_list_versions");
      expect(body).toContain("Do not ask the person to copy commands or edit the MCP configuration file by hand");
      expect(body).toContain("Do not ask the person to edit the MCP file by hand");
      expect(body).toContain("Do not download an executable");
      expect(body).not.toContain("releases/latest/download");
      expect(body).toContain("Library/Application Support/Trae CN/User/mcp.json");
      expect(body).toContain("Do not write `~/.trae-cn/mcp.json` or `~/.trae/mcp.json` for TRAE CN");
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
      expect(body).toContain('SDD_SERVER_URL": "http://127.0.0.1:3040"');
      expect(body).toContain("http://127.0.0.1:3041/mcp");
      expect(body).not.toContain("https://framework.sdd.works/mcp");
      expect(body).not.toContain("releases/latest/download");
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
    const unpacked = unpackedDir(sha);
    for (const [name, body] of Object.entries(files)) {
      writeFileSync(join(unpacked, name), body);
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
    expect(body.html).toContain('class="feature-name">ethan</span>');
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
