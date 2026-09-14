import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getPathsVersion } from "@sdd/paths";
import {
  fetchRepoTree,
  GitHubConfigError,
  GitHubSyncError,
  getGitHubPortForRepo,
  type TreeNode,
} from "@/github/sync";
import { db } from "@/lib/db";
import { parseGithubRepoUrl } from "@/lib/settings";
import { toolError, toolOk } from "./errors";

export type VersionEntry = { id: string; published_at?: string };

export type ListVersionsResult = {
  versions: VersionEntry[];
  inventory: { skills: string[]; rules: string[]; other: string[] };
  paths_version: number;
};

function inventoryFromTree(tree: TreeNode[]): ListVersionsResult["inventory"] {
  const skills: string[] = [];
  const rules: string[] = [];
  const other: string[] = [];

  for (const node of tree) {
    const base = node.name.replace(/\/$/, "");
    if (base === "skills" && node.type === "dir") {
      for (const child of node.children ?? []) {
        skills.push(child.name.replace(/\/$/, ""));
      }
    } else if (base === "rules" && node.type === "dir") {
      for (const child of node.children ?? []) {
        rules.push(child.name.replace(/\/$/, ""));
      }
    } else {
      other.push(node.name.replace(/\/$/, ""));
    }
  }

  return { skills, rules, other };
}

let cache: { key: string; payload: ListVersionsResult; expiresAt: number } | null =
  null;
const CACHE_TTL_MS = 60_000;

export function clearListVersionsCache(): void {
  cache = null;
}

export async function listVersions(): Promise<CallToolResult> {
  const row = await db.setting.findUnique({ where: { id: "singleton" } });
  const url = row?.githubUrl?.trim() ?? "";
  if (!url) {
    return toolError(
      "package_unavailable",
      "No GitHub repository is configured in Settings.",
    );
  }

  const parsed = parseGithubRepoUrl(url);
  if (!parsed) {
    return toolError(
      "package_unavailable",
      "Settings GitHub URL is invalid.",
    );
  }

  const cacheKey = `${parsed.owner}/${parsed.repo}`;
  const now = Date.now();
  if (cache && cache.key === cacheKey && cache.expiresAt > now) {
    return toolOk(cache.payload);
  }

  try {
    const port = getGitHubPortForRepo(parsed.owner);
    const [tags, tree] = await Promise.all([
      port.listRepoTags(parsed.owner, parsed.repo),
      fetchRepoTree(parsed.owner, parsed.repo),
    ]);
    const versions =
      tags.length > 0 ? tags : [{ id: "main" } satisfies VersionEntry];
    const payload: ListVersionsResult = {
      versions,
      inventory: inventoryFromTree(tree),
      paths_version: getPathsVersion(),
    };
    cache = { key: cacheKey, payload, expiresAt: now + CACHE_TTL_MS };
    return toolOk(payload);
  } catch (error) {
    if (
      error instanceof GitHubSyncError ||
      error instanceof GitHubConfigError
    ) {
      return toolError("package_unavailable", error.message);
    }
    throw error;
  }
}
