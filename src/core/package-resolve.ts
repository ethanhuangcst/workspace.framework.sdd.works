import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  GitHubConfigError,
  GitHubSyncError,
  getGitHubPortForRepo,
} from "@/github/sync";
import { db } from "@/lib/db";
import { parseGithubRepoUrl } from "@/lib/settings";

export type ResolvedPackage = {
  version: string;
  commitSha: string;
  tempDir: string;
};

export type PackageResolveError = {
  code: "package_unavailable";
  message: string;
};

type Override = (() => Promise<ResolvedPackage | PackageResolveError>) | null;

let override: Override = null;

export function setPackageResolveForTests(fn: Override): void {
  override = fn;
}

export async function resolvePackage(
  requestedVersion?: string,
): Promise<ResolvedPackage | PackageResolveError> {
  if (override) return override();

  const row = await db.setting.findUnique({ where: { id: "singleton" } });
  const url = row?.githubUrl?.trim() ?? "";
  if (!url) {
    return { code: "package_unavailable", message: "No GitHub repository is configured in Settings." };
  }
  const parsed = parseGithubRepoUrl(url);
  if (!parsed) {
    return { code: "package_unavailable", message: "Settings GitHub URL is invalid." };
  }

  try {
    const port = getGitHubPortForRepo(parsed.owner);
    const tags = await port.listRepoTags(parsed.owner, parsed.repo);
    const version =
      requestedVersion?.trim() || tags[0]?.id || "main";
    const tempDir = mkdtempSync(join(tmpdir(), "sdd-pkg-"));
    const { commitSha } = await port.materializePackage(
      parsed.owner,
      parsed.repo,
      version,
      tempDir,
    );
    const unpacked = join(tempDir, "unpacked");
    return {
      version,
      commitSha,
      tempDir: existsSync(unpacked) ? unpacked : tempDir,
    };
  } catch (error) {
    if (error instanceof GitHubSyncError || error instanceof GitHubConfigError) {
      return { code: "package_unavailable", message: error.message };
    }
    throw error;
  }
}
