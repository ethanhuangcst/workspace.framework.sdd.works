# How an IDE invokes a custom agent

Eight tools are in this file. Cursor, TRAE, and TRAE CN are verified in `specs/knowledge/agent/ide-agent-invoke.md` (2026-09-30). Claude Code, CodeBuddy CN, Cline, Codex, and Copilot CLI are vendor pages from the same day. That note marks those five not verified.

## Shared rules

- A custom agent is a file the user adds so the tool loads that prompt. The pack file is `agents/ethan.md`.
- Onboard (the prompt's ledger read and audit) runs when the transcript has no earlier onboard. The IDE does not store a flag that onboard finished.
- Typing the start gesture again can make the model treat the line as a new start. The IDE did not reload the file.
- Codex reads `*.toml`. Copilot reads `*.agent.md`. A file named `ethan.md` does not start Ethan on those two tools.

### How long a start lasts

| Length | The next message |
| --- | --- |
| Whole chat | The next line in the same chat goes to Ethan. A new chat, a restart, or a reload that drops the thread does not keep Ethan. |
| One reply | Ethan answers that one line. The next line goes to the main agent. |
| Side session | A call can be a separate conversation. The note does not say the parent chat becomes Ethan. |

## Cursor

Verified in `specs/knowledge/agent/cursor-agent-callup.md` (2026-09-22) and `specs/knowledge/agent/ide-agent-invoke.md` (2026-09-30).

### Agent root path

- User file: `~/.cursor/agents/<name>.md`.
- Project file: `<workspace>/.cursor/agents/<name>.md`. The project file wins.
- The frontmatter `name` is the slash name. For this pack the slash name is `/ethan`.
- A copy under templates does not register the agent.
- This repo has no `.cursor/` directory. `/ethan` here loads `~/.cursor/agents/ethan.md`.

### How to invoke

- Type `/ethan` at the start of the chat.

### Lifecycle

Length: whole chat.

#### Same chat

- The chat starts as Ethan.
- Onboard runs because this transcript has no earlier onboard.
- The next job is plain text. Ethan replies in the same chat.
- Ethan should not repeat onboard for that plain-text job.

#### A new transcript

- A new chat, a restart, or a reload that drops the thread has no earlier onboard.
- A plain-text line in that transcript does not start Ethan.
- Type `/ethan` again. That chat starts as Ethan, and onboard runs again.

## TRAE

Verified in `specs/knowledge/agent/ide-agent-invoke.md` (2026-09-30). The design records the same call-up on 2026-09-24.

### Agent root path

- The agent file is `~/.trae/agents/ethan.md`.

### How to invoke

- Turn on Settings, Beta, Subagents.
- Type `@`. The built-in agent calls the file when the message matches `description` (the line that says when to call the agent).
- `/ethan` does not start Ethan.

### Lifecycle

#### Side session

- Each call can be a fresh side conversation.
- The note does not say that the next plain-text line in the parent chat stays with Ethan.

## TRAE CN

Verified in `specs/knowledge/agent/ide-agent-invoke.md` (2026-09-30).

### Agent root path

- The agent file is `~/.trae-cn/agents/ethan.md`.

### How to invoke

- Turn on 设置, Beta, Subagents, 启用 Subagents 目录.
- Type `@` or @智能体.
- Only the built-in agent calls the file, and only when the message matches `description` (the line that says when to call the agent).
- `/ethan` does not start Ethan.

### Lifecycle

- The note does not say that the next plain-text line stays with Ethan.

## Claude Code

Not verified. The knowledge note says a slash command comes from skills and `commands/`, not from `agents/`.

Vendor page, read 2026-09-30: https://code.claude.com/docs/en/sub-agents

### Agent root path

- User file: `~/.claude/agents/`.
- Project file: `.claude/agents/`.
- The `name` field is the identity.

### How to invoke

- Name the agent in the prompt. Example: "Use the ethan subagent".
- Type `@` and pick the agent. That pick is one task.
- Start the session with `claude --agent ethan`. That makes Ethan the main thread.
- `/agents` does not open the agent. As of v2.1.198 it prints a reminder to edit the agents folder.

### Lifecycle

#### One task

Length: one reply.

- The line stays in the main thread. Claude writes the task for Ethan.
- Ethan starts with a fresh context and does not see the parent chat.
- The result comes back to the main thread.
- The next line stays with the main thread. The next Ethan task needs another mention, or another `@` pick.

#### `claude --agent ethan`

Length: whole chat for that session.

- The flag replaces the main system prompt for the session.
- The next line is plain text. Ethan replies.
- Resume restores Ethan. If the agent file is gone at resume, the default prompt continues and Claude shows a warning.

## CodeBuddy CN

Not verified. The knowledge note says this client has an agent list and the gesture is not checked.

Vendor pages, read 2026-09-30: https://www.codebuddy.cn/docs/ide/Features/Subagents, https://www.codebuddy.cn/docs/ide/User-guide/Slash-Commands, and https://www.codebuddy.cn/docs/cli/sub-agents

### Agent root path

- The path map lists `~/.codebuddy/agents/`.
- User scope and project scope are Markdown files.
- A slash command (`/name`) is a file under `commands/`, including `~/.codebuddy/commands/`. That folder is not the agent folder.

### How to invoke

#### Vendor pages

- Agentic mode: the main agent calls the file when the task matches `description`.
- Manual mode: the user picks the agent in the Agent box. That pick replaces the main agent.
- CLI: name the agent in the prompt.
- CLI: `--agent` starts the session as that agent.
- CLI: `--agents` passes a JSON definition for one run.
- A third-party page says type `@` plus the name. That gesture is not on the vendor pages above.

#### Tester line

- A tester typed `/ethan onboard` on 2026-09-30.
- The knowledge note does not record that line.
- The slash page does not list `agents/ethan.md` as `/ethan`.

### Lifecycle

#### Agentic mode

Length: one reply.

- The run has a separate context. The user waits, or the user interrupts. The user cannot type into the run.
- The next task stays with the main agent.
- Ethan runs again when that task matches `description`.

#### Manual mode

Length: whole chat, until another pick.

- The next line goes to Ethan.
- Ethan stays until the user picks another agent.
- The vendor pages do not say who replies after a window reload.

#### CLI

- Naming Ethan in the prompt is one request.
- `--agents` applies to that one run.
- `--agent` starts the session as Ethan. The next line in that session goes to Ethan.
- The vendor pages do not say who replies after a `--agent` session resumes.

#### Tester line

- The vendor pages do not say who replies to the next plain-text line after `/ethan onboard`.

## Cline

Not verified. The knowledge note lists `~/.cline/agents/ethan.md`. That folder was not in the 2026-09-17 marker run.

Plugin note, read 2026-09-30: https://github.com/cline/cline/blob/main/sdk/examples/plugins/agents-squad/README.md

### Agent root path

- Knowledge note and path map: `~/.cline/agents/`.
- Plugin project files: `.cline/agents/`.
- Plugin global files: `~/.cline/data/settings/agents/`.
- The plugin global folder and `~/.cline/agents/` are not the same folder.

### How to invoke

- The parent session calls `start_subagent` with the preset `name`.
- The plugin note has no slash that turns this chat into that agent.

### Lifecycle

#### Side session

- The call returns a session id and runs in the background.
- A follow-up to that run uses the session id.
- A new task is a new `start_subagent` call.
- The plugin note does not say that the session id ends when the window reloads.

## Codex

Not in the knowledge matrix. Vendor page, read 2026-09-30: https://developers.openai.com/codex/subagents

### Agent root path

- User file: `~/.codex/agents/*.toml`.
- Project file: `.codex/agents/*.toml`.
- Required fields are `name`, `description`, and `developer_instructions`.
- The `name` field is the identity.
- `ethan.md` is not a Codex agent file.

### How to invoke

- Ask Codex to delegate to the `name` in the TOML file.
- `/agent` switches among threads that are already running.
- `/agent` does not create the agent.

### Lifecycle

#### Side session

- Codex spawns that agent in a separate thread. The main thread collects the result.
- The next line in the main chat stays with Codex.
- The next delegation is a new spawn.
- GitHub issues 15250 and 26408 report that some tool-backed sessions still cannot spawn a project agent by name.

## Copilot CLI

Not in the knowledge matrix. Vendor page, read 2026-09-30: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/invoke-custom-agents

### Agent root path

- User file: `~/.copilot/agents/*.agent.md`.
- Repository file: `.github/agents/*.agent.md`. A user file wins over a repository file with the same name.
- The id is the file name without `.agent.md`.
- The profile file is `ethan.agent.md`. `ethan.md` is not a profile.

### How to invoke

- Type `/agent` and pick the profile.
- Or name the agent in the prompt.
- Or run `copilot --agent=ethan --prompt "..."`.

### Lifecycle

#### `/agent`

- The next prompt goes to the selected profile.
- The page does not say that a later turn in the same session stays on that profile.
- A later turn needs another `/agent` pick, or the prompt names the agent.

#### One command

- `copilot --agent=ethan` applies to that command. The next command needs the flag again.
- A prompt that names the agent is that one request.
