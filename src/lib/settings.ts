import { z } from "zod";

export type ParsedGithubRepo = {
  owner: string;
  repo: string;
  canonicalUrl: string;
  display: string;
};

const OWNER_REPO = /^[A-Za-z0-9_.-]+$/;

/**
 * Accept https://github.com/{owner}/{repo} with optional .git / trailing slash.
 */
export function parseGithubRepoUrl(raw: string): ParsedGithubRepo | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (host !== "github.com" && host !== "www.github.com") return null;

  const parts = url.pathname
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/\.git$/i, ""));
  if (parts.length < 2) return null;

  const owner = parts[0];
  const repo = parts[1];
  if (!OWNER_REPO.test(owner) || !OWNER_REPO.test(repo)) return null;
  if (owner === "." || owner === ".." || repo === "." || repo === "..") {
    return null;
  }

  return {
    owner,
    repo,
    canonicalUrl: `https://github.com/${owner}/${repo}`,
    display: `github.com/${owner}/${repo}`,
  };
}

export const updateSettingsSchema = z.object({
  url: z.string().min(1).max(512),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
