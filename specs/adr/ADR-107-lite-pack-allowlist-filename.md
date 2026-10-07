# ADR-107: Lite pack allow-list filename is lite-pack.allowlist.json

## Status
Accepted

## Context
Lite HTTP install copies a subset of pack skills and rules. The pack repo holds one JSON file at the repo root that lists those relative paths. Admin sync materializes the pack tree; the lite file-links API reads that JSON from the sync cache and returns same-origin URLs only for listed paths.

Earlier names caused confusion:

- `lite.framework.sdd.works.json` looked like a product URL or a client artifact.
- `.lite-pack.config.on-server.json` was clearer about lite pack policy but `config` was vague and `on-server` was wrong for a file committed in Git and shipped in the pack tarball.

The client lite receipt (`.sdd-lite-installed.json` on `{client_root}`) is separate. It is written after a successful copy. It is not downloaded from the pack.

## Decision
1. The pack-root allow-list basename is **`lite-pack.allowlist.json`** (no leading dot).
2. The authoring seed in the product repo is `specs/framework/seeds/lite-pack.allowlist.json`. The pack GitHub repo carries the same basename at the repo root.
3. Product code uses one constant, `LITE_PACK_ALLOWLIST_FILENAME`, in `src/core/seeds/lite-install-manifest.ts`. Routes and tests import that constant; they do not hard-code the string.
4. Living specs and portal ACs name `lite-pack.allowlist.json`. Dated change-log and product-backlog history may keep older basenames for the date they describe.
5. Client receipts `.sdd-lite-installed.json` and `.sdd-installed.json` stay off the pack repo and off this allow-list. Pack-root shape examples `.sdd-installed.example.json` and `.sdd-lite-installed.example.json` may ship (`pack_complete` false; not copied by install).

## Rationale
`allowlist` states the file role. A visible filename helps pack maintainers in GitHub. One constant limits rename churn in code.

## Consequences
- [Spec-seeds-15](product-backlog.md#L446), [Web-portal-17](product-backlog.md#L441), and [Web-portal-26](product-backlog.md#L419) reference this basename.
- Operators rename the file at the pack repo root and re-sync Admin Settings.
- Supersedes informal use of `lite.framework.sdd.works.json` and `.lite-pack.config.on-server.json` in living docs.

## Date
2026-10-07
