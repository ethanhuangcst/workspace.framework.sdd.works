import { describe, expect, it } from "vitest";
import { evaluateAdminDelete } from "./admin-users";

describe("evaluateAdminDelete", () => {
  it("should_allow_invite_delete", () => {
    const result = evaluateAdminDelete({
      actorId: "a1",
      targetKind: "invite",
      targetExists: true,
      activeAdminCount: 1,
    });
    expect(result).toEqual({ ok: true });
  });

  it("should_reject_delete_self", () => {
    const result = evaluateAdminDelete({
      actorId: "a1",
      targetKind: "admin",
      targetAdminId: "a1",
      targetExists: true,
      activeAdminCount: 2,
    });
    expect(result).toEqual({ ok: false, key: "errors.cannot_delete_self" });
  });

  it("should_reject_delete_last_admin", () => {
    const result = evaluateAdminDelete({
      actorId: "a1",
      targetKind: "admin",
      targetAdminId: "a2",
      targetExists: true,
      activeAdminCount: 1,
    });
    expect(result).toEqual({
      ok: false,
      key: "errors.cannot_delete_last_admin",
    });
  });

  it("should_allow_delete_other_admin_when_more_than_one", () => {
    const result = evaluateAdminDelete({
      actorId: "a1",
      targetKind: "admin",
      targetAdminId: "a2",
      targetExists: true,
      activeAdminCount: 2,
    });
    expect(result).toEqual({ ok: true });
  });

  it("should_reject_missing_target", () => {
    const result = evaluateAdminDelete({
      actorId: "a1",
      targetKind: "admin",
      targetExists: false,
      activeAdminCount: 2,
    });
    expect(result).toEqual({ ok: false, key: "errors.not_found" });
  });
});
