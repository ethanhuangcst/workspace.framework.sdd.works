# ADR-052: Commit SHA identity for install/update idempotency

## Status
Accepted

## Context
Manifest-tracked merge stores `package_version` as the GitHub ref label (tag or branch name, e.g. `main`, `v1.0.0`). When repo content changes under the same ref — skill rename, delete, or branch tip move — the label is unchanged. `sdd_install_framework` returned `already_up_to_date` while local skills/rules were stale.

Integrity checks (missing files on disk) and `force: true` partially mitigated manual deletion but not same-ref content drift.

## Decision
- On package materialization, resolve the **commit SHA** for the requested ref via GitHub `repos.getCommit` (Octokit) and return it from `materializePackage`.
- Store `package_commit` in `.sdd-installed.json` alongside `package_version`.
- Return `already_up_to_date` only when **all** hold: matching `package_commit`, matching `package_version`, manifest-listed files exist on disk, and `force` is not set.
- Manifests without `package_commit` (pre-ADR-052) trigger reinstall on next install/update (self-heal).
- **`sdd_list_versions` unchanged** — commit SHA is install/update-only; no extra per-tag API calls in the list tool.

## Rationale
Ref labels are mutable for branches and can be re-pointed for tags. Commit SHA is the stable identity for “what tree was installed.” One extra `getCommit` per install/update is acceptable for correctness.

## Consequences
- Branch installs (`main`) pick up content changes on the next `sdd_install_framework` call.
- Old manifests without `package_commit` reinstall once, then write the new field.
- Fixture port returns deterministic `sha-${ref}` for tests.

## Date
2026-09-18
