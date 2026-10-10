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
