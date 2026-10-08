# How an IDE starts a custom agent (Ethan)

The pack ships `agents/ethan.md`. Each IDE loads agent files from its own folder. This page covers where to put the file, how to start Ethan, and when you must invoke Ethan again for the next reply.

**Verified here (2026-09-30):** Cursor, TRAE, TRAE CN.

**Vendor docs only (same date):** Claude Code, CodeBuddy CN, Cline, Codex, Copilot CLI.

**Shared notes**

- Onboard runs on Ethan’s first pass in a chat (ledger and audit when the prompt says so). A new chat can run onboard again.
- Codex uses `*.toml` agent files. Copilot CLI uses `*.agent.md`. Plain `ethan.md` alone does not register on those tools.

## Invoke Ethan again (three patterns)

| Pattern | What happens |
| --- | --- |
| Same chat | Keep the thread open. Ethan answers follow-ups until you start a new chat. |
| One task | Ethan finishes one job. The main assistant gets the next line. Invoke Ethan again for the next job. |
| Separate thread | Ethan runs in another conversation. The main chat usually stays on the main assistant. |

## Cursor

| Topic | Detail |
| --- | --- |
| Agent file | `~/.cursor/agents/ethan.md` or `<project>/.cursor/agents/ethan.md` (project wins). Frontmatter `name` is the slash command `/ethan`. Nothing under `templates/` registers. |
| Start Ethan | Type `/ethan`, usually at the start of the chat. |
| Invoke Ethan again | Same chat. Follow-ups in that thread stay with Ethan. |
| New chat | Plain text does not start Ethan. Use `/ethan` again. Onboard may run again. |

## TRAE

| Topic | Detail |
| --- | --- |
| Agent file | `~/.trae/agents/ethan.md` |
| Setup | Settings → Beta → turn Subagents on. |
| Start Ethan | Type `@`. The built-in agent calls Ethan when your message matches `description` in the file. `/ethan` does not work. |
| Invoke Ethan again | Separate thread. The parent chat is not guaranteed to stay on Ethan. |

## TRAE CN

| Topic | Detail |
| --- | --- |
| Agent file | `~/.trae-cn/agents/ethan.md` |
| Setup | 设置 → Beta → Subagents → 启用 Subagents 目录. |
| Start Ethan | `@` or @智能体 when the message matches `description`. `/ethan` does not work. |
| Invoke Ethan again | Separate thread. Same as TRAE. |

## Claude Code

| Topic | Detail |
| --- | --- |
| Agent file | `~/.claude/agents/` or `.claude/agents/` (Markdown). Slash commands live under `commands/`, not `agents/`. |
| Start Ethan (one task) | Mention Ethan in text, or `@` and pick Ethan. |
| Invoke Ethan again (one task) | One task. Main Claude gets the next line. Ethan does not see the full parent chat. |
| Start Ethan (session) | `claude --agent ethan` |
| Invoke Ethan again (session) | Same chat in that terminal until you leave the session or remove the agent file. |
| Note | `/agents` only points you at the agents folder (v2.1.198). |

## CodeBuddy CN

| Topic | Detail |
| --- | --- |
| Agent file | `~/.codebuddy/agents/` (user or project). `/ethan` slash commands live under `commands/`, not `agents/`. |
| Start Ethan (agentic) | Main agent delegates when the task matches `description`. |
| Invoke Ethan again (agentic) | One task. Main agent holds the thread until it delegates again. |
| Start Ethan (manual) | Pick Ethan in the Agent box. |
| Invoke Ethan again (manual) | Same chat until you pick another agent. |
| CLI one shot | Name Ethan in the prompt, or `--agents` JSON for one run. |
| CLI session | `--agent ethan`. Later lines in that session go to Ethan. |

## Cline

| Topic | Detail |
| --- | --- |
| Agent file | `~/.cline/agents/` or project `.cline/agents/`. `~/.cline/data/settings/agents/` is a different plugin path. |
| Start Ethan | Parent calls `start_subagent` with the preset `name`. No slash command to switch this chat to Ethan. |
| Invoke Ethan again | Separate thread. Follow-ups use the subagent session id. Each new task needs a new call. |

## Codex

| Topic | Detail |
| --- | --- |
| Agent file | `~/.codex/agents/*.toml` or `.codex/agents/*.toml` (`name`, `description`, `developer_instructions`). Not `ethan.md`. |
| Start Ethan | Ask Codex to delegate to the TOML `name`. |
| Invoke Ethan again | Separate thread. Each delegation is a new spawn. `/agent` switches threads. It does not create an agent. |
| Known gaps | Some sessions may not spawn a project agent by name (GitHub issues 15250, 26408). |

## Copilot CLI

| Topic | Detail |
| --- | --- |
| Agent file | `~/.copilot/agents/*.agent.md` or `.github/agents/*.agent.md` (user wins over repo). Id is the basename without `.agent.md` (e.g. `ethan.agent.md`). |
| Start Ethan (interactive) | `/agent` and pick the profile, or name Ethan in the prompt. |
| Invoke Ethan again (interactive) | Docs do not promise the profile sticks. Use `/agent` again or name Ethan in the prompt. |
| One shot | `copilot --agent=ethan --prompt "..."` |
