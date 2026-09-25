import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getPathsVersion } from "@sdd/paths";
import { getCachedManifest } from "@/core/sync/cache";
import { toolError, toolOk } from "./errors";
import { getSddServerUrl } from "./package-fetch";
export type VersionEntry = { id: string; published_at?: string };

export type ListVersionsResult = {
  versions: VersionEntry[];
  inventory: {
    skills: string[];
    rules: string[];
    agents: string[];
    workflows: string[];
    templates?: string[];
    other: string[];
  };
  paths_version: number;
};

type ListVersionsOptions = {
  channel?: "stdio" | "http";
};

type VersionsOverride =
  | (() => Promise<CallToolResult>)
  | null;

let override: VersionsOverride = null;

export function setListVersionsForTests(fn: VersionsOverride): void {
  override = fn;
}

let cache: { key: string; payload: ListVersionsResult; expiresAt: number } | null =
  null;
const CACHE_TTL_MS = 60_000;

export function clearListVersionsCache(): void {
  cache = null;
}

function fromManifest(): ListVersionsResult | null {
  const manifest = getCachedManifest();
  if (!manifest) return null;
  return {
    versions: manifest.versions.map(({ id, published_at }) => ({
      id,
      published_at,
    })),
    inventory: manifest.inventory,
    paths_version: getPathsVersion(),
  };
}

async function fetchVersionsFromServer(
  serverUrl = getSddServerUrl(),
): Promise<ListVersionsResult | { code: "package_unavailable"; message: string }> {
  const url = `${serverUrl.replace(/\/+$/, "")}/api/sdd/versions`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch (error) {
    return {
      code: "package_unavailable",
      message:
        error instanceof Error ? error.message : "Failed to reach package server",
    };
  }
  if (res.status === 409) {
    return {
      code: "package_unavailable",
      message: "Package sync has not run on the server yet.",
    };
  }
  if (!res.ok) {
    return {
      code: "package_unavailable",
      message: `Package server returned ${res.status}`,
    };
  }
  const body = (await res.json()) as {
    versions: VersionEntry[];
    inventory: ListVersionsResult["inventory"];
    paths_version?: number;
  };
  return {
    versions: body.versions,
    inventory: body.inventory,
    paths_version: body.paths_version ?? getPathsVersion(),
  };
}

export async function listVersions(
  options: ListVersionsOptions = {},
): Promise<CallToolResult> {
  if (override) return override();

  const channel = options.channel ?? "http";
  const cacheKey = channel === "http" ? "cache-local" : getSddServerUrl();
  const now = Date.now();
  if (cache && cache.key === cacheKey && cache.expiresAt > now) {
    return toolOk(cache.payload);
  }

  if (channel === "http") {
    const payload = fromManifest();
    if (!payload) {
      return toolError(
        "package_unavailable",
        "Package sync has not run yet. Trigger sync from Settings or POST /api/admin/sync.",
      );
    }
    cache = { key: cacheKey, payload, expiresAt: now + CACHE_TTL_MS };
    return toolOk(payload);
  }

  const fetched = await fetchVersionsFromServer();
  if ("code" in fetched) {
    return toolError(fetched.code, fetched.message);
  }
  cache = { key: cacheKey, payload: fetched, expiresAt: now + CACHE_TTL_MS };
  return toolOk(fetched);
}
