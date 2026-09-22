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

Table conventions for RID, Sprint Backlog, and Product Backlog are in the sections after **Jobs**. Product facts, design, and test criteria stay in their own specs.

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
- Record that structure in `artifacts-map.md` (required process artifact; this project’s index).
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

**When**: copy or refresh seeds during on-board (job 1) if working copies are missing; on new project (job 2); on update settings (job 3) only when relocating or filling a gap — never overwrite filled working copies without the user confirming.

**From where**: `.cursor/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy listed files into the artifacts root named in `artifacts-map.md`.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (seeds vs working copies).

## 1. RID Registry

The RID Registry records only Risk, Impediment, and Dependency. It does not record verification steps or test cases.

### 1.1 Column definitions

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

### 1.2 Status meanings

| Status | Meaning |
|---|---|
| `Pending` | Registered; handling has not started |
| `Open` | Handling is in progress, or only some dependencies are in place |
| `Implemented` | Handling is implemented, but production acceptance or another registered item is still open |
| `Closed` | Every acceptance criterion of the solution is met, and nothing else is still open |

The status column contains only the enum value. Put dates, scope completed, remaining work, and verification evidence in the handling note. Point detailed history at [`change-log.md`](./change-log.md) or the design or test doc that owns it.

### 1.3 Solution, verification, and coverage

- A RID solution must land in [`product-backlog.md`](./product-backlog.md). Do not replace the execution item with another id inside the RID table. The link must target the item anchor, not the top of the file.
- The Product Backlog item’s acceptance criteria are the verification method for that solution. The RID table has no separate “verification method” column.
- Every RID must form a clickable chain: `RID → Product Backlog solution → Sprint Backlog item → design/test/ADR source`. The solution column links the Product Backlog item. The related-docs column links the Sprint item and the design, test, or decision section.
- The Product Backlog `Sprint` column remains a projection of the schedule. For precise tracking, the `Related` column links the stable Sprint Backlog anchor. Do not copy execution status into the Product Backlog.
- A stable criterion name (for example `V1`) may be cited, but it is not a RID row. Write the full criterion in the design or test spec, and put an executable summary in the Product Backlog acceptance criteria.
- A single source of truth is not a one-way link with no way back. Docs do not copy each other’s status or body text, but they may navigate both ways through stable anchors. RID handling status stays in the RID Registry. Sprint execution status stays in the Sprint Backlog.
- The RID section must keep a coverage table: `RID → Backlog item → acceptance criteria and design/test location → Sprint location`. Every cell must have a value and a resolvable link, so solution, verification, and schedule are fully covered.

## 2. Sprint backlog

The ToDo table of each sprint in [`sprint-backlog.md`](./sprint-backlog.md) is the single source of truth for that sprint’s execution list and status.

### 2.1 Column definitions

Columns are fixed: `#`, `Item`, `Category`, `Module`, `Acceptance criteria`, `Related docs`, `Note`, `Status`.

- Acceptance criteria must be verifiable when the item is implemented. They must not depend on another item that does not exist yet. Move a cross-item deliverable to the item that actually produces it.
- Related docs point at the Product Backlog item, requirement, design, test, decision, or process evidence. Do not copy their body text. If a RID uses the item as an execution landing point, the item must have a stable anchor so the RID and Product Backlog can link back.
- The note is a conclusion-level summary, remaining boundary, and evidence pointer. Do not paste command output, step-by-step logs, or a long investigation.
- If an item has not started and there is nothing else to say, write `—`. Do not repeat “not started” in the note.

### 2.2 Status meanings

| Status | Meaning |
|---|---|
| `ToDo` | Not started |
| `WIP` | Started, but acceptance criteria are not met |
| `Implemented` | Implemented or verified locally; production acceptance or another registered item is still open |
| `Done` | Every acceptance criterion of this item is met |

The status column contains only the enum value. Before you move a long status sentence into the note, confirm the detail already lives in `change-log.md`, a test spec, or a knowledge doc. If it has no home, write the process record first, then compress it to a summary.

### 2.3 Numbers, references, and retrospective

