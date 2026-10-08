---
name: sdd-retrospective
description: >
  Run a retrospective after DoD, at sprint-end, or on demand. Record ADRs and knowledge,
  append a brief Learnings, Opportunities, and Future actions block on sprint-backlog.md,
  and report a Retrospective Summary in the same turn. Focus on continuous inspection and
  adaptation of process, ways of working, technologies, and AI-agent and human-user
  collaboration. No second confirm to persist ADR, knowledge, or the sprint Retrospective
  block. Close confirm for backlog **Done** stays on sdd-dod.mdc before **Done** row writes.
  Use when the user asks for retrospective, lessons learned, 回顾, 总结经验, or
  /sdd-retrospective, or when sdd-dod.mdc requires the gate before Done. sdd-review-status
  does not replace this skill on SBI or PBI close.
---

# Retrospective

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

The practices file for this run is `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`.

ADR instance shape: that file, section `#adr-instance-shape`.

Knowledge instance shape: that file, section `#knowledge-instance-shape`.

Those sections stay on `{client_root}`. They are not copied into `{workspace}` as separate template files.

This skill supports continuous inspection and adaptation for continuous learning and improvement. Scope a retrospective to process, ways of working, technologies, and collaboration between AI agents and human users. It is not a task log, a delivery summary, or a substitute for backlog planning.

The sprint-backlog **Learnings**, **Opportunities**, and **Future actions** labels carry three kinds of point:

- **Learnings:** what was learned.
- **Opportunities:** what improvement opportunities were identified.
- **Future actions:** what future actions should be taken to improve how the team works.

Record durable decisions in the adr folder and durable notes in the Knowledge folder. Keep each sprint-backlog bullet to one sentence and link to those files for detail.

A **Learning** names one concrete incident: a correction in chat, a repeated mistake, a prior **Future action**, or an assumption in an earlier ADR. A general impression is not a Learning.

An AI-agent and human-user point records only a pattern: the human corrected the agent, the agent crossed a skill boundary, or a gate (close confirm, or an empty retrospective) changed the next run.

A by-rule or delegated Done run writes at most one numbered block. **Sprint-end** writes at most three numbered blocks. On demand follows the same cap as the trigger it matches: one block when the user names one SBI or PBI, three when the user asks for the sprint.

A **Future action** names the next inspection point: the next **Sprint-end**, or the next similar SBI. On **Sprint-end**, score each still-open **Future action** from an earlier sprint as landed, partial, or not landed, in one **Learnings** sentence. Do not edit the earlier bullet.

## Capabilities

The host picks order from the thread.

| Action | When |
| --- | --- |
| Review completed work | An SBI, PBI, sprint, or RID scope is in context; state what was learned, what improvement opportunities were identified, and what future actions should be taken, scoped to process, ways of working, technologies, and AI-agent and human-user collaboration |
| Classify the lesson | Before any write; split ADR-worthy, knowledge-worthy, sprint Retrospective bullet only, or nothing durable |
| Resolve write roots | Before ADR or knowledge writes; read `adr` and `knowledge` from `{workspace}/artifacts-map.json` |
| Shape new files | Before creating instances; read practices `#adr-instance-shape` and `#knowledge-instance-shape` |
| Ensure Retrospective section | Before a sprint-backlog append when the section is missing under the target sprint |
| Append sprint record | After classification; add numbered blocks under **Learnings**, **Opportunities**, and **Future actions** per practices |
| Score prior Future actions | On **Sprint-end**; mark each still-open earlier **Future action** as landed, partial, or not landed in one **Learnings** sentence |
| Persist in one pass | When ADR, knowledge, changes-log, or sprint-backlog updates apply; write without a second confirm |
| Send summary | After writes or when a blocker stops the run; send **Retrospective Summary** in the same reply |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start; read `adr`, `knowledge`, `locale`, and process file paths |
| `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, Retrospective under sprint-backlog | Before editing `sprint-backlog.md`; for **Learnings**, **Opportunities**, and **Future actions** label scope and `{trigger}` shape |
| `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, `#artifacts-mapjson` | Before ADR or knowledge writes |
| `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, `#adr-instance-shape` | Before creating an ADR instance |
| `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, `#knowledge-instance-shape` | Before creating a knowledge instance |
| `{client_root}/rules/sdd-dod.mdc` | By-rule gate before Done |
| Existing files under `{workspace}/{adr}` and `{workspace}/{knowledge}` | Numbering and index updates |
| Prior **Future actions** blocks in `{workspace}` sprint-backlog for earlier sprints | **Sprint-end**, to score each still-open action as landed, partial, or not landed |
| Accepted ADR files this sprint relied on | When the run writes or cites an ADR, to state in one sentence whether an earlier assumption held |

## When to run

- **By rule:** `sdd-dod.mdc` before a PBI or SBI is `Done`, or before RID close when a durable lesson exists. Run this skill in the same session before the backlog row becomes `Done`.
- **Delegated:** `sdd-review-status` and any other skill or rule that sets an SBI or PBI to `Done` invokes this skill first in the same turn.
- **Sprint-end:** before or while closing a sprint (`Sprint-end` trigger).
- **On demand:** the user asks for retrospective, lessons learned, 回顾, or `/sdd-retrospective`.

`{trigger}` on the sprint record follows practices Retrospective under sprint-backlog in `sdd-scrum-practices.md` and **By rule** / **On demand** in `{client_root}/templates/framework.sdd.works/pack-scrum-in-sdd.md` (Sprint Retrospective).

When a write needs `adr` or `knowledge` and the map has no key, stop and name **sdd-update-project**. Do not invent paths.

