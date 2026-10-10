import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = join(import.meta.dirname, "..", "..");
const SRC_ROOT = join(REPO_ROOT, "src");

const SETUP_BACKEND_FILES = [
  "src/app/api/agent-setup/route.ts",
  "src/app/api/agent-setup/install/route.ts",
  "src/app/api/agent-setup/install-full/route.ts",
  "src/app/api/agent-setup/node/route.ts",
  "src/mcp/setup-markdown.ts",
  "src/mcp/setup-paths.ts",
  "src/mcp/paste-sentences.ts",
  "src/mcp/node-setup-catalog.ts",
  "src/mcp/brand.ts",
  "src/mcp/public-origin.ts",
];

const PACK_INSTALL_FORBIDDEN_SETUP_IMPORTS = [
  "@/mcp/setup-markdown",
  "@/mcp/setup-paths",
  "@/mcp/paste-sentences",
  "@/mcp/node-setup-catalog",
  "@/mcp/brand",
];

const SETUP_FORBIDDEN_PACK_PREFIXES = ["@/core/tools", "@/core/sync"];

const INSTALL_HANDLER_FORBIDDEN = [
  "@/core/tools/install-plan",
  "@/core/tools/apply-plan",
  "@/core/tools/package-fetch",
  "composeInstallPlan",
];

const SHARED_WIRING_ALLOWED = new Set([
  "src/mcp/create-server.ts",
  "src/mcp/http-server.ts",
]);

/** Collect import specifiers from static import/export-from lines. */
function collectImportSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const importFromRe =
    /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,.$]+?\s+from\s+)?["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importFromRe.exec(source)) !== null) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

function listProductionTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listProductionTsFiles(full));
      continue;
    }
    if (!entry.name.endsWith(".ts") || entry.name.endsWith(".test.ts")) {
      continue;
    }
    out.push(relative(REPO_ROOT, full));
  }
  return out;
}

function readSrc(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf8");
}

function importsSetupModule(specifiers: string[]): boolean {
  return specifiers.some(
    (s) =>
      s.startsWith("@/mcp/setup-") ||
      s === "@/mcp/setup-markdown" ||
      s === "@/mcp/paste-sentences" ||
      s === "@/mcp/node-setup-catalog" ||
      s === "@/mcp/brand" ||
      s.startsWith("./setup-") ||
      s.startsWith("../mcp/setup-") ||
      s === "./paste-sentences" ||
      s === "./node-setup-catalog" ||
      s === "./brand",
  );
}

function importsPackInstallModule(specifiers: string[]): boolean {
  return specifiers.some(
    (s) =>
      s.startsWith("@/core/tools") ||
      s.startsWith("@/core/sync") ||
      s.startsWith("../core/tools") ||
      s.startsWith("../core/sync"),
  );
}

describe("feature-90 module boundary (sdd-mcp-module-boundary)", () => {
  it("AC1: setup backend files do not import from pack install module", () => {
    for (const rel of SETUP_BACKEND_FILES) {
      const specifiers = collectImportSpecifiers(readSrc(rel));
      for (const forbidden of SETUP_FORBIDDEN_PACK_PREFIXES) {
        const hit = specifiers.find(
          (s) => s === forbidden || s.startsWith(`${forbidden}/`),
        );
        expect(hit, `${rel} must not import ${forbidden}, got ${hit}`).toBeUndefined();
      }
    }
  });

  it("AC2: GET /setup route does not import install plan or tarball helpers", () => {
    const rel = "src/app/api/agent-setup/route.ts";
    const source = readSrc(rel);
    const specifiers = collectImportSpecifiers(source);
    for (const forbidden of INSTALL_HANDLER_FORBIDDEN) {
      const hit = specifiers.find((s) => s.includes(forbidden));
      expect(hit, `${rel} must not import ${forbidden}`).toBeUndefined();
    }
    expect(source).not.toMatch(/composeInstallPlan|readBundledPack|ensurePackageCacheFresh/);
  });

  it("AC3: pack install backend files do not import from setup backend", () => {
    const packFiles = listProductionTsFiles(join(SRC_ROOT, "core", "tools")).concat(
      listProductionTsFiles(join(SRC_ROOT, "core", "sync")),
    );
    for (const rel of packFiles) {
      const specifiers = collectImportSpecifiers(readSrc(rel));
      for (const forbidden of PACK_INSTALL_FORBIDDEN_SETUP_IMPORTS) {
        const hit = specifiers.find((s) => s === forbidden || s.startsWith(`${forbidden}/`));
        expect(hit, `${rel} must not import ${forbidden}`).toBeUndefined();
      }
    }
  });

  it("AC4: sdd_install_framework handler does not import setup backend", () => {
    const rel = "src/core/tools/install-http.ts";
    const specifiers = collectImportSpecifiers(readSrc(rel));
    expect(importsSetupModule(specifiers)).toBe(false);
    expect(readSrc(rel)).not.toMatch(/setup-markdown|paste-sentences|node-setup-catalog/);
  });

  it("AC5: only MCP server entry imports from both modules", () => {
    const productionFiles = listProductionTsFiles(SRC_ROOT);
    const dualImportViolations: string[] = [];

    for (const rel of productionFiles) {
      if (SHARED_WIRING_ALLOWED.has(rel)) {
        continue;
      }
      const specifiers = collectImportSpecifiers(readSrc(rel));
      if (importsSetupModule(specifiers) && importsPackInstallModule(specifiers)) {
        dualImportViolations.push(rel);
      }
    }

    expect(dualImportViolations).toEqual([]);
  });
});
