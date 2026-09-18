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
  other: string[];
};

export type PackageManifest = {
  latestCommit: string;
  latestVersion: string;
  versions: VersionEntry[];
  inventory: PackageInventory;
  syncedAt: string;
};

export function inventoryFromTree(tree: TreeNode[]): PackageInventory {
  const skills: string[] = [];
  const rules: string[] = [];
  const agents: string[] = [];
  const workflows: string[] = [];
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
    } else if (base === "agents" && node.type === "dir") {
      for (const child of node.children ?? []) {
        agents.push(child.name.replace(/\/$/, ""));
      }
    } else if (base === "workflows" && node.type === "dir") {
      for (const child of node.children ?? []) {
        workflows.push(child.name.replace(/\/$/, ""));
      }
    } else {
      other.push(node.name.replace(/\/$/, ""));
    }
  }

  return { skills, rules, agents, workflows, other };
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
