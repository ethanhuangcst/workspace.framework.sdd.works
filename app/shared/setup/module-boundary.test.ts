import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = join(import.meta.dirname, "..", "..", "..");
const APP_ROOT = join(REPO_ROOT, "app");

const SETUP_BACKEND_FILES = [
  "app/web/app/api/agent-setup/route.ts",
  "app/web/app/api/agent-setup/install/route.ts",
  "app/web/app/api/agent-setup/install-full/route.ts",
  "app/web/app/api/agent-setup/node/route.ts",
  "app/shared/setup/setup-markdown.ts",
  "app/shared/setup/paste-sentences.ts",
  "app/shared/setup/node-setup-catalog.ts",
  "app/shared/setup/brand.ts",
  "app/shared/setup/public-origin.ts",
];

const PACK_INSTALL_FORBIDDEN_SETUP_IMPORTS = [
  "@shared/setup/setup-markdown",
  "@shared/setup/paste-sentences",
  "@shared/setup/node-setup-catalog",
  "@shared/setup/brand",
];

const SETUP_FORBIDDEN_PACK_PREFIXES = ["@shared/core/tools", "@shared/core/sync"];

const INSTALL_HANDLER_FORBIDDEN = [
  "@shared/core/tools/install-plan",
  "@shared/core/tools/apply-plan",
  "@shared/core/tools/package-fetch",
  "composeInstallPlan",
];

const SHARED_WIRING_ALLOWED = new Set([
  "app/mcp/create-server.ts",
  "app/mcp/http-server.ts",
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
      s.startsWith("@shared/setup/") ||
      s === "@shared/setup/setup-markdown" ||
      s === "@shared/setup/paste-sentences" ||
      s === "@shared/setup/node-setup-catalog" ||
      s === "@shared/setup/brand" ||
      s.startsWith("./setup-") ||
      s.startsWith("./paste-sentences") ||
      s.startsWith("./node-setup-catalog") ||
      s.startsWith("./brand") ||
      s.startsWith("./public-origin") ||
      s === "./setup-markdown",
  );
}

function importsPackInstallModule(specifiers: string[]): boolean {
  return specifiers.some(
    (s) =>
      s.startsWith("@shared/core/tools") ||
      s.startsWith("@shared/core/sync") ||
      s.startsWith("../core/tools") ||
      s.startsWith("../core/sync") ||
      s.startsWith("../../core/tools") ||
      s.startsWith("../../core/sync"),
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
    const rel = "app/web/app/api/agent-setup/route.ts";
    const source = readSrc(rel);
    const specifiers = collectImportSpecifiers(source);
    for (const forbidden of INSTALL_HANDLER_FORBIDDEN) {
      const hit = specifiers.find((s) => s.includes(forbidden));
      expect(hit, `${rel} must not import ${forbidden}`).toBeUndefined();
    }
    expect(source).not.toMatch(/composeInstallPlan|readBundledPack|ensurePackageCacheFresh/);
  });

  it("AC3: pack install backend files do not import from setup backend", () => {
    const packFiles = listProductionTsFiles(join(APP_ROOT, "shared", "core", "tools")).concat(
      listProductionTsFiles(join(APP_ROOT, "shared", "core", "sync")),
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
    const rel = "app/shared/core/tools/install-http.ts";
    const specifiers = collectImportSpecifiers(readSrc(rel));
    expect(importsSetupModule(specifiers)).toBe(false);
    expect(readSrc(rel)).not.toMatch(/setup-markdown|paste-sentences|node-setup-catalog/);
  });

  it("AC5: only MCP server entry imports from both modules", () => {
    const productionFiles = [
      ...listProductionTsFiles(join(APP_ROOT, "web")),
      ...listProductionTsFiles(join(APP_ROOT, "shared")),
      ...listProductionTsFiles(join(APP_ROOT, "mcp")),
    ];
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
