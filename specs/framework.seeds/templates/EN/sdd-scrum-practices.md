---
title: SDD Scrum practices
type: process-spec
status: active
as_of: 2026-09-22
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint-backlog.md
related:
  - sdd-scrum-guide.md
  - product-backlog.md
  - change-log.md
  - artifacts-map.md
  - status.md
  - architecture.md
  - deployment.md
---

# SDD Scrum practices

This file is the **single source of truth** for what, how, and when AI agents apply sdd-scrum (Cursor, Claude Code, Codex, CodeBuddy, and similar). Names and meaning stay in [`sdd-scrum-guide.md`](./sdd-scrum-guide.md).

Table conventions for each template seed are under **Templates**. Product facts, design, and test criteria stay in their own specs.

The other templates in this folder use Pokymon Card Collection as the worked example. After you copy them, replace `[product name]` with the real product name and maintain the process docs using this file.

## Jobs (what, how, when)

### 1. On-board agent

- On-board agent ethan.
- Load artifact templates from the framework.sdd.works folder, or via `sdd_install_framework` / `sdd_update_framework`, when artifacts are missing.
- Run an on-board check and tell the user that agent ethan is ready.
- Record current status in `status.md` and suggest what to do next.

### 2. Start a new project

- Decide language of project artifacts (EN, HanS, HanT).
- Decide workspace folder structure from sub-systems, architecture, and components.
- Specify the sdd-scrum artifacts root (default: `{workspace_folder}/specs`) and sub-folders if needed.
- Record that structure in `{workspace}/artifacts-map.md` (required process artifact; this project’s index). Name `artifacts_root` there. Default `specs`. The user may set `docs`.
- Copy artifact templates to the locations named in `artifacts-map.md`, for the chosen language.
- Ensure agent ethan can operate those files.
- Record current status in `status.md` and tell the user the project is initialized, with suggestions for what to do next.

### 3. Update project settings

- Update language of project artifacts (EN, HanS, HanT).
- Update workspace folder structure from sub-systems, architecture, and components.
- Update the sdd-scrum artifacts root (default: `{workspace_folder}/specs`) and sub-folders if needed.
- Update `artifacts-map.md` so it remains this project’s index.
- Relocate artifact files to match language and `artifacts-map.md`.
- Ensure agent ethan can operate those files.
- Record current status in `status.md` and tell the user the project is updated, with suggestions for what to do next.

### 4. Refine product backlog

*(to fill)*

### 5. Sprint planning

*(to fill)*

### 6. Report status

*(to fill)*

### 7. Retrospective

*(to fill)*

### 8. Start a new sprint

*(to fill)*

## Templates

**When**: copy or refresh locale seeds during on-board (job 1) if working copies are missing; on new project (job 2); on update settings (job 3) only when relocating or filling a gap — never overwrite filled working copies without the user confirming. Do not copy `constants.md` into the artifacts root.