An empty retrospective is valid. When the only candidate bullets are next tasks, previous task summaries, board status, or restated design decisions, treat the run as empty. Do not write those as **Learnings**, **Opportunities**, or **Future actions**. Append nothing under ADR or knowledge. Still ensure the sprint **Retrospective** section exists for by-rule and **Sprint-end** triggers: add one **Learnings** bullet that the gate ran and nothing durable was saved, or use the practices empty sentence on a label with no point. State in the summary that nothing durable was persisted.

## Retrospective Summary (after write)

Every sentence the user reads is written from the user's view. Wording checks link `{client_root}/rules/friendly-language.mdc`.

Send one message:

- **Completed:** {PBI code, SBI code, sprint name, or task name}
- **ADRs created or updated:** {path and one line why, or `none`}
- **Knowledge created or updated:** {path and one line what was learned, or `none`}
- **Skipped:** {anything considered but not saved, or `none`}
- **Continuous-improvement insight:** {one sentence on process, ways of working, technologies, or AI-agent and human-user collaboration, or `none`}
- **Prior Future actions:** {on **Sprint-end**, each scored landed, partial, or not landed, or `none`}
- **Sprint-backlog Retrospective:** {sprint name and `{number}. {when}, {trigger}` written, or `none`}

Do not ask for a second confirm to apply retrospective writes (ADR, knowledge, Retrospective append). Do not use a question card for those writes. The user may correct in a follow-up message. When this run is by-rule before **Done**, do not write **Done** rows; the host applies **close confirm** from `sdd-dod.mdc` after Retrospective Summary unless the user already gave **close confirm** for that scope.

## Write rules

Write in this order when more than one file changes: new ADR instances, new or updated knowledge (and knowledge README index when present), `changes-log.md` when the run concludes a visible change, `sprint-backlog.md` Retrospective append. Skip `issues-log.md`, `status.md`, and `product-backlog.md` unless the pick for this run names them.

### ADR instances

- When `artifacts-map.json` has no `adr` key, stop and name `sdd-update-project`. Do not assume `{workspace}/{adr}`.
- Join `{workspace}` and the `adr` root. Create the next `ADR-{NNN}-{short-title}.md` using the practices ADR instance shape.
- Do not edit an accepted ADR to reverse a decision. Supersede with a new ADR.
- Do not create an ADR when an accepted ADR already records the same decision.
- Do not edit an accepted ADR to say whether an assumption held. When this run writes or cites an ADR, add one sprint **Learnings** sentence on whether an earlier assumption held.

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

- When `### Retrospective` already exists, append the next `{number}. {when}, {trigger}` under **Learnings**, **Opportunities**, and **Future actions** when each label has a point. `{number}` is the next integer under that label in the sprint.
- **`{trigger}` line (required shape).** Write the incident that started this retrospective, not a generic label when the run has a concrete scope.
  - **By rule or delegated Done** (from `sdd-dod.mdc`, **sdd-review-status**, or another skill that sets SBI or PBI **Done**): `{SBI code} {SBI name} done` or `{PBI code} {short Description noun} done`. Copy `{SBI name}` from the sprint table **SBI** column; copy the PBI noun from the product backlog **Description** cell. Example: `feature-42 Seed product-backlog.md done`.
  - **Sprint-end:** `Sprint-end`.
  - **On demand:** use only when the user invoked retrospective (lessons learned, 回顾, `/sdd-retrospective`) and no SBI or PBI row becomes **Done** in the same run. Do not write `On demand` for a by-rule gate that closes one SBI or PBI.
  - **Several SBIs or PBIs in one run:** one `{number}` block with one `{trigger}` that lists each code and operation, comma-separated, in sprint-table order; or split into separate `{number}` blocks, one trigger each. Do not use `On demand` for that case.
- Keep each **Learnings**, **Opportunities**, and **Future actions** bullet to one sentence. Put detail in the ADR or knowledge file and link the bullet to it. When no ADR or knowledge file was written in the same pass, the bullet still states the insight and stops.
- A **Learning** names the concrete incident in that same sentence.
- A **Future action** names a process or collaboration change and the next inspection point: the next **Sprint-end**, or the next similar SBI. It is not a backlog row, a test run ticket, or "schedule PBI X" unless the improvement is explicitly how planning or delivery works.
- A by-rule or delegated Done run appends at most one `{number}` block. **Sprint-end** appends at most three. On **Sprint-end**, also append one **Learnings** sentence per still-open earlier **Future action**, scored landed, partial, or not landed. Those score lines share the **Sprint-end** `{number}` block. They do not count toward the three-block cap.

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
- Backlog scheduling and new requirements stay with `sdd-refine-backlog`, `sdd-plan-sprint`, or `/new-requirement`; this skill does not add PBIs or SBIs.
- `sdd-review-status` compares and writes process picks only after the user chooses; it runs this skill before any pick that sets SBI or PBI `Done`.

## Anti-patterns

- A next task or a "run CE-SKILL-N" line written as a **Future action**.
- A previous task summary or **close confirm** recap written as a **Learning**.
- A design decision restated as a **Learning** when it belongs in the design spec or an ADR.
- A bullet with no link when an ADR or knowledge file was written in the same pass.
- A **Future action** with no next inspection point (the next **Sprint-end**, or the next similar SBI).
- A **Learning** with no concrete incident.
- A retrospective that only restates what the SBI shipped with no insight into how work is done.
- **Learnings**, **Opportunities**, and **Future actions** filled with delivery facts that belong in `changes-log.md` or the sprint **Done** table alone.
- Shipping metrics (commit counts, lines of code, streaks, or praise leaderboards) used as the retrospective.
