# SDD Scrum practices

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-04
> [Definition](#terminology-in-practice)

---

## Index

- [Terminology in practice](#terminology-in-practice)
- [Artifacts writing guideline](#artifacts-writing-guideline)
  - [General writing principles](#general-writing-principles)
  - [artifacts-map.json](#artifacts-mapjson)
  - [Header (process artifacts)](#header)
  - [Framework (process) artifacts](#framework-process-artifacts)
    - [product-backlog.md](#product-backlogmd)
      - [Requirements](#requirements)
      - [Product Backlog table](#product-backlog-table)
    - [sprint-backlog.md](#sprint-backlogmd)
      - [Current project progress and Index](#current-project-progress-and-index)
      - [Unplanned PBIs](#unplanned-pbis)
    - [status.md](#statusmd)
    - [issues-log.md](#issues-logmd)
    - [changes-log.md](#changes-logmd)
  - [Engineering artifacts](#engineering-artifacts)
    - [architecture.md](#architecturemd)
    - [{module-name}-design.md](#module-name-designmd)
    - [{module-name}-stories.md](#module-name-storiesmd)
    - [{module-name}-tests.md](#module-name-testsmd)
    - [deployment.md](#deploymentmd)
    - [.secrets](#secrets)
    - [framework-design.md](#framework-designmd)
- [Scrum in SDD practices](#scrum-in-sdd-practices)
  - [1. Plan sprints by MVP](#1-plan-sprints-by-mvp)
  - [2. Slice product to MVPs](#2-slice-product-to-mvps)
    - [Example](#example)
  - [3. Evaluate Product Backlog Readiness](#3-evaluate-product-backlog-readiness)
  - [4. Size product backlog](#4-size-product-backlog)

## Terminology in practice

Harness names, artifact names, and Scrum guide terms stay in [Terminology](./scrum-in-sdd.md#terminology) in `scrum-in-sdd.md`. This table is the store for backlog and sprint work names used in process artifacts.


| #   | Terminology | Definition                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | <a id="term-pbi"></a>PBI | Product backlog item. One row on `product-backlog.md`, scheduled or unscheduled. |
| 2   | <a id="term-sbi"></a>SBI | Sprint backlog item. One row in a sprint table on `sprint-backlog.md`. |
| 3   | <a id="term-feature"></a>Feature | Usable product capability. Record a Feature as a PBI first. Record it as an SBI when a sprint includes it. |
| 4   | <a id="term-task"></a>Task | Work that is not a Feature.<br>- A Task that creates value as part of product delivery is a PBI.<br>- A Task that is only the effort to build one PBI or one SBI stays internal. Do not record it as a PBI or an SBI.<br>- A shared Task required to deliver one sprint may be an SBI. It is not a PBI. |
| 5   | <a id="term-ogt"></a>OGT | On-going task. Temporary or side work in `status.md`. An OGT is not a PBI and not an SBI. |
| 6   | <a id="term-mvp"></a>MVP | Minimum viable product. The smallest feature set in which the user finishes one job in one sprint. |
| 7   | <a id="term-pbi-size-epic"></a>Epic (PBI Size) | One outcome too broad to ship as one PBI. Split into more PBI rows before sprint planning. |
| 8   | <a id="term-pbi-size-theme"></a>Theme (PBI Size) | One area whose requirement bullets still hide more than one path. Tighten to Implementable before sprint planning. |
| 9   | <a id="term-pbi-size-implementable"></a>Implementable (PBI Size) | One user-visible outcome. The PBI may get a sprint and SBIs. |
| 10  | <a id="term-issue"></a>Issue | A defect or other issue. Record an Issue only in `issues-log.md`. |
| 11  | <a id="term-rid"></a>RID | A risk, an impediment, or a dependency. Record a RID only in the RID Log in `sprint-backlog.md`. |


[Back to top](#index)

## Artifacts writing guideline

Read this before editing an artifact.

**When**: copy or refresh locale seeds during onboard if working copies are missing; on `sdd-update-project` when the map is missing, or when relocating or filling a gap. Do not overwrite filled working copies unless the user confirms. Do not copy `constants.json` into the artifacts root.

**From where**: locale seeds from `.cursor/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy each listed locale seed to the workspace-relative path named in `artifacts-map.json`. Do not place every file under `artifacts_root`. The map file itself stays `{workspace}/artifacts-map.json`. Read `constants.json` from `{client_root}/templates/framework.sdd.works/constants.json` after install; do not copy it into the artifacts root.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: `[scrum-in-sdd.md](./scrum-in-sdd.md)` (seeds vs working copies). `constants.json` is pack lookup on the client root, not a working copy under the artifacts root.

**Section reads**: A job opens one heading in this file. The read starts at that heading and stops at the next heading of the same level. The skill or agent names the heading.

### General writing principles

**Wording**

- Use short, precise, accurate, concise wording. One sentence carries one fact.
- A name is a noun. A title is one short subject line.
- One fact stays one line, or one short paragraph when a line cannot carry it.
- Two or more facts become a bullet list. One fact is one bullet.
- In a table cell, each bullet is its own line, separated by `<br>`.
- Use one name for one thing in the whole file. Put the plain meaning beside a specialist term on first use.
- Write a name from the end user's view. Name the result.
- A heading names what the reader gets. A single verb fails. The check is check 19 in `[friendly-language.mdc](../../rules/friendly-language.mdc)`.
bad example: `Reply`
good example: `Summarize the findings`
- An example the user reads states what the user understands. An example that only states what the agent saw in the files fails. The check is check 20 in `[friendly-language.mdc](../../rules/friendly-language.mdc)`.
bad example: "the card-list file is already in the workspace"
good example: "the actual status is WIP because the card list page is already in the web app"
- A line the user reads is written from the user's view: the status, the reason, and the change. The check is check 21 in `[friendly-language.mdc](../../rules/friendly-language.mdc)`.
good example: "In sprint-backlog.md, set feature-03 Card list view from ToDo to WIP."

**Structure**

- Process artifact file headers use [Header (process artifacts)](#header). One sentence per blockquote line. One link per line. The blockquote ends at the first `---`.
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
- The good example is a line the user understands. The bad example is a line that only states what the agent saw.

[Back to top](#index)

### artifacts-map.json

`{workspace}/artifacts-map.json` is the path configuration for this project.

**Role**

- It is not an artifact.
- It is not a seed.
- A new project does not copy a file from this section.
- `sdd-update-project` writes the file after the user confirms the chat summary.
- The chat summary stays in the chat.

**Keys**

- `artifacts_root` is one folder name. When the key is absent, use `specs`.
- `locale` is `EN`, `HanS`, or `HanT`.
- `files` lists workspace-relative paths that sit outside a module folder.
- `modules` lists one object per module folder.
`folder` is the directory name.
`files` lists the paths in that folder.
`stem` is present only when the filename stem differs from `folder`.

**Shape**

```json
{
  "artifacts_root": "{artifacts root}",
  "locale": "{locale}",
  "files": [
    "{path}"
  ],
  "modules": [
    {
      "folder": "{folder}",
      "stem": "{stem}",
      "files": [
        "{path}"
      ]
    }
  ]
}
```

**Rules**

- Write one folder name in `artifacts_root`, so the key stores that name.
- Write `EN`, `HanS`, or `HanT` in `locale`, so future specs use that language.
- Write one workspace-relative path in `{path}`, so the file opens as `{workspace}/{path}`.
- Write one path for each project file, so a missing file has no path.
- Leave `artifacts-map.json` off `files` and off every module `files` list, so the file does not record its own path.
- Omit `stem` when it matches `folder`, so a matching stem has no `stem` key.
- Write the `artifacts_root` value into each path, so the path matches the setting.
good example: `"artifacts_root": "specs"` and `"specs/product-backlog.md"`
bad example: `"artifacts_root": "spec"` while the path starts with `specs/`
good example: `"folder": "web-app"`, `"stem": "app"`, path `specs/web-app/app-design.md`
bad example: `name` and `purpose` keys beside the path
- Leave the product name, `Type`, `as_of`, and a Definition link out of the file, so the file stays keys and paths.

**Confirm**

`sdd-update-project` shows this summary in the chat before it writes the file.

```text
workspace name: {product name}
workspace folder: {workspace}
locale: {locale}
artifacts_root: {artifacts root}
stems:
- folder {folder}, stem {stem}: {what the module is}
files:
- {artifacts root}/product-backlog.md
- {artifacts root}/sprint-backlog.md
- {artifacts root}/status.md
- {artifacts root}/issues-log.md
- {artifacts root}/changes-log.md
- {artifacts root}/architecture.md
- {artifacts root}/deployment.md
- {artifacts root}/test-strategy.md
- {artifacts root}/.secrets
- {artifacts root}/{folder}/{stem}-design.md
- {artifacts root}/{folder}/{stem}-stories.md
- {artifacts root}/{folder}/{stem}-tests.md
```

- Write the product name in `{product name}`, so the summary names the product.
- Write the workspace folder in `{workspace}`, so the summary shows where the project lives.
- Write the chosen locale in `{locale}`, so the summary shows the language of future specs.
- Write the chosen folder name in `{artifacts root}`, so the summary shows the specs folder.
- Write one stem line for each picked module, so `{what the module is}` states what that module is.
- Omit a file line the project does not have, so the summary lists only the files the map will record.
- Leave this summary out of `artifacts-map.json`, so the file keeps the keys and the path lists.

**Example**

Pokymon Card Collection. The block shows a filled file. A new project does not copy it.

```json
{
  "artifacts_root": "specs",
  "locale": "EN",
  "files": [
    "specs/product-backlog.md",
    "specs/sprint-backlog.md",
    "specs/status.md",
    "specs/issues-log.md",
    "specs/changes-log.md",
    "specs/architecture.md",
    "specs/deployment.md",
    "specs/test-strategy.md",
    "specs/.secrets"
  ],
  "modules": [
    {
      "folder": "web-app",
      "stem": "app",
      "files": [
        "specs/web-app/app-design.md",
        "specs/web-app/app-stories.md",
        "specs/web-app/app-tests.md"
      ]
    },
    {
      "folder": "mcp",
      "files": [
        "specs/mcp/mcp-design.md",
        "specs/mcp/mcp-stories.md",
        "specs/mcp/mcp-tests.md"
      ]
    },
    {
      "folder": "rag",
      "files": [
        "specs/rag/rag-design.md",
        "specs/rag/rag-stories.md",
        "specs/rag/rag-tests.md"
      ]
    }
  ]
}
```

[Back to top](#index)

### Framework (process) artifacts

##### Header

<a id="header"></a>

Every Framework (process) artifact starts with a title line, then this blockquote, then `---`.

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
> Type: Framework (process) artifact of {product name}
> as_of: {date}
> [Definition]({practices}#{artifact-section-id})

---
```

- `{product name}` is the product name. The EN seed uses a sample name. After copying, replace the product name.
- `{date}` is the date of the last edit. The EN seed uses a sample date. After copying, replace the date.
- `{practices}` is the path from the artifact file to `sdd-scrum-practices.md`.
- `{artifact-section-id}` is the preview id of that artifact's `####` heading in this file, such as `product-backlogmd` or `sprint-backlogmd`.
- `Type` is always `Framework (process) artifact of {product name}`.

#### product-backlog.md

`[product-backlog.md](./product-backlog.md)` records product items. Each Requirements item has a PBI code, one noun for the deliverable, and bullets the user can act on. The table uses the same code and the same noun. Relations, the schedule projection, and product-level status stay in the table.

##### Header

###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `product-backlog.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `product-backlogmd`.

```markdown
# Product overview — {product name}
```

##### Requirements

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
- <a id="req-{pb-n}"></a>[{pbi code}](#{pb-n}) {noun}
  - {bullet}
```

- Put `req-{pb-n}` on the Requirements line. Link `{pbi code}` to `#{pb-n}` on the Product Backlog table row.
- Sprint-backlog and other files link `{pbi code}` to `#{pb-n}` only. They do not use `req-{pb-n}`.
- `{noun}` is one noun for the deliverable, the same words as the table `Description`.
- `{bullet}` is one line the person who uses the product can act on.
- Keep one item per i18n code, so HanS and HanT are not a second copy of the same item.

##### Product Backlog table

###### Template

```markdown
| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {seq} | {component} | <a id="{pb-n}"></a>[{pbi code}](#req-{pb-n}) | {noun} | {size} | {related} | {sprint} | {status} |
```

###### How to write

- Write `{seq}` from 1 through the last item, in the same order as Requirements.
- Write `{component}` as the product component for that row.
- Put `{pb-n}` on the PBI Code cell. Link `{pbi code}` to `#req-{pb-n}` on the matching Requirements line.
- `{related}` and other back-references link a PBI code to `#pb-n` on the table row, not to `#req-{pb-n}`.
- Write `{noun}` as the same noun as Requirements. `Description` is that noun, not a summary of a paragraph.
- Write `{size}` as `Epic`, `Theme`, or `Implementable`. See [4. Size product backlog](#4-size-product-backlog).
- Write `{related}` as one link, or as a `<br>` bullet for each link when the cell has more than one.
- Copy `{sprint}` from `sprint-backlog.md`, so that cell is not a second schedule. Write `—` when the PBI row is only in [Unplanned PBIs](#unplanned-pbis).
- Write `{status}` as `ToDo`, `WIP`, or `Done`.
- The template groups rows by component, then by PBI code inside the component. The product may use another grouping. Requirements and the table use the same order.
- A file or skill that already has its own row is not also a parent row. Skill folders start with `sdd-`.
- There is no DoD column. A Definition of Done section sits above the Product Backlog table. It lists the generic checks. Every PBI uses that list. The checks must be executable and observable, and they carry the verification method for a RID solution. A sprint item uses the Definition of Done section above the first sprint table. A sprint may state a replacement checklist above its own tables.
- The requirement bullets, related links, and status are owned by the Product Backlog.
- A Product Backlog item cited by a RID must have a stable item anchor. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references use the PBI code.

##### Status

A PBI uses the same three statuses as an SBI: `ToDo`, `WIP`, and `Done`. See Status under `sprint-backlog.md` for the meanings and the examples.

**Apply the Definition of Done checklist before marking a PBI `Done`.** Do not mark the PBI `Done` while any check in that section is open. A related SBI can be `Done` while the PBI stays `ToDo` or `WIP` when the PBI checklist is wider than that SBI.

The status cell contains only the word. Put the completion date and the evidence in the sprint note or in `changes-log.md`.

[Back to top](#index)

#### sprint-backlog.md

`[sprint-backlog.md](./sprint-backlog.md)` is the schedule and the execution list. It contains the RID Log, one section per sprint, and [Unplanned PBIs](#unplanned-pbis) after the last sprint. The ToDo table of each sprint is the single source of truth for that sprint’s items and status.

##### Header

###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `sprint-backlog.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `sprint-backlogmd`.

```markdown
# sprint-backlog, {product name}
```

##### Current project progress and Index

<a id="current-project-progress-and-index"></a>

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
## Current project progress

- Total sprints: {count}
- Current WIP sprint: [**{Sprint N}**](#{sprint-n}). Click the link to jump to {Sprint N}.
- Sprint goal: {sprint goal}

### Index

- [RID Log](#rid-log-risksimpediments-dependencies)
- [Sprint 1](#sprint-1)
- {one link for each later sprint}
- [Unplanned PBIs](#unplanned-pbis)

---
```

- `{count}` is the number of sprint sections.
- `{Sprint N}` is the sprint whose status line is WIP. Copy `{sprint goal}` from that sprint word for word. When no sprint is WIP, write `none` for Current WIP sprint and for Sprint goal.
- The Index link text is the name only. RID Log is first. Then one link per sprint, in sprint order. Unplanned PBIs is last.

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

##### Unplanned PBIs

The section sits after the last sprint section. It ends at the file end or at the next `---` when more sections follow.

###### Template

```markdown
## Unplanned PBIs

[Back to the top](#{h1})

> Product backlog items with no sprint assignment. The table matches the Product Backlog table in `product-backlog.md` without the `Sprint` column. The `#pb-N` anchor stays on the Product Backlog row only.

| # | Component | PBI Code | Description | Size | Related | Status |
| --- | --- | --- | --- | --- | --- | --- |
| {seq} | {component} | [{pbi code}]({product-backlog}#{pb-n}) | {noun} | {size} | {related} | {status} |
```

###### How to write

- Follow [General writing principles](#general-writing-principles).
- The section lists product backlog items (PBIs) only. Do not put an SBI (sprint backlog item) code in this table. An unscheduled PBI has no SBI until sprint planning adds one.
- List every PBI whose `Sprint` cell in `product-backlog.md` is `—`.
- Use the same columns as the [Product Backlog table](#product-backlog-table) except omit `Sprint`.
- The blockquote stays the two sentences in the Template. Do not add a third sentence that repeats the column rules.
- Write `{seq}` from 1 through the last unplanned row. Group by component, then order by PBI code inside the component. The component order is the same order as the Product Backlog table.
- Link `{pbi code}` to `{product-backlog}#{pb-n}`. Do not add a second `#pb-N` anchor in this file.
- `{noun}` is the Description noun from the Product Backlog row. Do not copy the Requirements bullets into `{noun}`.
- Copy `{size}`, `{related}`, and `{status}` from the Product Backlog row. Rewrite a `Related` link that uses `#pb-n` so it resolves from `sprint-backlog.md`, such as `./product-backlog.md#pb-8`.
- When no PBI is unscheduled, keep the heading, the back link, the blockquote, and the header row. Leave the body empty. The EN seed uses that empty table after the last sample sprint.
- When a PBI gets a sprint, remove its row here, add the sprint SBIs, and update the Product Backlog `Sprint` cell in the same change.
bad example: a row whose PBI Code is `feature-25`, so the table mixes an SBI with PBIs
good example: one row for `Skill-03` with the same noun, related links, and status as the Product Backlog row, and `Sprint` `—` on that PBI

##### Sprint body

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
## Sprint {n}

[Back to the top](#{h1})

Sprint Goal: {sprint goal}

{depends}

**Status: {status}** {status note}

{progress note}
```

- `{n}` is the sprint number. The heading is `## Sprint` plus that number, so the preview id stays `sprint-1` and the same pattern for each later sprint.
- The next line is `[Back to the top](#{h1})`. `{h1}` is the preview id of the file title.
- Current project progress copies `{sprint goal}` word for word.
- `{sprint goal}` follows [Sprint goal line](#sprint-goal-line).
- `{depends}` names an earlier sprint this sprint waits on.
- `{status}` is bold: `**ToDo**`, `**WIP**`, or `**Done**`.
- `{status note}` is the reason, in parentheses. Sprint 1 in the EN seed uses `**Status: Done** (every item is complete)`.
- `{progress note}` sits before the item table when needed.
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

`[status.md](./status.md)` is the tracking projection. It is not a second sprint backlog. It is not the defect list. Sections, in order: Header, Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), Last 15 closed OGTs, Last updated. Column rules are in `[framework-design.md](../../../framework-design.md)`.

##### Header

###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `status.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `statusmd`.

```markdown
# The latest status of {product name}
```

##### Project progress

###### Template

Follow [General writing principles](#general-writing-principles).

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

- The milestone table has two rows: Project kickoff and Initial product backlog refined.
- `{milestone status}` is `ToDo`, `WIP`, or `Done`.
- The sprint table columns are `Sprint`, `Status`, and `Note`. There is no Sprint Goal column.
- Consecutive Done sprints share one row, such as `Sprint 1 - 3`. Consecutive ToDo sprints share one row. A WIP sprint is its own row.
- `{sprint status}` is `ToDo`, `WIP`, or `Done`.
- An empty Note cell is allowed.
- This section does not list SBIs.

##### where we are now

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
## where we are now

- Which sprint are we working on now: {sprint name} ({sprint status}). {one sentence}
- What SBI are we working on now: {SBI code} {SBI name}
```

- The heading has no colon.
- `{sprint name}` and `{sprint status}` match the WIP sprint row in Project progress.
- `{one sentence}` states the current work.
- `{SBI code}` and `{SBI name}` name one current SBI.
- When more than one SBI is WIP, name the SBI this file is advancing now.

##### what could be the next

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
## what could be the next

- {SBI code} {SBI name}
- {SBI code} {SBI name}
```

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

Follow [General writing principles](#general-writing-principles).

```markdown
Last updated: {timestamp} {agent name}
```

- `{timestamp}` is the date and time of the last edit.
- `{agent name}` is the agent that wrote the line.
- This line sits after Last 15 closed OGTs. There is no heading.

[Back to top](#index)

#### issues-log.md

`[issues-log.md](./issues-log.md)` is the issue record. Sections, in order: Header, Open issues, Closed issues.

##### Header

###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `issues-log.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `issues-logmd`.

```markdown
# Issues log ({product name})
```

[Back to top](#index)

#### changes-log.md

`[changes-log.md](./changes-log.md)` is the conclusion record. Write an entry when a Change is done.

##### Header

###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `changes-log.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `changes-logmd`.

```markdown
# Changes log ({product name})
```

- After copying, replace the product name, the date, and remove sample entries when the project no longer needs them.

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
  **What changed**: Sprint 4 feature-27 updated `[sdd-scrum-practices.md](./sdd-scrum-practices.md)` and the EN `[status.md](./status.md)` seed.
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

`[architecture.md](./architecture.md)` records the stack and a small number of decisions. Product behavior stays in `product-backlog.md`. This file is optional and written when a decision needs a home.

[Back to top](#index)

#### {module-name}-design.md

`{module-name}` is the stem stored in `artifacts-map.json`. The default stem is the module folder name. A shorter stem is set once.

`{module-name}-design.md` is the design spec.

Section rules for a module file are written when that seed is in review. They follow [seed-artifacts-building-guide.md](../../../../seed-artifacts-building-guide.md).

[Back to top](#index)

#### {module-name}-stories.md

`{module-name}-stories.md` holds user stories and acceptance criteria.

[Back to top](#index)

#### {module-name}-tests.md

`{module-name}-tests.md` is the test spec.

[Back to top](#index)

#### deployment.md

`[deployment.md](./deployment.md)` records how to start locally and the order of steps at go-live. Do not put host names, secrets, or customer environment names here. This file is optional and written when those steps exist.

[Back to top](#index)

#### .secrets

`.secrets` stores secret names and where the values live. It does not store secret values. This file is optional and written when the project has secrets. Do not commit real values.

[Back to top](#index)

#### framework-design.md

`[framework-design.md](../../../framework-design.md)` is the overall design for framework artifacts. The sprint-item shape (columns, Type, status, and the retrospective block) is in its templates section. It also places `artifacts-map.json` at the workspace root and names `artifacts_root` there. This practices file states how to apply that shape.

[Back to top](#index)

## Scrum in SDD practices

### 1. Plan sprints by MVP

Each sprint delivers one MVP (minimum viable product). A product backlog item (PBI) is one feature on the product backlog.

- Pick the items in `product-backlog.md` that the user needs for one job, so those items are the MVP.
- Shape the MVP around the result the user gets: the PBIs that job needs, and no PBI that job does not need.
- Put that set in one sprint, so the sprint goal is the job the user finishes.
- Use Done sprint sections in this project's `sprint-backlog.md` as the reference grain for the next MVP: one thematic sprint goal, the parent PBIs that job needs, and SBIs that split under those PBIs.
  bad example: one planning option per skill row when those skills are one job for the user.
  good example: Sprint 3 themes R2 portal and MCP; Sprint 4 themes ethan onboard, with many SBIs under fewer parent PBIs.
- When one message offers more than one option, the number of new Implementable SBIs in each option differs by at most one. Count only Feature SBIs the option would add. An on-going task and a Task SBI do not count. Drop an option that is a different size. Do not add unrelated PBIs to make a thin option match. When the job truly needs one Implementable PBI, send that option alone. Do not split one job into one option per PBI.
- When a PBI still needs sprint rows that are not named, that PBI is not ready to close in this sprint. Name it under further refinement. Do not mark refinement as none in the same proposal. Split or refine with [3. Evaluate Product Backlog Readiness](#3-evaluate-product-backlog-readiness) and `sdd-refine-backlog`.
- An [Epic (PBI Size)](#term-pbi-size-epic) or [Theme (PBI Size)](#term-pbi-size-theme) may be named in the MVP plan when that sprint's job needs that outcome. Naming it does not put it on the sprint. It gets no `Sprint` cell and no SBIs until `sdd-refine-backlog` makes it [Implementable (PBI Size)](#term-pbi-size-implementable), or splits or tightens it into Implementable PBIs. The plan records an [OGT](#term-ogt) so that refine happens before the sprint is treated as delivering that outcome.

#### Sprint goal line

###### Template

```markdown
Sprint Goal: {actor} {verb} {result}[ so that {value}].
```

###### How to write

- Write what is true when the sprint is Done, and why that matters when the reason is not already in `{result}`.
- `{actor}` is the plain role that can truthfully claim `{result}` when every PBI in the sprint is Done. Derive `{actor}` from the MVP job and the PBIs in the sprint. Use the name the team would use in conversation. Do not use a fixed placeholder. Do not name tools, files, or ADRs in `{actor}`.
- When two roles each need a full outcome, the MVP is probably too big. Pick the role that closes the loop for this sprint, or split the work across sprints.
- `{verb}` and `{result}` are one job: one verb and one outcome. PBIs and SBIs in the table carry scope. The goal line does not list them.
- `{value}` is one short clause. Omit it when `{result}` already states the benefit.
- Read the line as the user reads `status.md`. That file copies the WIP sprint goal word for word.
  bad example: `Sprint Goal: Install or update writes the pack and a ledger (ADR-059), end users connect via a local program (ADR-058) with HTTP as fallback, and Ethan starts only when pack_complete is true.`
  good example: `Sprint Goal: A developer starts coach ethan from the local agent registry with the latest guide and practices seeds so that the R2 agent spike is callable before install work.`
  good example: `Sprint Goal: An adopter installs or updates the pack, connects MCP, and starts ethan only after a complete install receipt.`
  bad example: `Sprint Goal: Update the web portal and MCP to support framework.sdd.works R2.`
  good example: `Sprint Goal: An adopter sets up R2 from the instructions site without an admin-only path.`
  good example: `Sprint Goal: A developer completes ethan onboard so that the project has an audit verdict and a clear next step from the five process files.`

### 2. Slice product to MVPs

An MVP is the smallest feature set in which the user finishes one job.

- Start with the job the user wants done. That job is the MVP.
- Include every part of the product that job needs, so the user can start the job and get the result in this release. The same rule covers Epic and Theme rows. When the job needs that outcome, name the row in the plan. When the job does not need it, leave it off. The row stays unscheduled until it is Implementable.
- Keep the set small. A few features that close the loop are enough. A long list of screens leaves the job unfinished.
- The user can use this release before the next one starts.
- When the job is still too big, ship only the next result the user can get.
That result can be one step, one rule, one kind of information, or the usual path before anything goes wrong.
- When a question is still open, write it as an on-going task (OGT). An open question is not an MVP.

#### Example

**mypoke.trade product backlog**

mypoke.trade is the sample product. The user is a Pokémon card collector. This list keeps the items for three MVPs. The product has three parts, and items for the same part stay together. The web app comes first, then the agent, then the RAG.

- The web app is the site the user opens.
- The agent is the helper the user can talk to. It also does the work the page cannot do on its own.
- RAG (retrieval-augmented generation) is the notes the agent looks up before it answers.

**Web app**

1. APP-SRCH-002: Search cards by photo
2. APP-OWN-001: Save a card as owned, with a condition
3. APP-OWN-003: See a value while saving an owned card
4. APP-OWN-004: Get a suggested condition from a photo
5. APP-PRICE-001: See an AI price when no shop price is listed

- …

**Agent**

1. AGT-VAL-001: Price a card from the condition the user picked
2. AGT-VAL-002: Price a card from a photo and the user's condition
3. AGT-LIST-001: Estimate a market price when no shop price is listed

- …

**RAG**

1. RAG-CORP-001: Store a small set of pricing notes
2. RAG-RET-001: Return the notes that match the question
3. RAG-RET-002: Continue when no note is found

- …

**Sample MVP**

Each MVP uses the web app, the agent, and the RAG, so the user can finish that job in one release.

**Bad example.** Two web app features, and no agent or RAG feature.

1. APP-OWN-001: Web app: Save a card as owned, with a condition
2. APP-OWN-003: Web app: See a value while saving an owned card

The site can ask the user to save a card. The user still cannot learn what the card is worth, because the price comes from the agent and the notes.

**MVP 1.** The user learns what one card is worth.

1. APP-OWN-001: Web app: Save a card as owned, with a condition
2. APP-OWN-003: Web app: See a value while saving an owned card
3. AGT-VAL-001: Agent: Price a card from the condition the user picked
4. RAG-RET-001: RAG: Return the notes that match the question

**MVP 2.** The user learns what the card in a photo is worth.

1. APP-SRCH-002: Web app: Search cards by photo
2. APP-OWN-004: Web app: Get a suggested condition from a photo
3. AGT-VAL-002: Agent: Price a card from a photo and the user's condition
4. RAG-RET-002: RAG: Continue when no note is found

**MVP 3.** The user sees a price when the shop lists none.

1. APP-PRICE-001: Web app: See an AI price when no shop price is listed
2. AGT-LIST-001: Agent: Estimate a market price when no shop price is listed
3. RAG-CORP-001: RAG: Store a small set of pricing notes

[Back to top](#index)

### 3. Evaluate Product Backlog Readiness

Evaluate `product-backlog.md` against this list before a sprint takes an item, and when `sdd-refine-backlog` runs. A line passes or it fails.

- [ ] 1. One product outcome is one PBI. A second row for that same outcome fails.
- [ ] 2. Each Requirements item is the PBI code, one noun, and bullets the user can act on.
- [ ] 3. The table `Description` is that same noun.
- [ ] 4. The `Sprint` cell copies `sprint-backlog.md`. An unscheduled PBI uses `—`.
- [ ] 5. A PBI whose `Sprint` cell names a sprint has at least one SBI in that sprint. A PBI whose `Sprint` cell is `—` is listed in [Unplanned PBIs](#unplanned-pbis) and has no SBI.
- [ ] 6. Every SBI names one Parent PBI.
- [ ] 7. Place each [Feature](#term-feature), [Task](#term-task), [OGT](#term-ogt), [Issue](#term-issue), and [RID](#term-rid) only where [Terminology in practice](#terminology-in-practice) says.
- [ ] 8. The requirement is [Implementable (PBI Size)](#term-pbi-size-implementable), and the PBI adds value for the user.
  Epic: The user can manage her account.
  Theme: the user can log in to mypoke.trade with multiple methods.
  Implementable: the user can log in to mypoke.trade with a user name and a password.
  Too small (Acceptance Criteria level): the password field on the login screen shows `***`.
- [ ] 9. The `Size` cell is `Epic`, `Theme`, or `Implementable`. Only [Implementable (PBI Size)](#term-pbi-size-implementable) may name a sprint and have SBIs. A sprint plan may name an Epic or Theme when the job needs that outcome. The `Sprint` cell and SBIs still wait until Size is Implementable. [Epic (PBI Size)](#term-pbi-size-epic) and [Theme (PBI Size)](#term-pbi-size-theme) have no SBIs until split or tightened. Too small text is merged into another related PBI or removed from PBI requirement bullets.
- [ ] 10. Every Markdown link in `product-backlog.md` resolves from that file. Open the Requirements list and the Product Backlog `Related` column. Each link target file exists in the project. Each `#` anchor exists in that target file. A PBI back-reference in `Related` or in another process file points at `#pb-n` on the Product Backlog table row, not at `#req-{pb-n}`. On [Unplanned PBIs](#unplanned-pbis) in `sprint-backlog.md`, each `Related` link uses a path that resolves from `sprint-backlog.md`, such as `./product-backlog.md#pb-8`.

[Back to top](#index)

### 4. Size product backlog

Size is how coarse one PBI row is. It lives in the `Size` column on `product-backlog.md` and on [Unplanned PBIs](#unplanned-pbis).

- [Epic (PBI Size)](#term-pbi-size-epic): split into more PBI rows, or shrink the outcome, before sprint planning.
- [Theme (PBI Size)](#term-pbi-size-theme): tighten requirement bullets to one path before sprint planning.
- [Implementable (PBI Size)](#term-pbi-size-implementable): one outcome; the row may get a sprint and SBIs.
- Too small is not a `Size` value. It is acceptance-criterion detail. Merge it into another related PBI, or remove it from PBI requirement bullets. User stories and acceptance criteria stay with `sdd-atdd` or `sdd-spec-to-build`.

The ladder on mypoke.trade login wording:

- Epic: The user can manage her account.
- Theme: the user can log in to mypoke.trade with multiple methods.
- Implementable: the user can log in to mypoke.trade with a user name and a password.
- Too small (Acceptance Criteria level): the password field on the login screen shows `***`.

The same four lines appear under [3. Evaluate Product Backlog Readiness](#3-evaluate-product-backlog-readiness) item 8.

- `sdd-refine-backlog` sets `Size`, requirement bullets, and related process files after the user picks each fail.
- `sdd-plan-sprint` schedules only Implementable PBIs. It may name an Epic or Theme in the MVP plan when the job needs that outcome, and it records an OGT to refine that row. It does not set `Sprint` or add SBIs on Epic or Theme.
- User stories and acceptance criteria stay with `sdd-atdd` or `sdd-spec-to-build`.

[Back to top](#index)