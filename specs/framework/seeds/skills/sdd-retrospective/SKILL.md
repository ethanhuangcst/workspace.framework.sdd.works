---
name: sdd-retrospective
description: >
  Run a retrospective after DoD, at sprint-end, or on demand. Classify lessons as ADR
  or knowledge, write instance files under map roots, append the sprint Retrospective
  block, and report a Retrospective Summary in the same turn. No second confirm to
  persist ADR, knowledge, or the sprint Retrospective block. Close confirm for
  backlog **Done** stays on sdd-dod.mdc before **Done** row writes, not after
  Retrospective Summary. Use when the user asks for retrospective, lessons learned, 回顾, 总结经验, or
  /sdd-retrospective, or when sdd-dod.mdc requires the gate before Done. sdd-review-status
  does not replace this skill on SBI or PBI close.
---

# Retrospective

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

The practices file for this run is `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`.

ADR instance shape: that file, section `#adr-instance-shape`.

Knowledge instance shape: that file, section `#knowledge-instance-shape`.

Those sections stay on `{client_root}`. They are not copied into `{workspace}` as separate template files.

## Capabilities

| Capability | Result |
| --- | --- |
| Review completed work | State what went well, what was hard, and what was learned |
| Classify persist vs skip | Split ADR-worthy vs knowledge-worthy vs nothing durable |
| Resolve write roots | Read `adr` and `knowledge` from `{workspace}/artifacts-map.json` |
| Shape new files | Read practices `#adr-instance-shape` and `#knowledge-instance-shape` for instance layout |
| Ensure Retrospective section | Create `### Retrospective` under the sprint when missing, then append |
| Append sprint record | Add one numbered block under the current sprint Retrospective per practices |
| Persist in one pass | Write ADR, knowledge, changes-log, and sprint-backlog entries without a second confirm |
| Send summary | Retrospective Summary in chat after writes (or after a blocker stops the run) |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start; read `adr`, `knowledge`, `locale`, and process file paths |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, Retrospective under sprint-backlog | Before editing `sprint-backlog.md` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#artifacts-mapjson` | Before ADR or knowledge writes |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#adr-instance-shape` | Before creating an ADR instance |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, `#knowledge-instance-shape` | Before creating a knowledge instance |
| `{client_root}/rules/sdd-dod.mdc` | By-rule gate before Done |
| Existing files under `{workspace}/{adr}` and `{workspace}/{knowledge}` | Numbering and index updates |

## When to run

- **By rule:** `sdd-dod.mdc` before a PBI or SBI is `Done`, or before RID close when a durable lesson exists. Run this skill in the same session before the backlog row becomes `Done`.
- **Delegated:** `sdd-review-status` and any other skill or rule that sets an SBI or PBI to `Done` invokes this skill first in the same turn.
- **Sprint-end:** before or while closing a sprint (`Sprint-end` trigger).
- **On demand:** the user asks for retrospective, lessons learned, 回顾, or `/sdd-retrospective`.

`{trigger}` on the sprint record follows practices Retrospective under sprint-backlog in `sdd-scrum-practices.md` and **By rule** / **On demand** in `{client_root}/templates/framework.sdd.works/{locale}/scrum-in-sdd.md` (Sprint Retrospective).

## Steps