**From where**: locale seeds from `.cursor/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy listed locale files into the artifacts root named in `artifacts-map.md`. Read `constants.md` from `{client_root}/templates/framework.sdd.works/constants.md` after install; do not copy it into the artifacts root.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (seeds vs working copies). `constants.md` is pack lookup on the client root, not a working copy under the artifacts root.

Each heading below is one seed file. The RID Registry is a section inside `sprint-backlog.md`. It is not a separate seed. `constants.md` is listed first because it is not a locale seed.

### constants.md

[`constants.md`](../constants.md) is the pack lookup for path names, the instructions URL, skill keys, and rule keys. Ethan reads it after `{client_root}/.sdd-installed.json` has `pack_complete: true`. On a failed start he reads `instructions_url` from it when the file can be read. Home after install: `{client_root}/templates/framework.sdd.works/constants.md` ([ADR-060](../../../adr/ADR-060-constants-on-client-root.md)).

#### Home and copy boundary

- Read the live file from `{client_root}/templates/framework.sdd.works/constants.md`.
- Jobs 1–3 do not copy it into the artifacts root. Locale seeds still copy into that root.
- It is pack lookup, not a project file under `specs/`. Do not put product facts, acceptance criteria, or secret values in it.
- Do not add a section for a one-off path.

#### Sections

Sections stay in this order: Paths, `instructions_url`, Skills, Rules.

#### Paths table

Columns are `Name` and `Value`. Names are `agents_dir`, `skills_dir`, `rules_dir`, `workflows_dir`, `templates_dir`. Values are folder names relative to `client_root`, not absolute paths and not `~`.

#### instructions_url

One URL: the public instructions page. Prompts read it from this file. They do not hard-code the host.

#### Skills table

Columns are `Skill key` and `Folder`. A job row uses the `skill_*` key ethan matches. A non-job skill uses the folder name as the key. Folder names start with `sdd-`. One skill, one row. Do not repeat a folder under a second key.

#### Rules table

Columns are `Rule key` and `File`. The key is the rule id without `.mdc`. The file is the filename under `rules_dir`.

#### When a pack file is added

Add the skill or rule row here in the same change as the skill or rule. Do not leave a prompt that types the folder name itself.

### product-backlog.md

[`product-backlog.md`](./product-backlog.md) records product items, description, acceptance criteria, relations, the schedule projection, and product-level status.

#### Columns and maintenance boundary

Columns are fixed: `Category`, `PBI Code`, `PBI`, `Description`, `Acceptance criteria`, `Related`, `Sprint`, `Status`. `Category` is one word. `PBI Code` is that word plus a two-digit number, such as `Collect-01`, and it carries the row anchor. Rows with the same category stay together. Do not insert a row by pb number when that would split the category. Inside a category, order by PBI code. The category list belongs to the product. A file or skill that already has its own row is not also a parent row. Skill folders start with `sdd-`.

- Description, acceptance criteria, related links, and status are owned by the Product Backlog.
- `Sprint` is a projection of the schedule in `sprint-backlog.md`. It must not become a second schedule.
- Acceptance criteria must be executable and observable, and they carry the verification method for a RID solution.
- A Product Backlog item cited by a RID must have a stable item anchor. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references prefer the PBI code and the item name. The anchor stays on the PBI Code cell.

#### Status

A PBI uses the same three statuses as an SBI: `ToDo`, `WIP`, and `Done`. See Status under `sprint-backlog.md` for the meanings and the examples.

**Apply the Definition of Done rule before marking a PBI `Done`.** Do not mark the PBI `Done` while any of its acceptance criteria is open, or while the DoD rule has not been applied to that PBI. A related SBI can be `Done` while the PBI stays `ToDo` or `WIP` when the PBI acceptance is wider than that SBI.

The status cell contains only the word. Put the completion date and the evidence in the sprint note or in `change-log.md`.

### sprint-backlog.md

[`sprint-backlog.md`](./sprint-backlog.md) is the schedule and the execution list. It contains the RID Registry and one section per sprint. The ToDo table of each sprint is the single source of truth for that sprint’s items and status.

#### RID Registry

The RID Registry records only Risk, Impediment, and Dependency. It does not record verification steps or test cases.

**Columns**

| Column | Convention |
|---|---|
| `#` | Keep a stable id, such as `R1`, `I1`, `D1`. The id does not express priority |
| `Severity` | Impact level. Define the scale in the registry and keep one scale |
| `Type` | Only risk, impediment, or dependency |
| `Title` | One sentence for the item that must stay tracked |
| `Description` | Facts, trigger, or cause. Do not repeat the solution |
| `Impact` | What happens to the user, data, or delivery if it is not handled |
| `Solution (→ product-backlog)` | Clickable item-level anchors to one or more real Product Backlog items. Prefer the item name; use the number only as a locator |
| `Related docs` | Along the implementation path, link the Sprint Backlog item and the single source for design, test, or decision |
| `Handling note` | One to three sentences: current progress, remaining boundary, and a pointer to evidence |
| `Status` | Only `Pending`, `Open`, `Implemented`, or `Closed` |
| `Updated` | Date of the latest change to the facts or the status |

**RID status**

| Status | Meaning |
|---|---|
| `Pending` | Registered; handling has not started |
| `Open` | Handling is in progress, or only some dependencies are in place |
| `Implemented` | Handling is implemented, but production acceptance or another registered item is still open |
| `Closed` | Every acceptance criterion of the solution is met, and nothing else is still open |

The status column contains only the enum value. Put dates, scope completed, remaining work, and verification evidence in the handling note. Point detailed history at [`change-log.md`](./change-log.md) or the design or test doc that owns it.

**Solution, verification, and coverage**

