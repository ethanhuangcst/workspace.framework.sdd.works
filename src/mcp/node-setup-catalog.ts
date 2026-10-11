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
  npm_registry_policy: {
    mirror_regions: string[];
  };
};

export type RecommendedNpmRegistry = "mirror" | "default";

export type NpmRegistryRecommendation = {
  detected_country: string;
  recommended_npm_registry: RecommendedNpmRegistry;
  recommended_registry_url: string;
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

function isIsoCountryCode(value: string): boolean {
  return /^[A-Z]{2}$/.test(value);
}

export function recommendNpmRegistry(
  catalog: NodeSetupCatalog,
  countryHeader: string | null | undefined,
): NpmRegistryRecommendation {
  const trimmed = countryHeader?.trim();
  if (!trimmed) {
    return {
      detected_country: "unknown",
      recommended_npm_registry: "default",
      recommended_registry_url: catalog.npm_registries.default,
    };
  }
  const code = trimmed.toUpperCase();
  if (!isIsoCountryCode(code)) {
    return {
      detected_country: "unknown",
      recommended_npm_registry: "default",
      recommended_registry_url: catalog.npm_registries.default,
    };
  }
  const mirrorSet = new Set(
    catalog.npm_registry_policy.mirror_regions.map((r) => r.toUpperCase()),
  );
  if (mirrorSet.has(code)) {
    return {
      detected_country: code,
      recommended_npm_registry: "mirror",
      recommended_registry_url: catalog.npm_registries.cn_hk,
    };
  }
  return {
    detected_country: code,
    recommended_npm_registry: "default",
    recommended_registry_url: catalog.npm_registries.default,
  };
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
  const regions = parsed.npm_registry_policy?.mirror_regions;
  if (!Array.isArray(regions) || regions.length === 0) {
    throw new Error("node-catalog.json: invalid npm_registry_policy.mirror_regions");
  }
  for (const region of regions) {
    if (typeof region !== "string" || !isIsoCountryCode(region.toUpperCase())) {
      throw new Error("node-catalog.json: invalid npm_registry_policy.mirror_regions entry");
    }
  }
  return parsed;
}
