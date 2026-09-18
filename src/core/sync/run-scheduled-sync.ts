import { clearListVersionsCache } from "@/core/tools/list-versions";
import { syncFrameworkRepo, type SyncResult } from "./sync-job";

export type ScheduledSyncResult =
  | SyncResult
  | { skipped: true; reason: "no_github_token" };

export async function runScheduledSync(): Promise<ScheduledSyncResult> {
  if (!process.env.GITHUB_TOKEN?.trim()) {
    return { skipped: true, reason: "no_github_token" };
  }

  try {
    const result = await syncFrameworkRepo();
    clearListVersionsCache();
    if ("code" in result) {
      console.error("[sdd-sync] scheduled sync failed:", result.message);
    } else {
      console.info("[sdd-sync] scheduled sync:", result.status, result.commitSha);
    }
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "scheduled sync failed";
    console.error("[sdd-sync] scheduled sync error:", message);
    return { code: "sync_error", message };
  }
}
