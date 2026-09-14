export type DeleteTargetKind = "admin" | "invite";

export type DeleteGuardResult =
  | { ok: true }
  | { ok: false; key: "errors.cannot_delete_self" | "errors.cannot_delete_last_admin" | "errors.not_found" };

/**
 * Pure guards for DELETE /api/admin/users/[id].
 * Invite deletes never hit self/last-admin rules.
 */
export function evaluateAdminDelete(params: {
  actorId: string;
  targetKind: DeleteTargetKind;
  targetAdminId?: string;
  activeAdminCount: number;
  targetExists: boolean;
}): DeleteGuardResult {
  if (!params.targetExists) {
    return { ok: false, key: "errors.not_found" };
  }

  if (params.targetKind === "invite") {
    return { ok: true };
  }

  if (!params.targetAdminId) {
    return { ok: false, key: "errors.not_found" };
  }

  if (params.targetAdminId === params.actorId) {
    return { ok: false, key: "errors.cannot_delete_self" };
  }

  if (params.activeAdminCount <= 1) {
    return { ok: false, key: "errors.cannot_delete_last_admin" };
  }

  return { ok: true };
}
