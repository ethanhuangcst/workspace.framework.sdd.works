---
title: Cursor slash-invoke is agents/, not templates
type: ops-lesson
status: active
as_of: 2026-09-22
tags:
  - cursor
  - coach-ethan
  - agents
related_spec: specs/agent-ethan/agent-design.md
related:
  - specs/mcp/client.paths.md
  - specs/agent-ethan/agent-test.md
---

# Cursor slash-invoke is agents/, not templates

## Summary

`/ethan` (or `/coach-ethan`) starts whichever Cursor **custom agent** is registered under that frontmatter `name`. Cursor discovers those files from `~/.cursor/agents/` (client root) and `<workspace>/.cursor/agents/` (project). It does **not** discover agents from workspace templates (`<workspace>/.cursor/templates/framework.sdd.works/`).

## Evidence

- Cursor docs and operator path notes: project agents at `.cursor/agents/<name>.md`, user agents at `~/.cursor/agents/<name>.md`. Explicit invoke is `/name`.
- [`client.paths.md`](../../mcp/client.paths.md): Cursor Agents live in `.cursor/agents/` / `~/.cursor/agents/`. Same-name project vs user: **project wins**.
- Design stores: WS-t is the process-template pack (seed for `specs/`), not the slash registry.

## Lesson / guidance

Keep **call-up** and **knowledge load** separate:

1. Install the coach prompt into **`agents/`** (CR for all projects; project `.cursor/agents/` only when this workspace should override).
2. Do not expect a paste of templates (WS-t) to change `/ethan`.
3. After the agent starts, load process files per [`agent-design.md`](../../agent-ethan/agent-design.md) §5: live `specs/` first, then WS-t, then CR templates.

| Agent file location | `/ethan` |
| --- | --- |
| CR `agents/` only | CR agent |
| WS-t only | No agent from WS-t |
| CR `agents/` and WS-t | CR agent |
| CR `agents/` and project `.cursor/agents/` | Project agent |

## Links

- [`agent-design.md`](../../agent-ethan/agent-design.md) §2 Presence
- [`client.paths.md`](../../mcp/client.paths.md) — Cursor agents paths
