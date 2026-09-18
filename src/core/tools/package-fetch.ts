import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type FetchedPackage = {
  version: string;
  commitSha: string;
  tempDir: string;
};

export type PackageFetchError = {
  code: "package_unavailable";
  message: string;
};

type FetchOverride =
  | ((
      version?: string,
      serverUrl?: string,
    ) => Promise<FetchedPackage | PackageFetchError>)
  | null;

let override: FetchOverride = null;

export function setPackageFetchForTests(fn: FetchOverride): void {
  override = fn;
}

export function getSddServerUrl(): string {
  return (
    process.env.SDD_SERVER_URL?.trim() ||
    process.env.PUBLIC_BASE_URL?.trim() ||
    "https://framework.sdd.works"
  );
}

export async function fetchPackage(
  requestedVersion?: string,
  serverUrl = getSddServerUrl(),
): Promise<FetchedPackage | PackageFetchError> {
  if (override) return override(requestedVersion, serverUrl);

  const version = requestedVersion?.trim() || "latest";
  const url = `${serverUrl.replace(/\/+$/, "")}/api/sdd/package?version=${encodeURIComponent(version)}`;

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
  if (res.status === 404) {
    return {
      code: "package_unavailable",
      message: `Version ${version} is not available on the server.`,
    };
  }
  if (!res.ok) {
    return {
      code: "package_unavailable",
      message: `Package server returned ${res.status}`,
    };
  }

  const commitSha = res.headers.get("X-SDD-Commit")?.trim() ?? "";
  const versionLabel =
    res.headers.get("X-SDD-Version")?.trim() || requestedVersion || "unknown";
  const buffer = Buffer.from(await res.arrayBuffer());
  const tempDir = mkdtempSync(join(tmpdir(), "sdd-pkg-"));
  writeFileSync(join(tempDir, "pkg.tgz"), buffer);
  mkdirSync(join(tempDir, "unpacked"), { recursive: true });
  const result = spawnSync(
    "tar",
    ["-xzf", join(tempDir, "pkg.tgz"), "-C", join(tempDir, "unpacked"), "--strip-components", "1"],
    { encoding: "utf8" },
  );
  if (result.status !== 0) {
    return {
      code: "package_unavailable",
      message: result.stderr || "tarball unpack failed",
    };
  }

  return {
    version: versionLabel,
    commitSha,
    tempDir: join(tempDir, "unpacked"),
  };
}
