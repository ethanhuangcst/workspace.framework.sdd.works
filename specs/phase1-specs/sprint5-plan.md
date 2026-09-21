# Sprint 5 Plan — MVP-5: MCP server + discovery + key lookup

**Batch:** MVP-5 · **Status:** Done  
**Updated:** 2026-09-17  
**Accepted:** 2026-09-17 (operator confirmed usable in Cursor)  
**Backlog:** [`r1-product-backlog.md`](./r1-product-backlog.md) · **Req:** [`r1-req-spec.md`](./r1-req-spec.md) · **Tech:** [`r1-tech-spec.md`](./r1-tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](../mcp/mcp-design.md)

## Goal

A supported MCP client can connect (stdio and Streamable HTTP), list framework versions, and resolve a key value via `sdd_get_key` with auth.

## In scope

| Feature | Name | Stories | Status |
| --- | --- | --- | --- |
| TRAN-01 | MCP bootstrap (stdio) | [stdio](../mcp/mcp-stories.md#sdd-mcp-transport-stdio) | **Done** |
| TRAN-02 | MCP bootstrap (Streamable HTTP `/mcp`) | [http](../mcp/mcp-stories.md#sdd-mcp-transport-http) | **Done** |
| MCPL-01 | `sdd_list_versions` | [list](../mcp/mcp-stories.md#sdd-mcp-list-versions) | **Done** |
| MCPK-01 | `sdd_get_key` | [get_key](../mcp/mcp-stories.md#sdd-mcp-get-key) | **Done** |

## Delivery order

1. TRAN-01 — shared core + stdio — **Done** (`npm run mcp:stdio`; operator confirmed usable)
2. TRAN-02 — Streamable HTTP + `MCP_AUTH_TOKEN` — **Done** (`npm run mcp:http`, port 3041; operator confirmed usable)
3. MCPL-01 — list versions / inventory from Settings GitHub — **Done** (operator confirmed usable)
4. MCPK-01 — authorized plaintext `key_value` lookup — **Done** (operator confirmed usable)

## Dependencies

- **Requires Sprint 3** (KEYS-01) and **Sprint 4** (SETT-01 / FRMW package source).
- Auth: [ADR-049](../adr/ADR-049-mcp-http-bearer-auth.md).

## Out of scope this sprint

- Local filesystem install/update (Sprint 6) — stubs return `not_implemented` / `local_install_required`
- Cross-client path maps / HTTP write policy (Sprint 7)
- Writing Server 2 disk from HTTP MCP

## Exit criteria (DoD)

- [x] Client connects via stdio and via HTTP `/mcp` (contract + sibling process)
- [x] `sdd_list_versions` returns versions/inventory; no key values
- [x] `sdd_get_key` returns value when authorized; structured `not_found` / `unauthorized` otherwise
- [x] Same core behind both transports; integration tests for tool contracts
- [x] Operator confirms MCP discovery + key lookup usable in at least one real client — **confirmed 2026-09-17** (Cursor)

## Notes

Tool names (locked): `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`.

**Operator env:** set `MCP_AUTH_TOKEN` to a long random secret for locked HTTP; unset for local open mode (ADR-050). Optional: `MCP_HTTP_PORT=3041`, `MCP_HTTP_PATH=/mcp`.

## Retrospective

- Confirmed in Cursor over Streamable HTTP: `sdd_list_versions` + `sdd_get_key`.
- ADRs: [ADR-049](../adr/ADR-049-mcp-http-bearer-auth.md), [ADR-050](../adr/ADR-050-mcp-http-optional-bearer.md).
- Next: Sprint 6 (`MCPI-01`, `MCPU-01`, `MCPI-04`).
