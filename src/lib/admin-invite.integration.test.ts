import { afterAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/auth/password";
import { generateRawToken, hashToken } from "@/auth/token";
import { evaluateAdminDelete } from "@/lib/admin-users";

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("admin invite accept list delete", () => {
  const db = new PrismaClient();

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should_invite_accept_list_and_delete_other_admin", async () => {
    const actor = await db.admin.findUniqueOrThrow({
      where: { email: "me@ethanhuang.com" },
    });
    const inviteEmail = `invite-${Date.now()}@example.com`;
    const raw = generateRawToken();
    const invite = await db.inviteToken.create({
      data: {
        email: inviteEmail,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedBy: actor.id,
      },
    });

    expect(invite.usedAt).toBeNull();

    const username = `u${Date.now()}`;
    const passwordHash = await hashPassword("InvitePass1!");
    await db.$transaction(async (tx) => {
      await tx.admin.create({
        data: {
          email: inviteEmail,
          username,
          name: "Invited Admin",
          passwordHash,
          status: "ACTIVE",
        },
      });
      await tx.inviteToken.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      });
    });

    const created = await db.admin.findUniqueOrThrow({
      where: { email: inviteEmail },
    });
    const activeCount = await db.admin.count({ where: { status: "ACTIVE" } });
    expect(activeCount).toBeGreaterThanOrEqual(2);

    const selfGuard = evaluateAdminDelete({
      actorId: actor.id,
      targetKind: "admin",
      targetAdminId: actor.id,
      targetExists: true,
      activeAdminCount: activeCount,
    });
    expect(selfGuard.ok).toBe(false);
    if (!selfGuard.ok) {
      expect(selfGuard.key).toBe("errors.cannot_delete_self");
    }

    const otherGuard = evaluateAdminDelete({
      actorId: actor.id,
      targetKind: "admin",
      targetAdminId: created.id,
      targetExists: true,
      activeAdminCount: activeCount,
    });
    expect(otherGuard.ok).toBe(true);

    await db.admin.delete({ where: { id: created.id } });
    const gone = await db.admin.findUnique({ where: { email: inviteEmail } });
    expect(gone).toBeNull();
  });

  it("should_delete_pending_invite_by_id", async () => {
    const actor = await db.admin.findUniqueOrThrow({
      where: { email: "me@ethanhuang.com" },
    });
    const invite = await db.inviteToken.create({
      data: {
        email: `pending-${Date.now()}@example.com`,
        tokenHash: hashToken(generateRawToken()),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        invitedBy: actor.id,
      },
    });

    const guard = evaluateAdminDelete({
      actorId: actor.id,
      targetKind: "invite",
      targetExists: true,
      activeAdminCount: 0,
    });
    expect(guard.ok).toBe(true);

    await db.inviteToken.delete({ where: { id: invite.id } });
    const gone = await db.inviteToken.findUnique({ where: { id: invite.id } });
    expect(gone).toBeNull();
  });
});