- A RID solution must land in [`product-backlog.md`](./product-backlog.md). Do not replace the execution item with another id inside the RID table. The link must target the item anchor, not the top of the file.
- The Product Backlog item’s acceptance criteria are the verification method for that solution. The RID table has no separate “verification method” column.
- Every RID must form a clickable chain: `RID → Product Backlog solution → Sprint Backlog item → design/test/ADR source`. The solution column links the Product Backlog item. The related-docs column links the Sprint item and the design, test, or decision section.
- The Product Backlog `Sprint` column remains a projection of the schedule. For precise tracking, the `Related` column links the stable Sprint Backlog anchor. Do not copy execution status into the Product Backlog.
- A stable criterion name (for example `V1`) may be cited, but it is not a RID row. Write the full criterion in the design or test spec, and put an executable summary in the Product Backlog acceptance criteria.
- A single source of truth is not a one-way link with no way back. Docs do not copy each other’s status or body text, but they may navigate both ways through stable anchors. RID handling status stays in the RID Registry. Sprint execution status stays in the Sprint Backlog.
- The RID section must keep a coverage table: `RID → Backlog item → acceptance criteria and design/test location → Sprint location`. Every cell must have a value and a resolvable link, so solution, verification, and schedule are fully covered.

#### Sprint items

Columns are fixed, in this order: `Code`, `Parent PBI`, `Module`, `Type`, `SBI`, `Acceptance criteria`, `Related docs`, `Note`, `Status`. `Code` is the Type in lowercase plus a two-digit number inside that sprint, such as `feature-01` or `research-01`. `Type` is one word. Rows of the same Type stay together. `Parent PBI` shows the PBI code and the PBI name. The full shape is in [`framework-design.md`](../../framework-design.md).

| Type | Meaning |
| --- | --- |
| Feature | Delivers something the product ships for use: an agent capability, an MCP behavior, a web page, a seed, or a product behavior. |
| Research | Finds and records evidence before a feature is specified. Does not ship the feature. |
| Bug-fix | Corrects a defect in something already delivered. Does not add a new capability. |
| Documentation | Writes or retargets an explanation. Does not ship the capability the explanation describes. |
| Task | Supporting work that is not one of the types above. |

- Acceptance criteria must be verifiable when the item is implemented. They must not depend on another item that does not exist yet. Move a cross-item deliverable to the item that actually produces it.
- `Acceptance criteria` and `Note` are bullet lists inside the cell. One bullet is one check or one note. Separate bullets with a line break. A cell with nothing to say is `—`.
- Related docs point at the Product Backlog item, requirement, design, test, decision, or process evidence. Do not copy their body text. If a RID uses the item as an execution landing point, the item must have a stable anchor so the RID and Product Backlog can link back.
- The note is a conclusion-level summary, remaining boundary, and evidence pointer. Do not paste command output, step-by-step logs, or a long investigation.
- If an item has not started and there is nothing else to say, write `—`. Do not repeat “not started” in the note.

**Status**

An SBI status is only `ToDo`, `WIP`, or `Done`. The cell contains that word and nothing else.

| Status | Meaning | Example |
| --- | --- | --- |
| `ToDo` | Not started. | The installer row is `ToDo` until the first edit toward its acceptance criteria. |
| `WIP` | Started. Acceptance criteria are not all met, or the Definition of Done has not been applied. | Search returns set matches, and the rarity filter is still missing, so the item stays `WIP`. |
| `Done` | Every acceptance criterion is met, and the Definition of Done rule has been applied. | A catalog item is `Done` only after the duplicate-card check passes and the DoD rule has been applied to that item. |

**Apply the Definition of Done rule before marking an SBI `Done`.** A file on disk, a green local check, or met acceptance criteria is not enough while a DoD item for that SBI is still open. Leave the status `WIP` until the rule has been applied.

The sprint line above the table uses the same three words. `ToDo` when every SBI is `ToDo`. `WIP` when any SBI is `WIP`, or when the sprint mixes `ToDo` and `Done`. `Done` when every SBI is `Done`.

Put dates, remaining work, and evidence in the note. Do not put them in the status cell. The RID Registry uses its own statuses. This section does not change those.

**Numbers, references, and retrospective**

- `Code` locates the row inside that sprint. Across documents, prefer the SBI name. The row anchor is unique in the file (`s1-task-01` when another sprint also has `task-01`).
- Every sprint has one `Retrospective`, with Learnings and then Opportunities. A later retrospective in the same sprint is appended to that section, with a timestamp, a trigger, and a line of dashes between blocks. Link an ADR or a knowledge note only when one was written. The block shape is in [`framework-design.md`](../../framework-design.md). After each story or task, write the retrospective into the sprint that delivered the work.
- When the schedule changes, update the Product Backlog `Sprint` projection in the same change. When implementation status changes, write each table back according to its own job. Do not let one table stand in for the other.

