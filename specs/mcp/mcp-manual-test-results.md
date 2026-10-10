# MCP manual test results

> **Purpose:** Operator and client-journey evidence for MCP install, setup, and pack sync. Complements [`mcp-tests.md`](./mcp-tests.md) automation.
> **Recovery (2026-10-10):** An edit during feature-82 replaced older sections in this file. Use Cursor **Local History** on this path to restore prior MC-journey notes if you need them. The feature-82 block below is current.

## feature-82 / MCP-07 — Production pack sync

**Layer:** Admin Framework sync, shared cache volume, lite and package APIs, MCP install source.

**Automated (repo, 2026-10-10):**

- Added `should_copy_lite_pack_allowlist_at_unpack_root` in `sync-job.test.ts`.
- Added `should_use_cache_pack_source_for_a_real_commit` in `install.test.ts`.
- Added `should_put_root_lite_pack_allowlist_in_other` in `manifest.test.ts`.
- §15 CI command bundle green.

**Production probe (2026-10-10, unauthenticated curl):**

| Check | Result | Evidence |
| --- | --- | --- |
| `GET /api/sdd/versions` | pass | `latestCommit`: `df8a7ffc823fbde9c31630f4798c9de30ed72692`; `syncedAt`: `2026-10-09T06:22:16.157Z`; inventory includes skills, rules, agents, `content`, `templates`, `lite-pack.allowlist.json` in `other` |
| `GET /api/sdd/package?version=latest` | pass | HTTP 200; `x-sdd-commit`: `df8a7ffc823fbde9c31630f4798c9de30ed72692`; `x-sdd-version`: `main` |
| `GET /api/sdd/lite/files` | fail | HTTP 404 HTML (Next not-found page). Route exists in repo at `src/app/api/sdd/lite/files/route.ts` but is not on the deployed image yet. |
| Admin sync this session | skip | Cache already populated; re-run Framework sync before close if you want a fresh `syncedAt`. |
| MCP install uses cache | open | Not exercised in this probe. |

**Before feature-82 close:** Deploy an image that includes lite file routes, re-run lite/files curl (expect 200), then optional MCP install spot-check.

## feature-96 / MC-14 — Sync receipt on unchanged commit

**Layer:** `syncFrameworkRepo` unchanged short-circuit (non-force).

**Localhost (2026-10-10):**

| Check | Result | Evidence |
| --- | --- | --- |
| Second sync same commit | pass | `status: unchanged`, `commitSha: 3d5880c042f00547ba9716c2957f80e56464e14b` |
| `syncedAt` advanced | pass | `2026-10-10T06:50:22.245Z` → `2026-10-10T06:53:29.616Z` in `.data/sdd-packages/manifest.json` |
| Vitest | pass | `sync-job.test.ts` 7 passed |

**Note:** Admin Framework sync sends `force: true`. Scheduled sync, webhook, and CLI `syncFrameworkRepo()` without force use the unchanged-commit receipt path.

## feature-92 / WA-19–WA-21 — Setup page (localhost)

**Layer:** `GET /setup`, origin rewrite, Setup tab UI.

**Localhost (2026-10-10, user close confirm):**

| Check | Result | Evidence |
| --- | --- | --- |
| `GET http://localhost:3040/setup` | pass | Setup markdown `2026-10-09.v11`; MCP URL rewritten to `http://127.0.0.1:3041/mcp` |
| After setup link | pass | Points to `http://localhost:3040/install` |
| Agent sections | pass | WorkBuddy, CodeBuddy CN, TRAE CN Application Support path, current-client-only |
| Production `https://sdd.works/setup` | open | Still **404** before go-live |

**Closed 2026-10-10 (user close now):** [WA-21](../issues-log.md), [WA-20](../issues-log.md), [WA-19](../issues-log.md) on localhost and Vitest evidence above. **Post-deploy:** re-smoke live `https://sdd.works/setup`, Copy pill, and Setup tab per [release.md](../release.md) §7.2.

## MC-10 and MC-17 — Setup scope and install page (localhost)

