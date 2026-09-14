# Sprint 6 Plan — MVP-6: MCP install + update (Cursor, local)

**Batch:** MVP-6 · **Status:** ToDo  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](./mcp/mcp-design.md)

## Goal

A Cursor user can install the SDD framework locally and update it to a chosen version; re-running the same version is idempotent. Path roots use a seed map plus **Qwen** client-config discovery (ADR-047).

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| MCPI-04 | Qwen path discovery | [path-llm](./mcp/mcp-stories.md#sdd-mcp-path-llm) |
| MCPI-01 | `sdd_install_framework` (stdio, Cursor) | [install](./mcp/mcp-stories.md#sdd-mcp-install) |
| MCPU-01 | `sdd_update_framework` (stdio, Cursor) | [update](./mcp/mcp-stories.md#sdd-mcp-update) |

## Delivery order

1. MCPI-04 — Qwen client + redaction + schema + seed fallback + allow-list (fixture LLM in CI)
2. MCPI-01 — Cursor seed paths (macOS / Windows / Linux); wire resolver; write skills/rules/other; structured summary
3. MCPU-01 — same paths; idempotent `already_up_to_date`; merge/overwrite per design decision

## Dependencies

- **Requires Sprint 5** (TRAN-01, MCPL-01) and **Sprint 4** (package source).
- **Requires Sprint 1 PATH-01** (path map + resolver) — install/update consume the resolver.
- Decide merge vs overwrite (req-spec open question) before coding write policy.
- Client detection vs explicit `client` argument — Cursor-first; prefer explicit `client` when ambiguous (ADR-047).
- Operator fills `QWEN_*` in `.env.local` / Portainer (`protect-eng` — do not rewrite env without confirmation).

## Out of scope this sprint

- Non-Cursor clients (Sprint 7)
- HTTP install writing remote disk (forbidden; Sprint 7 policy)
- Portal chat LLM
- Admin portal feature work

## Exit criteria (DoD)

- [ ] Cursor stdio install places `SKILL.md` skills, rules, other folders under allow-listed roots
- [ ] Invalid / out-of-root paths (including LLM-proposed) fail with structured error and no writes
- [ ] Qwen unavailable → seed fallback; unresolved → structured error, no writes
- [ ] Update same version → idempotent or clear already-up-to-date
- [ ] Unit tests 100% on path allow-list, LLM schema validation, + idempotency; fixture Qwen in CI
- [ ] User confirms install + update usable on at least one OS

## Design

- [mcp-design.md](./mcp/mcp-design.md) · [mcp-stories.md](./mcp/mcp-stories.md)
