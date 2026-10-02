# SDD Scrum practices

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-01
> [Definition](#definition-of-sdd-scrum-practicesmd)

---

## Index

- [Terminology in practice](#terminology-in-practice)
  - [Definition of sdd-scrum-practices.md](#definition-of-sdd-scrum-practicesmd)
  - [Definition of sprint-backlog.md](#definition-of-sprint-backlogmd)
  - [Definition of status.md](#definition-of-statusmd)
  - [Definition of issues-log.md](#definition-of-issues-logmd)
  - [Definition of changes-log.md](#definition-of-changes-logmd)
  - [Definition of artifacts-map.md](#definition-of-artifacts-mapmd)
- [Artifacts writing guideline](#artifacts-writing-guideline)
  - [General writing principles](#general-writing-principles)
  - [Core artifacts](#core-artifacts)
    - [artifacts-map.md](#artifacts-mapmd)
  - [Framework (process) artifacts](#framework-process-artifacts)
    - [product-backlog.md](#product-backlogmd)
    - [sprint-backlog.md](#sprint-backlogmd)
    - [status.md](#statusmd)
    - [issues-log.md](#issues-logmd)
    - [changes-log.md](#changes-logmd)
  - [Engineering artifacts](#engineering-artifacts)
    - [architecture.md](#architecturemd)
    - [{module-name}-design.md](#module-name-designmd)
    - [{module-name}-stories.md](#module-name-storiesmd)
    - [{module-name}-test.md](#module-name-testmd)
    - [deployment.md](#deploymentmd)
    - [.secrets](#secrets)
- [Jobs](#jobs-what-how-when)
  - [1. On-board agent](#1-on-board-agent)
  - [2. Start a new project](#2-start-a-new-project)
  - [3. Update project settings](#3-update-project-settings)
  - [4. Refine product backlog](#4-refine-product-backlog)
  - [5. Sprint planning](#5-sprint-planning)
  - [6. Report status](#6-report-status)
  - [7. Retrospective](#7-retrospective)
  - [8. Start a new sprint](#8-start-a-new-sprint)

## Terminology in practice

Names and meanings stay in [Terminology](./scrum-in-sdd.md#terminology) in `scrum-in-sdd.md`. That heading is `## Terminology`.

### Definition of sdd-scrum-practices.md

- `sdd-scrum-practices.md` is the guideline for writing artifacts so they stay aligned with Scrum in SDD.
- Use it before editing an artifact, and when a job is about to run.
- It is for AI agents, and for the person who writes or reviews an artifact.
- It states what, how, and when. It does not redefine guide terms.

### Definition of sprint-backlog.md

**Purpose**: `sprint-backlog.md` is the Sprint Backlog artifact in [`scrum-in-sdd.md`](./scrum-in-sdd.md). Unlike the Sprint Backlog in classic Scrum, `sprint-backlog.md` lists every sprint.

**Single source of truth**: `sprint-backlog.md` owns the schedule and the item status. It is the latest project progress.

**Projection**: The `Sprint` column in `product-backlog.md` copies the schedule from `sprint-backlog.md`.

**Related**:
- `artifacts-map.md`
- `scrum-in-sdd.md`
- `status.md`
- `product-backlog.md`
- `sdd-scrum-practices.md`

**Sprint planning principles**:
- Each sprint states one [Sprint Goal](./scrum-in-sdd.md#commitment-sprint-goal).
- The planned [Increment](./scrum-in-sdd.md#increment) is what reaches that goal.
- Each sprint delivers a minimum viable product (MVP) with the fewest dependencies, and ships without waiting on an Increment from a later sprint.
- A sprint backlog item (SBI) is an item required to build those Increments, such as a Feature or a Task.
- A side task or a temporary task found during the sprint, and not needed to deliver those Increments, is an on-going task (OGT) in `status.md`.

### Definition of status.md

- `status.md` is the tracking projection.
- It is not a second sprint backlog. It is not the defect list.
- The schedule and the item status stay in `sprint-backlog.md`.
- Product items stay in `product-backlog.md`.
- A concluded change stays in `changes-log.md`.
- Paths stay in `artifacts-map.md`.

### Definition of issues-log.md

- `issues-log.md` records issues. A defect is one kind of issue.
- A row is opened when an issue is found and stays after it is closed.
- When a fix is concluded, `changes-log.md` gets its own entry.
- An open issue is not an on-going task (OGT) row in `status.md`.

### Definition of changes-log.md

- `changes-log.md` is the conclusion record. Write an entry when a change is done.
- An entry states what changed, why, and how the change was verified.
- An open defect stays in `issues-log.md`.
- A concluded fix still gets an entry here.
- Step-by-step detail stays in git and in the spec that owns the change.
- Do not put secrets here.

### Definition of artifacts-map.md

- `artifacts-map.md` is the index of where this project's artifacts live.
- A stored path is workspace-relative. Open `{workspace}/<path>`.
- `artifacts_root` is one folder name. When the field is absent, use `specs`.
- A module stores its folder, its stem, and the three file paths.
- The default stem is the folder name. A shorter stem is stored once.

[Back to top](#index)


## Artifacts writing guideline

Read this before editing an artifact.

**When**: copy or refresh locale seeds during on-board (job 1) if working copies are missing; on new project (job 2); on update settings (job 3) only when relocating or filling a gap. Do not overwrite filled working copies unless the user confirms. Do not copy `constants.md` into the artifacts root.

**From where**: locale seeds from `.cursor/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy each listed locale seed to the workspace-relative `local` path named in `artifacts-map.md`. Do not place every file under `artifacts_root`. The map file itself stays `{workspace}/artifacts-map.md`. Read `constants.md` from `{client_root}/templates/framework.sdd.works/constants.md` after install; do not copy it into the artifacts root.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (seeds vs working copies). `constants.md` is pack lookup on the client root, not a working copy under the artifacts root.


### General writing principles

**Wording**

- Use short, precise, accurate, concise wording. One sentence carries one fact.
- A name is a noun. A title is one short subject line.
- One fact stays one line, or one short paragraph when a line cannot carry it.
- Two or more facts become a bullet list. One fact is one bullet.
- In a table cell, each bullet is its own line, separated by `<br>`.
- Use one name for one thing in the whole file. Put the plain meaning beside a specialist term on first use.
- Write a name from the end user's view. Name the result.

**Structure**

- The file header is a blockquote of three lines. `Type` names the artifact group and the product. `as_of` is the date of the last edit. `Definition` links that file's section under [Terminology in practice](#terminology-in-practice). One sentence per line. One link per line. The blockquote ends at the first `---`.
- A heading level matches the role: file title, section, entry or table, numbered point.
- Sections stay in the order named for that file.
- Indent a continuation two spaces under its bullet. Leave no blank line between the bullet and that line.
- Omit a line, a label, or a block the section does not need.

**Links and ownership**

- Keep the key point in this section. Put the detail in the file that owns it, and link that file.
- A link to a spec gives the id, the link, and the name.
- Link a term. Do not copy its definition into the artifact.
- Do not restate the section rules in the live body.
- Each artifact keeps its own job. Do not record a fact in a second file that already owns it.

**Examples**

- Add a good example and a bad example when the shape is easy to miss.
- The good example shows the required shape. The bad example shows one failure.

[Back to top](#index)

### Core artifacts

#### artifacts-map.md

[`artifacts-map.md`](./artifacts-map.md) is the index of where this project's artifacts live. Sections, in order: Header, one block per file, one block per module.


##### Header


###### Template

```markdown
# Artifacts map ({product name})

> Type: Core artifact of {product name}
> as_of: {date}
> [Definition]({practices}#definition-of-artifacts-mapmd)

---

- product name: {product name}
- artifacts_root: {artifacts root}
- locale: {locale}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{product name}` is the product name. The EN seed uses Pokymon Card Collection.
- `{date}` is the date of the last edit. The EN seed uses a sample date.
- `{practices}` is the path to `sdd-scrum-practices.md`.
- `{artifacts root}` is one folder name relative to the workspace. When the field is absent, use `specs`. `docs` is an example. Any other single folder name is valid.
- `{locale}` is `EN`, `HanS`, or `HanT`.
- The EN seed writes concrete paths with the root `specs`. Do not write `{artifacts_root}` inside a path.
- Good: `artifacts_root: specs` and `local: specs/product-backlog.md`.
- Bad: `artifacts_root: spec` while the path starts with `specs/`.


##### File


###### Template

```markdown
## {name}

- name: {name}
- local: {path}
- purpose: {purpose}
```


###### How to write

- One block per file that exists. Omit a file the project does not have.
- `{name}` is the artifact name.
- `{path}` is workspace-relative. Open `{workspace}/{path}`. Do not prefix `artifacts_root` again.
- A file under the artifacts root includes that folder in `{path}`.
- The map file is the exception. Its `{path}` is `artifacts-map.md` when the file sits at the workspace root.
- `{purpose}` is one sentence, and only when that sentence stops a wrong copy. Omit the line when the name is enough.
- Good: `local: specs/product-backlog.md`.
- Bad: an ASCII tree in place of `local`.


##### Module


###### Template

```markdown
## {folder}

- folder: {folder}
- stem: {stem}
- design: {artifacts root}/{folder}/{stem}-design.md
- stories: {artifacts root}/{folder}/{stem}-stories.md
- test: {artifacts root}/{folder}/{stem}-test.md
```


###### How to write

- One block per module folder that exists.
- `{folder}` is the folder name under `artifacts_root`.
- `{stem}` is the name in the three filenames. The default is `{folder}`. A shorter stem is stored once on this block.
- Two modules do not use the same stem.
- The three paths are workspace-relative and include `{artifacts root}`.
- Good: folder `web-app`, stem `app`, design `specs/web-app/app-design.md`.
- Bad: `stem_1: web-app` in the header while the file is `app-design.md`.

[Back to top](#index)

### Framework (process) artifacts

#### product-backlog.md

[`product-backlog.md`](./product-backlog.md) records product items. The requirement text is a paragraph under each feature name in the Requirements section. The table `Description` is a short summary of that paragraph. Relations, the schedule projection, and product-level status stay in the table.


##### Columns and maintenance boundary

Columns are fixed: `Category`, `PBI Code`, `PBI`, `Description`, `Related`, `Sprint`, `Status`. There is no DoD column. `Category` is one word. `PBI Code` is that word plus a two-digit number, such as `Collect-01`. Each feature in Requirements is one tight list item: the PBI code and name, then the requirement on the next indented line. Rows with the same category stay together. Do not insert a row by pb number when that would split the category. Inside a category, order by PBI code. The category list belongs to the product. A file or skill that already has its own row is not also a parent row. Skill folders start with `sdd-`.

A Definition of Done section sits above the Product Backlog table. It lists the generic checks. Every PBI uses that list. The checks must be executable and observable, and they carry the verification method for a RID solution. A sprint item uses the Definition of Done section above the first sprint table. A sprint may state a replacement checklist above its own tables.

- The requirement paragraph, related links, and status are owned by the Product Backlog.
- `Description` stays a short summary. Do not put the requirement in that cell.
- `Sprint` is a projection of the schedule in `sprint-backlog.md`. It must not become a second schedule.
- A Product Backlog item cited by a RID must have a stable item anchor. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references prefer the PBI code and the item name. Feature lines and table cells stay plain Markdown (see Writing markdown).


##### Status

A PBI uses the same three statuses as an SBI: `ToDo`, `WIP`, and `Done`. See Status under `sprint-backlog.md` for the meanings and the examples.

**Apply the Definition of Done checklist before marking a PBI `Done`.** Do not mark the PBI `Done` while any check in that section is open. A related SBI can be `Done` while the PBI stays `ToDo` or `WIP` when the PBI checklist is wider than that SBI.

The status cell contains only the word. Put the completion date and the evidence in the sprint note or in `changes-log.md`.

[Back to top](#index)

#### sprint-backlog.md

[`sprint-backlog.md`](./sprint-backlog.md) is the schedule and the execution list. It contains the RID Log and one section per sprint. The ToDo table of each sprint is the single source of truth for that sprint’s items and status.


##### Header

The header ends at the first `---`.


###### Template

```markdown
# sprint-backlog, {product name}

> Type: Framework (process) artifact of {product name}
> as_of: {date}
> [Definition]({practices}#definition-of-sprint-backlogmd)

## Current project progress

- Total sprints: {count}
- Current WIP sprint: [**{Sprint N}**](#{sprint-n}). Click the link to jump to {Sprint N}.
- Sprint goal: {sprint goal}

### Index

- [RID Log](#rid-log-risksimpediments-dependencies)
- [Sprint 1](#sprint-1)
- {one link for each later sprint}

---
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{product name}` is the product name.
- `Type` is `Framework (process) artifact of {product name}`.
- `{practices}` is the path from `sprint-backlog.md` to `sdd-scrum-practices.md`. `Definition` links [Definition of sprint-backlog.md](#definition-of-sprint-backlogmd).
- `as_of` is the date of the last edit. The EN seed uses a sample date. After copying, replace the product name and the date.
- `{count}` is the number of sprint sections.
- `{Sprint N}` is the sprint whose status line is WIP. Copy `{sprint goal}` from that sprint word for word. When no sprint is WIP, write `none` for Current WIP sprint and for Sprint goal.
- The Index link text is the name only. RID Log is first. Then one link per sprint, in sprint order.


##### RID Log


###### Template

```markdown
## RID Log (Risks,Impediments, Dependencies)

[Back to the top](#{h1})

> This section records risks, impediments, and dependencies for the entire project. It does not belong to any sprint.

### Open RIDs

| # | Severity | Title | Description | Impact | Solution | Related | Created Sprint |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {type}-{number} | {severity} | {title} | {description} | {impact} | {solution} | {related} | {sprint} |

### Closed RIDs

| # | Severity | Title | Description | Impact | Solution | Related | Closed Sprint |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {type}-{number} | {severity} | {title} | {description} | {impact} | {solution} | {related} | {sprint} |
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{type}-{number}` is the RID type and a number, such as `R-1`, `I-2`, or `D-3`. `R` is a risk. `I` is an impediment. `D` is a dependency.
- `{severity}` is one of `Fetal`, `Broken`, `Blocking`, `High`, `Medium`, or `Low`.
- `{title}` names the problem. Write `HTTP MCP cannot write local ledger file`. Do not write `HTTP fallback ledger is AI-written`.
- `{description}` is up to three bullets.
- `{impact}` names the PBI and the SBI that cannot be delivered.
- `{solution}` names the fix.
- `{related}` links the spec.
- `{sprint}` is the sprint name. Open RIDs use Created Sprint. Closed RIDs use Closed Sprint.
- Sort each table by created time, newer first. Then sort by severity: Fetal, Broken, Blocking, High, Medium, Low.
- An open row stays in Open RIDs. A closed row moves to Closed RIDs.


##### Definition of Done

The section sits above the first sprint. It ends at the next `---`.


###### Template

```markdown
## Definition of Done

{intro}

- {check}

{replacement}

- {replacement check}

{item acceptance}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{intro}` is two sentences. Every sprint item uses this checklist. Mark the row `Done` only when every check passes.
- `{check}` is the default list for every sprint that has no replacement.
- The quality check names the test specs and links them. The live file links the agent test, the MCP test, and the portal test. The EN seed links [Definition of Done](./scrum-in-sdd.md#commitment-definition-of-done).
- `{replacement}` names the sprints that use a different checklist, then says those sprints use this checklist instead.
- `{item acceptance}` is Additional Done Criteria for one row under that sprint. It does not add a table column.
- The term is [Commitment: Definition of Done](./scrum-in-sdd.md#commitment-definition-of-done).


##### Sprint body


###### Template

```markdown
## Sprint {n}

[Back to the top](#{h1})

Sprint Goal: {sprint goal}

{depends}

**Status: {status}** {status note}

{progress note}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{n}` is the sprint number. The heading is `## Sprint` plus that number, so the preview id stays `sprint-1` and the same pattern for each later sprint.
- The next line is `[Back to the top](#{h1})`. `{h1}` is the preview id of the file title.
- Current project progress copies `{sprint goal}` word for word.
- `{depends}` names an earlier sprint this sprint waits on.
- `{status}` is bold: `**ToDo**`, `**WIP**`, or `**Done**`.
- `{status note}` is the reason, in parentheses. Sprint 1 in the EN seed uses `**Status: Done** (every item is complete)`.
- `{progress note}` sits before the item table. Sprint 4 uses `No row is WIP. The first ToDo row is feature-30.`
- The item table and the Retrospective are the next sections.


##### Sprint item table


###### Template

```markdown
### **{table status}**

Additional Done Criteria, on top of the Definition of Done:

- `{code}`: {additional done criteria}

| # | Code | SBI | Parent PBI | Module/Type | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| {n} | {code} | {sbi} | {parent} | {module}/{type} | {related} | **{status}** |
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{table status}` is the same bold word as the sprint status: `**ToDo**`, `**WIP**`, or `**Done**`.
- `{additional done criteria}` is one check for `{code}`. The Definition of Done still applies.
- Columns stay in this order: `#`, `Code`, `SBI`, `Parent PBI`, `Module/Type`, `Related specs`, `Status`. There is no DoD column.
- `{n}` is the place in this table, from 1. It is not the SBI. When a row moves, renumber `#`. The Code stays.
- `{code}` is the Type in lowercase, a hyphen, and a two-digit number inside that sprint, such as `feature-01` or `task-01`. Numbering restarts at `01` for each Type in each sprint. The cell is plain text. A link to the row uses the sprint heading, such as `#sprint-1`.
- `{sbi}` names the Increment as a tangible deliverable.
  Good: `Updated agent ethan.md with onboard capability`.
  Bad: `Update ethan.md onboard`.
- `{parent}` is the PBI code and the PBI name, and it links the product-backlog anchor.
- `{module}/{type}` is one cell.
  `{type}` is one of these:
  - `Feature` delivers something the product ships for use.
  - `Task` is supporting work that is not a feature, research, a bug fix, or documentation.
  - `Bug-fix` corrects a defect in something already delivered.
  - `Documentation` writes or retargets an explanation.
  - `Research` records evidence before a feature is specified.
- `{related}` links the requirement, design, test, decision, or process spec.
- `{status}` is one bold word in the cell: `**ToDo**`, `**WIP**`, or `**Done**`.
  - `**ToDo**` means not started.
  - `**WIP**` means started, and an acceptance criterion is still open or the Definition of Done has not been applied.
  - `**Done**` means every acceptance criterion is met, and the Definition of Done has been applied.
- Sort the rows in this order.
  Status is first: `**Done**`, then `**WIP**`, then `**ToDo**`.
  Type is second: `Feature`, then `Task`, then `Bug-fix`, then `Documentation`, then `Research`.
  Created time is third: a newer row comes before an older row.


##### Retrospective


###### Template

```markdown
### Retrospective

**Learnings**

#### {number}. {when}, {trigger}
- {learning}

**Opportunities**

#### {number}. {when}, {trigger}
- {opportunity}

**Future actions**

#### {number}. {when}, {trigger}
- {action}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- One sprint has one Retrospective.
  A later run adds the next number under these three labels.
  Do not add a second Retrospective heading.
  Do not add a second Learnings, Opportunities, or Future actions label.
- `{number}` starts at 1 for the first retrospective in that sprint.
  The next retrospective uses the next number.
  One retrospective uses the same number under each label that has a point.
- `{when}` is the date in brackets, such as `[Sep 24, 2026]`.
- `{trigger}` is `Sprint-end`, `On demand`, or the incident that fired the rule, such as `feature-01 done`.
- `{learning}`, `{opportunity}`, and `{action}` are the key points.
  The bullet links the ADR or the knowledge note when one was written.
- A label with no record uses one sentence.
  Learnings uses `No learning is recorded yet.`
  Opportunities uses `No opportunity is recorded yet.`
  Future actions uses `No future action is recorded yet.`
- Good: the bullet stays on the next line, with no blank line above it.
  ```markdown
  **Learnings**
  #### 1. [Sep 24, 2026], feature-01 done
  - The guide and practices have one authoring place.
    [The guide and practices have one authoring place](./sdd-scrum-practices.md)
  ```
- Bad: a blank line between the heading and the bullet, or a second `**Learnings**` for the next retrospective.
- When the schedule changes, update the Product Backlog `Sprint` projection in the same change.

[Back to top](#index)

#### status.md

[`status.md`](./status.md) is the tracking projection. It is not a second sprint backlog. It is not the defect list. Sections, in order: Header, Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), Last 15 closed OGTs, Last updated. Column rules are in [`framework-design.md`](../../../framework-design.md).


##### Header


###### Template

```markdown
# The latest status of {product name}

> Type: Framework (process) artifact of {product name}
> as_of: {date}
> [Definition]({practices}#definition-of-statusmd)

---
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{product name}` is the product name. The EN seed uses Pokymon Card Collection.
- `Type` is `Framework (process) artifact of {product name}`.
- `{practices}` is the path from `status.md` to `sdd-scrum-practices.md`. `Definition` links [Definition of status.md](#definition-of-statusmd).
- `as_of` is the date of the last edit. The EN seed uses a sample date. After copying, replace the product name and the date.


##### Project progress


###### Template

```markdown
## Project progress

| Milestone | Status |
| --- | --- |
| Project kickoff | {milestone status} |
| Initial product backlog refined | {milestone status} |

| Sprint | Status | Note |
| --- | --- | --- |
| {sprint range or name} | {sprint status} | {note} |
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- The milestone table has two rows: Project kickoff and Initial product backlog refined.
- `{milestone status}` is `ToDo`, `WIP`, or `Done`.
- The sprint table columns are `Sprint`, `Status`, and `Note`. There is no Sprint Goal column.
- Consecutive Done sprints share one row, such as `Sprint 1 - 3`. Consecutive ToDo sprints share one row. A WIP sprint is its own row.
- `{sprint status}` is `ToDo`, `WIP`, or `Done`.
- An empty Note cell is allowed.
- This section does not list SBIs.


##### where we are now


###### Template

```markdown
## where we are now

- Which sprint are we working on now: {sprint name} ({sprint status}). {one sentence}
- What SBI are we working on now: {SBI code} {SBI name}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- The heading has no colon.
- `{sprint name}` and `{sprint status}` match the WIP sprint row in Project progress.
- `{one sentence}` states the current work.
- `{SBI code}` and `{SBI name}` name one current SBI.
- When more than one SBI is WIP, name the SBI this file is advancing now.


##### what could be the next


###### Template

```markdown
## what could be the next

- {SBI code} {SBI name}
- {SBI code} {SBI name}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- The heading has no colon.
- Each bullet is one SBI after the current SBI, in sprint item order.


##### Current OGT(On-going Tasks)


###### Template

```markdown
## Current OGT(On-going Tasks)

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| {n} | {task name} | {affected} | {sprint name} | {status} |
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- An OGT is a temporary or side task. It is not an SBI split from a PBI.
- The newest row stays on top. `{n}` is rewritten from 1 through the row count on every insert or move. It is not a permanent id.
- `{affected}` is empty, or the SBI code and the SBI name.
- `{sprint name}` is the sprint name when the row was created.
- `{status}` is `ToDo`, `WIP`, or `Done`.
- A `Done` row leaves this table and becomes row 1 of Last 15 closed OGTs.
- An open defect is not a row. It belongs in `issues-log.md`.
- Do not write an `OGT for Sprint…` lead-in.


##### Last 15 closed OGTs


###### Template

```markdown
## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| {n} | {task name} | {affected} | {created sprint} | {closed sprint} |
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- The newest closed row stays on top. `{n}` is rewritten from 1 through the row count.
- `{created sprint}` is the sprint name when the row was created.
- `{closed sprint}` is the sprint name when the row closed.
- `{affected}` follows the same bullet rule as Current OGT.
- Cap the table at 15 rows. A 16th row drops the oldest.
- The number a task had while open ends when the row moves here.


##### Last updated


###### Template

```markdown
Last updated: {timestamp} {agent name}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{timestamp}` is the date and time of the last edit.
- `{agent name}` is the agent that wrote the line.
- This line sits after Last 15 closed OGTs. There is no heading.

[Back to top](#index)

#### issues-log.md

[`issues-log.md`](./issues-log.md) records issues. A defect is one kind of issue. A row is opened when an issue is found and stays after it is closed. When a fix is concluded, `changes-log.md` gets its own entry. An open issue is not an OGT row in `status.md`.


##### Header

The header ends at the first `---`.


###### Template

```markdown
# Issues log ({product name})

> Type: Framework (process) artifact of {product name}
> as_of: {date}
> [Definition]({practices}#definition-of-issues-logmd)

---
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{product name}` is the product name.
- `Type` is `Framework (process) artifact of {product name}`.
- `{practices}` is the path from `issues-log.md` to `sdd-scrum-practices.md`. `Definition` links [Definition of issues-log.md](#definition-of-issues-logmd).
- `as_of` is the date of the last edit. The EN seed uses a sample date. After copying, replace the product name and the date.
- Two tables, in order: Open issues, then Closed issues.
- Open columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, `Added time`.
- Status is `Open`, `Fixed`, or `Deferred`. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means the issue is accepted and not scheduled. A row moves to Closed issues only when it is `Closed`.
- Closed columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, `Closed time`.
- `Component` is the part that owns the issue, such as Web-app, MCP, or Agent.
- `Priority` is `Fatal`, `High`, `Medium`, or `Low`.
- `Id` stays the same when a row is sorted or moves.
- `Description` is under 3 lines. `Close Check` is shorter.
- Sort each table by component A to Z, then by time, oldest first. Open uses `Added time`. Closed uses `Closed time`.
- Write the date as `30/Sep/2026`.

[Back to top](#index)

#### changes-log.md

[`changes-log.md`](./changes-log.md) is the conclusion record. Write an entry when a Change is done.


##### Header

The header ends at the first `---`.


###### Template

```markdown
# Changes log ({product name})

> Type: Framework (process) artifact of {product name}
> as_of: {date}
> [Definition]({practices}#definition-of-changes-logmd)

---
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{product name}` is the product name.
- `Type` is `Framework (process) artifact of {product name}`.
- `{practices}` is the path from `changes-log.md` to `sdd-scrum-practices.md`. `Definition` links [Definition of changes-log.md](#definition-of-changes-logmd).
- `as_of` is the date of the last edit. The EN seed uses a sample date. After copying, replace the product name, the date, and the sample entries.


##### Entry


###### Template

```markdown
## {YYYY-MM-DD}

### {title}

**Why**: {why}

**What changed**: {what}

**Verification**: {verification}

**Boundary**: {boundary}
```


###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{YYYY-MM-DD}` is the day of the entry.
  Days are headings `## YYYY-MM-DD`.
  The newest day is first.
  Under a day, the newest entry is first.
- `{title}` names the concluded change.
- `{why}` states why the change was made.
- `{what}` names the files and the backlog or sprint item when one exists.
  It links that item by its existing heading.
- `{verification}` names the check that passed.
- `{boundary}` says what the entry leaves out.
  Omit the Boundary label and paragraph when the entry does not need them.
- The EN seed may keep sample entries. After a project copies the file, those samples are removed.
- Good: Why, What changed, and Verification are each one short paragraph. What changed names the file and the sprint item. Boundary is present only to say what the entry leaves out.
  ```markdown
  ## 2026-10-01
  ### Confirmed the status.md seed
  **Why**: The status seed had no section rules, so a copied project could drift from the practices.
  **What changed**: Sprint 4 feature-27 updated [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) and the EN [`status.md`](./status.md) seed.
  **Verification**: Ethan confirmed the live example and the EN seed.
  **Boundary**: HanS and HanT copies stay on i18n-02.
  ```
- Bad: Why tells what was tried, What changed names no file, and Verification is missing.
  ```markdown
  ## 2026-10-01
  ### Status work
  **Why**: I read the seed and then I decided to tidy it.
  **What changed**: Updated the docs.
  **Boundary**: Everything else stays the same.
  ```

[Back to top](#index)

### Engineering artifacts

#### architecture.md

[`architecture.md`](./architecture.md) records the stack and a small number of decisions. Product behavior stays in `product-backlog.md`. This file is optional and written when a decision needs a home.

[Back to top](#index)

#### {module-name}-design.md

`{module-name}` is the stem stored in `artifacts-map.md`. The default stem is the module folder name. A shorter stem is set once.

`{module-name}-design.md` is the design spec.

Section rules for a module file are written when that seed is in review. They follow [Template and How to write](../../../../seed-artifacts-building-guide.md).

[Back to top](#index)

#### {module-name}-stories.md

`{module-name}-stories.md` holds user stories and acceptance criteria.

[Back to top](#index)

#### {module-name}-test.md

`{module-name}-test.md` is the test spec.

[Back to top](#index)

#### deployment.md

[`deployment.md`](./deployment.md) records how to start locally and the order of steps at go-live. Do not put host names, secrets, or customer environment names here. This file is optional and written when those steps exist.

[Back to top](#index)

#### .secrets

`.secrets` stores secret names and where the values live. It does not store secret values. This file is optional and written when the project has secrets. Do not commit real values.

[Back to top](#index)

#### framework-design.md

[`framework-design.md`](../../../framework-design.md) is the overall design for framework artifacts. The sprint-item shape (columns, Type, status, and the retrospective block) is in its templates section. It also places `artifacts-map.md` at the workspace root and names `artifacts_root` there. This practices file states how to apply that shape.

[Back to top](#index)

## Jobs (what, how, when)


### 1. On-board agent

- On-board agent ethan.
- Load artifact templates from the framework.sdd.works folder, or via `sdd_install_framework` / `sdd_update_framework`, when artifacts are missing.
- Run an on-board check and tell the user that agent ethan is ready.
- Record current status in `status.md` and suggest what to do next.

[Back to top](#index)

### 2. Start a new project

- Decide language of project artifacts (EN, HanS, HanT).
- Decide workspace folder structure from sub-systems, architecture, and components.
- Specify the sdd-scrum artifacts root (default: `{workspace_folder}/specs`) and sub-folders if needed.
- Record that structure in `{workspace}/artifacts-map.md` (required core artifact; this project’s index). Name `artifacts_root` there. It is one folder name relative to the workspace. When the field is absent, use `specs`. `docs` is an example. Any other single folder name is valid.
- Copy artifact templates to the locations named in `artifacts-map.md`, for the chosen language.
- Ensure agent ethan can operate those files.
- Record current status in `status.md` and tell the user the project is initialized, with suggestions for what to do next.

[Back to top](#index)

### 3. Update project settings

- Update language of project artifacts (EN, HanS, HanT).
- Update workspace folder structure from sub-systems, architecture, and components.
- Update the sdd-scrum artifacts root (default: `{workspace_folder}/specs`) and sub-folders if needed.
- Update `artifacts-map.md` so it remains this project’s index.
- Relocate artifact files to match language and `artifacts-map.md`.
- Ensure agent ethan can operate those files.
- Record current status in `status.md` and tell the user the project is updated, with suggestions for what to do next.

[Back to top](#index)

### 4. Refine product backlog

*(to fill)*

[Back to top](#index)

### 5. Sprint planning

*(to fill)*

[Back to top](#index)

### 6. Report status

- Follow `sdd-review-status` (`skill_get_status`). [ADR-076](../../../../adr/ADR-076-review-status-one-skill.md).
- The skill compares the board with the open items in the current sprint.
- The skill lists each mismatch.
- The skill writes the text the user accepts after the second yes.
- How to write each process file stays in this file under that file's Definition and How to write.

[Back to top](#index)

### 7. Retrospective

*(to fill)*

[Back to top](#index)

### 8. Start a new sprint

*(to fill)*

[Back to top](#index)

