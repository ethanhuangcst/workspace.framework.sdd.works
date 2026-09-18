import { runScheduledSync } from "./run-scheduled-sync";

const INTERVAL_MS = 30 * 60 * 1000;

let interval: NodeJS.Timeout | null = null;

export function startScheduledSyncInterval(): void {
  if (interval) return;
  if (!process.env.GITHUB_TOKEN?.trim()) {
    console.info("[sdd-sync] scheduled sync disabled (GITHUB_TOKEN unset)");
    return;
  }

  const timer = setInterval(() => {
    void runScheduledSync();
  }, INTERVAL_MS);
  timer.unref();
  interval = timer;
  console.info("[sdd-sync] scheduled sync interval started (30 min)");
}