1. Read `{workspace}/artifacts-map.json` and the completed scope (SBI, PBI, sprint, or RID) from context.
2. Classify lessons: new ADR, new or updated knowledge, sprint Retrospective bullets, or none.
3. When a write needs `adr` or `knowledge` and the map has no key, stop and name **sdd-update-project**. Do not invent paths.
4. **Ensure Retrospective section** on `sprint-backlog.md` (see [Write rules](#sprint-backlogmd-retrospective)) when this run appends a sprint record or the trigger is by-rule `{SBI} done`, `{PBI} done`, or **Sprint-end**.
5. Write in this order when more than one file changes: new ADR instances, new or updated knowledge (and knowledge README index when present), `changes-log.md` when the run concludes a visible change, `sprint-backlog.md` Retrospective append. Skip `issues-log.md`, `status.md`, and `product-backlog.md` unless the pick for this run names them.
6. Send **Retrospective Summary** in the same reply. List what was written, what was skipped, and whether the run was empty.

An empty retrospective is valid. Append nothing under ADR or knowledge. Still ensure the sprint **Retrospective** section exists for by-rule and **Sprint-end** triggers: add one Learnings bullet that the gate ran and nothing durable was saved, or use the practices empty sentence on a label with no point. State in the summary that nothing durable was persisted.

## Retrospective Summary (after write)

Every sentence the user reads is written from the user's view. Wording checks link `{client_root}/rules/friendly-language.mdc`.

Send one message:

- **Completed:** {PBI code, SBI code, sprint name, or task name}
- **ADRs created or updated:** {path and one line why, or `none`}
- **Knowledge created or updated:** {path and one line what was learned, or `none`}
- **Skipped:** {anything considered but not saved, or `none`}
- **Sprint-backlog Retrospective:** {sprint name and `{number}. {when}, {trigger}` written, or `none`}

Do not ask for a second confirm to apply retrospective writes (ADR, knowledge, Retrospective append). Do not use a question card for those writes. The user may correct in a follow-up message. When this run is by-rule before **Done**, do not write **Done** rows; the host applies **close confirm** from `sdd-dod.mdc` after Retrospective Summary unless the user already gave **close confirm** for that scope.

## Write rules

### ADR instances

- When `artifacts-map.json` has no `adr` key, stop and name `sdd-update-project`. Do not assume `specs/adr`.
- Join `{workspace}` and the `adr` root. Create the next `ADR-{NNN}-{short-title}.md` using the practices ADR instance shape.
- Do not edit an accepted ADR to reverse a decision. Supersede with a new ADR.
- Do not create an ADR when an accepted ADR already records the same decision.

### Knowledge instances

- When `artifacts-map.json` has no `knowledge` key, stop and name `sdd-update-project`.
- Join `{workspace}` and the `knowledge` root. Create or update a note using the practices knowledge instance shape.
- Update `{workspace}/{knowledge}/README.md` index when that file exists.

### sprint-backlog.md Retrospective

- Read the Retrospective subsection in practices before editing.
- Resolve the sprint: from the SBI code on the completed row, or the single WIP sprint from the header or **Status: WIP** line. When more than one sprint is WIP, stop and name the mismatch in the summary. Do not guess.
- One sprint keeps one `### Retrospective` section inside that `## Sprint N` block.
- When `### Retrospective` is missing, insert it after the last item table (`### **Done**`, `### **WIP**`, or `### **ToDo**`) and before the next `---` or `## Sprint` heading. Use this skeleton, then add the first numbered block:

```markdown
### Retrospective

**Learnings**

**Opportunities**

No opportunity is recorded yet.

**Future actions**

No future action is recorded yet.
```

- When `### Retrospective` already exists, append the next `{number}. {when}, {trigger}` under Learnings, Opportunities, and Future actions when each label has a point. `{number}` is the next integer under that label in the sprint.
- **`{trigger}` line (required shape).** Write the incident that started this retrospective, not a generic label when the run has a concrete scope.
  - **By rule or delegated Done** (from `sdd-dod.mdc`, **sdd-review-status**, or another skill that sets SBI or PBI **Done**): `{SBI code} {SBI name} done` or `{PBI code} {short Description noun} done`. Copy `{SBI name}` from the sprint table **SBI** column; copy the PBI noun from the product backlog **Description** cell. Example: `feature-42 Seed product-backlog.md done`.
  - **Sprint-end:** `Sprint-end`.
  - **On demand:** use only when the user invoked retrospective (lessons learned, 回顾, `/sdd-retrospective`) and no SBI or PBI row becomes **Done** in the same run. Do not write `On demand` for a by-rule gate that closes one SBI or PBI.
  - **Several SBIs or PBIs in one run:** one `{number}` block with one `{trigger}` that lists each code and operation, comma-separated, in sprint-table order; or split into separate `{number}` blocks, one trigger each. Do not use `On demand` for that case.
- Link bullets to ADR or knowledge paths when those files were written in the same pass.

### changes-log.md

- Write one entry when the retrospective concludes a visible change. Leave secrets out.

## Limits

- Read `locale` from the map. Allowed values are `EN`, `HanS`, and `HanT`. When `locale` is missing, reply in the language of the user's request.
- Do not read an adr folder belonging to another workspace pack repo as runtime knowledge for a client project.
- Do not copy ADR or knowledge instance shape sections from practices into `{workspace}` as standalone template files.
- Do not commit unless the user asks.
- Leave `{client_root}/.sdd-installed.json` unchanged.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled.
- User Stories and Acceptance Criteria stay with `atdd-expert` or `sdd-spec-to-build`.
- `sdd-review-status` compares and writes process picks only after the user chooses; it runs this skill before any pick that sets SBI or PBI `Done`.
