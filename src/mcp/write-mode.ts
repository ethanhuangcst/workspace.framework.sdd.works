import { dirname } from "node:path";
import { homedir } from "node:os";
import { resolveClientPaths } from "@/core/path-detect";
import { checkCandidateRoot } from "@/core/tools/install-plan";
import type { InstallPlan } from "@/core/tools/install-plan";
import type { LedgerFiles } from "@/core/tools/install-plan";
import { fetchPackage, getSddServerUrl } from "@/core/tools/package-fetch";
import {
  applyPlannedFiles,
  filesFromWriteList,
  missingRecorded,
  planIsSafe,
  readLedgerFile,
  writeLedgerFile,
} from "@/core/tools/apply-plan";

export type PlanResponse = {
  code?: string;
  error?: { code: string; message?: string };
  plan?: InstallPlan;
  version?: string;
  commitSha?: string;
  manifest?: {
    version: number;
    package_version: string;
    package_commit: string;
    installed_at: string;
    pack_complete: boolean;
    files: LedgerFiles;
  };
};

function flag(argv: string[], name: string): string | undefined {
  const index = argv.indexOf(name);
  if (index < 0) return undefined;
  return argv[index + 1];
}

function clientRootFromSkills(skills: string): string {
  return dirname(skills.replace(/[/\\]+$/, ""));
}

export async function runWriteMode(
  argv: string[],
  deps?: {
    postPlan?: (url: string, body: unknown) => Promise<PlanResponse>;
    fetchPkg?: typeof fetchPackage;
  },
): Promise<number> {
  const client = flag(argv, "--client") ?? process.env.SDD_CLIENT;
  if (!client) {
    process.stdout.write(
      `${JSON.stringify({ error: { code: "client_unknown", message: "Pass --client." } })}\n`,
    );
    return 1;
  }
  const os = flag(argv, "--os");
  const home = process.env.HOME ?? homedir();
  const userProfile = process.env.USERPROFILE ?? home;
  const resolved = await resolveClientPaths(client, {
    home,
    userProfile,
    os,
    env: process.env,
    skipLlm: true,
  });
  if ("code" in resolved) {
    process.stdout.write(`${JSON.stringify({ error: resolved })}\n`);
    return 1;
  }
  const clientRoot = clientRootFromSkills(resolved.primary.skills);
  const rejected = checkCandidateRoot(clientRoot, home, userProfile);
  if (rejected) {
    process.stdout.write(`${JSON.stringify({ error: rejected })}\n`);
    return 1;
  }

  const ledger = readLedgerFile(clientRoot);
  const missing = missingRecorded(clientRoot, ledger);
  const server = getSddServerUrl().replace(/\/+$/, "");
  const body = {
    version: flag(argv, "--version"),
    client,
    os,
    force: argv.includes("--force"),
    inventory: { ledger, missing },
  };
  const postPlan =
    deps?.postPlan ??
    (async (url: string, payload: unknown) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      return (await res.json()) as PlanResponse;
    });
  const planBody = await postPlan(`${server}/api/sdd/install-plan`, body);
  if (planBody.error) {
    process.stdout.write(`${JSON.stringify(planBody)}\n`);
    return 1;
  }
  if (!planBody.plan || planBody.plan.action === "noop") {
    process.stdout.write(`${JSON.stringify({ action: "noop" })}\n`);
    return 0;
  }
  if (!planIsSafe(planBody.plan, ledger, clientRoot)) {
    process.stdout.write(
      `${JSON.stringify({ error: { code: "path_rejected", message: "Plan is outside the ledger or the client root." } })}\n`,
    );
    return 1;
  }
  if (planBody.plan.action === "rewrite_ledger" && ledger) {
    writeLedgerFile(clientRoot, {
      version: ledger.version ?? 1,
      package_version: ledger.package_version ?? planBody.version ?? "",
      package_commit: ledger.package_commit ?? planBody.commitSha ?? "",
      installed_at: new Date().toISOString(),
      pack_complete: true,
      files: {
        skills: ledger.files?.skills ?? [],
        rules: ledger.files?.rules ?? [],
        agents: ledger.files?.agents ?? [],
        workflows: ledger.files?.workflows ?? [],
        templates: ledger.files?.templates ?? [],
      },
    });
    process.stdout.write(`${JSON.stringify({ action: "rewrite_ledger" })}\n`);
    return 0;
  }

  const fetchPkg = deps?.fetchPkg ?? fetchPackage;
  const pkg = await fetchPkg(flag(argv, "--version"), server);
  if ("code" in pkg) {
    process.stdout.write(`${JSON.stringify({ error: pkg })}\n`);
    return 1;
  }
  applyPlannedFiles(pkg.tempDir, clientRoot, planBody.plan);
  const files = planBody.manifest?.files ?? filesFromWriteList(planBody.plan.write);
  writeLedgerFile(clientRoot, {
    version: 1,
    package_version: planBody.version ?? pkg.version,
    package_commit: planBody.commitSha ?? pkg.commitSha,
    installed_at: new Date().toISOString(),
    pack_complete: true,
    files,
  });
  process.stdout.write(`${JSON.stringify({ action: "apply" })}\n`);
  return 0;
}
