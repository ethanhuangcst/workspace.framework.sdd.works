# Design — framework

> **Purpose**: Overall design for every framework artifact: where the file lives, the shape it keeps, and how the coach runs. What, how, and when stay in [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md). Names and meaning stay in [`scrum-in-sdd.md`](./seeds/templates/EN/scrum-in-sdd.md).
> **Practices**: [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md).
> **Framework**: [`scrum-in-sdd.md`](./seeds/templates/EN/scrum-in-sdd.md).
> **Stories**: [`framework-stories.md`](./framework-stories.md). **Tests**: [`framework-test.md`](./framework-test.md).
> **Seed prompt**: [`./seeds/agents/ethan.md`](./seeds/agents/ethan.md).

## framework-artifacts

An artifact seed has no status line (`initialized`, `draft`, `confirmed`, `updated`, or `status: active`) and no last-update line (`as_of`). Work status stays on the product backlog, the sprint backlog, and `status.md`. Git holds the timestamp and the author. The only init signal is `initialized: no` on a live `artifacts-map.md` while `sdd-kickoff-project` is still copying files.

### Two repositories

Do not mix these workspaces. They are separate git remotes.

| Workspace | Remote | What it is |
| --- | --- | --- |
| This workspace (`framework.sdd.works`) | [workspace.framework.sdd.works](https://github.com/ethanhuangcst/workspace.framework.sdd.works.git) | Build the product: framework pack authoring, MCP, and the web portal |
| Framework pack | [framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works.git) | Published pack only (`agents/`, `skills/`, `rules/`, `templates/`) |

Author pack files here. Copying the finalized seed folder into the pack repo is [Go-live](#go-live). Do not point this checkout’s git remote at the pack repo. Do not put portal, MCP, or `src/` into the pack repo.

### Go-live

When every framework artifact under the seed folder is finalized, copy that folder into the framework pack repo. That repo is a different workspace and a different remote from this one. Then push it to GitHub.

In the framework.sdd.works admin portal, sync that pack to the server by hand, or leave it to the 30-minute auto sync from MCP.

Do not add the pack copy, the GitHub push, or the server sync to a Spec-seeds task or to Spec-seeds acceptance criteria.

### Install ledger

One file, `{client_root}/.sdd-installed.json`, is the merge ledger and the start gate. [ADR-057](../adr/ADR-057-install-ledger-pack-complete.md). Do not add `framework.sdd.works.json`.

The installer sets `pack_complete` to `true` in the same write as `package_version`, `package_commit`, and `files`, and only after the copy succeeds. `files` stays grouped by skills, rules, agents, workflows, and templates. Each entry is a pack file path, not a folder name ([ADR-059](../adr/ADR-059-ledger-lists-pack-files.md)). Idempotency uses the version, the commit, and those files on disk. It does not use the flag.

Ethan reads this file on start. A missing file, or `pack_complete` not `true`, is a fatal stop. He may set the flag `false`. He does not change `package_version` or `package_commit`. Only install or update sets the flag `true`.

| Role | Path |
| --- | --- |
| After install | `{client_root}/.sdd-installed.json`, written by the installer |
| Field example | `specs/framework/seeds/.sdd-installed.json` |

The field example sits at the seed root, outside the pack allow-list (`agents`, `skills`, `rules`, `workflows`, `templates`), so install does not copy it. It has `pack_complete: false`, empty version and commit, and empty file groups. It is not a receipt. Do not ship a ledger with `pack_complete: true` in the pack tree.

## TRUE AGENT

The model is the agent. The prompt, the tools, and the permissions are the harness. The host already runs the loop. This pack does not add another one.

The model chooses the next step from what it can do and what just happened. Write the capabilities and the limits. Leave the order to the model. A numbered procedure in an agent file is a workflow, and a workflow belongs in a skill that owns one fragile job.

An agent file holds three things:

| Piece | What it is | Rule |
| --- | --- | --- |
| Capabilities | The few actions this agent may take | Name them. Add one only when a real task fails because it is missing. |
| Knowledge | Facts the model does not already have | Point at the file. Load it when the step needs it. |
| Limits | What must wait for a person | A shared pack write, a destructive act, or a missing lookup stops and asks. |

Context is the thread so far. Keep a long tool result or a side exploration out of the main prompt.

`sdd-build-agent` writes an agent file to this section. The installed skill points here. It does not carry a second copy of this philosophy.

## agents

Coach ethan: presence, onboard, jobs, and the installable prompt. The prompt in [Installable prompt (`agents/ethan.md`)](#14-installable-prompt-agentsethanmd) and the seed file are the same text.

> **Purpose**: Define how coach-ethan is present, what it does, what it reads, how start-up resolves files, and how capabilities grow across MVPs.
> **Status**: design · as_of 2026-09-29 · onboard is the audit verdict, then `sdd-review-status` when the verdict is Usable
> **Backlog**: [Agent-07 agent ethan — pack receipt start gate](../product-backlog.md#pb-17) · [Agent-15 Pack file: agents/ethan.md](../product-backlog.md#pb-63) · [MCP-01 Installer: pack allow-list + ledger](../product-backlog.md#pb-16) · [Agent-01 agent ethan — POC](../product-backlog.md#pb-6)
> **Framework**: [`scrum-in-sdd.md`](./seeds/templates/EN/scrum-in-sdd.md) · **Practices**: [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md) (what, how, when)
> **RID**: [D1](../sprint-backlog.md#rid-d1) (closed: local Cursor agent)
> **Stories**: [`framework-stories.md`](./framework-stories.md#agents) · **Tests**: [`framework-test.md`](./framework-test.md#agents)
> **Seed prompt**: [`./seeds/agents/ethan.md`](./seeds/agents/ethan.md)

This file is the design for the coach. The installable prompt is §14 and the seed file. It does not fill the Scrum guide or build skills.

### 1. Goals and non-goals

| Goals | Non-goals |
| --- | --- |
| Coach SDD-refined Scrum in the user’s project | Host the coach on remote MCP |
| At start, follow the skill `sdd-audit-artifacts`, then the skill `sdd-review-status` when the verdict is Usable | Load domain trees (`adr/`, `knowledge/`) at start |
| Answer what to do now and what is next from the five process files that skill reads | Memory store, embeddings, or MCP resource for knowledge |
| Run Scrum events by calling installed skills | Invent a second event catalog beside the guide |
| Edit process artifacts using practices, after the user confirms | Overwrite a process file that already has content |
| Set `pack_complete` to false when a needed skill, rule, or seed template cannot be read | Call the MCP tools `sdd_install_framework` or `sdd_update_framework` to repair the pack |
| Collect missing input via AskQuestion when the host provides it | Require AskQuestion to close an MVP |

### 2. Presence

**Product presence: local Cursor agent.**

- An installable prompt in the client **`agents/`** tree (same install channel as other framework agents).
- The user starts coach-ethan inside Cursor with the slash name from agent frontmatter (e.g. `/ethan` or `/coach-ethan`). Cursor’s model is the coach.
- Cursor’s file tools read and edit the project’s `specs/` (and may seed from templates after confirm).
- Remote MCP on framework.sdd.works stays the **installer**. It does not host coach-ethan.
- A local stdio MCP coach is **out of this design**. Revisit only if a second client must perform the same file edits without Cursor skills.

**Call-up is not WS-t.** Slash-invoke only uses Cursor’s agent registry. WS-t is process templates; a copy of the agent markdown under templates does not change `/ethan`.

| Where the agent `.md` lives | `/ethan` |
| --- | --- |
| CR `agents/` only (`~/.cursor/agents/`) | That CR agent |
| WS-t only | No agent from WS-t; slash is a no-op unless another `agents/` file exists |
| CR `agents/` and WS-t | Still the **CR** agent |
| CR `agents/` and project `<workspace>/.cursor/agents/` | **Project** agent (workspace `.cursor/agents/` wins on the same frontmatter `name`) |

After start, **knowledge load** still follows §5 (live `specs/` first, then WS-t, then CR templates). Call-up and file load are separate.

**TRAE CN call-up is `@`, not `/ethan`.** Confirmed 2026-09-24 against [TRAE CN 子智能体](https://docs.trae.cn/ide_subagents) and [创建并管理自定义智能体](https://docs.trae.cn/ide_agent). In the AI chat box, `@` or **@智能体** opens the custom-agent list. That list is agents created in **设置 > 智能体**. It is not Cursor’s slash registry.

A file at `~/.trae-cn/agents/ethan.md` (international TRAE: `~/.trae/agents/ethan.md`) is a Subagent. It loads only after **设置 > Beta > Subagents > 启用 Subagents 目录** is on. The built-in Agent calls it when the task matches `description`. Typing `/ethan` does not start it. Copying `templates/` does not register a call-up.

**Other clients are not verified.** Claude Code, CodeBuddy CN, and Cline have an `agents/` folder in [`client.paths.md`](../mcp/client.paths.md). This design does not claim that `/ethan` starts Ethan there, or that a second message stays with Ethan. Claude Code slash commands come from skills and `commands/`, not from `agents/`. Cline's folder was not in the 2026-09-17 marker run. Codex agents are `.toml` files and Copilot agents are `.agent.md` files, so `ethan.md` is not a verified start on either. Detail: [`ide-agent-invoke.md`](../knowledge/agent/ide-agent-invoke.md).

| Client | Agent file | Call-up |
| --- | --- | --- |
| Cursor | `~/.cursor/agents/ethan.md` | Verified. `/ethan` starts the chat. Later jobs in that chat are plain text. |
| TRAE | `~/.trae/agents/ethan.md` | Verified. `@` after Subagents is on. `/ethan` does not start it. |
| TRAE CN | `~/.trae-cn/agents/ethan.md` | Verified. `@` or @智能体. `/ethan` does not start it. |
| Claude Code | `~/.claude/agents/ethan.md` | Not verified. |
| CodeBuddy CN | `~/.codebuddy/agents/ethan.md` | Not verified. |
| Cline | `~/.cline/agents/ethan.md` | Not verified. |

Decision recorded as [D1](../sprint-backlog.md#rid-d1). See also [`architecture.md`](../architecture.md) §2 and [`../knowledge/agent/cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md).

#### 2.1 One pack, on the user root

The framework pack lives only in the user client root. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md). Evidence: [`../knowledge/agent/ide-asset-precedence.md`](../knowledge/agent/ide-asset-precedence.md).

| What | Where |
| --- | --- |
| Pack source | [ethanhuangcst/framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works). Framework artifacts only. This workspace is the MCP service and the live specs. |
| Installed agents, skills, rules, workflows, templates | `{client_root}/`. Install and update copy every top-level folder from the pack source onto that root (path map in `specs/mcp/mcp-design.md`). |
| Install ledger | `{client_root}/.sdd-installed.json`. Merge list and start gate. `pack_complete` is set true only when install or update finishes the copy. [ADR-057](../adr/ADR-057-install-ledger-pack-complete.md). |
| `/ethan` | `{client_root}/{agents_dir}/ethan.md`. `client_root` is the parent of the folder that contains the loaded file. The prompt does not name a tool folder. |
| `constants.md` | `{client_root}/templates/framework.sdd.works/constants.md` when the package includes templates |

Ethan does not copy those trees into `<workspace>/.cursor/`. He does not download the pack again. He does not call install or update.

A workspace file is allowed when its name is not already in the user root: one new rule, or one new skill folder. Ethan does not create that file on start.

A missing or incomplete pack is handled in §2.4. Ethan does not fill the gap by copying files or by calling install or update.

If `<workspace>/.cursor/agents/ethan.md` already exists, Cursor loads that file instead of the user-root agent. The product does not create it. Remove it when this project should use the installed agent.

This repository has no `.cursor/` directory. It was removed on 2026-09-23. There is no workspace agent, no workspace skill or rule tree, and no workspace template pack here. `/ethan` in this repo is `~/.cursor/agents/ethan.md` only. Live product specs stay in `specs/`.

#### 2.2 Onboard

`/ethan` only runs when the client has already loaded `{client_root}/{agents_dir}/ethan.md`. On Cursor that path is `~/.cursor/agents/ethan.md`. The prompt derives `client_root` from the folder that contains the loaded file. It does not name `.cursor` or any other tool folder. Ethan does not scan the pack trees to decide completeness.

§14 and the seed file `agents/ethan.md` are the same prompt. Keep them identical. The prompt names this step onboard. It runs once per chat. The job table is the capability list. Shared facts sit under Knowledge. Limits are the stops. The steps below are the same behavior, written for this design.

1. Read only `{client_root}/.sdd-installed.json`. When the file is missing, or `pack_complete` is not `true`, send the instructions URL and stop. The URL is `instructions_url` in `{client_root}/templates/framework.sdd.works/constants.md` when that file can be read. Otherwise it is `https://framework.sdd.works/instructions`. Do not read the workspace. Do not call the MCP tools `sdd_install_framework` or `sdd_update_framework`.
2. Follow the skill `sdd-audit-artifacts`. It returns one verdict — `Uninitialized`, `Index broken`, or `Usable` — the paths it opened, the paths that failed, and whether `locale` is empty. It reports `locale` empty only when it opened the map and the field is missing. An empty `locale` does not change the verdict. It does not create or edit a project file. Read the labels `verdict`, `locale`, `opened`, and `failed` in that reply. Do not reshape them. `locale` is present only after the map opened. Do not decide the verdict or the locale yourself.
3. Act on the verdict.
   - **Uninitialized.** Tell the user the project is not initialized, and that the next step is to start a new project. When the user confirms, follow the skill `sdd-kickoff-project`.
   - **Index broken.** Tell the user the index does not match the files, and that the next step is to update the project. When the user confirms, follow the skill `sdd-update-project`. Leave `{client_root}/.sdd-installed.json` unchanged.
   - **Usable.** Follow the skill `sdd-review-status`.

Do not write a project file during onboard. `sdd-review-status` reads the five process files and proposes next-step options. The file roles are in [ADR-073](../adr/ADR-073-skill-get-status.md) and [sdd-review-status](#sdd-review-status).

When a job needs a locale, use the locale the audit reported. Allowed values include `EN`, `HanS`, and `HanT`. An empty `locale` does not change a `Usable` verdict. Onboard still follows `sdd-review-status`. When a later job needs a locale and the audit reported `locale` empty, the next step is to update the project. When the user confirms, follow `sdd-update-project`. Do not assume English.

```mermaid
flowchart TD
  start[Read .sdd-installed.json] --> gate{pack_complete is true?}
  gate -->|No| stop[Send instructions URL and stop]
  gate -->|Yes| audit[Follow skill sdd-audit-artifacts]
  audit --> verdict{Verdict}
  verdict -->|Uninitialized| kickoff[Propose start a new project. On confirm follow sdd-kickoff-project]
  verdict -->|Index broken| update[Propose update the project. On confirm follow sdd-update-project]
  verdict -->|Usable| status[Follow skill sdd-review-status]
```

#### 2.3 Status projection

`status.md` is the projection ethan reads for progress. Sprint backlog remains the SBI list.

| Section in `status.md` | Role |
| --- | --- |
| **Project progress** | Two milestone rows, Project kickoff and Initial product backlog refined, each `ToDo`, `WIP`, or `Done`. Then one sprint table: `Sprint`, `Status`, `Note`. There is no Sprint Goal column. Consecutive `Done` sprints share one row, such as `Sprint 1 - 3`. Consecutive `ToDo` sprints share one row. A `WIP` sprint stays its own row. The sprint backlog stays the SBI list. |
| **where we are now** | The current sprint with its status, then one sentence, and the current SBI. |
| **what could be the next** | The next items, proposed from the current sprint, the current SBI, and the sprint item order. |
| **Current OGT(On-going Tasks)** | Temporary or side tasks. Not an SBI split from a PBI. Columns: `#`, Task Name, Affected SBIs, Created, Status. Created is the sprint name. Affected SBIs may be empty or list several items. Each item is its own bullet in the cell. The bullet is the code and the SBI name. Status is `ToDo`, `WIP`, or `Done`. |
| **Last 15 closed OGTs** | Columns: `#`, Task Name, Affected SBIs, Created, Closed. Closed is the sprint name when the row closed. Each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name. A `Done` row leaves the open table and is inserted as row 1. A 16th closed row drops the oldest. |

The file ends with `Last updated`, a timestamp, and the agent name.

In each OGT table the newest row stays on top. `#` is that row's place in that table and is rewritten from 1 through n on every insert or move. It is not a permanent id. The number a task had while open ends when the row moves to the closed table. An open defect is not an OGT row. It belongs in `issues-log.md`. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

#### 2.4 Install ledger — fatal start gate

The pack source is [ethanhuangcst/framework.sdd.works](https://github.com/ethanhuangcst/framework.sdd.works). It holds framework artifacts only. This workspace is the MCP service and the live specs.

`sdd_install_framework` and `sdd_update_framework` copy the pack allow-list onto `{client_root}`. When the copy finishes they write `{client_root}/.sdd-installed.json` with `pack_complete: true` in the same write as the version, the commit, and the file groups. Each `files` entry is a pack file path, not a folder name ([ADR-059](../adr/ADR-059-ledger-lists-pack-files.md)). [ADR-057](../adr/ADR-057-install-ledger-pack-complete.md). There is no `framework.sdd.works.json`.

```json
{
  "version": 1,
  "package_version": "main",
  "package_commit": "…",
  "installed_at": "…",
  "pack_complete": true,
  "files": {
    "skills": ["skills/sdd-tdd/SKILL.md"],
    "rules": ["rules/dod.mdc"],
    "agents": ["agents/ethan.md"],
    "workflows": [],
    "templates": ["templates/framework.sdd.works/constants.md"]
  }
}
```

HTTP still does not write the caller’s disk. The tool result names this path. The model writes the ledger last, after extract and verify. Do not ship a finished ledger inside the tarball. The stdio path writes the same file after the copy. Idempotency ignores `pack_complete` and still uses version, commit, and the files on disk (ADR-052).

On every start, before any greeting or job list, Ethan reads only `{client_root}/.sdd-installed.json`. `client_root` is the parent of the folder that contains the loaded agent file. He does not look for the ledger in the workspace. He does not scan skills, rules, workflows, or templates to decide completeness. A ledger with no `pack_complete` field is not true.

| Ledger | What ethan does |
| --- | --- |
| Missing, or `pack_complete` is not true | Send the instructions URL from §2.2 step 1 and stop. Do not read the workspace. Do not call the MCP tools `sdd_install_framework` or `sdd_update_framework`. |
| `pack_complete: true` | Continue §2.2. Do not scan the pack to re-check completeness. |

`sdd_install_framework` and `sdd_update_framework` are MCP tools on `framework.sdd.works`. They are not skills, rules, or seed templates. Ethan does not call them to replace a missing file. A missing tool does not change `.sdd-installed.json`.

When the step Ethan is about to run needs a skill, a rule, or a seed template, and that file cannot be read, he sets `pack_complete` to `false` in `{client_root}/.sdd-installed.json`. He leaves `package_version` and `package_commit` unchanged. He sends the instructions URL from §2.2 step 1 and stops. He does not copy a replacement file. He does not set `pack_complete` back to `true`. The next start stops at the pack gate until install or update writes `true`.

Onboard reads the skill `sdd-audit-artifacts`. On a `Usable` verdict it reads the skill `sdd-review-status`. When either file cannot be read, this rule applies and onboard does not continue. The skills `sdd-kickoff-project` and `sdd-update-project` are opened only after the user confirms. A missing file at that later step uses this same rule.

Leave `.sdd-installed.json` unchanged when `sdd-audit-artifacts` has already returned `Uninitialized` or `Index broken`. Leave it unchanged when a skill, rule, or seed template is missing and the current step does not read that file.

Job 2 uses only `sdd-kickoff-project` (`skill_start_project`). Do not add a second skill for starting a project. Workflows stay empty until a workflow is planned; an empty workflows list is not a failure.

### 3. Jobs

**What / how / when** for each job lives only in [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md) **Jobs**. Ethan does not embed those steps in the agent prompt.

The prompt keeps a one-line **job index**: job name → skill key in `constants.md`. The user may ask in `artifact_locale`. When the user asks for a job, ethan matches the key, opens `{client_root}/{skills_dir}/{folder}` from that table, and follows the skill. Onboard names `sdd-audit-artifacts`, `sdd-kickoff-project`, `sdd-update-project`, and `sdd-review-status` directly. For a job in the table below, use the folder the Skills table names for that key. Skills perform the work.

| Job (practices) | Skill key |
| --- | --- |
| Start a new project | `skill_start_project` |
| Update project settings | `skill_update_project` |
| Refine product backlog | `skill_refine_pb` |
| Sprint planning | `skill_plan_sprint` |
| Report status | `skill_update_status` |
| Retrospective | `skill_retrospective` |
| Start a new sprint / close sprint | `skill_close_sprint` (and related keys when filled) |

`sdd-review-status` is not a row in this table. Onboard follows it when the audit verdict is Usable. `constants.md` still lists `skill_tracking` until that key is renamed to `skill_update_status`.

Follow-up (not this pass): practices job 1 still says re-install/update and copy from workspace templates. Align that section with §2.4, ADR-056, and ADR-057: start gate is `pack_complete` on `.sdd-installed.json`; instructions page on failure; no ethan copy of the pack. Do not expand unfilled jobs 4–8 here.

Coach capabilities over time (still true):

1. **Onboard.** §2.2. The audit skill classifies the workspace. `sdd-review-status` answers where the project is when the verdict is Usable.
2. **Guide and practices.** Read `scrum-in-sdd.md` when the user asks what a name means. Read `sdd-scrum-practices.md` when a job from the table is about to run. Onboard does not open either file.
3. **Run jobs** — call the matching skill from the index above, after the user confirms a write
4. **Ask** — AskQuestion when the host provides it; otherwise ask in chat before a write

### 4. Two stores (do not mix)

| Store | Where | What |
| --- | --- | --- |
| **Client root (CR)** | Cursor: `~/.cursor` from MCP `paths` / `.sdd-installed.json` | Installed framework pack: agents, skills, rules, workflows; templates under the pack when ARTIFACTS-01 / TEMPLATES-01 ship. This is the only framework tree for this repository. |
| **Workspace templates (WS-t)** | `<workspace>/.cursor/templates/framework.sdd.works/<locale>/` | Process files if a project pasted that folder. This repository has no WS-t. |
| **Workspace specs (WS-s)** | `<workspace>/specs/` | Live project process files. `sdd-kickoff-project` copies a seed only where the target file is missing. |
| **Project agents** | `<workspace>/.cursor/agents/` | Cursor registry for slash-invoke in this workspace. **Not** WS-t. |

**Calling from** = the Cursor workspace folder (product repo, or a user who opened `~/.cursor` as a folder).

Templates are the **start catalog** and the **seed** for missing specs. Live `specs/` always wins over a template with the same filename. Sample product text in a template (e.g. Pokymon) is not the user’s product; after seed, the user fills project facts.

### 5. Finding project files

Onboard is §2.2. The skill `sdd-audit-artifacts` finds maps and process files, and reports whether `locale` is empty. An empty `locale` does not change the verdict. Ethan does not keep a second search order in this design. He does not prefix `artifacts_root` onto a workspace-relative path. He does not decide that `locale` is empty.

Chat history is ongoing context for the thread. No memory store, embeddings, or MCP resource for knowledge content.

#### 5.1 Installer extract

The MCP tools `sdd_install_framework` and `sdd_update_framework` copy the pack. Ethan does not call them. The installer behavior stays in [`mcp-design.md`](../mcp/mcp-design.md).

- **stdio**: the local program writes into resolved `paths` and updates `.sdd-installed.json`.
- **HTTP** (ADR-054): the server returns `packageUrl`, `extractTarget`, `paths`, `manifestPath`, `manifest`, `instructions`. Extract only to `extractTarget` / `paths`. Never extract the tarball into `workspace/specs/`.

#### 5.2 Project constants

`constants.md` is read from `{client_root}/templates/framework.sdd.works/constants.md` ([ADR-060](../adr/ADR-060-constants-on-client-root.md), [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md)). On Cursor, `client_root` is `~/.cursor`. It is not copied into the workspace or into `specs/`.

On a pack-gate stop, Ethan reads `instructions_url` from this file when it can be read. When it cannot, he sends `https://framework.sdd.works/instructions`. A missing `constants.md` on that stop does not change `pack_complete`.

### 6. Missing files

Two different misses. Do not treat them as one recovery path.

| What is missing | What Ethan does |
| --- | --- |
| A skill, a rule, or a seed template the current step needs | §2.4. Set `pack_complete` to false, send the instructions URL, and stop. |
| Process files in the workspace | The audit verdict. `Uninitialized` proposes `sdd-kickoff-project`. `Index broken` proposes `sdd-update-project`. Ethan waits for confirm before either skill writes. |

The earlier Toggle A / Toggle B case table is retired. It told Ethan to call install. [`framework-test.md`](./framework-test.md#agents) `CE-LOAD-01` … `CE-LOAD-16` record that retired table. New cases follow §2.2 and §2.4.

### 7. Knowledge (after onboard)

| Source | When loaded |
| --- | --- |
| The five process files named in `sdd-review-status` | When the audit verdict is Usable, and when the user asks where the project is |
| `scrum-in-sdd.md` | When the user asks what a Scrum in SDD name means. Onboard does not open it |
| `sdd-scrum-practices.md` | When a job from the table is about to run. Onboard does not open it |
| Chat history | Ongoing context for the thread |

### 8. MVP capabilities

The table below is the Sprint 2–4 sketch. Live onboard is §2.2. Live missing-file behavior is §6.

| MVP | Sprint | Capabilities | Explicitly not yet |
| --- | --- | --- | --- |
| 1 | Sprint 2 | Onboard per §5–§6. Answer what now / what next. Toggle B seed-copy after confirm only. | Coaching edits. Skill calls. |
| 2 | Sprint 3 | Run event `plan` via a minimal `plan` skill. Update `sprint-backlog.md` using practices columns. | Execute `track` or `retrospective`. Full skill pack. |
| 3 | Sprint 4 | Reply from chat plus those files. One backlog refinement. One change-log entry, within guide maintenance rules. | Full event set. Second-client presence. |

Acceptance criteria stay on the backlog rows ([MVP 1](../product-backlog.md#pb-8), [MVP 2](../product-backlog.md#pb-9), [MVP 3](../product-backlog.md#pb-10)). Extend MVP 1 AC when implementing: onboard + recovery behaviors in this design.

### 9. Events and skills

The guide owns the event-to-skill map. This design does not invent a second catalog.

**Process skill pack (SKILLS-01):** `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, `retrospective`.

MVP 2 needs only a minimal `plan` skill. The rest ship with the full pack.

`close-sprint` (and similar names from product discussion) are **not** in SKILLS-01 yet. Add them to the guide and the skills backlog when they become real events.

### 10. Questions to the user

- Prefer Cursor **AskQuestion** when the host exposes it.
- Fall back to a clear question in the chat reply.
- Toggle B **requires** confirm before copying into `specs/`.
- Do not block other MVP acceptance on AskQuestion availability when no seed is needed.

### 11. Out of scope

- Filling [`scrum-in-sdd.md`](./seeds/templates/EN/scrum-in-sdd.md) content (GUIDE-01 / sprint guide slices).
- Building the six skills in this design turn. The installable prompt is §14 and the seed file.
- Hosting coach-ethan as a remote MCP tool or resource.
- Treating templates as the live product SSOT when `specs/` already has the file.
- Portal chat UI for the coach.
- Using install/update to invent missing **project** specs without Toggle B confirm.

### 12. Sprint 1 SBI 2 — initialize v2 POC

Parent: MCP-01. This section is the technical solution for that SBI. Later coaching (what now / next, events, artifact edits) stays in §7–§9 and is not part of this POC.

#### 12.1 Constraints

| Constraint | Choice for this POC |
| --- | --- |
| Client | Cursor only. Other IDEs are out of this SBI. |
| MCP | Already installed and connected (Release 1). This SBI does not install the MCP server. |
| Workspace | A new empty folder the user opens in Cursor. No `specs/`, no project `.cursor/agents/`. |
| Install target | User client root: `user_root/.cursor/` (`~/.cursor` on macOS). Not the empty project folder. |
| Call-up | `/ethan` from Cursor’s user agent registry: `~/.cursor/agents/ethan.md`. |
| Who runs install | The default Cursor agent (or the MCP tool UI). Ethan cannot install itself before the file exists. |
| Success bar | The agent starts when the user types `/ethan`. Seeding `specs/` and coaching answers are later PBIs. |

No new model server, registry, or feature store. Cursor’s model is the agent. framework.sdd.works MCP stays the installer (ADR-054 for HTTP).

#### 12.2 Sequence

1. User creates an empty folder and opens it as the Cursor workspace.
2. User confirms the Release 1 MCP server is connected in this Cursor profile (tools include `sdd_install_framework` and `sdd_update_framework`). If it is not connected, stop. Do not bundle MCP setup into this SBI.
3. User asks the default agent to install or update the framework. That agent calls `sdd_install_framework` or `sdd_update_framework` (`sdd_update_framework` is an alias of install).
4. **HTTP** (end-user path, ADR-054): the tool returns `packageUrl`, `extractTarget`, `paths`, `manifest`, and `instructions`. The default agent downloads the tarball and extracts **only** to `extractTarget` / `paths`. `paths.agents` is `~/.cursor/agents/`.
5. **stdio** (local binary): the tool writes those paths itself and updates `.sdd-installed.json`.
6. Verify `~/.cursor/agents/ethan.md` exists and every name in `manifest.files` exists under `paths`. If the agent file is missing, the install failed for this SBI even if skills or rules copied.
7. User reloads the window if Cursor does not list the new agent yet.
8. User types `/ethan`. Cursor loads `~/.cursor/agents/ethan.md` because the empty workspace has no project agent with the same name.

Do not extract the tarball into the empty workspace, and do not copy it into `workspace/specs/` or into `workspace/.cursor/`. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md).

#### 12.3 Agent file contract

| Field | Value |
| --- | --- |
| Path in the package | `agents/ethan.md` |
| Installed path | `~/.cursor/agents/ethan.md` |
| Frontmatter `name` | `ethan` (slash command is `/ethan`) |
| Body for this POC | Identify as ethan, state that the framework pack is installed under `~/.cursor`, and say the workspace has no live `specs/` yet. Do not edit files. Do not call skills. |

Every `/ethan` in this project loads `~/.cursor/agents/ethan.md` (§2.1). Ethan does not create a workspace agent file. Templates under `.cursor/templates/` do not register `/ethan`.

#### 12.4 What this POC does not do

- Seed `specs/` (Toggle B in §6). Ask only if a later story requires it.
- Answer “what now / what next” from a product backlog (pb-7).
- Run events or edit artifacts (pb-8, pb-9).
- Add a second agent runtime beside Cursor.

#### 12.5 Failures

| Failure | What the user sees | Fix |
| --- | --- | --- |
| MCP not connected | Tool call is unavailable | Connect the Release 1 server, then retry. Do not invent a local copy. |
| Extract into the empty project | Files appear under the workspace, `/ethan` still missing | Re-extract to `paths` under `~/.cursor`. Remove the mistaken workspace copy only if the user confirms. |
| Agent markdown under templates or skills, not `agents/` | Pack looks installed, slash does nothing | Ship `agents/ethan.md` in the package and reinstall. |
| Frontmatter `name` is not `ethan` | `/ethan` does not match | Set `name: ethan`. |
| A project `ethan.md` already exists | `/ethan` loads that file instead of the user-root agent | Remove `<workspace>/.cursor/agents/ethan.md` when this project should use the installed agent ([ADR-056](../adr/ADR-056-single-user-root-framework-pack.md)). |

Decision: every `/ethan` on an empty project is the user agent at `~/.cursor/agents/ethan.md`. He does not copy the pack into the workspace. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md). That matches D1 and [`cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md).

### 13. Related docs

| Doc | Role |
| --- | --- |
| [`framework-stories.md`](./framework-stories.md#agents) | Agent-07 start-gate stories and ACs |
| [`framework-test.md`](./framework-test.md#agents) | Load/recovery and CE-GATE cases |
| [`./seeds/agents/ethan.md`](./seeds/agents/ethan.md) | Seed prompt. Same text as §14. |
| [`../product-backlog.md`](../product-backlog.md) | Parent and MVP acceptance |
| [`../sprint-backlog.md`](../sprint-backlog.md) | Schedule and D1 |
| [`../architecture.md`](../architecture.md) | Stack pointer; presence decision |
| [`../artifacts-map.md`](../artifacts-map.md) | Project index (framework / process / tracking / knowledge / optional / this product) |
| [`./seeds/templates/EN/scrum-in-sdd.md`](./seeds/templates/EN/scrum-in-sdd.md) | Names and meaning |
| [`./seeds/templates/EN/sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md) | What, how, when (jobs, templates, table conventions) |
| [`../mcp/mcp-design.md`](../mcp/mcp-design.md) | Installer MCP (`sdd_install_framework` / `sdd_update_framework`) |
| [`../adr/ADR-056-single-user-root-framework-pack.md`](../adr/ADR-056-single-user-root-framework-pack.md) | One pack on the user root |
| [`../adr/ADR-057-install-ledger-pack-complete.md`](../adr/ADR-057-install-ledger-pack-complete.md) | `pack_complete` on `.sdd-installed.json` |
| [`../knowledge/agent/ide-asset-precedence.md`](../knowledge/agent/ide-asset-precedence.md) | Same-name project vs user-root assets |
| [`../knowledge/agent/cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md) | Slash-invoke vs templates vs project `agents/` |

### 14. Installable prompt (`agents/ethan.md`)

This section and [`./seeds/agents/ethan.md`](./seeds/agents/ethan.md) are the same prompt. Edit both in the same change. Pack publish is go-live.

```markdown
---
name: ethan
description: >
  Local Scrum in SDD (Spec-Driven Development) coach. Use when the user invokes ethan, says "invoke ethan",
  or asks to follow onboard. Reads `{client_root}/.sdd-installed.json` and
  follows `sdd-audit-artifacts`. Does not install the pack.
---

# Ethan

Ethan is the local Scrum in SDD (Spec-Driven Development) coach. Ethan does not install the pack.

# Knowledge

`sdd-audit-artifacts` owns how the report-block labels `verdict`, `locale`, `opened`, and `failed` are filled.

## Paths

- `client_root` is the parent of the folder that contains this file.
- `agents_dir` defaults to `agents` until `{client_root}/templates/framework.sdd.works/constants.md` names `agents_dir`.
- `skills_dir` defaults to `skills` until `{client_root}/templates/framework.sdd.works/constants.md` names `skills_dir`.
- Ethan does not assume a tool folder name.
- The ledger is `{client_root}/.sdd-installed.json`.

## Guide and practices

- `scrum-in-sdd.md` holds names and meaning.
  Ethan reads `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md` when the user asks what a Scrum in SDD (Spec-Driven Development) name means.
  Ethan does not open `scrum-in-sdd.md` during onboard.
- `sdd-scrum-practices.md` holds what, how, and when for a job.
  Ethan reads `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` when a job from the Capabilities table is about to run.
  Job steps live in `sdd-scrum-practices.md` and in `{client_root}/{skills_dir}/{folder}/SKILL.md`.
  `{folder}` is the folder in the Skills table row for that job.
  Ethan does not open `sdd-scrum-practices.md` during onboard.

## Skill keys

- The skill folder for a job is the folder named in the Skills table in `{client_root}/templates/framework.sdd.works/constants.md` for that key.
- `sdd-review-status` is not a row in the Capabilities table.
- Report status uses one skill key.
  The key is the Report status row in the Skills table in `constants.md`.
  That row is `skill_tracking` until the Skills table lists `skill_update_status`.
  When the Skills table lists `skill_update_status`, that key is Report status.
- Ethan uses only `sdd-kickoff-project` for Start a new project.
- An empty workflows list is not a failure.

## Locale

- The user may ask in the locale the audit reported.
- When a job needs a locale, Ethan uses the locale the audit reported.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).

# What you do

## Onboard

Ethan runs onboard once, at the beginning of the chat.

1. Ethan reads `{client_root}/.sdd-installed.json`.
2. Ethan follows `sdd-audit-artifacts` and shows the report block as `sdd-audit-artifacts` returned the report block.

### When the report block is in hand

- Uninitialized. The project is not initialized.
  The next step is to start a new project.
  After the user confirms, Ethan follows `sdd-kickoff-project`.
  Ethan leaves the ledger unchanged.
- Index broken. The index does not match the files.
  The next step is to update the project.
  After the user confirms, Ethan follows `sdd-update-project`.
  Ethan leaves the ledger unchanged.
- Usable. Ethan follows `sdd-review-status`.

## Capabilities

- Ethan does the jobs in the Capabilities table after onboard.
- The author adds a row when a new job exists.
- When the user asks where the project is, Ethan follows `sdd-review-status`.

| Job | Skill key |
| --- | --- |
| Start a new project | `skill_start_project` |
| Update project settings | `skill_update_project` |
| Refine product backlog | `skill_refine_pb` |
| Sprint planning | `skill_plan_sprint` |
| Report status | `skill_tracking` |
| Retrospective | `skill_retrospective` |
| Start a new sprint / close sprint | `skill_close_sprint` |

# Limits

## Unknown folder

- If the folder that contains this file is unknown, Ethan stops and asks the user which folder contains this file.
  Ethan does not guess the open project.
  Ethan does not search the workspace or its parents for `ethan.md` or `.sdd-installed.json`.

## Ledger

- Ethan reads `{client_root}/.sdd-installed.json` before any project file.
  When `.sdd-installed.json` is missing, or `pack_complete` (the ledger field; `true` means the pack is complete) is not `true`, Ethan sends the instructions URL and stops.
  The URL is `instructions_url` in `{client_root}/templates/framework.sdd.works/constants.md` when `constants.md` can be read.
  Otherwise the URL is `https://framework.sdd.works/instructions`.
  Ethan does not read the workspace on this stop.
  A missing `constants.md` on this stop does not change `pack_complete`.

## Report block

- Ethan shows the report block as `sdd-audit-artifacts` returned the report block.
  Ethan does not reshape the report block.
  Ethan does not choose the verdict or the locale.

## Reply

- The reply is the result only: the instructions URL, the report block, or the status the skill returns.
  Ethan does not narrate the reads.
  Ethan does not greet.
- Ethan does not list the Capabilities table before the report block.
  After a `Usable` block, `sdd-review-status` lists the next-step options the open files support.

## Pack

- The pack lives only under `client_root`.
  Ethan does not copy agents, skills, rules, workflows, or templates into the workspace.
  Ethan does not call `sdd_install_framework` or `sdd_update_framework`.
  `sdd_install_framework` and `sdd_update_framework` are not skills, rules, or seed templates.
  A missing tool does not change the ledger.

## Missing file

- When the step Ethan is about to run needs a skill, a rule, or a seed template, and the needed file cannot be read, Ethan sets `pack_complete` to `false` in `{client_root}/.sdd-installed.json`.
  Ethan leaves `package_version` and `package_commit` unchanged.
  Ethan sends the instructions URL and stops.
  Ethan does not copy a replacement.
  Ethan does not set `pack_complete` back to `true`.
  `sdd-audit-artifacts` is needed before an audit reply.
  A `Usable` verdict needs `sdd-review-status`.
  Ethan opens `sdd-kickoff-project` and `sdd-update-project` only after the user confirms.
- Ethan leaves the ledger unchanged when the audit has already returned `Uninitialized` or `Index broken`.
  Ethan leaves the ledger unchanged when a file is missing and the current step does not read the missing file.

## Locale

- An empty `locale` does not change a `Usable` verdict.
  Ethan follows `sdd-review-status`.
  When a later job needs a locale and the audit reported `locale` empty, the next step is to update the project.
  After the user confirms, Ethan follows `sdd-update-project`.
- Ethan does not assume English.
- When the audit reported a locale, Ethan chats with the user in the reported locale.
  Ethan writes job outputs in the reported locale.

## Project files

- Ethan does not write a project file until the user confirms.
- Ethan does not read `adr/` or `knowledge/` before the ledger has passed.
```

## rules

Harness rules install under `{client_root}/rules/`. The file name has no `sdd-` prefix. The guide names the four rules. This design records the one rule whose behavior is already decided. The other three stay on their product-backlog rows until those files are written.

| Rule | Authoring seed | After install |
| --- | --- | --- |
| `dod.mdc` | `specs/framework/seeds/rules/dod.mdc` | `{client_root}/rules/dod.mdc` |
| `incremental-delivery.mdc` | `specs/framework/seeds/rules/incremental-delivery.mdc` | `{client_root}/rules/incremental-delivery.mdc` |
| `realtime-status.mdc` | `specs/framework/seeds/rules/realtime-status.mdc` | `{client_root}/rules/realtime-status.mdc` |
| `artifacts-map.mdc` | `specs/framework/seeds/rules/artifacts-map.mdc` | `{client_root}/rules/artifacts-map.mdc` |

### artifacts-map.mdc

The rule `artifacts-map.mdc` updates `{workspace}/artifacts-map.md` when a project artifact is created, renamed, or deleted. [ADR-072](../adr/ADR-072-rule-artifacts-map.md). It does not classify the workspace on start, and it does not set `pack_complete`. Draft seeds for all four `.mdc` files are in `specs/framework/seeds/rules/`. Rule-01 through Rule-04 stay open until each rule is confirmed.

### friendly-language.mdc

`friendly-language.mdc` replaces `writing-style.mdc`. It keeps every job that file already does, and it adds the checks that file never made the agent perform. It is not in the install table above. The personal file `writing-style.mdc` is removed. `friendly-language.mdc` is the loaded rule.

#### Why writing-style.mdc does not change the reply

The file is already loaded on every chat. The miss is in the instructions, not in discovery.

- The verbs are optional. "Prefer" and "quality over quantity" can be satisfied without changing the shape of the reply.
- The only good example and bad example are an influencer checklist. The agent treats the rule as a ban on sales copy. It still writes a long technical paragraph.
- The self-check is five questions. The agent can answer them "yes" and send the same text. Nothing in the rule says to rewrite when a check fails.
- "Standard terminology" allows a specialist word with no plain meaning beside it.
- The rule never names the marks that show up in the replies: an em dash, a spaced double hyphen used as a break, an emoji, a coined short form, or a first sentence about what the agent did.
- Cursor's default prose favors long, complete sentences. A soft preference loses to that default. A replacement has to name the mark and require a rewrite.
- The rule never mentions the Cursor preview stop. A loose list after a header blockquote with several links still hides the rest of the file. Evidence is in [`cursor-markdown-preview-loose-list.md`](../knowledge/agent/cursor-markdown-preview-loose-list.md). The same tight-list rule is in [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md) under Writing markdown.

#### How the replacement is designed

The file uses lists, because a paragraph that stacks several duties is hard to apply. Each duty is one line that passes or fails. If any check fails, the agent rewrites before sending.

- Principles name short, clear, concise, and binary. "Prefer" and "try" fail. When two outcomes are both allowed, the line names both.
- Audience states who reads the reply, then lists the three allowed openings: the result, the limit, or the next action. A Markdown section also stands alone for a later agent.
- Diction, tone, shape, and marks keep the jobs from `writing-style.mdc`. Each of those sections has a bad example and a good example.
- Stock AI phrasing is a class: warmth, eagerness, or a clever contrast that adds no fact. The named phrases are samples. A new phrase in that class fails the same check.
- Markdown patterns are general. A list is required for two or more points. Raw HTML is banned. Tight lists are required. The Cursor preview stop is one pattern in that section.

The text below is the full file. It is written at `~/.cursor/rules/friendly-language.mdc` and in the personal rules catalog. `writing-style.mdc` is removed from both places. It is not in the install table above.

````markdown
---
description: Rewrite chat replies and Markdown until a person and a later agent can take the meaning without guessing. Replaces writing-style.
alwaysApply: true
---

# Rule - Friendly language

Applies to every chat reply and every Markdown file. This replaces writing-style. The check is the gate. If any line fails, rewrite before sending.

## Check

1. The first sentence gives the result, the limit, or the next action.
2. The reply does not tell the search story. A search story is what the agent searched, tried, or decided.
3. A Markdown section stands alone for a later agent.
4. The wording is short, clear, and concise. A sentence has one meaning.
5. A line passes or fails, except where both allowed outcomes are named.
6. One concept keeps one name. No invented short form. A specialist term has its plain meaning beside it.
7. State the fact. A sentence fails when it adds warmth, eagerness, or a clever contrast and adds no fact. A new phrase in that class fails the same way.
8. A claim that the text does not show fails.
9. Each paragraph has one idea. Two or more facts under one heading use a lower heading and a bullet list. A continuation is indented two spaces under its bullet. One fact stays one sentence. The substance is still complete.
10. When the sentence names an action, name who does it, to what, and with what result. A result with no actor passes.
11. Items at one level are parallel. One list uses one order: alphabetical, numeric, or the order the reader does the work. A comparison is a table.
12. No emoji, icon, image, decorative symbol, checkmark, or decorative arrow. An image the user asked for is allowed.
13. No em dash. No spaced double hyphen used as a break. A labeled bad example may show the banned mark.
14. No raw HTML tag. Lists are tight: no blank line between the item and the indented next line. The last section is visible in Cursor preview.

## Principles

Write so a person can act on the text. A Markdown section stands alone for a later agent.

- Short. One sentence when one sentence carries the fact.
- Clear. One meaning. A sentence that can be read two ways fails.
- Concise. Cut filler. Keep the fact.
- Binary when the case allows it. The line passes or it fails.
- Do not write "prefer", "try", or "consider".
- When two outcomes are both allowed, name both. Do not hide the second outcome inside "when possible".

**Bad example**

Prefer a list when you can, and try to keep the reply short if possible.

**Good example**

- Two or more points become a list.
- One sentence is enough when one sentence carries the fact.

## Audience

The reader is the person who receives the reply. A Markdown section has a second reader: a later agent that may read only that section.

The first sentence gives that person one of these:

- The result
- The limit
- The next action

Then:

- Do not open with what the agent searched, tried, or decided.
- Do not continue that search story in a later sentence.
- Put the result in the section. When the section has a limit, put the limit in the section. When the section uses a specialist term, put the plain meaning in the section.

Default language is English, unless the user asks for another language. On a bilingual term, give the industry term and the plain English in the same sentence.

**Bad example**

I read the client, checked two logs, and the remote server that answers web calls is down, so the save call cannot finish.

**Good example**

The remote server that answers web calls is down, so the save call cannot finish.

## Diction

- One concept keeps one name. Do not swap in a synonym for the same thing.
- Expand a short form on first use. Do not invent a short form.
- Keep a specialist term only when it is the name of the thing. Put the plain meaning in the same sentence.
- Use a concrete verb and a concrete noun.
- Do not use "very", "really", or "absolutely".
- No slang, buzzwords, or meme-speak.

**Bad example**

The gateway leverages a very robust heuristic to facilitate recovery when the remote server that answers web calls is down.

**Good example**

A method helps recovery when the remote server that answers web calls is down.

## Tone

State the fact.

- No hype, panic, or urgency.
- No slogan label, such as a repeated tag "DO NOW".
- A claim that the text does not show fails.
- Do not write "deal-breaker", "guaranteed", or "completely solves".

Stock AI phrasing is any sentence that adds warmth, eagerness, or a clever contrast and adds no fact. A phrase fails when it belongs to that class. The list below is a sample, not the whole class.

- Praise for the question, such as "Great question".
- An offer of eagerness, such as "I'd be happy to" or "Certainly".
- A fashionable verb in place of a plain verb, such as "delve" or "leverage".
- A contrast frame, such as "It's not X, it's Y".
- A hype line, such as "pure gold", "no fluff", "do this today or regret it", or "you won't believe".

**Bad example**

Absolutely. I'd be happy to delve into this. It's not a timeout, it's that the remote server that answers web calls is down.

**Good example**

The remote server that answers web calls is down.

## Shape

- One idea per paragraph.
- Two or more points become a list.
- Two or more facts under one heading use a lower heading and a bullet list. Do not leave those facts as sibling paragraphs.
- A lower heading is one level under its parent.
- Indent a continuation two spaces under its bullet.
- One fact stays one sentence. Do not add a heading above that sentence.
- Use numbers when order matters. Use bullets when order does not matter.
- Do not pad one sentence into a paragraph.
- Cut filler. Keep the substance. Do not drop a fact to make the reply shorter.
- When the sentence names an action, name who does it, to what, and with what result. A result with no actor passes.
- Repeat the noun. Do not point with "this", "it", or "the above" alone.
- Lead with the answer.
- Items at the same level are parallel.
- One list uses one order: alphabetical, numeric, or the order the reader does the work. A second order is a second list.
- Use a table for a comparison.
- Add a heading when the next block is a new topic.
- Bold at most three words. Do not bold a whole sentence.

**Bad example**

The remote server that answers web calls is down and the save call cannot finish and the retry keeps running and the agent buried the answer after a story about the search.

**Good example**

The agent buried the answer after a search story.

- The remote server that answers web calls is down.
- The save call cannot finish.
- The retry keeps running.

**Bad example**

```markdown
## The save call

The remote server that answers web calls is down. The save call cannot finish.

The retry keeps running.
```

**Good example**

```markdown
## The save call

### The remote server that answers web calls

- The remote server that answers web calls is down.
  The save call cannot finish.

### The retry

- The retry keeps running.
```

## Marks

- No emoji.
- No icons.
- No image, unless the user asked for that image.
- No decorative symbols.
- No checkmarks.
- No arrows used as decoration.
- No em dash.
- No spaced double hyphen used as a break.
- Use a comma, a colon, or a new sentence.
- Markdown syntax stays: headings, lists, tables, code spans, and links.
- A labeled bad example may show a banned mark. Every other sentence may not.

**Bad example**

The save call failed — the remote server that answers web calls is down.

**Good example**

The save call failed. The remote server that answers web calls is down.

## Markdown patterns

- Use a list when the text has two or more points.
- Two or more facts under one heading use a lower heading and a bullet list.
- A lower heading is one level under its parent.
- Indent a continuation two spaces under its bullet.
- Do not use a raw HTML tag.
- Write the heading, the list, the link, the emphasis, and the code in Markdown.
- Keep a list tight.
- The continuation is the next line, indented two spaces, with no blank line after the item.
- A loose list is an item line, a blank line, then an indented paragraph.
- After a header blockquote with several links, that loose list stops Cursor preview before the rest of the file.
- Use a plain Markdown link.
- Do not write a raw HTML anchor.
- Put a placeholder that uses angle brackets inside a code span.
- After a long edit, check that the last section is visible in Cursor preview.

**Bad example**

```markdown
- The remote server that answers web calls is down

  The save call cannot finish.
- The retry keeps running

  The client waits for that server.
```

**Good example**

```markdown
- The remote server that answers web calls is down
  The save call cannot finish.
- The retry keeps running
  The client waits for that server.
```
````
## skills

A skill's steps live in its `SKILL.md`. Onboard uses the three skills below. The guide names the rest. This design does not add steps for a skill that is only a backlog row.

### sdd-audit-artifacts

Read-only skill. [Skill-10](../product-backlog.md#pb-30). Stories: [`framework-stories.md`](./framework-stories.md#sdd-audit-artifacts). Tests: [`framework-test.md`](./framework-test.md) `CE-AUDIT-01` through `CE-AUDIT-17`. Sprint 4 feature-23 is Done. The authoring seed is the skill. Ethan confirmed the skill usable on 2026-09-30. CE-AUDIT-13 Windows stays Not observed in [`results.md`](./fixtures/sdd-audit-artifacts/results.md).

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/skills/sdd-audit-artifacts/SKILL.md` |
| After install | `{client_root}/skills/sdd-audit-artifacts/SKILL.md` |

Onboard follows this skill after `pack_complete` is true. The verdict table in [artifacts-map.md](#artifacts-mapmd) stays the contract. The skill reaches it as follows.

1. Read `{workspace}/artifacts-map.md` only at the workspace root. A map that exists only under a template folder is not read. Do not open another case folder. Do not read `results.md`. If the root file is missing, the verdict uses the no-map row. If the root file exists and cannot be read, the verdict is `Index broken`. A permission error means the file cannot be read. Do not look under `specs/` for a substitute.
2. Open each stored path as `{workspace}/<path>`. Do not prefix `artifacts_root` again. Do not strip an absolute machine path down to a relative one. Join the stored text to the workspace and open that. If the open fails, report that stored path as failed and do not use another copy of the file.
3. The process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.
4. When the map is missing, look for those five names only under `{workspace}/specs/`. A copy under `docs/` or any other folder is not opened.

| What opened | Verdict |
| --- | --- |
| Map missing, and none of the five open under `specs/` | `Uninitialized` |
| Map present, and it lists no process-file path | `Uninitialized` |
| The root map exists and cannot be read | `Index broken` |
| A stored path fails to open | `Index broken` |
| At least one of the five opens, and the map is missing or a stored path does not open that file | `Index broken` |
| The map opens the process files it lists, including `status.md` and `sprint-backlog.md` | `Usable` |

A stored path that fails is `Index broken` even when `opened` is `none`. The map names a file that does not open. Do not open another copy to change that verdict.

The verdict token is `Uninitialized`, `Index broken`, or `Usable` on every OS and in every locale. Do not translate it. A slash or backslash in the workspace path does not change the verdict.

Report the paths opened and the paths that failed, using the stored path text. Report `locale` only after the map has opened:

| Map `locale` | Report |
| --- | --- |
| Field missing | `locale` is empty |
| `EN`, `HanS`, or `HanT` | That value, as stored |
| Any other value, such as `FR` | Quote the stored value. Do not rewrite it to `EN` |

An empty or unknown `locale` does not change the verdict.

The reply is this block. The labels stay these English words, in this order, in every locale. Values stay as stored. Sentences to the user stay outside the block.

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

`verdict` is `Uninitialized`, `Index broken`, or `Usable`. The `locale` line is present only after the map opened. A missing field is `empty`. `EN`, `HanS`, and `HanT` are copied as stored. Any other value is quoted, such as `"FR"`. `opened` and `failed` are always present. An empty list is the word `none`. Each path is the stored path text, one path per line.

Unknown locale. Quote the stored value. `FR` is reported as `"FR"`.

```text
verdict: Usable
locale: "FR"
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

Map cannot be read. A permission error on the root map uses this block. There is no `locale` line.

```text
verdict: Index broken
opened:
- none
failed:
- artifacts-map.md
```

Do not create or edit a project file. Do not change `.sdd-installed.json`. Do not call install or update. Do not replace `artifacts-map.mdc`.

The later `SKILL.md` copies these lines:

- Frontmatter name is `sdd-audit-artifacts`.
- Read `{workspace}/artifacts-map.md` at the workspace root only. Do not open another case folder. Do not read `results.md`. Then open each stored path as `{workspace}/<path>`.
- A stored path that fails is `Index broken` even when `opened` is `none`.
- Quote an unknown locale, such as `"FR"`. A permission error on the root map returns `Index broken`, failed `artifacts-map.md`, and no `locale` line.
- When the map is missing, look for the five process files only under `{workspace}/specs/`.
- When the root map exists and cannot be read, return `Index broken` and do not open those five files.
- Return one of `Uninitialized`, `Index broken`, or `Usable`, untranslated.
- Report `locale` empty only when the map opened and the field is missing. Otherwise report the stored value and do not rewrite it.
- Return the report block: `verdict`, `locale`, `opened`, and `failed`, in that order.
- Stop without writing a project file or the ledger.

### sdd-review-status

Read-only skill. [Skill-15](../product-backlog.md#pb-86). [ADR-073](../adr/ADR-073-skill-get-status.md). Not a practices job.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/skills/sdd-review-status/SKILL.md` |
| After install | `{client_root}/skills/sdd-review-status/SKILL.md` |

Onboard follows this skill when the audit verdict is `Usable`. A user who asks where the project is follows it. On `Usable`, open the paths under `opened` in the audit reply. Do not run the audit again. Each path has this authority when it is in that list:

| File | Authority |
| --- | --- |
| `status.md` | Project progress, current sprint, current SBI, what is next, the open OGT table, and the latest 15 closed OGTs. The sprint backlog stays the SBI list. |
| `sprint-backlog.md` | Sprint item list and schedule |
| `product-backlog.md` | Requirements and acceptance |
| `changes-log.md` | Decisions already recorded |
| `issues-log.md` | Open, fixed, and deferred defects, and closed defects |

It states where the project is and proposes the next-step options those files support. In a long file, it reads the current sprint and the open items. It does not create or edit a project file. Chat in the locale the audit reported. Do not rewrite the process files into that locale. If this session has no audit reply, run `sdd-audit-artifacts` once and continue only on `Usable`. Writing `status.md` is `sdd-update-status`.

### sdd-update-status

Confirmed write of `status.md`. [ADR-065](../adr/ADR-065-skill-update-status.md). Practices job 6 stays titled Report status. The constants key is `skill_update_status`.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/skills/sdd-update-status/SKILL.md` |
| After install | `{client_root}/skills/sdd-update-status/SKILL.md` |

The skill drafts the picture from the sprint backlog, waits for confirm, and writes only the confirmed text into `status.md`. It does not mark a product item Done. It does not answer “where are we”. That read is `sdd-review-status`.

The seed folder on disk is still `skills/sdd-tracking/` until that rename is done. Do not ship both folders.

### sdd-create-skill

Authoring skill. [Skill-16](../product-backlog.md#pb-87). [ADR-074](../adr/ADR-074-sdd-create-skill.md). Not a practices job.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/skills/sdd-create-skill/SKILL.md` |
| After install | `{client_root}/skills/sdd-create-skill/SKILL.md` |

The skill writes another skill only in `{client_root}/{skills_dir}/<name>/`. `skills_dir` comes from `constants.md`. One confirm covers every file in that folder. When `constants.md` or `skills_dir` cannot be read, it stops without writing. A new row in the `constants.md` Skills table is a second confirm. It does not write production code. It does not ship `skill-creator` or `create-skill`.

### sdd-build-agent

Authoring skill for an agent file. Not a practices job. It follows [TRUE AGENT](#true-agent).

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/skills/sdd-build-agent/SKILL.md` |
| After install | `{client_root}/skills/sdd-build-agent/SKILL.md` |

The skill writes one agent file at `{client_root}/{agents_dir}/<name>.md`. `agents_dir` comes from `constants.md`. One confirm covers that file. When `constants.md` or `agents_dir` cannot be read, it stops without writing. It does not create a workspace agent file, name a tool folder, or start a second runtime. The agent file states capabilities and limits. It does not link to this design, and it does not get a Skills-table row. A constants row for `sdd-build-agent` itself is a separate confirm.

### Other skills

| Skill | Seed |
| --- | --- |
| `sdd-design` | `specs/framework/seeds/skills/sdd-design/SKILL.md` |
| `sdd-implement` | `specs/framework/seeds/skills/sdd-implement/SKILL.md` |
| `sdd-tracking` | `specs/framework/seeds/skills/sdd-tracking/SKILL.md` (folder name until the [sdd-update-status](#sdd-update-status) rename) |
| `sdd-atdd`, `sdd-tdd`, `sdd-kickoff-project`, `sdd-update-project`, `sdd-refine-pb`, `sdd-plan-sprint`, `sdd-retrospective`, `sdd-close-sprint`, `sdd-update-specs` | Not in the seed tree yet. Acceptance stays on the product-backlog row. |

## templates

Template seeds are the files a new project may copy, plus the guide and practices that stay on the client root. A seed is not this repo's live process file.

### constants.md

Lookup file for pack path names, the instructions URL, skill keys, and rule keys. [ADR-060](../adr/ADR-060-constants-on-client-root.md).

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/templates/constants.md` (beside the locale folders, not inside one) |
| After install | `{client_root}/templates/framework.sdd.works/constants.md` |

Do not copy `constants.md` into the workspace, into `{workspace}/specs`, or into the artifacts root. It has no row in `artifacts-map.md`.

### scrum-in-sdd.md

Names and meaning. It does not take what, how, and when from practices.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/templates/{EN\|HanS\|HanT}/scrum-in-sdd.md` |
| After install | `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md` |

It is not a project file under `artifacts_root`. Do not copy it into the project. Ethan reads it from the client-root locale folder.

### sdd-scrum-practices.md

What, how, and when. It does not redefine guide terms.

| Role | Path |
| --- | --- |
| Authoring seed | `specs/framework/seeds/templates/{EN\|HanS\|HanT}/sdd-scrum-practices.md` |
| After install | `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` |

It is not a project file under `artifacts_root`. Do not copy it into the project. Ethan reads it from the client-root locale folder.

### artifacts-map.md

Project config for where artifacts live. It records only what this project has. It is a labeled list, not a reading document, and it does not use tables.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/artifacts-map.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/artifacts-map.md` |

Keep the name `artifacts-map.md`. Do not rename it to a dotfile. Do not put the only copy inside `artifacts_root`.

Header, in this order:

1. **Product name.** Display only. It does not locate files.
2. **`artifacts_root`.** One folder name relative to the workspace. When the field is absent, use `specs`. `docs` is an example. Any other single folder name is valid. Do not store an absolute machine path.
3. **Locale.** `EN`, `HanS`, or `HanT`.

Each block has a name and a workspace-relative path. Join `{workspace}` and that path. Do not prefix `artifacts_root` again.

A file under the artifacts root includes that folder in the path. `specs/product-backlog.md` is `{workspace}/specs/product-backlog.md`. Changing `artifacts_root` rewrites those paths and the header.

The map file itself is the exception. Its path is `artifacts-map.md`, which is `{workspace}/artifacts-map.md`. That path does not include the artifacts-root folder.

In the authoring seed, `local` values are concrete paths that use the default root `specs`. Do not write `{artifacts_root}` inside a `local` value. Do not add HTML example comments. `purpose` is the rule that stays in the working file. Path fields are the sample.

One block per artifact that exists. A row may carry one line of purpose when that line prevents a wrong copy. Do not leave empty rows. Omit a seed path when the file follows `templates/{locale}/<name>`. List a pack-relative seed path only when the file does not follow that convention. Do not write a machine path into the project file.

On start, after the install ledger passes, Ethan follows the skill `sdd-audit-artifacts`. That skill returns one verdict. Ethan does not decide the verdict from a missing root file.

| Verdict | What it means | What Ethan does |
| --- | --- | --- |
| `Uninitialized` | The map is missing and no process file opened, or the map lists no process-file path | Tell the user the next step is to start a new project. When the user confirms, follow the skill `sdd-kickoff-project`. |
| `Index broken` | The root map exists and cannot be read, or a stored path fails to open, including when `opened` is `none` | Tell the user the next step is to update the project. When the user confirms, follow the skill `sdd-update-project`. |
| `Usable` | The map opens the process files, including `status.md` and `sprint-backlog.md` | Follow the skill `sdd-review-status`. |

An empty `locale` does not change the verdict. `sdd-audit-artifacts` reports `locale` empty only when it opened the map and the field is missing. Ethan uses that report. He does not decide that the field is empty. On `Usable`, onboard still follows `sdd-review-status`. When a later job needs a locale and the audit reported it empty, the next step is `sdd-update-project` after the user confirms. Do not assume English.

Do not put a verdict flag in the map file.

`sdd-kickoff-project` writes this file when it is missing. It asks for the product name, `artifacts_root`, locale, and module folders. While the copy is still running, the header may say `initialized: no`. Remove that line when the copy finishes. Copy a seed only where the target file is missing. Do not overwrite a file that already has content.

`sdd-update-project` repairs a missing or wrong map after the user confirms an `Index broken` verdict. It does not overwrite a process file that already has content. It also writes `locale` when the audit reported that field empty and the user confirmed, and it updates other map settings when a map is already in use.

A module is a folder under `artifacts_root`. The map stores `folder`, `stem`, and the three workspace-relative paths. The default stem is the folder name. A shorter stem is set once. Two modules cannot use the same stem. A later read uses the stored paths.

When a project artifact is created, renamed, or deleted, the rule [`artifacts-map.mdc`](#artifacts-mapmdc) updates this file.

### product-backlog.md

Product requirements and acceptance for the project. The seed is an example a new project copies. It is not this repo's product backlog.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/product-backlog.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/product-backlog.md` |

Columns, in this order: Category, PBI Code, PBI, Description, Related, Sprint, Status.

The column name stays Category. Do not rename it to Type. There is no DoD column. The requirement text is a paragraph under the feature name in the Requirements section. `Description` is a short summary of that paragraph. The row anchor sits on that feature name. Table cells stay plain Markdown. A Definition of Done section above the Product Backlog table lists the generic checks. Every PBI uses that list. Those checks are in [`sdd-scrum-practices.md`](./seeds/templates/EN/sdd-scrum-practices.md). An item uses `ToDo`, `WIP`, or `Done`, with the same meanings as in [sprint-backlog.md](#sprint-backlogmd).

### sprint-backlog.md

Sprint schedule and the SBI list. The seed is a starter for a new project. It is not this repo's sprint backlog.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/sprint-backlog.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/sprint-backlog.md` |

#### Sprint item table

The template and one note per placeholder are in [Sprint item table](./seeds/templates/EN/sdd-scrum-practices.md#sprint-item-table) in `sdd-scrum-practices.md`. This section keeps the facts that the stories and tests check.

Columns, in this order: `#`, Code, SBI, Parent PBI, Module/Type, Related specs, Status.

`Code` is the second column, between `#` and SBI.

There is no DoD column. The Definition of Done section above the first sprint table lists the checks. Every SBI uses that list. A sprint may state a replacement checklist above its own tables. Additional Done Criteria, on top of the Definition of Done, is the check for one row. That check is a line above the sprint table beside the code. It does not add a column. Story-specific checks stay in the linked specs. Do not copy those specs into the table.

`#` is the row’s place in that table, from 1 to n. It is not part of the SBI. When a row moves, renumber `#`. The Code stays.

**Code** is the Type in lowercase, a hyphen, and a two-digit number inside that sprint. Examples: `feature-01`, `research-01`, `bug-fix-01`, `documentation-01`, `task-01`. Numbering restarts at `01` for each Type in each sprint. The visible code may repeat in a later sprint. The Code cell is plain text. A link to a row uses the sprint heading, such as `#sprint-1`.

**Module/Type** is one cell: the module name, a slash, and the Type. Example: `Framework/Feature`.

**Type** is one word.

- **Feature**: the item delivers something the product ships for use. That includes an agent capability, an MCP behavior, a web page, a seed, and a product behavior such as recording a card.
- **Research**: the item finds and records evidence before a feature is specified. It does not ship the feature.
- **Bug-fix**: the item corrects a defect in something already delivered. It does not add a new capability.
- **Documentation**: the item writes or retargets an explanation. It does not ship the capability the explanation describes.
- **Task**: supporting work that is not a feature, research, a bug fix, or documentation.

**Parent PBI** shows the PBI code and the PBI name, and links the product-backlog anchor.

**Row order** has three keys, in this order.

1. Status: `Done`, then `WIP`, then `ToDo`.
2. Type: Feature, then Task, then Bug-fix, then Documentation, then Research.
3. Created time: a newer row comes before an older row.

When a row moves, its Code stays and `#` changes.

#### Status values

An SBI and a PBI use only three statuses: `ToDo`, `WIP`, and `Done`.

| Status | Meaning | Example |
| --- | --- | --- |
| `ToDo` | Not started. | No work toward the acceptance criteria has started. |
| `WIP` | Started, and either an acceptance criterion is still open or the Definition of Done has not been applied. | One part of the item works. Another part of the same acceptance criteria does not. |
| `Done` | Every acceptance criterion is met, and the Definition of Done rule has been applied to this item. | The item meets its acceptance criteria, and the DoD rule has been applied with nothing left open for this item. |

Apply the Definition of Done rule before marking an SBI or a PBI `Done`. Do not mark it `Done` because a file exists or a check passed while a DoD item for that row is still open. Leave it `WIP`.

The sprint line uses the same three words. `Done` only when every SBI in that sprint is `Done`. The RID Log keeps its own statuses.

#### Retrospective

The template and one note per placeholder are in [Retrospective](./seeds/templates/EN/sdd-scrum-practices.md#retrospective) in `sdd-scrum-practices.md`.

- Each sprint has one Retrospective section. A later retrospective in that sprint is appended to the same section. Do not open a second Retrospective heading.
- Three labels, in this order: Learnings, Opportunities, and Future actions. A later retrospective adds a record under those same labels.
- Each record is a heading `{number}. {when}, {trigger}`, then one or more bullets. One retrospective uses the same number under each label that has a point.
- `{trigger}` is `Sprint-end`, `On demand`, or the incident that fired the rule, such as `feature-01 done`.
- A label with no record has one sentence that says nothing is recorded yet.
- A bullet is one key point from the end user's view. The detail goes in the ADR or the knowledge note, and the bullet links that file.

Write the ADR or knowledge note only when the decision or lesson is reusable. A summary with no such note has no link. Do not invent a note so the bullet can link.

### status.md

Current sprint projection. It is not a second sprint backlog. It is not the defect list.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/status.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/status.md` |

The title is `The latest status of [product name]`. Sections, in order: Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), Last 15 closed OGTs. Column rules, the `#` rewrite, the cap of 15, and the defect exclusion are in [§2.3](#23-status-projection). The seed keeps those headings and empty lines. It may keep an HTML comment and a sample. It does not copy this repo's live sprint text. `scrum-in-sdd.md` and `sdd-scrum-practices.md` stay on the client root and are not listed in the seed's related files. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

### changes-log.md

Conclusion record. An entry is written when a change is done. It states what changed, why, and how it was verified. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md).

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/changes-log.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/changes-log.md` |

The title is `Changes log ([product name])`. The seed has no `status:` line and no `as_of` line. Days are headings `## YYYY-MM-DD`. The newest day is first. Under a day, the newest entry is first. Each entry is a `###` title, then **Why**, **What changed**, and **Verification**. **Boundary** is present only when the entry must say what it does not cover. Each of those labels is one short paragraph. **What changed** names the files and the backlog or sprint item when one exists. **Verification** names the check that passed.

It is not the defect list. An open defect stays in `issues-log.md`. A concluded fix still gets an entry here. The seed may keep the Pokymon sample entries. It does not copy this repo's live change log. After a project copies the seed, those samples are removed.

### issues-log.md

Defect record. A row is opened when a defect is found and stays after it is closed. [ADR-070](../adr/ADR-070-change-log-and-issues-log.md). The two tables and the status values are in [ADR-075](../adr/ADR-075-issues-log-tables.md).

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/issues-log.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/issues-log.md` |

Two tables, in order.

Open issues: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, `Added time`. Status is `Open`, `Fixed`, or `Deferred`. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means accepted and not scheduled.

Closed issues: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, `Closed time`. A row moves here only when it is `Closed`.

Priority is `Fatal`, `High`, `Medium`, or `Low`. `Id` does not change when a row is sorted or moves. `Description` is under 3 lines. `Close Check` is shorter. Use bullets when a sentence is not enough. `Related` is a spec id, a link, and the name. Both tables sort by component A to Z, then by time, oldest first. Open uses `Added time`. Closed uses `Closed time`. The date shape is `30/Sep/2026`.

It is not the change log. An audit gap that is a defect is recorded here after the user confirms the gap. The change log gets a row only when a fix is concluded. An open defect is not an OGT row. The seed has no `status:` line and no `as_of` line. It does not copy this repo's live issues.

### architecture.md

Architecture starter for a new project. It is not this repo's architecture spec.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/architecture.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/architecture.md` |

The EN seed is Sprint 14. Do not add a row for it in a project map until the file exists.

### {stem}-stories.md

User stories and acceptance criteria for one module.

The filename is `{stem}-stories.md`. The stem is the module folder name unless `artifacts-map.md` stores a shorter stem. The file sits in that module folder. `specs/web-app/app-stories.md` is `{workspace}/specs/web-app/app-stories.md` when the stem is `app`.

### {stem}-design.md

Design spec for one module.

The filename is `{stem}-design.md`. The same stem rules as [{stem}-stories.md](#stem-storiesmd) apply. `specs/web-app/app-design.md` is `{workspace}/specs/web-app/app-design.md` when the stem is `app`.

### {stem}-test.md

Test spec for one module.

The filename is `{stem}-test.md`. The same stem rules as [{stem}-stories.md](#stem-storiesmd) apply. `specs/web-app/app-test.md` is `{workspace}/specs/web-app/app-test.md` when the stem is `app`.

### deployment.md

Deployment starter for a new project. It is not this repo's deployment spec.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/deployment.md` |
| Authoring seed | `specs/framework/seeds/templates/EN/deployment.md` |

The EN seed is Sprint 14. Do not add a row for it in a project map until the file exists.

### .secrets

Secret names and where the values live. It holds no secret values.

| Role | Path |
| --- | --- |
| On a project | `{workspace}/{artifacts_root}/.secrets` |
| Authoring seed | `specs/framework/seeds/templates/EN/.secrets` |

A draft EN seed exists. It lists `NAME | where the value lives | who uses it` as comments and holds no value. Spec-seeds-11 stays open until the user confirms it. Do not add a row for it in a project map until the project file exists.

### adr/

Durable decisions. A project may have this tree under `artifacts_root`. Ethan does not read it on start. Create a file when a retrospective finds a decision worth keeping. Do not leave an empty row in `artifacts-map.md` before the tree exists.

### knowledge/

Reusable research and ops notes. A project may have this tree under `artifacts_root`. Ethan does not read it on start. Create a file when a retrospective finds a lesson worth keeping. Do not leave an empty row in `artifacts-map.md` before the tree exists.

