import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { TreeNode } from "@/github/sync";
import { manifestPath } from "./paths";

export type VersionEntry = {
  id: string;
  commitSha?: string;
  published_at?: string;
};

export type PackageInventory = {
  skills: string[];
  rules: string[];
  agents: string[];
  workflows: string[];
  /** Top-level entries under templates/ (pack allow-list). Optional on older manifests. */
  templates?: string[];
  other: string[];
};

export type PackageManifest = {
  latestCommit: string;
  latestVersion: string;
  versions: VersionEntry[];
  inventory: PackageInventory;
  syncedAt: string;
};

function pushChildren(node: TreeNode, into: string[]): void {
  for (const child of node.children ?? []) {
    into.push(child.name.replace(/\/$/, ""));
  }
}

export function inventoryFromTree(tree: TreeNode[]): PackageInventory {
  const skills: string[] = [];
  const rules: string[] = [];
  const agents: string[] = [];
  const workflows: string[] = [];
  const templates: string[] = [];
  const other: string[] = [];

  for (const node of tree) {
    const base = node.name.replace(/\/$/, "");
    const lower = base.toLowerCase();
    if (node.type !== "dir") {
      other.push(base);
      continue;
    }
    if (base === "skills" || base === "skill") {
      pushChildren(node, skills);
    } else if (lower === "rules") {
      pushChildren(node, rules);
    } else if (base === "agents") {
      pushChildren(node, agents);
    } else if (base === "workflows") {
      pushChildren(node, workflows);
    } else if (base === "templates") {
      pushChildren(node, templates);
    } else {
      // Non-pack names (src, .gitignore, *.code-workspace, …) stay in other only
      other.push(base);
    }
  }

  return { skills, rules, agents, workflows, templates, other };
}

export function readPackageManifest(): PackageManifest | null {
  const path = manifestPath();
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as PackageManifest;
  } catch {
    return null;
  }
}

export function writePackageManifest(manifest: PackageManifest): void {
  const path = manifestPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(manifest, null, 2));
}