- `#N` means the item number inside that sprint only. Across documents, prefer the item name. Use the number only to help locate it.
- Every sprint must keep a `Retrospective` with at least “What went well”, “What to improve”, and “What we learned”. After each story or task, write the retrospective into the sprint that actually delivered the work. Add an ADR or `specs/knowledge/` note only when there is a durable decision or reusable knowledge, and link it from the sprint retrospective. Update the sprint retrospective even when there is no ADR or knowledge doc.
- When the schedule changes, update the Product Backlog `Sprint` projection in the same change. When implementation status changes, write each table back according to its own job. Do not let one table stand in for the other.

## 3. Product Backlog

[`product-backlog.md`](./product-backlog.md) records product items, description, acceptance criteria, relations, the schedule projection, and product-level status.

### 3.1 Columns and maintenance boundary

Columns are fixed: `#`, `Category`, `Parent`, `Title`, `Description`, `Acceptance criteria`, `Related`, `Sprint`, `Status`.

- Description, acceptance criteria, related links, and status are owned by the Product Backlog.
- `Sprint` is a projection of the schedule in `sprint-backlog.md`. It must not become a second schedule.
- Acceptance criteria must be executable and observable, and they carry the verification method for a RID solution.
- A Product Backlog item cited by a RID must have a stable item anchor. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references prefer the item name and use the number only as a locator. A renumber must not change the meaning.

### 3.2 Status meanings

The Product Backlog uses the same four states as the Sprint Backlog:

- `ToDo`: not started.
- `WIP`: in progress; acceptance criteria are not met.
- `Implemented`: implemented; production acceptance or another registered item is still open.
- `Done`: every acceptance criterion of the item is met.

The status column contains only the enum value. Put the completion date, remaining work, and verification evidence in the sprint item’s note or in `change-log.md`. Do not put them in the Product Backlog status cell.

## 4. Single source of truth

| Information | Single source | How other docs cite it |
|---|---|---|
| RID status, impact, and current handling summary | RID Registry in `sprint-backlog.md` | Cite only the RID id and title |
| Product solution and acceptance criteria | `product-backlog.md` | RID links the item anchor; the item’s `Related` column links the sprint item and design or test source |
| Sprint schedule and execution status | Sprint Backlog in `sprint-backlog.md` | Product Backlog `Sprint` is only a projection; `Related` may link the execution item |
| Detailed design and verification matrix | The design or test spec | Process tables keep a summary and a section link |
| Process evidence and reason for change | `change-log.md` | Tracking artifact; the note column keeps the date, conclusion, and link |
| Current sprint, SBI, next, and OGT rows | `status.md` | Tracking projection; not a second sprint backlog |
| Table shape and status meanings | This file (after Jobs) | Process docs link this file from the header |
| Artifact index | `artifacts-map.md` | Other docs link paths; they do not keep a second catalog |
| Durable decisions | `adr/` | Knowledge category; create when ADR-worthy (retrospective) |
| Reusable research / ops notes | `knowledge/` | Knowledge category; create when knowledge-worthy (retrospective) |
| Architecture decisions (optional / JIT) | `architecture.md` | Process tables link the section; they do not restate the full decision |
| Deploy and upgrade steps (optional / JIT) | `deployment.md` | Process tables link the section; they do not restate the full steps |

State each fact in full only in the document that owns it. When the wording changes, check authority document, then citing documents, then the place operators follow, so a second copy does not go stale in silence.

## 5. Links

- [`sprint-backlog.md`](./sprint-backlog.md): RID Registry and Sprint Backlog
- [`product-backlog.md`](./product-backlog.md): product items and acceptance criteria
- [`status.md`](./status.md): current sprint, SBI, next, OGT
- [`change-log.md`](./change-log.md): tracking — process evidence and change record
- [`artifacts-map.md`](./artifacts-map.md): process artifact index
- [`sdd-scrum-guide.md`](./sdd-scrum-guide.md): names and meaning
- [`architecture.md`](./architecture.md): optional / JIT — architecture and decisions
- [`deployment.md`](./deployment.md): optional / JIT — deploy and upgrade
- [`adr/`](./adr/): knowledge — durable decisions
- [`knowledge/`](./knowledge/): knowledge — reusable notes
