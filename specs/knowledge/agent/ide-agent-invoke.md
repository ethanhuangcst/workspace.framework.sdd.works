---
title: IDE agent invoke differs by client
type: ops-lesson
status: active
as_of: 2026-09-30
tags:
  - ethan
  - call-up
  - ide
related_spec: specs/framework/framework-design.md
related:
  - specs/mcp/client.paths.md
  - specs/framework/framework-test.md
  - specs/knowledge/agent/cursor-agent-callup.md
---

# IDE agent invoke differs by client

## Summary

`agents/ethan.md` is the same prompt on every client. The gesture that loads it is not. Onboard (the prompt's once-per-chat ledger and audit) follows the chat transcript. The IDE does not store a flag that onboard already finished.

## Verified

| Client | Start Ethan | `/ethan` | Agent file |
| --- | --- | --- | --- |
| Cursor | `/ethan` at the start of the chat. Later jobs in that chat are plain text. | Starts that chat as Ethan. A project file `<workspace>/.cursor/agents/ethan.md` wins over `~/.cursor/agents/ethan.md`. | `~/.cursor/agents/ethan.md` |
| TRAE | `@` after Subagents is enabled. The built-in Agent calls the file when the message matches `description`. Each call can be a fresh side conversation. | Does not start Ethan. | `~/.trae/agents/ethan.md` |
| TRAE CN | `@` or @智能体. Only the built-in Agent calls the file, and only after 设置 > Beta > Subagents > 启用 Subagents 目录 is on. | Does not start Ethan. | `~/.trae-cn/agents/ethan.md` |

## Not verified

These clients have a documented agent folder. Call-up and whether a second message stays with Ethan are not checked. Do not write them as `/ethan` behavior.

| Client | Agent file | What is known |
| --- | --- | --- |
| Claude Code | `~/.claude/agents/ethan.md` | Slash commands come from skills and `commands/`, not from `agents/`. |
| CodeBuddy CN | `~/.codebuddy/agents/ethan.md` | The client has an agent list. The gesture is not checked. |
| Cline | `~/.cline/agents/ethan.md` | Documented folder. Not in the 2026-09-17 marker run. |

Codex agents are `.toml` files. Copilot agents are `.agent.md` files. A copy of `ethan.md` in those folders is not a verified start. They stay out of the matrix until a root is recorded.

## Onboard

Onboard runs when a chat has no earlier onboard in its transcript. A new chat, a restart, or a reload that drops the thread runs it again. The same chat keeps the beginning, so Ethan should not repeat it. Typing the invoke gesture again can make the model treat the message as a new start even though the IDE did not reload the file.
