import { describe, expect, it } from "vitest";
import { generateRawToken, hashToken } from "@/auth/token";
import { isInviteTokenLive } from "@/auth/invite-token";

describe("invite token", () => {
  it("should_hash_raw_token_deterministically", () => {
    const raw = generateRawToken();
    expect(hashToken(raw)).toBe(hashToken(raw));
    expect(hashToken(raw)).not.toBe(hashToken(`${raw}x`));
  });

  it("should_reject_expired_or_used_invite", () => {
    const now = 1_000_000;
    expect(
      isInviteTokenLive(
        {
          expiresAt: new Date(now - 1),
          usedAt: null,
        },
        now,
      ),
    ).toBe(false);
    expect(
      isInviteTokenLive(
        {
          expiresAt: new Date(now + 60_000),
          usedAt: new Date(now),
        },
        now,
      ),
    ).toBe(false);
    expect(
      isInviteTokenLive(
        {
          expiresAt: new Date(now + 60_000),
          usedAt: null,
        },
        now,
      ),
    ).toBe(true);
  });
});
