# Sprint 7 Plan — MVP-7: Cross-client + HTTP hardening

**Batch:** MVP-7 · **Status:** ToDo  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](./mcp/mcp-design.md)

## Goal

First-class clients across macOS / Windows / Linux resolve install paths via **seed maps + Qwen** config discovery; HTTP install follows the safe local-bridge policy; MCP tool descriptions are i18n-aware.

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| MCPI-02 | Cross-client path resolution | [cross-client](./mcp/mcp-stories.md#sdd-mcp-cross-client) |
| MCPI-03 | HTTP install policy | [http policy](./mcp/mcp-stories.md#sdd-mcp-http-install-policy) |
| MCPU-02 | Update on HTTP | [http policy](./mcp/mcp-stories.md#sdd-mcp-http-install-policy) |
| I18N-02 | MCP description i18n | [i18n](./admin-portal/app-stories.md#sdd-admin-i18n) |

## Delivery order

1. MCPI-02 — seed + Qwen for Cursor Agents, WorkBuddy / CN, Claude Code, Cline, VS Code, Codex, Copilot (+ TRAE as candidate)
2. MCPI-03 — HTTP MUST NOT write Server 2 as `~/.cursor`; `local_install_required` or signed instructions (no Qwen against server disk)
3. MCPU-02 — update semantics over HTTP under the same policy
4. I18N-02 — tool descriptions from catalogs (`en` + `zh-Hans` / `zh-Hant` overlay)

## Dependencies

- **Requires Sprint 6** (MCPI-01, MCPU-01, MCPI-04) and Sprint 5 transports.
- **Requires Sprint 1 PATH-01** — expand the same `paths.json` for new clients; bump `paths_version`.
- Document or ADR: HTTP install / local-bridge decision. **Accepted for LLM:** ADR-047.

## Out of scope this sprint

- New admin portal pages
- Hosting third-party skill marketplaces
- In-portal GitHub file editing
- Portal chat LLM

## Exit criteria (DoD)

- [ ] Path resolution documented and tested for at least one primary client path per OS (macOS / Windows / Linux)
- [ ] HTTP install/update never writes arbitrary Server 2 home paths; structured failure or bridge path only
- [ ] MCP descriptions resolve for supported locales without missing-key crashes
- [ ] Regression: Cursor stdio install/update still green
- [ ] User confirms cross-client + HTTP policy behavior is acceptable

## Design

- [mcp-design.md](./mcp/mcp-design.md) · [tech-spec.md](./tech-spec.md) (HTTP install policy) · [13-instructions](./admin-portal/ui-mockup/13-instructions.html)
