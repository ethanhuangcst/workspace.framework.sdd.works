import { Octokit } from "@octokit/rest";

export type TreeNode = {
  name: string;
  type: "dir" | "file";
  children?: TreeNode[];
};

export type GitHubPort = {
  checkRepoAccessible: (owner: string, repo: string) => Promise<boolean>;
  fetchRepoTree: (owner: string, repo: string) => Promise<TreeNode[]>;
};

export class GitHubConfigError extends Error {
  constructor(message = "GITHUB_TOKEN is not configured") {
    super(message);
    this.name = "GitHubConfigError";
  }
}

export class GitHubSyncError extends Error {
  constructor(message = "GitHub sync failed") {
    super(message);
    this.name = "GitHubSyncError";
  }
}

const FIXTURE_REACHABLE = new Set(["fixture/sdd-framework", "org/sdd-framework"]);

const FIXTURE_TREE: TreeNode[] = [
  {
    name: "skills/",
    type: "dir",
    children: [
      { name: "tdd/SKILL.md", type: "file" },
      { name: "atdd/SKILL.md", type: "file" },
      { name: "retrospective/SKILL.md", type: "file" },
    ],
  },
  {
    name: "rules/",
    type: "dir",
    children: [
      { name: "dod.mdc", type: "file" },
      { name: "incremental-delivery.mdc", type: "file" },
      { name: "common-test-strategy.mdc", type: "file" },
    ],
  },
  {
    name: "specs/",
    type: "dir",
    children: [{ name: "req-spec.md", type: "file" }],
  },
];

export function createFixtureGitHubPort(options?: {
  unreachable?: Set<string>;
}): GitHubPort {
  const unreachable = options?.unreachable ?? new Set(["fixture/missing"]);
  return {
    async checkRepoAccessible(owner, repo) {
      const key = `${owner}/${repo}`;
      if (unreachable.has(key)) return false;
      return FIXTURE_REACHABLE.has(key) || key.startsWith("fixture/");
    },
    async fetchRepoTree(owner, repo) {
      const ok = await this.checkRepoAccessible(owner, repo);
      if (!ok) {
        throw new GitHubSyncError("fixture repo unreachable");
      }
      return structuredClone(FIXTURE_TREE);
    },
  };
}

const MAX_TREE_ENTRIES = 400;

export function flatPathsToTree(
  entries: { path: string; type: "blob" | "tree" | string }[],
): TreeNode[] {
  type Mutable = { name: string; type: "dir" | "file"; children?: Map<string, Mutable> };
  const root = new Map<string, Mutable>();
  let count = 0;

  for (const entry of entries) {
    if (count >= MAX_TREE_ENTRIES) break;
    const parts = entry.path.split("/").filter(Boolean);
    if (parts.length === 0) continue;
    let level = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLeaf = i === parts.length - 1;
      const isDir = !isLeaf || entry.type === "tree";
      let node = level.get(part);
      if (!node) {
        node = {
          name: isDir ? `${part}/` : part,
          type: isDir ? "dir" : "file",
          children: isDir ? new Map() : undefined,
        };
        level.set(part, node);
        count += 1;
        if (count >= MAX_TREE_ENTRIES) break;
      }
      if (isDir && node.children) {
        level = node.children;
      }
    }
  }

  function toArray(map: Map<string, Mutable>): TreeNode[] {
    return [...map.values()]
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({
        name: n.name,
        type: n.type,
        children: n.children ? toArray(n.children) : undefined,
      }));
  }

  return toArray(root);
}

function createOctokitPort(): GitHubPort {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new GitHubConfigError();
  }
  const baseUrl =
    process.env.GITHUB_API_BASE_URL?.trim() || "https://api.github.com";
  const octokit = new Octokit({ auth: token, baseUrl });

  return {
    async checkRepoAccessible(owner, repo) {
      try {
        await octokit.repos.get({ owner, repo });
        return true;
      } catch {
        return false;
      }
    },
    async fetchRepoTree(owner, repo) {
      try {
        const { data: repoData } = await octokit.repos.get({ owner, repo });
        const ref = repoData.default_branch;
        const { data: refData } = await octokit.git.getRef({
          owner,
          repo,
          ref: `heads/${ref}`,
        });
        const sha = refData.object.sha;
        const { data: treeData } = await octokit.git.getTree({
          owner,
          repo,
          tree_sha: sha,
          recursive: "true",
        });
        return flatPathsToTree(
          (treeData.tree ?? []).map((t) => ({
            path: t.path ?? "",
            type: t.type ?? "blob",
          })),
        );
      } catch (error) {
        if (error instanceof GitHubSyncError) throw error;
        throw new GitHubSyncError(
          error instanceof Error ? error.message : "GitHub sync failed",
        );
      }
    },
  };
}

let overridePort: GitHubPort | null = null;

export function setGitHubPortForTests(port: GitHubPort | null): void {
  overridePort = port;
}

export function getGitHubPort(): GitHubPort {
  if (overridePort) return overridePort;
  if (process.env.GITHUB_FIXTURE === "1") {
    return createFixtureGitHubPort();
  }
  return createOctokitPort();
}

export async function checkRepoAccessible(
  owner: string,
  repo: string,
): Promise<boolean> {
  return getGitHubPort().checkRepoAccessible(owner, repo);
}

export async function fetchRepoTree(
  owner: string,
  repo: string,
): Promise<TreeNode[]> {
  return getGitHubPort().fetchRepoTree(owner, repo);
}

type CacheEntry = {
  key: string;
  tree: TreeNode[];
  expiresAt: number;
};

const CACHE_TTL_MS = 30_000;
let treeCache: CacheEntry | null = null;

export function clearFrameworkTreeCache(): void {
  treeCache = null;
}

export async function fetchRepoTreeCached(
  owner: string,
  repo: string,
  now = Date.now(),
): Promise<{ tree: TreeNode[]; fromCache: boolean; durationMs: number }> {
  const key = `${owner}/${repo}`;
  if (treeCache && treeCache.key === key && treeCache.expiresAt > now) {
    return { tree: treeCache.tree, fromCache: true, durationMs: 0 };
  }
  const started = Date.now();
  const tree = await fetchRepoTree(owner, repo);
  const durationMs = Date.now() - started;
  treeCache = { key, tree, expiresAt: now + CACHE_TTL_MS };
  return { tree, fromCache: false, durationMs };
}
