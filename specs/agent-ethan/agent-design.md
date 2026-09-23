# coach-ethan — agent design

> **Purpose**: Define how coach-ethan is present, what it does, what it reads, how start-up resolves files, and how capabilities grow across MVPs.
> **Status**: design · as_of 2026-09-23 · Sprint 1 SBI 2 not implemented
> **Backlog**: [pb-14 Initialize framework.sdd.works v2 POC](../product-backlog.md) · [pb-6 agent ethan — POC](../product-backlog.md) · Sprint 1 SBI 2 in [`sprint-backlog.md`](../sprint-backlog.md)
> **Framework**: [`sdd-scrum-guide.md`](../sdd-scrum-guide.md) · **Practices**: [`sdd-scrum-practices.md`](../sdd-scrum-practices.md) (what, how, when)
> **RID**: [D1](../sprint-backlog.md#rid-d1) (closed: local Cursor agent)
> **Tests**: [`agent-test.md`](./agent-test.md)

This file is the design for the coach. It does not fill the Scrum guide, add a prompt file, or build skills.

## 1. Goals and non-goals

| Goals | Non-goals |
| --- | --- |
| Coach SDD-refined Scrum in the user’s project | Host the coach on remote MCP |
| At start, load every **process** file named in `artifacts-map.md` | Load domain trees (`adr/`, `mcp/`, …) at start |
| Answer what to do now and what is next from live specs | Memory store, embeddings, or MCP resource for knowledge |
| Run Scrum events by calling installed skills / workflows | Invent a second event catalog beside the guide |
| Edit process artifacts using practices (jobs, templates, columns) | Overwrite existing live `specs/` files when seeding |
| Recover missing templates via MCP; seed missing specs after confirm | Tar the install package into `specs/` |
| Collect missing input via AskQuestion when the host provides it | Require AskQuestion to close an MVP |

## 2. Presence

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

Decision recorded as [D1](../sprint-backlog.md#rid-d1). See also [`architecture.md`](../architecture.md) §2 and [`../knowledge/agent/cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md).

### 2.1 One pack, on the user root

The framework pack lives only in the user client root. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md). Evidence: [`../knowledge/agent/ide-asset-precedence.md`](../knowledge/agent/ide-asset-precedence.md).

| What | Where |
| --- | --- |
| Installed agents, skills, rules, workflows, templates | `~/.cursor/` (Cursor). Written by `sdd_install_framework` / `sdd_update_framework`. |
| `/ethan` | `~/.cursor/agents/ethan.md` in every project |
| `project-constants.md` | `~/.cursor/templates/framework.sdd.works/project-constants.md` when the package includes templates |

Ethan does not copy those trees into `<workspace>/.cursor/`. He does not download the pack again.

A workspace file is allowed when its name is not already in the user root: one new rule, or one new skill folder. Ethan does not create that file on start.

If `~/.cursor/agents/ethan.md` is missing, the framework is not installed or not updated. Say that, send the user to `https://framework.sdd.works/instructions`, and stop.

If `<workspace>/.cursor/agents/ethan.md` already exists, Cursor loads that file instead of the user-root agent. The product does not create it. Remove it when this project should use the installed agent.

This repository has no `.cursor/` directory. It was removed on 2026-09-23. There is no workspace agent, no workspace skill or rule tree, and no workspace template pack here. `/ethan` in this repo is `~/.cursor/agents/ethan.md` only. Live product specs stay in `specs/`.

### 2.2 Start cases

| Case | What ethan does |
| --- | --- |
| User-root `agents/ethan.md` exists | Use the user-root pack. Read constants from the user-root templates path when that file exists. |
| User-root `agents/ethan.md` is missing | Instructions URL above, then stop. |
| A job needs a skill | Open that folder under `~/.cursor/skills/` using the Skills table in the user-root constants file. If the folder is missing, read `instructions_url` from that file when it exists. Otherwise use the instructions URL above and stop. |
| `templates/` is missing on the user root | The current package has no templates entry ([`mcp-design.md`](../mcp/mcp-design.md)). Say that. Do not create a workspace templates tree. |
| Workspace already has a same-name agent, rule, or skill | Do not overwrite it and do not treat it as the installed pack. Call-up still follows Cursor: a project `ethan.md` wins. |

## 3. Jobs

What coach-ethan does over time:

1. **Start load** — find `artifacts-map.md`, then load each process file it lists (see §4–§5).
2. **Guide** — answer questions; say what to do now and what is next from the guide and live sprint/backlog state.
3. **Run events** — call the matching skill or workflow for SDD-Scrum events. Event definitions and skill names live in [`sdd-scrum-guide.md`](../sdd-scrum-guide.md).
4. **Maintain artifacts** — edit the right local files using [`sdd-scrum-practices.md`](../sdd-scrum-practices.md) (jobs, templates, columns, and statuses).
5. **Ask** — use AskQuestion when the Cursor host provides it; otherwise ask in chat. Required for Toggle B seed (confirm before copy). Not required to close every MVP acceptance path.

## 4. Two stores (do not mix)

| Store | Where | What |
| --- | --- | --- |
| **Client root (CR)** | Cursor: `~/.cursor` from MCP `paths` / `.sdd-installed.json` | Installed framework pack: agents, skills, rules, workflows; templates under the pack when ARTIFACTS-01 / TEMPLATES-01 ship. This is the only framework tree for this repository. |
| **Workspace templates (WS-t)** | `<workspace>/.cursor/templates/framework.sdd.works/<locale>/` | Process files if a project pasted that folder. This repository has no WS-t. |
| **Workspace specs (WS-s)** | `<workspace>/specs/` | Live project process files. Destination when the user confirms seed-from-template (Toggle B). |
| **Project agents** | `<workspace>/.cursor/agents/` | Cursor registry for slash-invoke in this workspace. **Not** WS-t. |

**Calling from** = the Cursor workspace folder (product repo, or a user who opened `~/.cursor` as a folder).

Templates are the **start catalog** and the **seed** for missing specs. Live `specs/` always wins over a template with the same filename. Sample product text in a template (e.g. Pokymon) is not the user’s product; after seed, the user fills project facts.

## 5. Start load and search order

### 5.1 Sequence

1. Resolve `clientRoot` from the seed map and/or local `.sdd-installed.json` (`paths`). Do not invent folders.
2. Find `artifacts-map.md` in this order:
   1. `workspace/specs/artifacts-map.md`
   2. `workspace/.cursor/templates/framework.sdd.works/<locale>/artifacts-map.md`
   3. Client-root template path from install `paths` (when the pack includes templates)
3. **Locale**: first existing of `EN`, then `HanS`.
4. Load **every process-doc row** named in that map. Template pack today typically lists: practices, product-backlog, sprint-backlog (or legacy `sprint_plan.md` / HanS), change-log, architecture, deployment; include `sdd-scrum-guide.md` when the map lists it. Domain trees are not loaded at start.
5. For each filename, use the same search order. **Live `specs/` wins** over WS-t, which wins over CR templates when choosing a read source for coaching (after recovery).
6. Chat history is ongoing context for the thread. No memory store, embeddings, or MCP resource for knowledge content.

“Load” means the agent prompt instructs the model to **read those files into the chat**.

### 5.2 MCP extract discipline

When repairing the **client-root** pack, call `sdd_install_framework` or `sdd_update_framework` (`sdd_update_framework` is an alias of install).

- **stdio**: MCP writes into resolved `paths` and updates `.sdd-installed.json`.
- **HTTP** (ADR-054): server returns `packageUrl`, `extractTarget`, `paths`, `manifestPath`, `manifest`, `instructions`. The agent extracts **only** to `extractTarget` / `paths`. Never extract the tarball into `workspace/specs/`.
- After extract, verify every name in `manifest.files.*` exists under `paths`. If any listed file is missing, do not skip extraction.

### 5.3 Project constants

`project-constants.md` is read from `~/.cursor/templates/framework.sdd.works/project-constants.md` ([ADR-056](../adr/ADR-056-single-user-root-framework-pack.md)). It is not copied into the workspace or into `specs/`.

Until the install package includes `templates/`, that file is absent. §2.2 covers that case. `instructions_url` inside the file is used only after the user-root file exists. The bootstrap URL in §2.2 is the literal for a missing `agents/ethan.md`.

## 6. Missing-file recovery

Two toggles. Do not collapse them.

### Toggle A — template / pack missing

Covers incomplete CR pack and/or missing WS-t.

| Situation | Action |
| --- | --- |
| Incomplete **client-root** pack (agents, skills, templates when in the tarball) | Call install/update; extract to `extractTarget` / `paths` only |
| WS-t missing, CR has templates | Use CR for this session. Do not require a workspace `.cursor` copy |
| CR missing, WS-t present (pasted templates) | Use WS-t. Optional later: install to CR for other projects; do not block this chat |
| Both missing | MCP install, then retry search. If MCP unavailable or extract fails, stop and tell the user |

### Toggle B — live `specs/` missing

Separate from A. Templates must exist first (either store); if not, run Toggle A first.

| Situation | Action |
| --- | --- |
| Templates exist; WS-s missing or incomplete | **AskQuestion** (else ask in chat). After confirm, copy template files listed in artifacts-map into `workspace/specs/`, then load those |
| Some specs exist, some names missing | Same ask; copy **only the missing names**. Never overwrite an existing `specs/` file |
| No template anywhere after Toggle A | Do not invent specs. Stop and tell the user |

**Copy source order for Toggle B:** WS-t first, then CR templates.

**MVP 1 note:** Toggle B seed-copy after confirm is **start recovery**, not coaching mutation. MVP 1 still forbids backlog/sprint status edits and skill calls. Coaching writes begin in MVP 2/3.

### Case table

`CR` = client root pack/templates. `WS-t` = workspace templates. `WS-s` = workspace specs. Call = Cursor workspace.

| # | CR | WS-t | Call from | Missing | Toggle | Recovery |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | yes | no | CR | CR files | A | MCP install/update → `extractTarget` |
| 2 | no | yes | WS | WS-t files | A | MCP then retry; else fail |
| 3 | yes | no | WS | WS-s | B | Ask; copy CR templates → specs |
| 4 | yes | no | WS | CR | A | MCP repair CR; if WS-s exists keep coaching from specs |
| 5 | yes | no | WS | CR and WS-s | A then B | MCP repair CR; ask; copy to specs |
| 6 | no | yes | WS | WS-s | B | Ask; copy WS-t → specs |
| 7 | no | yes | WS | WS-t | A | MCP to create CR; then B if specs still empty |
| 8 | no | yes | CR | CR | A | MCP install to CR; WS-t is extra |
| 9 | yes | yes | WS | CR | A | MCP repair CR; load WS-s if present else WS-t |
| 10 | yes | yes | WS | WS-t | A | Ignore WS-t; use CR and/or WS-s |
| 11 | yes | yes | WS | WS-s | B | Ask; copy from WS-t first, else CR |
| 12 | yes | yes | WS | both CR and WS-t | A | MCP; then B if specs empty |
| 13 | yes | yes | WS | CR, WS-t, WS-s | A then B | MCP; ask; copy to specs |
| 14 | yes | yes | CR | CR | A | MCP; do not write a product `specs/` |
| 15 | yes | yes | CR | WS-t or WS-s | — | Out of this call; coach from CR templates |
| 16 | no | no | WS or CR | all | A | MCP install; if still no map, stop |

Test ids: `CE-LOAD-01` … `CE-LOAD-16` in [`agent-test.md`](./agent-test.md).

## 7. Knowledge (after start load)

| Source | When loaded |
| --- | --- |
| Every process file listed in the resolved `artifacts-map.md` | At start (search order §5) |
| Live guide + backlog + sprint backlog (subset of the above when present in WS-s) | Every “what now / what next” turn |
| Live practices | When about to write an artifact (also loaded at start if listed in the map) |
| Chat history | Ongoing context for the thread |

## 8. MVP capabilities

| MVP | Sprint | Capabilities | Explicitly not yet |
| --- | --- | --- | --- |
| 1 | Sprint 2 | Start load per §5–§6. Answer what now / what next. Toggle B seed-copy after confirm only. | Coaching edits. Skill calls. |
| 2 | Sprint 3 | Run event `plan` via a minimal `plan` skill. Update `sprint-backlog.md` using practices columns. | Execute `track` or `retrospective`. Full skill pack. |
| 3 | Sprint 4 | Reply from chat plus those files. One backlog refinement. One change-log entry, within guide maintenance rules. | Full event set. Second-client presence. |

Acceptance criteria stay on the backlog rows ([MVP 1](../product-backlog.md#pb-8), [MVP 2](../product-backlog.md#pb-9), [MVP 3](../product-backlog.md#pb-10)). Extend MVP 1 AC when implementing: start load + recovery behaviors in this design.

## 9. Events and skills

The guide owns the event-to-skill map. This design does not invent a second catalog.

**Process skill pack (SKILLS-01):** `Initiate_project`, `organize_artifacts`, `backlog_refinement`, `plan`, `track`, `retrospective`.

MVP 2 needs only a minimal `plan` skill. The rest ship with the full pack.

`close-sprint` (and similar names from product discussion) are **not** in SKILLS-01 yet. Add them to the guide and the skills backlog when they become real events.

## 10. Questions to the user

- Prefer Cursor **AskQuestion** when the host exposes it.
- Fall back to a clear question in the chat reply.
- Toggle B **requires** confirm before copying into `specs/`.
- Do not block other MVP acceptance on AskQuestion availability when no seed is needed.

## 11. Out of scope

- Filling [`sdd-scrum-guide.md`](../sdd-scrum-guide.md) content (GUIDE-01 / sprint guide slices).
- Implementing the agent prompt file or the six skills in this design turn.
- Hosting coach-ethan as a remote MCP tool or resource.
- Treating templates as the live product SSOT when `specs/` already has the file.
- Portal chat UI for the coach.
- Using install/update to invent missing **project** specs without Toggle B confirm.

## 12. Sprint 1 SBI 2 — initialize v2 POC

Parent: pb-14. This section is the technical solution for that SBI. Later coaching (what now / next, events, artifact edits) stays in §7–§9 and is not part of this POC.

### 12.1 Constraints

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

### 12.2 Sequence

1. User creates an empty folder and opens it as the Cursor workspace.
2. User confirms the Release 1 MCP server is connected in this Cursor profile (tools include `sdd_install_framework` and `sdd_update_framework`). If it is not connected, stop. Do not bundle MCP setup into this SBI.
3. User asks the default agent to install or update the framework. That agent calls `sdd_install_framework` or `sdd_update_framework` (`sdd_update_framework` is an alias of install).
4. **HTTP** (end-user path, ADR-054): the tool returns `packageUrl`, `extractTarget`, `paths`, `manifest`, and `instructions`. The default agent downloads the tarball and extracts **only** to `extractTarget` / `paths`. `paths.agents` is `~/.cursor/agents/`.
5. **stdio** (local binary): the tool writes those paths itself and updates `.sdd-installed.json`.
6. Verify `~/.cursor/agents/ethan.md` exists and every name in `manifest.files` exists under `paths`. If the agent file is missing, the install failed for this SBI even if skills or rules copied.
7. User reloads the window if Cursor does not list the new agent yet.
8. User types `/ethan`. Cursor loads `~/.cursor/agents/ethan.md` because the empty workspace has no project agent with the same name.

Do not extract the tarball into the empty workspace, and do not copy it into `workspace/specs/` or into `workspace/.cursor/`. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md).

### 12.3 Agent file contract

| Field | Value |
| --- | --- |
| Path in the package | `agents/ethan.md` |
| Installed path | `~/.cursor/agents/ethan.md` |
| Frontmatter `name` | `ethan` (slash command is `/ethan`) |
| Body for this POC | Identify as ethan, state that the framework pack is installed under `~/.cursor`, and say the workspace has no live `specs/` yet. Do not edit files. Do not call skills. |

Every `/ethan` in this project loads `~/.cursor/agents/ethan.md` (§2.1). Ethan does not create a workspace agent file. Templates under `.cursor/templates/` do not register `/ethan`.

### 12.4 What this POC does not do

- Seed `specs/` (Toggle B in §6). Ask only if a later story requires it.
- Answer “what now / what next” from a product backlog (pb-7).
- Run events or edit artifacts (pb-8, pb-9).
- Add a second agent runtime beside Cursor.

### 12.5 Failures

| Failure | What the user sees | Fix |
| --- | --- | --- |
| MCP not connected | Tool call is unavailable | Connect the Release 1 server, then retry. Do not invent a local copy. |
| Extract into the empty project | Files appear under the workspace, `/ethan` still missing | Re-extract to `paths` under `~/.cursor`. Remove the mistaken workspace copy only if the user confirms. |
| Agent markdown under templates or skills, not `agents/` | Pack looks installed, slash does nothing | Ship `agents/ethan.md` in the package and reinstall. |
| Frontmatter `name` is not `ethan` | `/ethan` does not match | Set `name: ethan`. |
| A project `ethan.md` already exists | `/ethan` loads that file instead of the user-root agent | Remove `<workspace>/.cursor/agents/ethan.md` when this project should use the installed agent ([ADR-056](../adr/ADR-056-single-user-root-framework-pack.md)). |

Decision: every `/ethan` on an empty project is the user agent at `~/.cursor/agents/ethan.md`. He does not copy the pack into the workspace. [ADR-056](../adr/ADR-056-single-user-root-framework-pack.md). That matches D1 and [`cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md).

## 13. Related docs

| Doc | Role |
| --- | --- |
| [`agent-test.md`](./agent-test.md) | Load/recovery test plan and cases |
| [`../product-backlog.md`](../product-backlog.md) | Parent and MVP acceptance |
| [`../sprint-backlog.md`](../sprint-backlog.md) | Schedule and D1 |
| [`../architecture.md`](../architecture.md) | Stack pointer; presence decision |
| [`../artifacts-map.md`](../artifacts-map.md) | Project index (framework / process / tracking / knowledge / optional / this product) |
| [`../sdd-scrum-guide.md`](../sdd-scrum-guide.md) | Names and meaning |
| [`../sdd-scrum-practices.md`](../sdd-scrum-practices.md) | What, how, when (jobs, templates, table conventions) |
| [`../mcp/mcp-design.md`](../mcp/mcp-design.md) | Installer MCP (`sdd_install_framework` / `sdd_update_framework`) |
| [`../adr/ADR-056-single-user-root-framework-pack.md`](../adr/ADR-056-single-user-root-framework-pack.md) | One pack on the user root |
| [`../knowledge/agent/ide-asset-precedence.md`](../knowledge/agent/ide-asset-precedence.md) | Same-name project vs user-root assets |
| [`../knowledge/agent/cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md) | Slash-invoke vs templates vs project `agents/` |
