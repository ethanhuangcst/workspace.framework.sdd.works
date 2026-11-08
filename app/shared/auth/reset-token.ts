type ResetTokenLike = {
  usedAt: Date | null;
  expiresAt: Date;
  admin: { status: string };
};

export function isResetTokenLive(
  row: ResetTokenLike | null | undefined,
  nowMs = Date.now(),
): boolean {
  return Boolean(
    row &&
      !row.usedAt &&
      row.expiresAt.getTime() >= nowMs &&
      row.admin.status === "ACTIVE",
  );
}
