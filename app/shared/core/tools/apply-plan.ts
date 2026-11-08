import { existsSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { PathRoots } from "@sdd/paths";
import {
  ledgerFiles,
  recordedPaths,
  type InstallLedger,
  type InstallPlan,
  type LedgerFiles,
} from "./install-plan";

function isInside(root: string, target: string): boolean {
  const base = resolve(root);
  const abs = resolve(target);
  return abs === base || abs.startsWith(base + "/");
}

export function planIsSafe(
  plan: InstallPlan,
  ledger: InstallLedger | null,
  clientRoot: string,
): boolean {
  const allowed = new Set(recordedPaths(ledgerFiles(ledger)));
  for (const rel of [...plan.delete, ...plan.write]) {
    if (rel.includes("..") || rel.startsWith("/") || rel.includes("\\")) return false;
    if (!isInside(clientRoot, join(clientRoot, rel))) return false;
  }
  return plan.delete.every((rel) => allowed.has(rel));
}

export function missingRecorded(clientRoot: string, ledger: InstallLedger | null): string[] {
  return recordedPaths(ledgerFiles(ledger)).filter((rel) => {
    if (rel.includes("..")) return true;
    const abs = join(clientRoot, rel);
    if (!existsSync(abs)) return true;
    return lstatSync(abs).isDirectory();
  });
}

function sourceFor(pkgDir: string, rel: string): string | null {
  const slash = rel.indexOf("/");
  if (slash < 0) return null;
  const prefix = rel.slice(0, slash);
  const rest = rel.slice(slash + 1);
  if (prefix === "skills") {
    for (const name of ["skills", "skill"]) {
      const candidate = join(pkgDir, name, rest);
      if (existsSync(candidate) && lstatSync(candidate).isFile()) return candidate;
    }
    return null;
  }
  if (prefix === "rules") {
    for (const name of ["rules", "Rules"]) {
      const candidate = join(pkgDir, name, rest);
      if (existsSync(candidate) && lstatSync(candidate).isFile()) return candidate;
    }
    return null;
  }
  const candidate = join(pkgDir, rel);
  if (existsSync(candidate) && lstatSync(candidate).isFile()) return candidate;
  return null;
}

export function applyPlannedFiles(
  pkgDir: string,
  clientRoot: string,
  plan: InstallPlan,
): void {
  for (const rel of plan.delete) {
    const abs = join(clientRoot, rel);
    if (!existsSync(abs) || lstatSync(abs).isDirectory()) continue;
    rmSync(abs, { force: true });
  }
  for (const rel of plan.write) {
    const src = sourceFor(pkgDir, rel);
    if (!src) continue;
    const dest = join(clientRoot, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
  }
}

export function filesFromWriteList(paths: string[]): LedgerFiles {
  const files: LedgerFiles = {
    skills: [],
    rules: [],
    agents: [],
    workflows: [],
    templates: [],
  };
  for (const rel of paths) {
    if (rel.startsWith("skills/")) files.skills.push(rel);
    else if (rel.startsWith("rules/")) files.rules.push(rel);
    else if (rel.startsWith("agents/")) files.agents.push(rel);
    else if (rel.startsWith("workflows/")) files.workflows.push(rel);
    else if (rel.startsWith("templates/")) files.templates.push(rel);
  }
  return files;
}

export function writeLedgerFile(
  clientRoot: string,
  manifest: {
    version: number;
    package_version: string;
    package_commit: string;
    installed_at: string;
    pack_complete: boolean;
    files: LedgerFiles;
  },
): void {
  mkdirSync(clientRoot, { recursive: true });
  writeFileSync(join(clientRoot, ".sdd-installed.json"), JSON.stringify(manifest, null, 2));
}

export function readLedgerFile(clientRoot: string): InstallLedger | null {
  const path = join(clientRoot, ".sdd-installed.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as InstallLedger;
  } catch {
    return null;
  }
}

export type { PathRoots };
