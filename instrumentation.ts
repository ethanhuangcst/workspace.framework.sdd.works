export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduledSyncInterval } = await import(
      "@/core/sync/scheduled-sync"
    );
    startScheduledSyncInterval();
  }
}
