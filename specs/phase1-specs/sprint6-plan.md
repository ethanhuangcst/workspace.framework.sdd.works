# Sprint 6 Plan — MVP-6: MCP install + update (Cursor, local)

**Batch:** MVP-6 · **Status:** Done  
**Updated:** 2026-09-18  
**Accepted:** 2026-09-18 (Cursor HTTP install + LE1–LE5 live GitHub E2E)  
**Backlog:** [`r1-product-backlog.md`](./r1-product-backlog.md) · **Req:** [`r1-req-spec.md`](./r1-req-spec.md) · **Tech:** [`r1-tech-spec.md`](./r1-tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](../mcp/mcp-design.md)

## Goal

A Cursor user can install the SDD framework locally and update it to a chosen version; re-running the same version is idempotent. Path roots use **deterministic client config detection** (MCPI-05) first, then a seed map plus **Qwen** client-config discovery (ADR-047) when needed.

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| MCPI-04 | Qwen path discovery | [path-llm](../mcp/mcp-stories.md#sdd-mcp-path-llm) |
| MCPI-05 | Client path detection | [path-detect](../mcp/mcp-stories.md#sdd-mcp-path-detect) |
| MCPI-01 | `sdd_install_framework` (stdio, Cursor) | [install](../mcp/mcp-stories.md#sdd-mcp-install) |
| MCPU-01 | `sdd_update_framework` (stdio, Cursor) | [update](../mcp/mcp-stories.md#sdd-mcp-update) |
| SYNK-01 | Server-side framework sync | [sync-job](../mcp/mcp-stories.md#sdd-mcp-sync-job) |
| PKAPI-01 | Package REST API | [package-api](../mcp/mcp-stories.md#sdd-mcp-package-api) |

## Delivery order

1. SYNK-01 — sync job: GitHub → local cache + manifest (ADR-053)
2. PKAPI-01 — `GET /api/sdd/versions`, `GET /api/sdd/package`, `POST /api/admin/sync`
3. MCPI-04 — Qwen client + redaction + schema + seed fallback + allow-list (fixture LLM in CI)
4. MCPI-05 — deterministic env-var + config-file path detection; `clientInfo.name` mapping; cache per session
5. MCPI-01 — stdio fetches package from REST API; write skills/rules/other; structured summary
6. ADR-054 Hybrid — HTTP install returns tarball URL; prompt-based setup; Instructions page primary path
7. MCPU-01 — same paths; idempotent `already_up_to_date`; manifest-tracked merge

## Dependencies

- **Requires Sprint 5** (TRAN-01, MCPL-01) and **Sprint 4** (package source).
- **Requires Sprint 1 PATH-01** (path map + resolver) — install/update consume the resolver.
- Decide merge vs overwrite (req-spec open question) before coding write policy. **DECIDED: manifest-tracked merge (ADR-048)** — see `mcp-design.md` § Write policy.
- Client detection vs explicit `client` argument — Cursor-first; prefer explicit `client` when ambiguous (MCPI-05 + ADR-047).
- Operator fills `QWEN_*` in `.env.local` / Portainer (`protect-eng` — do not rewrite env without confirmation).
- Knowledge: [`mcp/client.paths.md`](../mcp/client.paths.md).

## Out of scope this sprint

- Non-Cursor clients (Sprint 7)
- HTTP install writing remote disk (forbidden; Sprint 7 policy)
- Portal chat LLM
- Admin portal feature work

## Exit criteria (DoD)

- [x] Cursor stdio install places `SKILL.md` skills, rules, agents, workflows under allow-listed roots
- [x] Invalid / out-of-root paths (including LLM-proposed) fail with structured error and no writes
- [x] Env var resolution works for Claude Code (`CLAUDE_CONFIG_DIR`), Codex (`CODEX_HOME`), Cline (`CLINE_DIR`), Kiro (`KIRO_HOME`)
- [x] `clientInfo.name` auto-detect maps at least Cursor + Claude Code + TRAE + TRAE CN correctly
- [x] Deterministic resolution failure falls through to Qwen → seed map → structured error
- [x] Resolution source field reports `env` | `config` | `seed` | `llm`
- [x] Qwen unavailable → seed fallback; unresolved → structured error, no writes
- [x] Update same version → idempotent or clear already-up-to-date
- [x] Manifest-tracked merge: install/update preserves user files, removes stale package files via `.sdd-installed.json` manifest
- [x] Compat aliases: writing to shared root (e.g. `~/.claude/skills/`) covers multiple clients; never write to both primary and compat for same client
- [x] Unit tests 100% on path allow-list, LLM schema validation, path detection, + idempotency; fixture Qwen in CI
- [x] User confirms install + update usable on at least one OS
- [x] Sync job stores framework files + manifest in operator cache (SYNK-01)
- [x] stdio binary fetches packages from operator REST API — no DB/GitHub on client (PKAPI-01, ADR-053)
- [x] `sdd_get_key` removed from stdio; HTTP MCP only
- [x] Operator runs sync against real test GitHub repo (opt-in E2E: `SDD_E2E_GITHUB_REPO=https://github.com/ethanhuangcst/test.sdd`)

## Design

- [mcp-design.md](../mcp/mcp-design.md) · [mcp-stories.md](../mcp/mcp-stories.md) · [mcp-test.md](../mcp/mcp-test.md)

## Deferred to Sprint 7

Verification and scope items not required to close MVP-6 — see [`sprint7-plan.md`](./sprint7-plan.md) § Carried from Sprint 6:

- Mac live stdio path E2E ([`mcp-test.md`](../mcp/mcp-test.md) §5 Tests 1–5; field `clientInfo.name` observation)
- Manual operator scenarios M1–M2 ([`mcp-test.md`](../mcp/mcp-test.md) §7.4)
- Sync E2E S2–S5 (rename/delete/GitHub-down scenarios beyond LE1–LE5)
- MCPI-05 env matrix: Copilot (`COPILOT_*`), OpenCode (`XDG_DATA_HOME`), `CLINE_DATA_DIR`
- Cross-client install beyond Cursor-first ([`MCPI-02`](../mcp/mcp-stories.md#sdd-mcp-cross-client))
