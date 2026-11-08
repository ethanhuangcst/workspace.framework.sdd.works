export function isInviteTokenLive<
  T extends { expiresAt: Date; usedAt: Date | null },
>(row: T | null | undefined, nowMs = Date.now()): row is T {
  return Boolean(
    row && !row.usedAt && row.expiresAt.getTime() >= nowMs,
  );
}
