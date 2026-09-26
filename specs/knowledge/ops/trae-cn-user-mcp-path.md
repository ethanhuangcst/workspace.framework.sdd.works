---
title: TRAE CN user MCP path (Manage page)
type: ops-lesson
status: active
as_of: 2026-09-26
tags:
  - trae-cn
  - mcp
  - client-paths
related_spec: specs/mcp/client.paths.md
related:
  - mcp/read-client-config-results.md
  - mcp/mcp-design.md
---

# TRAE CN user MCP path (Manage page)

## Summary

TRAE CN’s Manage-page user MCP list is not under `~/.trae-cn/`. On macOS it is `~/Library/Application Support/Trae CN/User/mcp.json`, beside that app’s `settings.json`. Writing `~/.trae-cn/mcp.json` or the international `~/.trae/mcp.json` does not populate that list.

## Evidence

- 2026-09-26: empty Manage page after writing `~/.trae-cn/mcp.json` / `~/.trae/mcp.json`; entry appeared only after writing the Application Support `User/mcp.json`.
- Project MCP (when Enable Project MCP is on) stays `<workspace>/.trae/mcp.json` even inside TRAE CN.
- Pack install roots (`~/.trae-cn/skills`, rules, agents) are unchanged by this path.

## Lesson / guidance

- Confirm the file the Manage UI loads (sibling of user `settings.json`) before documenting setup or running agent paste.
- Do not treat the data-folder home (`~/.trae-cn/`) as the user MCP config path for TRAE CN.
- Keep international TRAE user MCP at `~/.trae/mcp.json` as a separate client.

## Links

- [`specs/mcp/client.paths.md`](../../mcp/client.paths.md) — TRAE / TRAE CN MCP table
- [`specs/mcp/read-client-config-results.md`](../../mcp/read-client-config-results.md) — TRAE CN row
- `public/agent-setup/prompt.md` — setup version `2026-09-26.v4`