### artifacts-map.md

[`artifacts-map.md`](./artifacts-map.md) is the required index of live files and trees for this project. On a project it lives at `{workspace}/artifacts-map.md` and names `artifacts_root` (default `specs`; the user may set `docs`). Paths in the map are relative to that folder. It is not the framework definition. Other docs link paths here. They do not keep a second catalog.

### status.md

[`status.md`](./status.md) records the current sprint, the current SBI, and what to do next. It is a tracking projection. It is not a second sprint backlog.

### change-log.md

[`change-log.md`](./change-log.md) records conclusion-level changes: what changed, why, and how it was verified. Step-by-step detail stays in git and in the spec that owns the change.

### architecture.md

[`architecture.md`](./architecture.md) records the stack and a small number of decisions. Product behavior stays in `product-backlog.md`. This file is optional and written when a decision needs a home.

### deployment.md

[`deployment.md`](./deployment.md) records how to start locally and the order of steps at go-live. Do not put host names, secrets, or customer environment names here. This file is optional and written when those steps exist.

### .secrets

`.secrets` stores secret names and where the values live. It does not store secret values. This file is optional and written when the project has secrets. Do not commit real values.

### sdd-scrum-guide.md

[`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is framework text: names and meaning. Locale copies share this filename. It does not take what, how, and when from this practices file.

### sdd-scrum-practices.md

This file. What, how, and when. It does not redefine guide terms.

### framework-design.md

[`framework-design.md`](../../framework-design.md) is the sprint-item shape: columns, Type, status, and the retrospective block. It also places `artifacts-map.md` at the workspace root and names `artifacts_root` there. This practices file states how to apply that shape.

## Single source of truth

| Information | Single source | How other docs cite it |
|---|---|---|
| RID status, impact, and current handling summary | RID Registry in `sprint-backlog.md` | Cite only the RID id and title |
| Product solution and acceptance criteria | `product-backlog.md` | RID links the item anchor; the item’s `Related` column links the sprint item and design or test source |
| Sprint schedule and execution status | Sprint Backlog in `sprint-backlog.md` | Product Backlog `Sprint` is only a projection; `Related` may link the execution item |
| Detailed design and verification matrix | The design or test spec | Process tables keep a summary and a section link |
| Process evidence and reason for change | `change-log.md` | Tracking artifact; the note column keeps the date, conclusion, and link |
| Current sprint, SBI, next, and OGT rows | `status.md` | Tracking projection; not a second sprint backlog |
| Table shape and status meanings | Templates in this file | Process docs link this file from the header |
| Artifact index | `artifacts-map.md` | Other docs link paths; they do not keep a second catalog |
| Durable decisions | `adr/` | Knowledge category; create when ADR-worthy (retrospective) |
| Reusable research / ops notes | `knowledge/` | Knowledge category; create when knowledge-worthy (retrospective) |
| Architecture decisions (optional / JIT) | `architecture.md` | Process tables link the section; they do not restate the full decision |
| Deploy and upgrade steps (optional / JIT) | `deployment.md` | Process tables link the section; they do not restate the full steps |

State each fact in full only in the document that owns it. When the wording changes, check authority document, then citing documents, then the place operators follow, so a second copy does not go stale in silence.

## Links

- [`sprint-backlog.md`](./sprint-backlog.md): RID Registry and Sprint Backlog
- [`product-backlog.md`](./product-backlog.md): product items and acceptance criteria
- [`status.md`](./status.md): current sprint, SBI, next, OGT
- [`change-log.md`](./change-log.md): tracking — process evidence and change record
- [`artifacts-map.md`](./artifacts-map.md): process artifact index
- [`sdd-scrum-guide.md`](./sdd-scrum-guide.md): names and meaning
- [`architecture.md`](./architecture.md): optional / JIT — architecture and decisions
- [`deployment.md`](./deployment.md): optional / JIT — deploy and upgrade
- `.secrets`: optional — secret names and where values live. Not a file of secret values.
- `adr/`: knowledge, under the artifacts root, when a decision is ADR-worthy. Not a file in this seed folder.
- `knowledge/`: knowledge, under the artifacts root, when a note is reusable. Not a file in this seed folder.
