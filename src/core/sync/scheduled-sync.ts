import { runScheduledSync } from "./run-scheduled-sync";

export const SCHEDULED_SYNC_INTERVAL_MS = 30 * 60 * 1000;

let interval: NodeJS.Timeout | null = null;

/** Test-only: clear the module interval so tests can restart the timer. */
export function resetScheduledSyncIntervalForTests(): void {
  if (interval) clearInterval(interval);
  interval = null;
}

export function startScheduledSyncInterval(): void {
  if (interval) return;
  if (!process.env.GITHUB_TOKEN?.trim()) {
    console.info("[sdd-sync] scheduled sync disabled (GITHUB_TOKEN unset)");
    return;
  }

  const timer = setInterval(() => {
    void runScheduledSync();
  }, SCHEDULED_SYNC_INTERVAL_MS);
  timer.unref();
  interval = timer;
  console.info("[sdd-sync] scheduled sync interval started (30 min)");
}
