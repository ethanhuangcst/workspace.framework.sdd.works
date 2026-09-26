---
title: Cursor stdio source vs placed sdd-mcp binary
type: ops-lesson
status: active
as_of: 2026-09-26
tags:
  - mcp
  - stdio
related_spec: specs/mcp/mcp-design.md
related:
  - adr/ADR-063-unregister-sdd-list-versions.md
  - knowledge/ops/trae-cn-user-mcp-path.md
---

# Cursor stdio source vs placed sdd-mcp binary

## Summary

This repo has two local stdio MCP processes. Editing TypeScript updates only the process that runs the source. The placed binary stays on the build that was last copied into `~/.sdd/`.

## Evidence

- Cursor's MCP entry for this repo is `npm exec tsx src/mcp/stdio.ts`. Stopping that process and refreshing MCP in Cursor loads the current source.
- `~/.sdd/sdd-mcp` is the compiled host binary from `npm run mcp:build` and `npm run mcp:place`. TRAE CN uses that file. A source change, including the [MCP-03](../../product-backlog.md#pb-78) tool list, does not appear there until those two commands run and the client reloads.
- Killing the `tsx` process does not stop or replace `~/.sdd/sdd-mcp`.

## Lesson / guidance

After a stdio tool-registration change, refresh Cursor's MCP server to pick up `src/mcp/stdio.ts`. Rebuild and place `~/.sdd/sdd-mcp`, then reload TRAE CN, when the check is the host binary.

## Links

- [ADR-063](../../adr/ADR-063-unregister-sdd-list-versions.md)
- [ADR-051](../../adr/ADR-051-zero-dep-stdio-binary.md)
