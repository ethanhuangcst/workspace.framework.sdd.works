import { readFileSync } from "node:fs";
import { join } from "node:path";

const PLATFORM_KEYS = ["darwin-arm64", "darwin-x64", "win32-x64"] as const;

export type NodeSetupCatalog = {
  version: number;
  node_lts: string;
  downloads: Record<(typeof PLATFORM_KEYS)[number], string>;
  npm_registries: {
    default: string;
    cn_hk: string;
  };
};

export function nodeCatalogPath(): string {
  return join(process.cwd(), "public", "agent-setup", "node-catalog.json");
}

function isHttpsUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function loadNodeSetupCatalog(): NodeSetupCatalog {
  const raw = readFileSync(nodeCatalogPath(), "utf8");
  const parsed = JSON.parse(raw) as NodeSetupCatalog;
  if (parsed.version !== 1 || typeof parsed.node_lts !== "string") {
    throw new Error("node-catalog.json: invalid version or node_lts");
  }
  for (const key of PLATFORM_KEYS) {
    const url = parsed.downloads?.[key];
    if (typeof url !== "string" || !isHttpsUrl(url)) {
      throw new Error(`node-catalog.json: invalid downloads.${key}`);
    }
  }
  for (const regKey of ["default", "cn_hk"] as const) {
    const url = parsed.npm_registries?.[regKey];
    if (typeof url !== "string" || !isHttpsUrl(url)) {
      throw new Error(`node-catalog.json: invalid npm_registries.${regKey}`);
    }
  }
  return parsed;
}