**Layer:** `GET /setup` prompt content ([feature-91](../sprint-backlog.md#sprint-9)); `GET /install` install sequence ([feature-95](../sprint-backlog.md#sprint-9)).

**Close policy (2026-10-10):** Localhost page and Vitest checks count. A live CodeBuddy CN or Codex agent replay is not required for issue close.

**Automated (2026-10-10):**

| Check | Result | Evidence |
| --- | --- | --- |
| MC-10 setup markdown | pass | `npx vitest run src/app/api/sdd/sdd-api.test.ts -t should_return_agent_setup_markdown` → 1 passed |
| MC-17 install page markdown | pass | Same file `-t should_return_install_full_markdown` → 1 passed (2 passed total in one run) |

**Localhost (optional, same session):** User confirmed setup body at `http://localhost:3040/setup` (v11, current-client-only, After setup → `/install`).

## Manual e2e before go-live

Plan: [`mcp-tests.md`](./mcp-tests.md#16-manual-e2e-before-go-live) §16. Prep: [`scripts/manual-e2e-prep.sh`](../../scripts/manual-e2e-prep.sh). Pair-run: [`go-live-test.md`](./go-live-test.md). **Summary (2026-10-10):** CodeBuddy CN and TRAE CN **pass** TC-1 through TC-6. TC-7 through TC-9 **pass** once-per-run. **Codex not verified:** operator token exhausted; TC-2 through TC-6 **skip**; TC-1 canonical **fail** ([MC-19](../issues-log.md)). Open OGT rows on [`status.md`](../status.md) track **Codex only** until rerun.

### Preflight (fill when you start)

| Check | Result | Evidence |
| --- | --- | --- |
| Dev server on 3040 | pass | HTTP 200 on `/api/sdd/versions` (2026-10-10) |
| Real latestCommit | pass | `3d5880c042f00547ba9716c2957f80e56464e14b` (not fixture) |
| lite/files 200 | pass | HTTP 200 (2026-10-10) |
| Prep script smoke | pass | `--fixture-on` / `--fixture-off`; `--backup-mcp trae-cn` |

### CodeBuddy CN (`codebuddy`)

| Check | Result | Evidence |
| --- | --- | --- |
| TC-1 setup MCP only | pass | Canonical prompt; `~/.codebuddy/mcp.json`; URL-only entry; tools in session; MC-10 diffs clean ([go-live-test.md](./go-live-test.md)) |
| TC-2 install via /install | pass | MCP tool + tarball; 73 files; ledger; no workspace `specs/` ([go-live-test.md](./go-live-test.md)) |
| TC-3 seed-map root | pass | Root `~/.codebuddy`; workspace clean; verify-tc3 PASS ([go-live-test.md](./go-live-test.md)) |
| TC-4 nested templates | pass | verify-tc4 PASS; no flat `templates/EN/` ([go-live-test.md](./go-live-test.md)) |
| TC-5 update noop | pass | Agent `noop`; ledger unchanged ([go-live-test.md](./go-live-test.md)) |
| TC-6 update apply | pass | Staged ledger → apply; 73 files; verify-tc6 PASS ([go-live-test.md](./go-live-test.md)) |

### TRAE CN (`trae-cn`)

| Check | Result | Evidence |
| --- | --- | --- |
| TC-1 setup MCP only | pass | Canonical prompt via shell fetch; Application Support `mcp.json`; tools in session; MC-10 diffs clean ([go-live-test.md](./go-live-test.md)) |
| TC-2 install via /install | pass | Same install sequence; root `~/.trae-cn`; verify PASS ([go-live-test.md](./go-live-test.md)) |
| TC-3 seed-map root | pass | Root `~/.trae-cn`; workspace clean; verify-tc3 PASS ([go-live-test.md](./go-live-test.md)) |
| TC-4 nested templates | pass | verify-tc4 PASS ([go-live-test.md](./go-live-test.md)) |
| TC-5 update noop | pass | Agent `noop`; no disk writes ([go-live-test.md](./go-live-test.md)) |
| TC-6 update apply | pass | apply via HTTP MCP fallback; verify-tc6 PASS ([go-live-test.md](./go-live-test.md)) |

### Codex (`codex`)

| Check | Result | Evidence |
| --- | --- | --- |
| TC-1 setup MCP only | fail (canonical) | One-line fetch failed (agent shell curl); alternate browser + `codex mcp remove/add` wired MCP; `codex mcp get` enabled `streamable_http`; [MC-19](../issues-log.md); [go-live-test.md](./go-live-test.md) |
| TC-2 install via /install | skip | Operator Codex token exhausted 2026-10-10 ([go-live-test.md](./go-live-test.md)) |
| TC-3 seed-map root | skip | Same |
| TC-4 nested templates | skip | Same |
| TC-5 update noop | skip | Same |
| TC-6 update apply | skip | Same |

### Once per run (any connected client)

| Check | Result | Evidence |
| --- | --- | --- |
| TC-7 fixture → bundled | pass (disk) | No fixture stub on client; `pack_source` was `cache` after sync (see [go-live-test.md](./go-live-test.md)); `--fixture-off` run |
| TC-8 get_key not_found | pass | Cursor MCP: missing name → `not_found`; empty → `invalid_input`; verify-tc8 Vitest PASS ([go-live-test.md](./go-live-test.md)) |
| TC-9 root_required | pass | Cursor MCP: `root_required` → apply under `$HOME` → `/etc/sdd` `path_rejected`; verify-tc9 Vitest PASS ([go-live-test.md](./go-live-test.md)) |
