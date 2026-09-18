# Sprint 7 Plan — MVP-7: Cross-client + verification hardening

**Batch:** MVP-7 · **Status:** ToDo  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](./mcp/mcp-design.md)

## Goal

First-class clients across macOS / Windows / Linux resolve install paths via **seed maps + Qwen** config discovery; remaining Sprint 6 verification gates close; MCP tool descriptions are i18n-aware.

## Carried from Sprint 6

Items deferred at MVP-6 close-out (2026-09-18):

| Item | Source | Sprint 7 action |
| --- | --- | --- |
| Mac live stdio path E2E | [`mcp-test.md`](./mcp/mcp-test.md) §5 Tests 1–5 | Run on operator Mac; document actual Cursor `clientInfo.name` |
| Manual operator M1–M2 | [`mcp-test.md`](./mcp/mcp-test.md) §7.4 | Verify once per release candidate |
| Sync E2E S2–S5 | [`mcp-test.md`](./mcp/mcp-test.md) §6 | Automate or operator-run rename/delete/GitHub-down scenarios |
| Copilot / XDG / `CLINE_DATA_DIR` env rows | [`client.paths.md`](./mcp/client.paths.md) | Extend MCPI-05 env matrix + unit tests |
| Cross-client install | MCPI-02 | Seed + Qwen for WorkBuddy, Claude Code, Cline, Codex, Copilot, etc. |

**Already done in Sprint 6 (not Sprint 7 scope):** ADR-054 HTTP hybrid (`packageUrl` + portable `~` paths + AI extraction), MCPI-03, HTTP update alias (MCPU-02 behavior).

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| MCPI-02 | Cross-client path resolution | [cross-client](./mcp/mcp-stories.md#sdd-mcp-cross-client) |
| MCPI-05+ | Extended env path detection | [path-detect](./mcp/mcp-stories.md#sdd-mcp-path-detect) |
| VERIF-01 | Mac stdio path E2E + operator manual gates | [`mcp-test.md`](./mcp/mcp-test.md) §5, §7.4 |
| VERIF-02 | Sync scenario E2E (S2–S5) | [`mcp-test.md`](./mcp/mcp-test.md) §6 |
| I18N-02 | MCP description i18n | [i18n](./admin-portal/app-stories.md#sdd-admin-i18n) |

## Delivery order

1. VERIF-01 — Mac live stdio path tests; tick [`mcp-test.md`](./mcp/mcp-test.md) §5; manual M1–M2 once
2. MCPI-05+ — Copilot / XDG / `CLINE_DATA_DIR` env resolution + tests
3. MCPI-02 — seed + Qwen for first-class non-Cursor clients; OS variants (macOS / Windows / Linux)
4. VERIF-02 — sync rename/delete/unavailable E2E (S2–S5)
5. I18N-02 — tool descriptions from catalogs (`en` + `zh-Hans` / `zh-Hant` overlay)

## Dependencies

- **Requires Sprint 6** (MCPI-01, MCPU-01, MCPI-04, MCPI-05, SYNK-01, PKAPI-01, ADR-054).
- **Requires Sprint 1 PATH-01** — expand the same `paths.json` for new clients; bump `paths_version`.

## Out of scope this sprint

- New admin portal pages
- Hosting third-party skill marketplaces
- In-portal GitHub file editing
- Portal chat LLM

## Exit criteria (DoD)

- [ ] Path resolution documented and tested for at least one primary client path per OS (macOS / Windows / Linux)
- [ ] [`mcp-test.md`](./mcp/mcp-test.md) §5 Mac gate checkboxes ticked (live stdio)
- [ ] Manual M1–M2 verified once per release candidate
- [ ] Sync E2E S2–S5 covered (automated or documented operator run)
- [ ] Copilot / XDG / `CLINE_DATA_DIR` env resolution implemented + unit tested
- [ ] MCP descriptions resolve for supported locales without missing-key crashes
- [ ] Regression: Cursor stdio + HTTP install/update still green

## Design

- [mcp-design.md](./mcp/mcp-design.md) · [tech-spec.md](./tech-spec.md) · [13-instructions](./admin-portal/ui-mockup/13-instructions.html)
