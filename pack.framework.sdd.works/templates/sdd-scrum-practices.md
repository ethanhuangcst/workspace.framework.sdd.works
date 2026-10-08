# SDD Scrum practices

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-06
> [Definition](#terminology-in-practice)

---

## Index

- [Terminology in practice](#terminology-in-practice)
- [Artifacts writing guideline](#artifacts-writing-guideline)
  - [General writing principles](#general-writing-principles)
  - [artifacts-map.json](#artifacts-mapjson)
  - [ADR instance shape](#adr-instance-shape)
  - [Knowledge instance shape](#knowledge-instance-shape)
  - [Header (process artifacts)](#header)
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
    - [{module-name}-tests.md](#module-name-testsmd)
    - [release.md](#releasemd)
    - [test-strategy.md](#test-strategymd)
    - [.secrets](#secrets)
    - [Pack layout note](#pack-layout-note)
- [Scrum in SDD practices](#scrum-in-sdd-practices)
  - [1. Plan sprints by MVP](#1-plan-sprints-by-mvp)
  - [2. Slice product to MVPs](#2-slice-product-to-mvps)
  - [3. Evaluate Product Backlog Readiness](#3-evaluate-product-backlog-readiness)
  - [4. Size product backlog](#4-size-product-backlog)
  - [5. Feature break down](#5-feature-break-down)
  - [6. User Story Mapping](#6-user-story-mapping)



## Terminology in practice

Harness names, artifact names, and Scrum guide terms stay in [Terminology](./pack-scrum-in-sdd.md#terminology) in `pack-scrum-in-sdd.md`. This table is the store for backlog and sprint work names used in process artifacts.


| #   | Terminology              | Definition                                                                                                                                                                                                                                                                                     |
| --- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | PBI                      | Product backlog item. One row on `product-backlog.md`, scheduled or unscheduled.                                                                                                                                                                                                               |
| 2   | SBI                      | Sprint backlog item. One row in a sprint table on `sprint-backlog.md`.                                                                                                                                                                                                                         |
| 3   | Feature                  | Usable product capability. Record a Feature as a PBI first. Record it as an SBI when a sprint includes it.                                                                                                                                                                                     |
| 4   | Task                     | Work that is not a Feature. - A Task that creates value as part of product delivery is a PBI. - A Task that is only the effort to build one PBI or one SBI stays internal. Do not record it as a PBI or an SBI. - A shared Task required to deliver one sprint may be an SBI. It is not a PBI. |
| 5   | OGT                      | On-going task. Temporary or side work in `status.md`. An OGT is not a PBI and not an SBI.                                                                                                                                                                                                      |
| 6   | MVP                      | Minimum viable product. The smallest feature set in which the user finishes one job in one sprint.                                                                                                                                                                                             |
| 7   | Epic (PBI Size)          | One outcome too broad to ship as one PBI. Split into more PBI rows before sprint planning.                                                                                                                                                                                                     |
| 8   | Theme (PBI Size)         | One area whose requirement bullets still hide more than one path. Tighten to Implementable before sprint planning.                                                                                                                                                                             |
| 9   | Implementable (PBI Size) | One user-visible outcome. The PBI may get a sprint and SBIs.                                                                                                                                                                                                                                   |
| 10  | Issue                    | A defect or other issue. Record an Issue only in `issues-log.md`.                                                                                                                                                                                                                              |
| 11  | RID                      | A risk, an impediment, or a dependency. Record a RID only in the RID Log in `sprint-backlog.md`.                                                                                                                                                                                               |
| 12  | ATDD                     | Acceptance Test-Driven Development. Define acceptance criteria, usually as Gherkin scenarios, from the spec before implementation. Tests and code trace to those scenarios. Unit-level TDD runs after acceptance criteria exist.                                                               |
| 13  | User Story Mapping       | Order user activities on a backbone, slice vertical stories for an MVP, then write user stories and acceptance criteria into `{stem}-stories.md`. Aligns with [2. Slice product to MVPs](#2-slice-product-to-mvps) and [5. Feature break down](#5-feature-break-down).                         |


[Back to top](#index)

## Artifacts writing guideline

Read this before editing an artifact.

**When**: copy or refresh locale seeds during onboard if working copies are missing; on `sdd-update-project` when the map is missing, or when relocating or filling a gap. Do not overwrite filled working copies unless the user confirms. Do not copy `constants.json` into the artifacts root.

**From where**: locale seeds from `{client_root}/templates/framework.sdd.works/<locale>/` (locale EN, HanS, or HanT), or MCP `sdd_install_framework` / `sdd_update_framework` into the same extract target. Then copy each listed locale seed to the workspace-relative path named in `artifacts-map.json`. Do not place every file under `artifacts_root`. The map file itself stays `{workspace}/artifacts-map.json`. Read `constants.json`, `pack-scrum-in-sdd.md`, `sdd-scrum-practices.md`, and `coach-knowledge.md` from `{client_root}/templates/framework.sdd.works/` after install. Do not copy those four files into the workspace or the artifacts root.

**What they are not**: seeds are not live artifacts. Edit working copies under the artifacts root. Names and meaning of this split: `[pack-scrum-in-sdd.md](./pack-scrum-in-sdd.md)` (seeds vs working copies). The AI-read trio and `constants.json` stay on the client root only.

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

**Requirements bullets (product-backlog)**

- Each `{bullet}` under Requirements is for a **person** who owns or uses the product, not for an agent reading the board.
- State what the user **sees**, **gets**, or **can do**, or what the system **does** in plain terms.
- Put file paths, tool names, and ADR ids in bullets only when the operator or adopter must know them. Put design detail in Related specs on the Product Backlog table row.
- bad example: "The instructions page gains a section on how each agent tool calls up an agent."
- good example: "You see a tab on the instructions page for invoking agents, skills, and rules."

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

- It is an SDD Core artifact with `pack-scrum-in-sdd.md` and `sdd-scrum-practices.md` ([Core Artifacts](./pack-scrum-in-sdd.md#core-artifacts) in `pack-scrum-in-sdd.md`). It is not a Framework process Markdown file with a Type and as_of header.
- It is not a copied template seed.
- A new project does not copy a file from this section.
- `sdd-update-project` writes the file after the user confirms the chat summary.
- The chat summary stays in the chat.

**Keys**

- `artifacts_root` is one folder name. When the key is absent, use `specs`.
- `locale` is `EN`, `HanS`, or `HanT`.
- `adr` is an optional workspace-relative directory root for Architecture Decision Records. Omit the key when the project does not use that tree.
- `knowledge` is an optional workspace-relative directory root for project knowledge notes. Omit the key when the project does not use that tree.
- `files` lists workspace-relative paths that sit outside a module engineering triad (process files, product-level engineering files).
- `modules` lists one object per engineering module.
- Each module object has a `files` list (required). Paths in that list are the contract skills open.
- `folder` is optional. When present, it is the subdirectory under `{artifacts_root}` for that module. When omitted, module files live directly under `{artifacts_root}`.
- `stem` is optional. When present, it labels the module and prefixes filenames (`{stem}-stories.md`). When omitted, match paths in `files` by suffix or by exact name (`stories.md`, `design.md`, `tests.md` for a single-module map only).

**Shape**

```json
{
  "artifacts_root": "{artifacts root}",
  "locale": "{locale}",
  "adr": "{adr root}",
  "knowledge": "{knowledge root}",
  "files": [
    "{path}"
  ],
  "modules": [
    {
      "folder": "{folder optional}",
      "stem": "{stem optional}",
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
- Write one directory path in `adr`, so ADR files live under `{workspace}/{adr}`. Omit `adr` when the user excluded that tree.
- Write one directory path in `knowledge`, so knowledge notes live under `{workspace}/{knowledge}`. Omit `knowledge` when the user excluded that tree.
- Do not list every file under `adr` or `knowledge` in `files`, so the map keeps one root per tree.
- Leave `artifacts-map.json` off `files` and off every module `files` list, so the file does not record its own path.
- Omit `stem` when it matches `folder`, so a matching stem has no `stem` key.
- Omit `folder` when module files sit under `{artifacts_root}` without a subfolder, so flat paths such as `specs/app-stories.md` are valid.
- Use unqualified `design.md`, `stories.md`, and `tests.md` under `{artifacts_root}` only when `modules` has exactly one entry.
- Write the `artifacts_root` value into each path, so the path matches the setting.
good example: `"artifacts_root": "specs"` and `"../../../../product-backlog.md"`
bad example: `"artifacts_root": "spec"` while the path starts with `specs/`
good example: `"folder": "web-app"`, `"stem": "app"`, path `specs/web-app/app-design.md`
good example: no `folder`, paths `specs/app-design.md`, `specs/app-stories.md`, `specs/app-tests.md`
bad example: `name` and `purpose` keys beside the path
bad example: two module entries both listing `specs/stories.md`
- Leave the product name, `Type`, `as_of`, and a Definition link out of the file, so the file stays keys and paths.

**Confirm**

`sdd-update-project` shows this summary in the chat before it writes the file.

```text
workspace name: {product name}
workspace folder: {workspace}
locale: {locale}
artifacts_root: {artifacts root}
adr: {adr root}
knowledge: {knowledge root}
modules:
- {layout and label}: {what the module is}
  - {artifacts root}/{path to design}
  - {artifacts root}/{path to stories}
  - {artifacts root}/{path to tests}
files:
- {artifacts root}/product-backlog.md
- {artifacts root}/sprint-backlog.md
- {artifacts root}/status.md
- {artifacts root}/issues-log.md
- {artifacts root}/changes-log.md
- {artifacts root}/architecture.md
- {artifacts root}/release.md
- {artifacts root}/test-strategy.md
- {artifacts root}/.secrets
```

- List each module's three engineering paths under `modules:` using the paths task 7 chose (foldered, flat + stem, or singleton). Do not repeat those three lines under `files:`.
- Write the product name in `{product name}`, so the summary names the product.
- Write the workspace folder in `{workspace}`, so the summary shows where the project lives.
- Write the chosen locale in `{locale}`, so the summary shows the language of future specs.
- Write the chosen folder name in `{artifacts root}`, so the summary shows the specs folder.
- Write the chosen ADR root in `{adr root}` when the user included it. Omit the `adr:` line when the user excluded it.
- Write the chosen Knowledge root in `{knowledge root}` when the user included it. Omit the `knowledge:` line when the user excluded it.
- Write one module block for each picked module, so `{what the module is}` states what that module is and `{layout and label}` names foldered, flat + stem, or singleton.
- Omit a file line the project does not have, so the summary lists only the files the map will record.
- Leave this summary out of `artifacts-map.json`, so the file keeps the keys and the path lists.

**Example**

Pokymon Card Collection names a sample product in this JSON block only. A new project does not copy this file. The five process artifact EN seeds (`product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, `issues-log.md`) use `[product name]` and bracket placeholders, not a sample product body.

```json
{
  "artifacts_root": "specs",
  "locale": "EN",
  "adr": "specs/adr",
  "knowledge": "specs/knowledge",
  "files": [
    "../../../../product-backlog.md",
    "specs/sprint-backlog.md",
    "specs/status.md",
    "specs/issues-log.md",
    "specs/changes-log.md",
    "specs/architecture.md",
    "specs/release.md",
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

**Example (flat + stem, not a copy seed).** One module with no subfolder:

```json
{
  "artifacts_root": "specs",
  "locale": "EN",
  "files": [
    "../../../../product-backlog.md",
    "specs/sprint-backlog.md",
    "specs/status.md",
    "specs/issues-log.md",
    "specs/changes-log.md"
  ],
  "modules": [
    {
      "stem": "app",
      "files": [
        "specs/app-design.md",
        "specs/app-stories.md",
        "specs/app-tests.md"
      ]
    }
  ]
}
```



### ADR instance shape



Instance files live under `{workspace}/{adr}` when `artifacts-map.json` names an `adr` root. The shape stays in this practices file on `{client_root}`. It is not copied into `{workspace}`. `sdd-retrospective` reads this section before creating an ADR file.

###### Template

```markdown
# ADR-{NNN}: {Title}

## Status

Accepted | Deprecated | Superseded (by ADR-XXX)

## Context

{What situation or problem led to this decision?}

## Decision

{What was decided? Be specific.}

## Rationale

{Why this over alternatives? What alternatives were considered?}

## Consequences

{Results, trade-offs, risks, follow-up actions.}

## Date

{YYYY-MM-DD}
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- List `{workspace}/{adr}/`. Next file is `ADR-{NNN}-{short-title}.md` where `{NNN}` is one greater than the highest existing three-digit number, or `001` when the tree is empty.
- Match the language of the project specs in the same change.
- Do not edit an accepted ADR to reverse a decision. Supersede with a new ADR.



### Knowledge instance shape



Instance files live under `{workspace}/{knowledge}` when `artifacts-map.json` names a `knowledge` root. The shape stays in this practices file on `{client_root}`. It is not copied into `{workspace}`. `sdd-retrospective` reads this section before creating a knowledge note.

###### Template

```markdown
---
title: {Short title}
type: research-note | ops-lesson | domain-note | design-direction
status: active | draft | superseded
as_of: {YYYY-MM-DD}
tags:
  - {tag}
related_spec: {workspace-relative spec path}
related:
  - {path to adr or knowledge doc}
---

# {Title}

## Summary

{One short paragraph: what was learned and why it matters.}

## Evidence

- {Sourced facts, what was tried, or user-provided context}

## Lesson / guidance

{Reusable takeaway for future work.}

## Links

- {Related ADRs, specs, or knowledge docs}
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- Place each note at `{workspace}/{knowledge}/{topic-area}/{doc-slug}.md`. Reuse an existing topic folder when the subject already belongs there.
- When `{workspace}/{knowledge}/README.md` exists, add or update a row in its index table.
- Match the language of the project specs in the same change.

[Back to top](#index)

### Framework (process) artifacts



##### Header



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



#### [product-backlog.md](http://product-backlog.md)

`[product-backlog.md](./product-backlog.md)` records product items. The EN authoring seed is a placeholder template (`[product name]`, bracket placeholders). After the [Header (process artifacts)](#header) and Index, the body sections appear in this order: Product overview, Definition of Done, Requirements, Product Backlog, Change record. The Definition of Done section lists **additional** PBI checks for this product on top of the standard Definition of Done in `sdd-dod.mdc`. Each Requirements item has a PBI code, one noun for the deliverable, and bullets the user can act on. Requirements carry one `#pb-n` anchor. The table uses the same code and the same noun and links the PBI code to `#pb-n` on that Requirements line. Relations, the schedule projection, and product-level status stay in the table. Other process files link a PBI code to `./product-backlog.md#L{line}` for that Requirements line, not to a cross-file `#pb-n` fragment.

##### Header



###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `product-backlog.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `product-backlogmd`.

```markdown
# Product overview — {product name}
```



##### Product overview

The section sits after Index. It ends at the next `---`.

###### Template

```markdown
# Product overview

- {fact}
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{fact}` is one line about what the product does, a phase, or a constraint. Use one to three bullets.



##### Definition of Done

The section sits after Product overview. It ends at the next `---`. Standard close checks live in `sdd-dod.mdc`. This section lists additional PBI checks only.

###### Template

```markdown
<a id="definition-of-done"></a>

# Definition of Done

{intro}

- {additional check}
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- Put `<a id="definition-of-done"></a>` on the line before the `# Definition of Done` heading so `sprint-backlog.md` can link `./product-backlog.md#definition-of-done`.
- `{intro}` states that this section is additional criteria on top of the standard Definition of Done in `sdd-dod.mdc`, and that a PBI is `Done` only when both pass. Link [Commitment: Definition of Done](./pack-scrum-in-sdd.md#commitment-definition-of-done) when the reader needs the Scrum term.
- `{additional check}` is project-specific. Do not repeat the default checks from `sdd-dod.mdc` (acceptance criteria, common quality gate, user confirmed usable, retrospective).
- Additional checks must be executable and observable. They may name test specs or other verification for this product.



##### Requirements



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
- <a id="{pb-n}"></a>[{pbi code}](#{pb-n}) {noun}
  - {bullet}
```

- Put `{pb-n}` on the Requirements line. Link `{pbi code}` to `#{pb-n}` on that line.
- Do not put `{pb-n}` in a Product Backlog table cell. Markdown preview in the IDE often fails to scroll to HTML ids inside table cells.
- `sprint-backlog.md` and other cross-file links use `./product-backlog.md#L{line}` where `{line}` is the 1-based line of that anchor. Same-file links in `product-backlog.md` use `#pb-n`.
- `{noun}` is one noun for the deliverable, the same words as the table `Description`. Use a name a person recognizes (tab title, API name, seed file), not an internal codename alone.
- `{bullet}` is one line the person who uses the product can act on. Follow [Requirements bullets (product-backlog)](#general-writing-principles).
- Group items under `### Category: …` or `#### …` when one component has many PBIs (instructions page, public site, lite installer, template seeds).
- Keep one item per i18n code, so HanS and HanT are not a second copy of the same item.

###### How to write

- Follow [General writing principles](#general-writing-principles).
- Retired PBIs include one bullet that names what superseded them, in user-readable form.

**Web-portal tab example**

- bad example: "Research comes before the section is written."
- good example: "The tab content comes from research on how each agent tool starts an agent, a skill, or a rule."

**Pack seed example**

- bad example: "The pack repo ships versioned JSON under `profiles/`."
- good example: "The pack includes one root manifest file that lists which skills and rules a lite install may copy."

##### Product Backlog table



###### Template

```markdown
| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {seq} | {component} | [{pbi code}](#{pb-n}) | {noun} | {size} | {related} | {sprint} | {status} |
```



###### How to write

- Write `{seq}` from 1 through the last item, in the same order as Requirements.
- Write `{component}` as the product component for that row.
- Link `{pbi code}` in the table to `#pb-n` on the matching Requirements line. Do not put `{pb-n}` in the table cell.
- `{related}` and other same-file back-references link a PBI code to `#pb-n` on the Requirements line.
- Write `{noun}` as the same noun as Requirements. `Description` is that noun, not a summary of a paragraph.
- Write `{size}` as `Epic`, `Theme`, or `Implementable`. See [4. Size product backlog](#4-size-product-backlog).
- Write `{related}` as one link, or as a `<br>` bullet for each link when the cell has more than one.
- Copy `{sprint}` from `sprint-backlog.md`, so that cell is not a second schedule. Write `—` when the PBI row is only in [Unplanned PBIs](#unplanned-pbis).
- Write `{status}` as `ToDo`, `WIP`, or `Done`.
- The template groups rows by component, then by PBI code inside the component. The product may use another grouping. Requirements and the table use the same order.
- A file or skill that already has its own row is not also a parent row. Skill folders start with `sdd-`.
- There is no DoD column. [Definition of Done](#definition-of-done) is the first checklist section after Product overview. It lists additional product checks on top of `sdd-dod.mdc`. SBIs use the same section via the link in the Definition of Done block above the first sprint table in `sprint-backlog.md`. A sprint may state a replacement checklist above its own tables.
- The requirement bullets, related links, and status are owned by the Product Backlog.
- A Product Backlog item cited by a RID must have a stable `{pb-n}` anchor on its Requirements line. The `Related` column must link the Sprint Backlog item and the design or test source, so the path from product solution to implementation and verification is navigable.
- Back-references use the PBI code.



##### Status

A PBI uses the same three statuses as an SBI: `ToDo`, `WIP`, and `Done`. See Status under `sprint-backlog.md` for the meanings and the examples.

**Apply** `sdd-dod.mdc` **and the additional checks in the product-backlog Definition of Done section before marking a PBI** `Done`**.** Do not mark the PBI `Done` while any standard or additional check is open. A related SBI can be `Done` while the PBI stays `ToDo` or `WIP` when the PBI checklist is wider than that SBI.

The status cell contains only the word. Put the completion date and the evidence in the sprint note or in `changes-log.md`.

##### Change record

The section sits after the Product Backlog table. It ends at the file end or at `[Back to top](#index)`.

###### Template

```markdown
# Change record

| Date | Change |
| --- | --- |
| {date} | {change} |
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{change}` records a product-backlog edit (scope, PBI row, or Requirements). It is not `changes-log.md`, which records shipped work verification.
- Sort newest first when the table grows.

[Back to top](#index)

#### [sprint-backlog.md](http://sprint-backlog.md)

`[sprint-backlog.md](./sprint-backlog.md)` is the schedule and the execution list. The EN authoring seed is a placeholder template (`[product name]`, bracket placeholders, one sample sprint). It contains the RID Log, one section per sprint, and [Unplanned PBIs](#unplanned-pbis) after the last sprint. The ToDo table of each sprint is the single source of truth for that sprint’s items and status.

- `{product-backlog}` is the sibling path `./product-backlog.md`. `sprint-backlog.md` and `product-backlog.md` live in the same `{artifacts_root}` folder. Do not write `/{artifacts_root}/product-backlog.md`. A leading `/` is a filesystem root on macOS and breaks Cmd+click in the editor.
- Parent PBI and Unplanned PBI Code cells link `./product-backlog.md#L{line}`. `{line}` is the 1-based line of `<a id="{pb-n}">` on the Requirements line in `product-backlog.md`. Cursor preview opens a link with no fragment (such as `./adr/ADR-061-….md`) and opens `#L{line}`. It does not open an HTML id fragment such as `#pb-n`. When the Requirements line moves, update `{line}` in `sprint-backlog.md`.

##### Header



###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `sprint-backlog.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `sprint-backlogmd`.

```markdown
# sprint-backlog, {product name}
```



##### Current project progress and Index



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

{replacement}

- {replacement check}

{item acceptance}
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- `{intro}` is two sentences. Every sprint item uses `sdd-dod.mdc` and the checklist in [product-backlog.md](./product-backlog.md#definition-of-done). Mark the row `Done` only when every check passes. Do not duplicate the product-backlog bullet list here.
- `{replacement}` names the sprints that use a different checklist, then says those sprints use this checklist instead.
- `{item acceptance}` is Additional Done Criteria for one row under that sprint. It does not add a table column.
- The term is [Commitment: Definition of Done](./pack-scrum-in-sdd.md#commitment-definition-of-done).



##### Unplanned PBIs

The section sits after the last sprint section. It ends at the file end or at the next `---` when more sections follow.

###### Template

```markdown
## Unplanned PBIs

[Back to the top](#{h1})

> Product backlog items with no sprint assignment. The table matches the Product Backlog table in `product-backlog.md` without the `Sprint` column. Link each PBI code to `./product-backlog.md#L{line}` on the matching Requirements line. Do not add a `#pb-N` anchor in this file.

| # | Component | PBI Code | Description | Size | Related | Status |
| --- | --- | --- | --- | --- | --- | --- |
| {seq} | {component} | [{pbi code}](./product-backlog.md#L{line}) | {noun} | {size} | {related} | {status} |
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- The section lists product backlog items (PBIs) only. Do not put an SBI (sprint backlog item) code in this table. An unscheduled PBI has no SBI until sprint planning adds one.
- List every PBI whose `Sprint` cell in `product-backlog.md` is `—`.
- Use the same columns as the [Product Backlog table](#product-backlog-table) except omit `Sprint`.
- The blockquote matches the Template. Do not add a fourth sentence that repeats the column rules.
- Write `{seq}` from 1 through the last unplanned row. Group by component, then order by PBI code inside the component. The component order is the same order as the Product Backlog table.
- Link `{pbi code}` to `./product-backlog.md#L{line}` on the Requirements line in `product-backlog.md`. Do not add a `#pb-N` anchor in this file.
- `{noun}` is the Description noun from the Product Backlog row. Do not copy the Requirements bullets into `{noun}`.
- Copy `{size}`, `{related}`, and `{status}` from the Product Backlog row. Rewrite a `Related` link that uses `#pb-n` so it resolves from `sprint-backlog.md` as `./product-backlog.md#L{line}`, where `{line}` is the Requirements line of that `#pb-n`.
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
- `{parent}` is the PBI code and the PBI name. Link it to `./product-backlog.md#L{line}` on the matching Requirements line, such as `[Spec-seeds-15 Pack install profile manifests](product-backlog.md#L274)` when that `#pb-n` anchor is on line 274.
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
  - `**Done**` means every acceptance criterion is met, Definition of Done has been applied, and **close confirm** from `sdd-dod.mdc` is recorded in chat before the row shows **Done**. A file on disk alone is not **Done** on the board.
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
- `{trigger}` names the incident that fired this retrospective. Prefer `{SBI code} {SBI name} done` or `{PBI code} {Description noun} done` when DoD or a status-review pick closed one row ([Sprint Retrospective](./pack-scrum-in-sdd.md#sprint-retrospective) **By rule**). Use `Sprint-end` when the whole sprint closes. Use `On demand` only when a human invoked retrospective and no SBI or PBI became **Done** in the same run ([Sprint Retrospective](./pack-scrum-in-sdd.md#sprint-retrospective) **On demand**). Short form `feature-01 done` is allowed when the SBI name adds no disambiguation.
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

#### [status.md](http://status.md)

`[status.md](./status.md)` is the tracking projection. The EN authoring seed is a placeholder template (`[product name]`, bracket placeholders). It is not a second sprint backlog. It is not the defect list. Sections, in order: Header, Project progress, where we are now, what could be the next, Current OGT(On-going Tasks), Last 15 closed OGTs, Last updated. Column rules are in [status.md](#statusmd) in this file.

WIP updates use pack rule `sdd-realtime-status.mdc`. Close updates use `sdd-dod.mdc`.

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

#### [issues-log.md](http://issues-log.md)

`[issues-log.md](./issues-log.md)` is the issue record. The EN authoring seed is a placeholder template: empty tables, optional sample row only inside an HTML comment. Sections, in order: Header, Open issues, Closed issues.

##### Header



###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `issues-log.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `issues-logmd`.

```markdown
# Issues log ([product name])
```



##### Open issues



###### Template

```markdown
## Open issues

| Id | Title | Component | Priority | Description | Related | Close Check | Status | Added time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```



###### How to write

- `{Status}` is `Open`, `Fixed`, or `Deferred`. `{Priority}` is `Fatal`, `High`, `Medium`, or `Low`.
- The EN seed may include one sample row inside an HTML comment only. Delete that comment after the first real defect.



##### Closed issues



###### Template

```markdown
## Closed issues

| Id | Title | Component | Priority | Description | Related | Close Check | Closed Sprint | Closed time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```



###### How to write

- A row moves here only when the issue is closed. `{Closed time}` uses `DD/Mon/YYYY`.

[Back to top](#index)

#### [changes-log.md](http://changes-log.md)

`[changes-log.md](./changes-log.md)` is the conclusion record. Write an entry when a Change is done. The EN authoring seed is a placeholder template with one sample entry block using bracket placeholders.

##### Header



###### Template

Follow [General writing principles](#general-writing-principles). Use [Header (process artifacts)](#header). `{practices}` is the path from `changes-log.md` to `sdd-scrum-practices.md`. `{artifact-section-id}` is `changes-logmd`.

```markdown
# Changes log ([product name])
```



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
- The EN seed keeps one placeholder entry block. Replace bracket text or delete that block after the first real conclusion.
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



#### [architecture.md](http://architecture.md)

`[architecture.md](./architecture.md)` records goals, boundaries, stack, principles, and a small number of decisions. Product behavior stays in `product-backlog.md`. This file is optional and written when a decision needs a home. The EN authoring seed is a placeholder template with bracket examples and named diagram blocks (`[product name]`, not a sample product body).

##### Header and spec index



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# Architecture — {product name}

> **Purpose**: Record the stack, boundaries, and a small number of decisions. Product behavior belongs in `[product-backlog.md](./product-backlog.md)`. Optional / JIT (not a required process artifact).
> **Practices**: `[sdd-scrum-practices.md](./sdd-scrum-practices.md)` (what, how, when).
> **Framework**: `[pack-scrum-in-sdd.md](./pack-scrum-in-sdd.md)` (names and meaning).

{link to tech-spec or sibling lock doc when present}

| Spec | Role |
| --- | --- |
| `[product-backlog.md](./product-backlog.md)` | PBIs, scope, and acceptance |
| `[{module}/{stem}-design.md](./{module}/{stem}-design.md)` | Module design |
| `[release.md](./release.md)` | Local startup and go-live |
```



###### How to write

- Do not add `Type`, `as_of`, or a Definition link. Those belong to [Header (process artifacts)](#header) only.
- Do not add a fictional product domain in the header or body. Use bracket placeholders and Example rows.
- The spec index lists paths that resolve from this file. Do not duplicate module design prose here.



##### Architecture goals



###### Template

```markdown
## 1. Architecture goals

| Goal | Meaning |
| --- | --- |
| {goal name} | {one sentence} |

{optional scope link to product-backlog}
```



###### How to write

- `{goal name}` states an outcome the architecture must preserve, such as degradation, latency, or tenant isolation.
- Prefer three to six rows. Product acceptance stays on `product-backlog.md`.



##### Product shape



###### Template

```markdown
## 2. Product shape

| Surface | Role | Who uses it |
| --- | --- | --- |
| {surface} | {role} | {actor} |
```



###### How to write

- `{surface}` names a deployable or user-visible boundary, such as web app, BFF, agent service, MCP server, or batch job.



##### Recommended diagrams



###### Template

Use these **fixed diagram names** as `### Diagram: …` headings. Delete optional blocks when they do not apply.

1. **Diagram: System context** — Mermaid: user, app/BFF, external API or MCP.
2. **Diagram: Logical view (services)** — Mermaid: client, one or more services, data stores; follow with numbered **principles** (browser does not call DB, and similar).
3. **Diagram: Auth and tenancy (optional)** — Mermaid flowchart TB: login or API key to scoped `user_id`.
4. **Diagram: ML inference path (optional)** — Mermaid: client, BFF or agent, model provider, optional vector store; small MVP vs later table for serving and versioning.
5. **Diagram: Deployment and runtime** — Table: process name, responsibility, deploy shape (`make dev`, container, PaaS).



###### How to write

- Use Mermaid `flowchart` for every diagram block except **Diagram: Deployment and runtime**, which is a table.
- Do not use ASCII or plain-text arrow diagrams for auth or data flow.
- Do not put secrets, real hosts, or customer environment names in diagrams.
- One MVP with one model does not need a full MLOps diagram. Record prompt and model versioning and rollback in a decision or ADR when inference is production-critical.
- Module internals belong in `{stem}-design.md`, not in these product-wide diagrams.



##### Stack



###### Template

```markdown
## 4. Stack

| Category | Choice | Note |
| --- | --- | --- |
| App / UI | {choice} | {note} |
| API / services | {choice} | {note} |
| Data | {choice} | {note} |
| Auth | {choice} | {note} |
| Hosting / runtime | {choice} | {note} |
| CI / tests | {choice} | {note} |
| ML / inference | {choice or —} | {note} |
```



###### How to write

- Keep one row per category. Use `—` when the category does not apply yet.
- Module-level detail stays in `{stem}-design.md`.



##### Design principles and non-goals



###### Template

```markdown
## 5. Design principles

1. **{name}** — {one sentence}

## 6. Non-goals

- {non-goal bullet}
```



###### How to write

- Principles are technical boundaries (BFF, citations, confirm-before-write). Non-goals reject scope creep (payments, silent ingest, platform overkill).



##### Decisions



###### Template

```markdown
## 7. Decisions

**Decision: {short title}**

- {fact}
- ADR: [{ADR-NNN}](./adr/ADR-NNN-{slug}.md) when ADR-worthy
```



###### How to write

- List a small number of decisions. Move long rationale into `{workspace}/{adr}/` when the map names an adr root, or into `{stem}-design.md`.



##### Module specs and release



###### Template

```markdown
## 8. Module specs

Per-module design, stories, and tests live under `{artifacts_root}/` as named in `artifacts-map.json`.

Local startup and go-live order are in `[release.md](./release.md)`.
```



###### How to write

- Replace `{artifacts_root}` with the folder name the project uses, such as `specs`.

[Back to top](#index)

#### {module-name}-design.md



The design spec path is the `*-design.md` or `design.md` entry in that module's `files` list. `{stem}` or `{module-name}` in headings is the filename prefix when the map uses `{stem}-design.md`.

`{module-name}-design.md` is the usual foldered name. Flat layouts use `{artifacts_root}/{stem}-design.md` or singleton `design.md`.

`sdd-spec-to-build` updates the **UI design** block (jobs 4–6) and the **Technical design** block (job 7) in this file when the SBI has UI or engineering design work. Skip a block when the job is N/A on the readiness checklist.

##### What belongs where


| Artifact                                 | Put here                                                                                                                                                               | Do not put here                                                       |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `[architecture.md](./architecture.md)`   | Product-wide goals, surfaces, system context and service diagrams, cross-module stack summary, design principles, non-goals, ADR index, links to module specs          | Page-level UI tokens, one module's routes table, local `make` ports   |
| `[release.md](./release.md)`             | Local startup steps, `make dev` / `make up` / `make down`, production release order, smoke checklist, environment variable **names** (no values), upgrade and rollback | Module data model, screen layout, component CSS                       |
| `{stem}-design.md`                       | This module's UI design and technical design sections below                                                                                                            | Product-wide architecture narrative duplicated from `architecture.md` |
| `[test-strategy.md](./test-strategy.md)` | Product-wide pyramid, CI policy, critical journeys                                                                                                                     | Module test cases (use `{stem}-tests.md`)                             |




##### Header



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# {Product or module} — design

Stories: `[{stem}-stories.md](./{stem}-stories.md)`. Tests: `[{stem}-tests.md](./{stem}-tests.md)`. Mockups: `[{mockup-folder}/](./{mockup-folder}/)` when UI exists.

**Status:** draft — one feature or SBI at a time.
```



###### How to write

- One intro paragraph links sibling specs. Use a mockup folder path only when the module ships UI.
- Do not duplicate the `architecture.md` spec index table.



##### UI design

Use this block when the feature has a user interface. `frontend-designer` and `frontend-developer` load for jobs 4–6.

###### Template

```markdown
## UI design

### Scope

| Goals | Non-goals |
| --- | --- |
| {user-visible outcome} | {out of scope for this module UI} |

### Routes and frames

| Path or frame | Story id | Mockup file | Auth |
| --- | --- | --- | --- |
| {path} | `{story-id}` | `{file.html}` | {Public or Session} |

Optional ASCII frame sketch when it clarifies shell layout.

### Visual style

Palette, typography, motion, and brand rules the implementation must follow. Point to a tokens file or mockup `:root` when one exists.

User-facing copy is i18n keys. Name supported locales. Tests assert keys, roles, or `data-testid`, not one language's sentences.

### Mockups and assets

| Artifact | Path | Rule |
| --- | --- | --- |
| HTML or Figma mockups | `{mockup-folder}/` | Source of truth for layout and class names |
| Tokens / portal CSS | `{path}` | Stay in sync with mockups in the same change |

When mockups change, update production CSS or components in the same change.
```



###### How to write

- Job 4 fills **Scope**, **Routes and frames**, and **Visual style**.
- Job 5 creates or updates files under **Mockups and assets**.
- Job 6 syncs tokens, CSS, or components so implementation matches mockups and this section.
- MCP-only, CLI-only, or API-only features omit the whole **UI design** block.



##### Technical design

Use this block for almost every feature. `fullstack-engineer` loads for job 7.

###### Template

```markdown
## Technical design

### Stack

| Layer | Choice | Note |
| --- | --- | --- |
| {App, API, data, auth, …} | {version or library} | {constraint} |

### Runtime

How this module runs in dev and prod: routes prefix, BFF vs separate service, ports only when module-specific. Product-wide deploy shape stays in `[architecture.md](./architecture.md)` and `[release.md](./release.md)`.

### Data

Entities, keys, and invariants for this module.

### Auth and API

Credentials per channel, main API routes, error shape. Authorization on the server; hiding UI is not the control.

### Integrations

Other modules, external APIs, or MCP surfaces this module calls.

### Security

Module-specific rules: secrets storage, what never appears in logs or client bundles.

### Tests

Point to `[{stem}-tests.md](./{stem}-tests.md)`. Follow **common-test-strategy** and `[test-strategy.md](./test-strategy.md)` when present. Do not copy the full case list here.
```



###### How to write

- Job 7 updates **Technical design** only. Do not write production code in the spec phase.
- Local hostnames, release order, and smoke steps belong in `[release.md](./release.md)`, not here.
- Cross-product diagrams and multi-module boundaries belong in `[architecture.md](./architecture.md)`.

[Back to top](#index)

#### {module-name}-stories.md



The stories path is the `*-stories.md` or `stories.md` entry in that module's `files` list. Do not assume `{artifacts_root}/{folder}/{stem}-stories.md` when the map lists another path.

###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# {Product or module} — user stories

{One paragraph: scope, related design file, default roles.}

**Locales:** {locale list when UI exists}. User-facing copy is i18n keys. Tests assert keys, roles, or `data-testid`, not one language's sentences.

**Roles:** {role list}

**Default Given:** unless stated, {shared precondition}.

---

## `{feature-id}` — {Feature title}

### User story 1 — {short title}

**As a** {role}
**I want** {capability}
**So that** {value}

#### AC1

```gherkin
Scenario: {observable outcome name}
  Given {precondition}
  When {action}
  Then {visible or API outcome}
```
```



###### How to write

- Follow [General writing principles](#general-writing-principles).
- Write stories when a [Feature](#term-feature) or Implementable PBI is ready for design. Use [6. User Story Mapping](#6-user-story-mapping) to order slices before you fill this file.
- Trace each story to a parent PBI or SBI in the intro or in an optional AC tag line, such as `#### AC1 — PBI-42 / WA-01`.
- One user story is one outcome. Split when roles or outcomes differ.
- One Gherkin scenario is one behavior. Name the scenario for the outcome the user sees.
- When the product has UI, scenarios use stable selectors: `role`, accessible name, or `data-testid`. They do not lock English copy as the contract.
- PBI requirement bullets stay on `product-backlog.md`. `sdd-refine-backlog` does not author Gherkin here.
- Author and revise this file with `atdd-expert` or as part of `sdd-spec-to-build` when the SBI needs acceptance criteria before build.
- Gherkin rules and coverage expectations are in [Acceptance criteria practices](#acceptance-criteria-practices).
good example: vertical story: sign in and reach the signed-in landing
bad example: four stories for login page, POST route, session storage, and API wiring for one Feature

[Back to top](#index)

#### {module-name}-tests.md



The test spec path is the `*-tests.md` or `tests.md` entry in that module's `files` list. Do not assume `{artifacts_root}/{folder}/{stem}-tests.md` when the map lists another path.

`sdd-spec-to-build` job 3 and `testing-expert` update this file when a feature needs a module test plan before build.

##### What belongs where


| Artifact                                          | Put here                                                               | Do not put here                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| `[test-strategy.md](./test-strategy.md)`          | Product-wide pyramid, CI policy, environments, named critical journeys | Module case tables duplicated from every `*-tests.md`   |
| `{stem}-tests.md`                                 | Module strategy, layer tables, cases traced to stories                 | Release order, smoke hostnames, system context diagrams |
| `[{stem}-design.md](./{module}/{stem}-design.md)` | One **Tests** pointer to this file                                     | Full scenario lists                                     |
| `[architecture.md](./architecture.md)`            | Cross-module test policy only when product-wide                        | Per-route case matrices                                 |




##### Header



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# {Product or module} — test strategy and plan

**Area:** {short module label}
**Stories:** `[{stem}-stories.md](./{stem}-stories.md)` · **Design:** `[{stem}-design.md](./{stem}-design.md)`
**Quality bar:** extends **common-test-strategy** — critical path 100%, overall ≥80% where measurable.
```



###### How to write

- Link sibling stories and design files. State **common-test-strategy** as the baseline.
- Name areas or story-id prefixes when the module is large.



##### Strategy



###### Template

```markdown
## 1. Strategy

| Layer | Scope | Default CI | Live opt-in |
| --- | --- | --- | --- |
| Unit | {modules under test} | Always | — |
| Integration | {API, DB, contracts} | Always | {when live keys needed} |
| E2E | {browser or client journeys} | {fixture or always} | {live opt-in label} |

**Principles**

- Map each critical story to at least one automated check when code is expected.
- Prefer role, accessible name, or `data-testid` over English copy in UI tests.
- Use an isolated test DB or temp data dir; never production data.
- Fixture-green CI alone is not Done when the product requires a verified live path.
```



###### How to write

- Follow the pyramid in **common-test-strategy**. Adjust shares only when `test-strategy.md` or the user names a stricter bar.
- List 3–5 principles. Include fixture vs live when external services apply.



##### Layer cases



###### Template

Number one heading per layer. Use a table per layer.

```markdown
## 2. Unit tests

| Module or route | Cases |
| --- | --- |
| {name} | {behavior}; trace `{story-id}` or AC when helpful |

## 3. Integration tests

| Route or area | Cases |
| --- | --- |
| {name} | {contract or persistence behavior} |

## 4. E2E

| Spec area | Scenarios |
| --- | --- |
| {journey} | {visible outcomes from Gherkin} |
```



###### How to write

- Trace cases to scenarios in `{stem}-stories.md`. Do not restate full Gherkin blocks.
- Name commands to run the layer when the project already has them (`vitest`, `pytest`, Playwright).
- Author and revise with `testing-expert` or as part of `sdd-spec-to-build` job 3.
- Do not paste secrets, tokens, or real hostnames. Use env var names only.

[Back to top](#index)

#### [release.md](http://release.md)

`[release.md](./release.md)` records local startup, production release order, smoke checks, and upgrade or rollback. Product runtime shape stays in `[architecture.md](./architecture.md)`. Host-specific values belong in a separate `deployment-plan.md` or the operator secret store, not in this seed. The EN authoring seed is a placeholder template with bracket examples. Do not put real host names, secrets, or customer environment names in `release.md`.

##### Header and spec index



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# Release — {product name}

> **Purpose**: How to start locally, the order of production release steps, and upgrade or rollback. Do not write real host names, secrets, or customer environment names here. Optional / JIT (not a required process artifact).
> **Practices**: `[sdd-scrum-practices.md](./sdd-scrum-practices.md)` (what, how, when).
> **Framework**: `[pack-scrum-in-sdd.md](./pack-scrum-in-sdd.md)` (names and meaning).

| Spec | Role |
| --- | --- |
| `[architecture.md](./architecture.md)` | Stack and runtime diagram |
| `[release.md](./release.md)` | Local, release order, smoke, rollback |
| `[deployment-plan.md](./deployment-plan.md)` | Optional operator detail for a target node |
```



###### How to write

- Do not add `Type`, `as_of`, or a Definition link. Those belong to [Header (process artifacts)](#header) only.
- Do not add a sample product name in the header beyond `{product name}` in the title.



##### Local development



###### Template

Numbered steps: install deps, local data, `make up` or `make dev`, smoke, `make down`. Link a local-startup PBI when the backlog defines one.

##### Pre-flight, release order, smoke



###### Template

Sections: **Pre-flight** artifact table; optional **Diagram: Production runtime** (Mermaid `flowchart TB`, same style as [architecture.md](#architecturemd)); **Production release order** table (isolation → CI → env → DB → deploy → DNS → TLS → smoke); **Production placeholders** table; **Environment variable names** (no values); **Smoke checklist**; **Upgrade**; **Rollback** with `changes-log.md` on failure.

###### How to write

- Use Mermaid for production runtime diagrams. Do not use ASCII arrow diagrams.
- Release order matches a semi-automated deploy: database reachable before public DNS; container healthy before TLS cutover.
- `deployment-plan.md` holds stack name, ports, domains, and image coordinates filled for operators; `release.md` stays product-generic.
- Require `make up` / `make down` when the project has a root Makefile with `dev`, `up`, and `down` targets.

[Back to top](#index)

#### [test-strategy.md](http://test-strategy.md)

`[test-strategy.md](./test-strategy.md)` is the **product-level** test strategy at `{artifacts_root}/test-strategy.md`. It extends **common-test-strategy** and must not weaken it. **Detailed test plans and test cases** belong in module `{stem}-tests.md` only; do not copy case lists into `test-strategy.md`. The EN authoring seed is a placeholder template with bracket examples. This file is optional and written when the project defines a product-wide quality bar beyond module specs.

##### Header and scope



###### Template

Follow [General writing principles](#general-writing-principles).

```markdown
# Test strategy — {product name}

> **Purpose**: Product-wide quality bar: baseline extension, pyramid, tools, environments, CI policy, and named critical journeys. Optional / JIT (not a required process artifact).
> **Practices**: `[sdd-scrum-practices.md](./sdd-scrum-practices.md)` (what, how, when).
> **Framework**: `[pack-scrum-in-sdd.md](./pack-scrum-in-sdd.md)` (names and meaning).

This file is the **product-level test strategy** only. Detailed test plans, scenario lists, and case-level mapping live in `{stem}-tests.md`.
```



###### How to write

- Do not add `Type`, `as_of`, or a Definition link. Those belong to [Header (process artifacts)](#header) only.
- Do not add a sample product name in the header beyond `{product name}` in the title.
- Do not restate Gherkin AC or per-story automation tables here; link `{stem}-tests.md`.



##### Baseline through module specs



###### Template

Sections: **Baseline** table; **Product-specific deltas**; **Test goals** (product outcomes); **CI default vs acceptance closure**; **Pyramid and tools** (optional multi-service columns); **Environments and data**; **External dependencies (CI vs closure)**; **Stricter rules**; **Module test specs** table linking `{stem}-tests.md`; **Secrets and honesty**.

###### How to write

- **CI default vs acceptance closure**: green PR CI does not alone satisfy MVP or go-live acceptance when live deps are in scope for the slice (pattern from mature multi-service products).
- E2E: real browser; wait for rendered state; stable selectors; dynamic apps use `make dev` / `make up` or Playwright `webServer`, not bare DOM inspection before load.
- Opt-in LLM, vision, or vendor **eval** is named at product level; datasets and thresholds live in `{stem}-tests.md` or linked knowledge.
- A second product-level file (for example `mcp-test-strategy.md`) is rare; prefer one `test-strategy.md` plus module `{stem}-tests.md` files unless UI and MCP policies truly diverge at product scope.

[Back to top](#index)

#### .secrets

`[.secrets](./.secrets)` at `{artifacts_root}/.secrets` looks like a `.env` **file**: `NAME=` with an empty value, `#` line comments for rules and groups, and optional end-of-line `#` on each key for where the value lives. It holds no secret values. Filled values stay in gitignored `.env.local` or the host env UI. This file is optional and written when the project has secrets. The EN authoring seed is a placeholder template with bracket examples and sample key names.

##### Header and keys



###### Template

Follow [General writing principles](#general-writing-principles). Use a `dotenv` fenced block, not Markdown headings inside the live file.

```dotenv
# {product name} — secret names only. Leave every value empty. Do not commit real keys, tokens, or passwords.
# Where the value lives: end-of-line # comment (example: .env.local, Portainer, CI secret).
# Filled values belong in gitignored files only (.env.local, operator env on the host).
# Optional artifact. See sdd-scrum-practices.md#secrets and release.md.

# Database
DATABASE_URL=  # .env.local or Portainer

# Auth and encryption
SESSION_SECRET=  # .env.local or Portainer
KEYS_ENCRYPTION_KEY=  # Portainer

# Third-party APIs
OPENAI_API_KEY=  # .env.local
RESEND_API_KEY=  # Portainer

# Deploy, CI, and service-to-service
GITHUB_TOKEN=  # GitHub Actions secret
CRON_SECRET=  # Portainer
MCP_AUTH_TOKEN=  # Portainer on web and MCP stacks

# One-time bootstrap (remove or rotate after first admin login when the product requires)
ADMIN_SEED_PASSWORD=  # Portainer at first deploy

# {SECRET_NAME}=  # {where the value lives}
```



###### How to write

- Do not add `Type`, `as_of`, or a Definition link. Those belong to [Header (process artifacts)](#header) only.
- Use `KEY=` lines only; never paste a value after `=`.
- Group keys with `#` comment lines (example `# Database`). Those are dotenv comments, not Markdown headings.
- End-of-line `#` names **where the value lives** only. Do not add a second clause after `|`.
- Delete example keys the product does not use; add rows for secrets the product actually has.
- App runtime copy-paste lists may also use `.env.example` in the app repo; do not duplicate every key when `.env.example` already owns the full list.
- Link `[release.md](./release.md)` for deploy env names when both files exist; keep `.secrets` limited to true secrets.

[Back to top](#index)

#### Pack layout note

The sprint-item shape (columns, Type, status, and the retrospective block) is under [sprint-backlog.md](#sprint-backlogmd) in this file. `artifacts-map.json` sits at the workspace root and names `artifacts_root`. This practices file states how to apply that shape.

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
- [ ] 2. Each Requirements item is the PBI code, one noun, and bullets the user can act on. The line carries one `#pb-n` anchor. The Product Backlog table links to that anchor and does not add a second `#pb-n` in the cell.
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
- [ ] 10. Every Markdown link in `product-backlog.md` resolves from that file. Open the Requirements list and the Product Backlog `Related` column. Each link target file exists in the project. Each `#` anchor exists in that target file. A PBI back-reference inside `product-backlog.md` points at `#pb-n` on the Requirements line. On `sprint-backlog.md`, Parent PBI and Unplanned PBI links use `./product-backlog.md#L{line}` for that same Requirements line, not a cross-file `#pb-n` fragment.
- [ ] 11. Body sections appear in order: Product overview, Definition of Done, Requirements, Product Backlog, Change record. The Definition of Done intro states additional criteria on top of `sdd-dod.mdc`. `<a id="definition-of-done"></a>` sits on the line before the `# Definition of Done` heading.

[Back to top](#index)

### 4. Size product backlog

Size is how coarse one PBI row is. It lives in the `Size` column on `product-backlog.md` and on [Unplanned PBIs](#unplanned-pbis).

- [Epic (PBI Size)](#term-pbi-size-epic): split into more PBI rows, or shrink the outcome, before sprint planning.
- [Theme (PBI Size)](#term-pbi-size-theme): tighten requirement bullets to one path before sprint planning.
- [Implementable (PBI Size)](#term-pbi-size-implementable): one outcome; the row may get a sprint and SBIs.
- Too small is not a `Size` value. It is acceptance-criterion detail. Merge it into another related PBI, or remove it from PBI requirement bullets. User stories and acceptance criteria stay with `atdd-expert` or `sdd-spec-to-build`.

The ladder on mypoke.trade login wording:

- Epic: The user can manage her account.
- Theme: the user can log in to mypoke.trade with multiple methods.
- Implementable: the user can log in to mypoke.trade with a user name and a password.
- Too small (Acceptance Criteria level): the password field on the login screen shows `***`.

The same four lines appear under [3. Evaluate Product Backlog Readiness](#3-evaluate-product-backlog-readiness) item 8.

- `sdd-refine-backlog` sets `Size`, requirement bullets, and related process files after the user picks each fail.
- `sdd-plan-sprint` schedules only Implementable PBIs. It may name an Epic or Theme in the MVP plan when the job needs that outcome, and it records an OGT to refine that row. It does not set `Sprint` or add SBIs on Epic or Theme.
- User stories and acceptance criteria stay with `atdd-expert` or `sdd-spec-to-build`.
- Feature and Task breakdown rules and examples are in [5. Feature break down](#5-feature-break-down).

[Back to top](#index)

### 5. Feature break down

This section is the breakdown for two jobs.

- `sdd-refine-backlog` splits or tightens a PBI.
- `sdd-plan-sprint` turns Implementable PBIs into sprint rows.

A [Feature](#term-feature) is the usable outcome. A [Task](#term-task) is work that is not that outcome. A step that only builds one PBI or one SBI is not a new PBI and not a new SBI. A task the whole sprint needs, and that is not the effort to build one Feature, may be one Task SBI. It is not a PBI.

#### Refine a backlog item

- [Epic (PBI Size)](#term-pbi-size-epic): split into more PBI rows at the next Size down. Prefer [Theme (PBI Size)](#term-pbi-size-theme) rows when the Epic hides several user-facing areas. Do not jump from Epic to Implementable in one step unless only one area remains. Do not turn the Epic into a task list.
- [Theme (PBI Size)](#term-pbi-size-theme): tighten the requirement bullets to one path, or split into Implementable PBIs. Do not leave two user paths on one row.
- [Implementable (PBI Size)](#term-pbi-size-implementable): leave the row as one outcome. Acceptance-criterion detail stays on the row or moves to `atdd-expert` or `sdd-spec-to-build`. It does not become a new PBI.
- Too small is not a `Size`. Merge it into a related PBI, or drop it from the requirement bullets.



#### Plan a sprint

- One Implementable PBI becomes one Feature SBI. The SBI names a tangible deliverable.
- Do not split one Feature into frontend, backend, API, or integration SBIs. Those layers are implementation work inside one Feature, not separate sprint rows.
- After those Feature SBIs are named, list extra tasks the sprint still needs. Each extra task is one Task SBI. The parent is the PBI that sprint delivers. Omit the list when no extra task passes the [Task](#term-task) row.
- An Epic or a Theme may be named in the MVP plan when the job needs that outcome. It gets no `Sprint` cell and no SBIs until it is Implementable. Record an [OGT](#term-ogt) so refine happens first.



#### Examples

The ladder is the same login wording as [4. Size product backlog](#4-size-product-backlog).

**Good example (refine).** Epic "The user can manage her account" becomes three Theme PBIs: create an account, log in, and reset the password. Each Theme row is one user-facing area. Later, the Theme "log in" becomes an Implementable PBI such as log in with a user name and a password. Other Themes stay Theme until a later refine.

**Bad example (refine).** The same Epic stays one PBI, and the requirement bullets become "create the login form", "hash the password", and "write the session cookie". Those lines are build steps. They are not PBIs.

**Bad example (refine).** The same Epic becomes three Implementable PBIs in one step, with no Theme rows between Epic and Implementable, when the Epic still hides several areas such as create account, log in, and reset password.

**Good example (sprint plan).** PBI "Log in with a user name and a password" is one Feature SBI: "User can sign in with a user name and a password and see the home page." A shared Task SBI "Add the login route to the public instructions page" is listed only because every Feature in that sprint needs that route.

**Bad example (sprint plan).** The same PBI becomes four SBIs: "Build the login page frontend", "Implement POST /auth/login", "Add session storage", and "Connect the frontend to the auth API." Those are technical layers for one Feature. They belong in implementation planning, not as four sprint rows.

[Back to top](#index)

### 6. User Story Mapping



User Story Mapping orders what the user does, slices vertical stories for an MVP, then records stories and acceptance criteria in `{stem}-stories.md`. See [User Story Mapping (terminology)](#term-user-story-mapping) and [ATDD (terminology)](#term-atdd).

#### When to map

- The PBI is [Implementable (PBI Size)](#term-pbi-size-implementable) and the sprint has a [Feature](#term-feature) SBI for one user-visible outcome.
- Design is about to start and `{stem}-stories.md` has no stories for that outcome yet.



#### Steps

1. **Backbone:** List user activities left to right in the order the user does them.
2. **Slices:** Under each activity, list user tasks. Draw horizontal slices for MVP 1, MVP 2, and later increments. Match [2. Slice product to MVPs](#2-slice-product-to-mvps).
3. **Pick the next slice:** Choose the top slice that delivers one job. Do not split that slice by frontend, API, or database layers on the sprint board ([5. Feature break down](#5-feature-break-down)).
4. **Write stories:** For each task in the slice, write one user story (`As a` / `I want` / `So that`) and acceptance criteria in the module stories path from the map. Follow [Acceptance criteria practices](#acceptance-criteria-practices) and the file shape in [{module-name}-stories.md](#module-name-storiesmd). Run `atdd-expert` when the agent should draft or revise that file.



#### Acceptance criteria practices



Acceptance criteria state testable behavior before implementation ([ATDD](#term-atdd)). They live under each user story as `#### ACn` headings with one or more Gherkin scenarios.

###### Shape

- Use `Scenario:` with `Given`, `When`, and `Then`. Add `And` only to extend the same step kind.
- Name each scenario for the outcome the user or operator can observe, not the class or file under test.
- Optional trace tag on the heading, such as `#### AC1 — Web-portal-09 / WA-01`, when the scenario maps to a PBI, SBI, or external id.



###### Coverage

- Each critical user story has at least one happy-path scenario.
- Each critical user story has at least one failure, empty, or denial scenario when the product must handle it (validation error, unauthorized, missing data).
- One scenario is one behavior. Split when `When` or `Then` would describe two unrelated outcomes.



###### Assertions and i18n

- `Then` steps assert visible or API outcomes the user cares about, not internal flags or private fields.
- When the product has UI, prefer `role`, accessible name, or `data-testid` in steps. Use i18n keys in the spec narrative; do not lock one locale's sentence as the only contract in Gherkin.
good example: `Then the guide with test id instructions-guide is shown`
bad example: `Then the page title is "Welcome"`
good example: `Then the seed exits with failure`
bad example: `Then process.exitCode equals 1`



###### Shared preconditions

- State role, session, and fixture assumptions in `Given`, or once in the file **Default Given** line when every scenario shares them.
- Do not repeat the same five-line `Given` block in every scenario when the default already covers it.



###### Order and tools

- Write or revise acceptance criteria before production code for that story ([ATDD](#term-atdd)). Unit and integration tests follow the scenarios and the project test spec.
- `atdd-expert` drafts or revises `{stem}-stories.md`. Automated tests implement the scenarios; they do not replace the spec file.



#### Good and bad mapping

- good example: MVP 1 is save a card, see a value while saving, agent prices the card, RAG returns matching notes. Each row is a vertical story the user can finish.
- bad example: MVP 1 is only UI stories while agent and RAG stories sit in a later MVP when the user cannot finish the job without them.
- good example: one Feature SBI for sign-in with user name and password; stories in `{stem}-stories.md` cover happy path and one failure path.
- bad example: four sprint SBIs for login page, POST route, session, and API wiring for the same Feature.



#### Relations

- `product-backlog.md` holds PBI outcomes and requirement bullets, not Gherkin.
- `sdd-refine-backlog` sets Size and PBI shape. It does not write user stories or acceptance criteria.
- `sdd-spec-to-build` may load `atdd-expert` when an SBI needs acceptance criteria before the build phase.

[Back to top](#index)