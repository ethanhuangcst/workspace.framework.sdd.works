export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduledSyncInterval } = await import(
      "@shared/core/sync/scheduled-sync"
    );
    startScheduledSyncInterval();
  }
}
