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
  - scrum-in-sdd.md
  - product-backlog.md
  - changes-log.md
  - artifacts-map.md
  - status.md
  - architecture.md
  - deployment.md
---

# SDD Scrum practices

This file is the **single source of truth** for what, how, and when AI agents apply sdd-scrum (Cursor, Claude Code, Codex, CodeBuddy, and similar). Names and meaning stay in [`scrum-in-sdd.md`](./scrum-in-sdd.md).

Table conventions for each template seed are under **Templates**. Product facts, design, and test criteria stay in their own specs.

The other templates in this folder use Pokymon Card Collection as the worked example. After you copy them, replace `[product name]` with the real product name and maintain the process docs using this file.

## Index

- [Terminology in practice](#terminology-in-practice)
- [Writing markdown](#writing-markdown)
- [Jobs (what, how, when)](#jobs-what-how-when)
  - [1. On-board agent](#1-on-board-agent)
  - [2. Start a new project](#2-start-a-new-project)
  - [3. Update project settings](#3-update-project-settings)
  - [4. Refine product backlog](#4-refine-product-backlog)
  - [5. Sprint planning](#5-sprint-planning)
  - [6. Report status](#6-report-status)
  - [7. Retrospective](#7-retrospective)
  - [8. Start a new sprint](#8-start-a-new-sprint)
- [Templates](#templates)
  - [constants.md](#constantsmd)
  - [product-backlog.md](#product-backlogmd)
  - [sprint-backlog.md](#sprint-backlogmd)
  - [artifacts-map.md](#artifacts-mapmd)
  - [status.md](#statusmd)
  - [changes-log.md](#changes-logmd)
  - [issues-log.md](#issues-logmd)
  - [architecture.md](#architecturemd)
  - [deployment.md](#deploymentmd)
  - [.secrets](#secrets)
  - [scrum-in-sdd.md](#scrum-in-sddmd)
  - [sdd-scrum-practices.md](#sdd-scrum-practicesmd)
  - [framework-design.md](#framework-designmd)
- [Single source of truth](#single-source-of-truth)
- [Links](#links)

## Terminology in practice

- [Terminology](./scrum-in-sdd.md#terminology) in `scrum-in-sdd.md` holds the name and the meaning for each listed term.
- A listed term uses a heading that links to Terminology.
- The lines under a listed-term heading are the practice in framework.sdd.works.
- The lines under a listed-term heading do not copy the meaning.
- The Sprint Goal heading links to [Commitment: Sprint Goal](./scrum-in-sdd.md#commitment-sprint-goal).
- The Sprint Goal lines do not copy that meaning.
- MVP has no statement in `scrum-in-sdd.md`, so the MVP heading holds the one meaning.

### [Scrum in SDD](./scrum-in-sdd.md#terminology)

- [`scrum-in-sdd.md`](./scrum-in-sdd.md) holds the name.
- `sdd-scrum-practices.md` holds what, how, and when.

### [Spec](./scrum-in-sdd.md#terminology)

- `product-backlog.md` owns the requirement paragraph.
- A sprint item links the story spec. The cell does not copy the story body.
- Example: cite `V1` from the sprint item. The full criterion stays in the design or test spec.

### [Harness](./scrum-in-sdd.md#terminology)

- `constants.md` lists the rules and the skills.
- Jobs 1 through 3 name the agent ethan.

### [Rule](./scrum-in-sdd.md#terminology)

- `constants.md` holds the Rules table. The key has no `.mdc`. The file name sits under `rules_dir`.
- Apply the Definition of Done checklist in `product-backlog.md` and above the first sprint table before an item is `Done`.
- Example: a catalog item stays `WIP` while the duplicate-card check is still open.

### [Skill](./scrum-in-sdd.md#terminology)

- `constants.md` holds the Skills table. One folder is one row. A folder name starts with `sdd-`.
- Jobs 1 through 8 in this file are the when for those skills.
- Example: add the skill row in the same change as the skill. Do not leave a prompt that types the folder name itself.

### [Agent](./scrum-in-sdd.md#terminology)

- Jobs 1 through 3 name ethan.
- `status.md` ends with Last updated, a timestamp, and the agent name.

### [Workflow](./scrum-in-sdd.md#terminology)

- Jobs 1 through 8 in this file are the sequence.
- Jobs 4 through 8 are still unfilled.

### [Knowledge](./scrum-in-sdd.md#terminology)

- `adr/` holds a durable decision. `knowledge/` holds a reusable note.
- The sprint Retrospective links that file only when the file was written.

### [Artifact](./scrum-in-sdd.md#terminology)

- `artifacts-map.md` is the index of live files.
- Another doc links the path. It does not keep a second catalog.
- Example: `specs/product-backlog.md` opens as `{workspace}/specs/product-backlog.md`.

### [PBI](./scrum-in-sdd.md#terminology)

- `product-backlog.md` uses `PBI Code` and `PBI`.
- The `Sprint` column copies the schedule from `sprint-backlog.md`.
- Example: `Collect-01` is the code. The requirement is the next indented line under the feature name.
- A related SBI can be `Done` while the PBI stays `ToDo` when the PBI checklist is wider than that SBI.

### [SBI](./scrum-in-sdd.md#terminology)

- `sprint-backlog.md` uses the `SBI` column. `status.md` names the current SBI.
- `#` is the place in the table. `Code` stays when the row moves.
- Example: the row that was `#2` can become `#3`, and `feature-01` is still `feature-01`.
- Status is only `ToDo`, `WIP`, or `Done`.

### [Increment](./scrum-in-sdd.md#terminology)

- The Definition of Done sections in `product-backlog.md` and `sprint-backlog.md` are the checks for usable output.
- Example: met acceptance criteria leave the SBI `WIP` until that checklist has been applied.

### [OGT](./scrum-in-sdd.md#terminology)

- `status.md` holds Current OGT and the latest 15 closed OGTs.
- An open defect is a row in `issues-log.md`. It is not an OGT row.
- Example: each Affected SBIs bullet is the code and the SBI name.

### [Sprint Goal](./scrum-in-sdd.md#commitment-sprint-goal)

- The sprint section in `sprint-backlog.md` states one Sprint Goal.
- Current project progress copies that Sprint Goal word for word.

### MVP

- MVP (minimum viable product) is the smallest Increment a user can use on its own.

[Back to top](#index)

## Writing markdown

Every spec and process artifact must stay readable in the IDE markdown preview. A file that a standard parser renders in full can still stop part way in Cursor preview. Apply these rules to every artifact.

- Keep lists tight. Put the continuation of a list item on the next line, indented two spaces, with no blank line after the item line.
- Do not write a loose list: an item line, a blank line, then an indented paragraph. After a header blockquote with several links, that list stops Cursor preview at the paragraph before the list.
- Use plain Markdown links. Do not write raw HTML such as `<a id="…"></a>`.
- Put placeholders with angle brackets inside a code span, such as `` `<path>` ``.
- After editing a long artifact, open the preview and check that the last section renders.

**Good example**

```markdown
- [Collect-01](#pb-1) Catalog a card
  The collector records name, set, card number, rarity, and quantity.
- [Collect-02](#pb-2) Search by set and rarity
  Search only the current collector’s cards.
```

**Bad example**

```markdown
- [Collect-01](#pb-1) Catalog a card

  The collector records name, set, card number, rarity, and quantity.
```

[Back to top](#index)

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
- Record that structure in `{workspace}/artifacts-map.md` (required core artifact; this project’s index). Name `artifacts_root` there. It is one folder name relative to the workspace. When the field is absent, use `specs`. `docs` is an example. Any other single folder name is valid.
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

[Back to top](#index)

## Templates

**When**: copy or refresh locale seeds during on-board (job 1) if working copies are missing; on new project (job 2); on update settings (job 3) only when relocating or filling a gap — never overwrite filled working copies without the user confirming. Do not copy `constants.md` into the artifacts root.

**From where**: locale seeds from `.cursor/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy each listed locale seed to the workspace-relative `local` path named in `artifacts-map.md`. Do not place every file under `artifacts_root`. The map file itself stays `{workspace}/artifacts-map.md`. Read `constants.md` from `{client_root}/templates/framework.sdd.works/constants.md` after install; do not copy it into the artifacts root.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: [`scrum-in-sdd.md`](./scrum-in-sdd.md) (seeds vs working copies). `constants.md` is pack lookup on the client root, not a working copy under the artifacts root.

Each heading below is one seed file. The RID Log is a section inside `sprint-backlog.md`. It is not a separate seed. `constants.md` is listed first because it is not a locale seed.

### constants.md

[`constants.md`](../constants.md) is the pack lookup for path names, the instructions URL, skill keys, and rule keys. Ethan reads it after `{client_root}/.sdd-installed.json` has `pack_complete: true`. On a failed start he reads `instructions_url` from it when the file can be read. Home after install: `{client_root}/templates/framework.sdd.works/constants.md` ([ADR-060](../../../../adr/ADR-060-constants-on-client-root.md)).

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

[`product-backlog.md`](./product-backlog.md) records product items. The requirement text is a paragraph under each feature name in the Requirements section. The table `Description` is a short summary of that paragraph. Relations, the schedule projection, and product-level status stay in the table.

#### Columns and maintenance boundary

Columns are fixed: `Category`, `PBI Code`, `PBI`, `Description`, `Related`, `Sprint`, `Status`. There is no DoD column. `Category` is one word. `PBI Code` is that word plus a two-digit number, such as `Collect-01`. Each feature in Requirements is one tight list item: the PBI code and name, then the requirement on the next indented line. Rows with the same category stay together. Do not insert a row by pb number when that would split the category. Inside a category, order by PBI code. The category list belongs to the product. A file or skill that already has its own row is not also a parent row. Skill folders start with `sdd-`.

A Definition of Done section sits above the Product Backlog table. It lists the generic checks. Every PBI uses that list. The checks must be executable and observable, and they carry the verification method for a RID solution. A sprint item uses the Definition of Done section above the first sprint table. A sprint may state a replacement checklist above its own tables.

- The requirement paragraph, related links, and status are owned by the Product Backlog.
- `Description` stays a short summary. Do not put the requirement in that cell.
- `Sprint` is a projection of the schedule in `sprint-backlog.md`. It must not become a second schedule.
- A Product Backlog item cited by a RID must have a stable item anchor. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references prefer the PBI code and the item name. Feature lines and table cells stay plain Markdown (see Writing markdown).

#### Status

A PBI uses the same three statuses as an SBI: `ToDo`, `WIP`, and `Done`. See Status under `sprint-backlog.md` for the meanings and the examples.

**Apply the Definition of Done checklist before marking a PBI `Done`.** Do not mark the PBI `Done` while any check in that section is open. A related SBI can be `Done` while the PBI stays `ToDo` or `WIP` when the PBI checklist is wider than that SBI.

The status cell contains only the word. Put the completion date and the evidence in the sprint note or in `changes-log.md`.

### sprint-backlog.md

[`sprint-backlog.md`](./sprint-backlog.md) is the schedule and the execution list. It contains the RID Log and one section per sprint. The ToDo table of each sprint is the single source of truth for that sprint’s items and status.

#### Header

The header ends at the first `---`.

##### Template

```markdown
# sprint-backlog, {product name}

> **Purpose**: `sprint-backlog.md` is the Sprint Backlog artifact in [`scrum-in-sdd.md`]({path}), and, unlike the Sprint Backlog in classic Scrum, `sprint-backlog.md` lists every sprint.
> **Single source of truth**: `sprint-backlog.md` owns the schedule and the item status, and represents the latest project progress.
> **Projection**: The `Sprint` column in [`product-backlog.md`]({path}) copies the schedule from `sprint-backlog.md`.
> **Related**: [`artifacts-map.md`]({path}), [`scrum-in-sdd.md`]({path}), [`status.md`]({path}), [`product-backlog.md`]({path}), [`sdd-scrum-practices.md`]({path})
> **{as_of or Example}**: {value}
> **Sprint planning principles**:
> - Each sprint states one [Sprint Goal]({practices}#sprint-goal) and the [Increments]({practices}#increment) planned to reach that goal.
> - Each sprint delivers an [MVP]({practices}#mvp) (minimum viable product) with the fewest dependencies, and ships without waiting on an Increment from a later sprint.
> - [SBIs]({practices}#sbi) (sprint backlog items) are the items required to build those Increments, such as Features and Tasks.
> - A side task or a temporary task found during the sprint, and not needed to deliver those Increments, is an [OGT]({practices}#ogt) (on-going task) in [`status.md`]({path}).

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

##### How to write

- `{product name}` is the product name.
- `{path}` is the path from `sprint-backlog.md` to that file. The header has no Framework line.
- The live file uses `as_of` and the value is the date of the last edit. The EN seed uses `Example` instead, names Pokymon Card Collection, and tells the reader to replace the product name and the items after copying `sprint-backlog.md`.
- `{practices}` is the path to `sdd-scrum-practices.md`. Sprint Goal, Increment, MVP, SBI, and OGT link those headings in [Terminology in practice](#terminology-in-practice). Do not copy the meaning.
- Sprint planning principles stay last in the blockquote. A later `>` line would join the last bullet.
- `{count}` is the number of sprint sections.
- `{Sprint N}` is the sprint whose status line is WIP. Copy `{sprint goal}` from that sprint word for word. When no sprint is WIP, write `none` for Current WIP sprint and for Sprint goal.
- The Index link text is the name only. RID Log is first. Then one link per sprint, in sprint order.
- The purpose line uses a comma. One fact per line. Repeat `sprint-backlog.md`. The header has no em dash.

#### RID Log

##### Template

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

##### How to write

- `{type}-{number}` is the RID type and a number, such as `R-1`, `I-2`, or `D-3`. `R` is a risk. `I` is an impediment. `D` is a dependency.
- `{severity}` is one of `Fetal`, `Broken`, `Blocking`, `High`, `Medium`, or `Low`.
- `{title}` is one short subject line. Write `HTTP MCP cannot write local ledger file`. Do not write `HTTP fallback ledger is AI-written`.
- `{description}` is up to three bullets in the cell. Each bullet is `- ` and its own line, separated by `<br>`. Write `- HTTP MCP cannot write the local .sdd-installed.json with pack_complete: true.<br>- Skipping that file blocks Ethan's start gate.`
- `{impact}` is one line about delivery. Write `PBI xxx and SBI xxx cannot be delivered, because agent onboard stops`. Do not write `Install looks successful on HTTP fallback; /ethan still stops`.
- `{solution}` is one line about the fix. Write `Write the ledger last, after verify, name manifestPath in the instructions, and do not commit a true ledger in the pack git tree`. Do not write the steps as a paragraph.
- `{related}` is the spec id, a link, and the spec name. Write `[ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md) End-user stdio installer with HTTP fallback`. Do not write `ADR-058` alone.
- `{sprint}` is the sprint name. Open RIDs use Created Sprint. Closed RIDs use Closed Sprint.
- Sort each table by created time, newer first. Then sort by severity: Fetal, Broken, Blocking, High, Medium, Low.
- Open RIDs use Created Sprint as the created time. Closed RIDs use Closed Sprint as the time column.
- An open row stays in Open RIDs. A closed row moves to Closed RIDs.

#### Definition of Done

The section sits above the first sprint. It ends at the next `---`.

##### Template

```markdown
## Definition of Done

{intro}

- {check}

{replacement}

- {replacement check}

{item acceptance}
```

##### How to write

- `{intro}` is two sentences. Every sprint item uses this checklist. Mark the row `Done` only when every check passes.
- `{check}` is one bullet. The default list is the checklist for every sprint that has no replacement.
- The quality check names the test specs and links them. The live file links the agent test, the MCP test, and the portal test. The EN seed links [Definition of Done](./scrum-in-sdd.md#commitment-definition-of-done).
- `{replacement}` names the sprints that use a different checklist, then says those sprints use this checklist instead. Omit the block when every sprint uses the default list.
- `{replacement check}` is one bullet in that replacement list.
- `{item acceptance}` is one sentence. Additional Done Criteria, on top of the Definition of Done, is the check for one row under that sprint. It does not add a table column.
- Definition of Done keeps its meaning in [Commitment: Definition of Done](./scrum-in-sdd.md#commitment-definition-of-done). Do not copy that meaning.

#### Sprint body

##### Template

```markdown
## Sprint {n}

[Back to the top](#{h1})

Sprint Goal: {sprint goal}

{depends}

**Status: {status}** {status note}

{progress note}
```

##### How to write

- `{n}` is the sprint number. The heading is `## Sprint` plus that number, so the preview id stays `sprint-1` and the same pattern for each later sprint.
- The next line is `[Back to the top](#{h1})`. `{h1}` is the preview id of the file title.
- `{sprint goal}` is one sentence. Current project progress copies that sentence word for word.
- `{depends}` names an earlier sprint this sprint waits on. Omit the line when the sprint does not wait.
- `{status}` is bold: `**ToDo**`, `**WIP**`, or `**Done**`.
- `{status note}` is the reason, in parentheses, when the status needs one. Omit it when the word is enough. Sprint 1 in the EN seed uses `**Status: Done** (every item is complete)`.
- `{progress note}` is one or two sentences before the item table. Omit it when the status line is enough. Sprint 4 uses `No row is WIP. The first ToDo row is feature-30.`
- The item table and the Retrospective are the next sections.

#### Sprint item table

##### Template

```markdown
### **{table status}**

Additional Done Criteria, on top of the Definition of Done:

- `{code}`: {additional done criteria}

| # | Code | SBI | Parent PBI | Module/Type | Related specs | Status |
| --- | --- | --- | --- | --- | --- | --- |
| {n} | {code} | {sbi} | {parent} | {module}/{type} | {related} | **{status}** |
```

##### How to write

- `{table status}` is the same bold word as the sprint status: `**ToDo**`, `**WIP**`, or `**Done**`.
- `{additional done criteria}` is one check for `{code}`. The Definition of Done still applies. Omit the block when the sprint has no extra check.
- Columns stay in this order: `#`, `Code`, `SBI`, `Parent PBI`, `Module/Type`, `Related specs`, `Status`. There is no DoD column.
- `{n}` is the place in this table, from 1. It is not the SBI. When a row moves, renumber `#`. The Code stays.
- `{code}` is the Type in lowercase, a hyphen, and a two-digit number inside that sprint, such as `feature-01` or `task-01`. Numbering restarts at `01` for each Type in each sprint. The cell is plain text. A link to the row uses the sprint heading, such as `#sprint-1`.
- `{sbi}` is a noun. It names the Increment as a tangible deliverable that creates value. It is short, precise, concise, clean, and clear. Write it from the end user's view.
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
- `{related}` links the requirement, design, test, decision, or process spec. Do not copy the spec body into the cell.
- A cell with one fact stays one line. A cell with more than one fact uses bullets. Each bullet is `- ` on its own line, separated by `<br>`.
  Good: `- [Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7)<br>- [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63)`
  Bad: `[Agent-02 agent ethan: initial capabilities](./product-backlog.md#pb-7) · [Agent-15 Pack file: agents/ethan.md](./product-backlog.md#pb-63)`
- `{status}` is one bold word in the cell: `**ToDo**`, `**WIP**`, or `**Done**`.
  - `**ToDo**` means not started.
  - `**WIP**` means started, and an acceptance criterion is still open or the Definition of Done has not been applied.
  - `**Done**` means every acceptance criterion is met, and the Definition of Done has been applied.
- Sort the rows in this order.
  Status is first: `**Done**`, then `**WIP**`, then `**ToDo**`.
  Type is second: `Feature`, then `Task`, then `Bug-fix`, then `Documentation`, then `Research`.
  Created time is third: a newer row comes before an older row.
- SBI keeps its meaning in [SBI](#sbi). Do not copy that meaning.

#### Retrospective

##### Template

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

##### How to write

- One sprint has one Retrospective.
  A later run adds the next number under these three labels.
  Do not add a second Retrospective heading.
  Do not add a second Learnings, Opportunities, or Future actions label.
- `{number}` starts at 1 for the first retrospective in that sprint.
  The next retrospective uses the next number.
  One retrospective uses the same number under each label that has a point.
- `{when}` is the date in brackets, such as `[Sep 24, 2026]`.
- `{trigger}` is `Sprint-end`, `On demand`, or the incident that fired the rule, such as `feature-01 done`.
- `{learning}`, `{opportunity}`, and `{action}` are key points from the end user's view.
  One point is one bullet.
  The detail goes in the ADR or the knowledge note.
  The bullet links that file when one was written.
- A label with no record uses one sentence.
  Learnings uses `No learning is recorded yet.`
  Opportunities uses `No opportunity is recorded yet.`
  Future actions uses `No future action is recorded yet.`
  Good:
  ```markdown
  **Learnings**

  #### 1. [Sep 24, 2026], feature-01 done

  - The guide and practices have one authoring place.
    [The guide and practices have one authoring place](./sdd-scrum-practices.md)
  ```
  Bad: a second `**Learnings**` for the next retrospective, or a paragraph that copies the ADR into the sprint.

- When the schedule changes, update the Product Backlog `Sprint` projection in the same change. When implementation status changes, write each table back according to its own job. Do not let one table stand in for the other.

### artifacts-map.md

[`artifacts-map.md`](./artifacts-map.md) is the required index of live files and trees for this project. On a project it lives at `{workspace}/artifacts-map.md` and names `artifacts_root`. That field is one folder name relative to the workspace. When it is absent, use `specs`. `docs` is an example. Any other single folder name is valid. Paths in the map are workspace-relative. Open `{workspace}/<path>`. Do not prefix `artifacts_root` again. Example: `specs/product-backlog.md` is `{workspace}/specs/product-backlog.md`. It is not the framework definition. Other docs link paths here. They do not keep a second catalog.

### status.md

[`status.md`](./status.md) is the tracking projection. Sections, in order: Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), and the latest 15 closed OGTs. The progress sprint table is `Sprint`, `Status`, `Note`. Consecutive Done sprints share one row. Consecutive ToDo sprints share one row. Where we are now states the sprint and its status, then one sentence. What is next follows the current sprint, the current SBI, and the sprint item order. Each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name. The file ends with Last updated, a timestamp, and the agent name. The sprint backlog stays the SBI list. An OGT is a temporary or side task. An open defect belongs in `issues-log.md`. Column rules are in [`framework-design.md`](../../../framework-design.md).

### changes-log.md

[`changes-log.md`](./changes-log.md) is the conclusion record. Write an entry when a change is done. The entry states what changed, why, and how it was verified. An open defect stays in `issues-log.md`. A concluded fix still gets an entry here. Step-by-step detail stays in git and in the spec that owns the change.

The title is `Changes log ([product name])`. There is no `status:` line and no `as_of` line. Days are headings `## YYYY-MM-DD`. The newest day is first. Under a day, the newest entry is first. Each entry is a `###` title, then **Why**, **What changed**, and **Verification**. **Boundary** is present only when the entry must say what it does not cover. Each of those labels is one short paragraph. **What changed** names the files and the backlog or sprint item when one exists. **Verification** names the check that passed. The EN seed may keep sample entries. After a project copies the file, those samples are removed.

### issues-log.md

[`issues-log.md`](./issues-log.md) records defects. A row is opened when a defect is found and stays after it is closed. It is not the change log. When a fix is concluded, `changes-log.md` gets its own entry. An open defect is not an OGT row in `status.md`.

Two tables, in order: Open issues, then Closed issues.

Open columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Status`, `Added time`. Status is `Open`, `Fixed`, or `Deferred`. `Fixed` means a fix exists and the close check is not confirmed. `Deferred` means the defect is accepted and not scheduled. A row moves to Closed issues only when it is `Closed`.

Closed columns: `Id`, `Title`, `Component`, `Priority`, `Description`, `Related`, `Close Check`, `Closed Sprint`, `Closed time`.

`Component` is the part that owns the defect, such as Web-app, MCP, or Agent. Use one term for that part in the whole file. `Priority` is `Fatal`, `High`, `Medium`, or `Low`. `Id` stays the same when a row is sorted or moves. `Description` is under 3 lines. `Close Check` is shorter. Use bullets when a sentence is not enough. `Related` is a spec id, a link, and the name. Sort each table by component A to Z, then by time, oldest first. Open uses `Added time`. Closed uses `Closed time`. Write the date as `30/Sep/2026`.

### architecture.md

[`architecture.md`](./architecture.md) records the stack and a small number of decisions. Product behavior stays in `product-backlog.md`. This file is optional and written when a decision needs a home.

### deployment.md

[`deployment.md`](./deployment.md) records how to start locally and the order of steps at go-live. Do not put host names, secrets, or customer environment names here. This file is optional and written when those steps exist.

### .secrets

`.secrets` stores secret names and where the values live. It does not store secret values. This file is optional and written when the project has secrets. Do not commit real values.

### scrum-in-sdd.md

[`scrum-in-sdd.md`](./scrum-in-sdd.md) is framework text: names and meaning. Locale copies share this filename. It does not take what, how, and when from this practices file.

### sdd-scrum-practices.md

This file. What, how, and when. It does not redefine guide terms.

### framework-design.md

[`framework-design.md`](../../../framework-design.md) is the overall design for framework artifacts. The sprint-item shape (columns, Type, status, and the retrospective block) is in its templates section. It also places `artifacts-map.md` at the workspace root and names `artifacts_root` there. This practices file states how to apply that shape.

[Back to top](#index)

## Single source of truth

| Information | Single source | How other docs cite it |
|---|---|---|
| RID status, impact, and current handling summary | RID Log in `sprint-backlog.md` | Cite only the RID id and title |
| Product solution and acceptance criteria | `product-backlog.md` | RID links the item anchor; the item’s `Related` column links the sprint item and design or test source |
| Sprint schedule and execution status | Sprint Backlog in `sprint-backlog.md` | Product Backlog `Sprint` is only a projection; `Related` may link the execution item |
| Detailed design and verification matrix | The design or test spec | Process tables keep a summary and a section link |
| Process evidence and reason for change | `changes-log.md` | Tracking artifact; the entry keeps the date, the conclusion, and the link |
| Open, fixed, deferred, and closed defects | `issues-log.md` | Two tables. An open defect is not an OGT row. A concluded fix still gets a change-log entry |
| Project progress, current sprint, current SBI, next items, and OGT rows | `status.md` | Tracking projection; the sprint backlog stays the SBI list |
| Table shape and status meanings | Templates in this file | Process docs link this file from the header |
| Artifact index | `artifacts-map.md` | Other docs link paths; they do not keep a second catalog |
| Durable decisions | `adr/` | Knowledge category; create when ADR-worthy (retrospective) |
| Reusable research / ops notes | `knowledge/` | Knowledge category; create when knowledge-worthy (retrospective) |
| Architecture decisions (optional / JIT) | `architecture.md` | Process tables link the section; they do not restate the full decision |
| Deploy and upgrade steps (optional / JIT) | `deployment.md` | Process tables link the section; they do not restate the full steps |

State each fact in full only in the document that owns it. When the wording changes, check authority document, then citing documents, then the place operators follow, so a second copy does not go stale in silence.

[Back to top](#index)

## Links

- [`sprint-backlog.md`](./sprint-backlog.md): RID Log and Sprint Backlog
- [`product-backlog.md`](./product-backlog.md): product items and acceptance criteria
- [`status.md`](./status.md): project progress, current sprint, current SBI, next items, open OGTs, latest 15 closed OGTs
- [`changes-log.md`](./changes-log.md): tracking — process evidence and change record
- [`issues-log.md`](./issues-log.md): defects — Open issues and Closed issues
- [`artifacts-map.md`](./artifacts-map.md): core artifact index
- [`scrum-in-sdd.md`](./scrum-in-sdd.md): names and meaning
- [`architecture.md`](./architecture.md): optional / JIT — architecture and decisions
- [`deployment.md`](./deployment.md): optional / JIT — deploy and upgrade
- `.secrets`: optional — secret names and where values live. Not a file of secret values.
- `adr/`: knowledge, under the artifacts root, when a decision is ADR-worthy. Not a file in this seed folder.
- `knowledge/`: knowledge, under the artifacts root, when a note is reusable. Not a file in this seed folder.

[Back to top](#index)
