# coach-ethan — agent design

> **Purpose**: Define how coach-ethan is present, what it does, what it reads, how start-up resolves files, and how capabilities grow across MVPs.
> **Status**: design · as_of 2026-09-22 · not implemented
> **Backlog**: [coach-ethan](../product-backlog.md#pb-3) · [MVP 1](../product-backlog.md#pb-8) · [MVP 2](../product-backlog.md#pb-9) · [MVP 3](../product-backlog.md#pb-10)
> **Framework**: [`sdd-scrum-guide.md`](../sdd-scrum-guide.md) · **Writing conventions**: [`sdd-scrum-practices.md`](../sdd-scrum-practices.md)
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
| Edit process artifacts using practices columns | Overwrite existing live `specs/` files when seeding |
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

## 3. Jobs

What coach-ethan does over time:

1. **Start load** — find `artifacts-map.md`, then load each process file it lists (see §4–§5).
2. **Guide** — answer questions; say what to do now and what is next from the guide and live sprint/backlog state.
3. **Run events** — call the matching skill or workflow for SDD-Scrum events. Event definitions and skill names live in [`sdd-scrum-guide.md`](../sdd-scrum-guide.md).
4. **Maintain artifacts** — edit the right local files using [`sdd-scrum-practices.md`](../sdd-scrum-practices.md) columns and statuses.
5. **Ask** — use AskQuestion when the Cursor host provides it; otherwise ask in chat. Required for Toggle B seed (confirm before copy). Not required to close every MVP acceptance path.

## 4. Two stores (do not mix)

| Store | Where | What |
| --- | --- | --- |
| **Client root (CR)** | Cursor: `~/.cursor` from MCP `paths` / `.sdd-installed.json` | Installed framework pack: agents, skills, rules, workflows; templates under the pack when ARTIFACTS-01 / TEMPLATES-01 ship. This repo’s `.cursor/` is an **edit copy** for framework.sdd.works authors, not the end-user layout. |
| **Workspace templates (WS-t)** | `<workspace>/.cursor/templates/framework.sdd.works/<locale>/` | Same process files if the user pasted the folder into the project. |
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

## 6. Missing-file recovery

Two toggles. Do not collapse them.

### Toggle A — template / pack missing

Covers incomplete CR pack and/or missing WS-t.

| Situation | Action |
| --- | --- |
| Incomplete **client-root** pack (agents, skills, templates when in the tarball) | Call install/update; extract to `extractTarget` / `paths` only |
| WS-t missing, CR has templates | Use CR for this session. Do not require a workspace `.cursor` copy |
| CR missing, WS-t present (author edit copy or paste) | Use WS-t. Optional later: install to CR for other projects; do not block this chat |
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

## 12. Related docs

| Doc | Role |
| --- | --- |
| [`agent-test.md`](./agent-test.md) | Load/recovery test plan and cases |
| [`../product-backlog.md`](../product-backlog.md) | Parent and MVP acceptance |
| [`../sprint-backlog.md`](../sprint-backlog.md) | Schedule and D1 |
| [`../architecture.md`](../architecture.md) | Stack pointer; presence decision |
| [`../artifacts-map.md`](../artifacts-map.md) | Process file index the coach loads |
| [`../sdd-scrum-guide.md`](../sdd-scrum-guide.md) | Framework SSOT |
| [`../sdd-scrum-practices.md`](../sdd-scrum-practices.md) | Artifact writing rules |
| [`../mcp/mcp-design.md`](../mcp/mcp-design.md) | Installer MCP (`sdd_install_framework` / `sdd_update_framework`) |
| [`../knowledge/agent/cursor-agent-callup.md`](../knowledge/agent/cursor-agent-callup.md) | Slash-invoke vs templates vs project `agents/` |
