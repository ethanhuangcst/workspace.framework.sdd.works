# Sprint 5 Plan — MVP-5: MCP server + discovery + key lookup

**Batch:** MVP-5 · **Status:** ToDo  
**Backlog:** [`product-backlog.md`](./product-backlog.md) · **Req:** [`req-spec.md`](./req-spec.md) · **Tech:** [`tech-spec.md`](./tech-spec.md) · **MCP design:** [`mcp/mcp-design.md`](./mcp/mcp-design.md)

## Goal

A supported MCP client can connect (stdio and Streamable HTTP), list framework versions, and resolve a key value via `sdd_get_key` with auth.

## In scope

| Feature | Name | Stories |
| --- | --- | --- |
| TRAN-01 | MCP bootstrap (stdio) | [stdio](./mcp/mcp-stories.md#sdd-mcp-transport-stdio) |
| TRAN-02 | MCP bootstrap (Streamable HTTP `/mcp`) | [http](./mcp/mcp-stories.md#sdd-mcp-transport-http) |
| MCPL-01 | `sdd_list_versions` | [list](./mcp/mcp-stories.md#sdd-mcp-list-versions) |
| MCPK-01 | `sdd_get_key` | [get_key](./mcp/mcp-stories.md#sdd-mcp-get-key) |

## Delivery order

1. TRAN-01 — shared core + stdio entry; pin `@modelcontextprotocol/sdk`; register four tool names (install/update may stub-reject until Sprint 6)
2. TRAN-02 — Streamable HTTP + `MCP_AUTH_TOKEN` (or chosen auth)
3. MCPL-01 — list versions / inventory from Settings GitHub source
4. MCPK-01 — authorized plaintext `key_value` lookup

## Dependencies

- **Requires Sprint 3** (KEYS-01) and **Sprint 4** (SETT-01 / FRMW package source).
- Resolve or implement provisional answer for `sdd_get_key` auth model (req-spec open question).

## Out of scope this sprint

- Local filesystem install/update (Sprint 6)
- Cross-client path maps / HTTP write policy (Sprint 7)
- Writing Server 2 disk from HTTP MCP

## Exit criteria (DoD)

- [ ] Client connects via stdio and via `https://…/mcp` (or local HTTP)
- [ ] `sdd_list_versions` returns versions/inventory; no key values
- [ ] `sdd_get_key` returns value when authorized; structured `not_found` / `unauthorized` otherwise
- [ ] Same core behind both transports; integration tests for tool contracts
- [ ] Operator confirms MCP discovery + key lookup usable in at least one real client

## Notes

Tool names (locked): `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, `sdd_get_key`.
