# Changes log (framework.sdd.works)

> Conclusion record. An entry is written when a change is done. It states what changed, why, and how it was verified.
> An open defect stays in [`issues-log.md`](./issues-log.md). A concluded fix still gets an entry here.
> Days are `## YYYY-MM-DD`, newest day first. Under a day, the newest entry is first.
> Each entry is a `###` title, then **Why**, **What changed**, and **Verification**. **Boundary** is present only when the entry must say what it does not cover.
> Each of those labels is one short paragraph. **What changed** names the files and the backlog or sprint item when one exists. **Verification** names the check that passed.
> Step-by-step detail stays in git and in the spec that owns the change. Do not put secrets here.
> Phase 1 history stays in git and [`phase1-process-specs/`](./phase1-process-specs/).

---

## 2026-10-01

### Feature-04 sprint-backlog seed is Done

**Why**: The user confirmed every sprint-backlog section. The design file still carried the old item table and retrospective rules.

**What changed**: [`framework-design.md`](./framework/framework-design.md) `sprint-backlog.md` links the practices rules and states Additional Done Criteria, the sprint-heading row link, the three-key row order, and the three-label retrospective. [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md), the HanS guide, and the three portal guide copies say the By-rule record names the incident. Sprint 4 feature-04 and [Spec-seeds-06](./product-backlog.md#pb-37) are Done. The live [`sprint-backlog.md`](./sprint-backlog.md) header and RID description cells are restored after an editor format pass. [markdown-table-cell-bullets](./knowledge/agent/markdown-table-cell-bullets.md) records the table-cell and heading-id lesson.

**Verification**: The design no longer says Item acceptance, `s1-feature-01`, or implementation order. The guide catalog and install tests pass, 46 of 46. The Sprint 4 table lists feature-04 Done between feature-11 and feature-03.

**Boundary**: The HanS and HanT sprint-backlog seeds stay on Sprint 16 i18n-02.

### Retrospective rules are Done

**Why**: The user confirmed the retrospective in the live file and the EN seed.

**What changed**: Retrospective rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Current OGT has no open row. feature-04 stays open.

**Verification**: Closed row 1 is Retrospective rules. The live file and the EN seed name the incident, such as `feature-01 done`.

### Retrospective examples use three labels

**Why**: The user asked to test the retrospective shape on the live file and the EN seed.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the template. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use Learnings, Opportunities, and Future actions. A later run is the next number under those labels.

**Verification**: Sprint 1 has records 1 through 4 under the labels that have a point. Sprint 2 in the EN seed has the three empty sentences.

### Skill-08 names the three retrospective headings

**Why**: The retrospective record must use Learnings, Opportunities, and Future actions. The skill that writes that record is `sdd-retrospective`.

**What changed**: [Skill-08](./product-backlog.md#pb-28) in [`product-backlog.md`](./product-backlog.md) states those three headings. The PBI already existed. It stays in Sprint 9.

**Verification**: The Skill-08 line and the Skill-08 table row both name Learnings, Opportunities, and Future actions.

### Sprint item table rules are Done

**Why**: The user confirmed the sprint item table in the live file and the EN seed.

**What changed**: Sprint item table rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Retrospective rules is WIP.

**Verification**: Current OGT row 1 is Retrospective rules, status WIP. Closed row 1 is Sprint item table rules.

### Status words are bold

**Why**: The user required every status `ToDo`, `WIP`, and `Done` to be highlighted with `**`.

**What changed**: The sprint body and sprint item table rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) say the status word is bold. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use that bold word in the table heading and the status cell. The sprint line was already `**Status: {status}**`.

**Verification**: The live file has 16 bold table headings and 85 bold status cells. The EN seed has 2 bold headings and 6 bold status cells.

### Sprint 4 feature-28 parent cell breaks onto two lines

**Why**: The preview still showed Agent-02 and Agent-15 on one line, separated by a middle dot.

**What changed**: Multi-fact cells in [`sprint-backlog.md`](./sprint-backlog.md) use `- ` bullets separated by `<br>`. The feature-28 Parent PBI cell is the check. The how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) shows that cell as the example.

**Verification**: No SBI table cell still contains ` · `. The feature-28 parent cell is two bullets.

### SBI cells with more than one fact use bullets

**Why**: The user added a sprint item table rule: more than one fact in a cell uses bullet points on separate lines.

**What changed**: The how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) states that rule. Multi-fact cells in [`sprint-backlog.md`](./sprint-backlog.md) use `- ` bullets separated by `<br>`. The EN seed cells each have one fact, so they stay one line.

**Verification**: A cell with one fact is one line. A cell that had ` · ` between facts is now a bullet list.

### Sprint item tables match the related-spec rule

**Why**: A review of the live sprint backlog and the EN seed found related cells that were not links, and em dashes in the seed retrospective.

**What changed**: Related cells in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed are links. A row with no other spec links its parent PBI. The seed retrospective no longer uses an em dash.

**Verification**: Every SBI related cell contains a Markdown link. The seed retrospective lines are sentences.

### Sprint item table rule is a template

**Why**: The user confirmed the sprint item table, including Additional Done Criteria on top of the Definition of Done.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the template and the how-to. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow that table. Sprint item table rules stays WIP until the user confirms both files.

**Verification**: The practices file has the sprint item table template. The live Sprint 4 table and the EN seed tables use the new heading, the noun SBI, and the sort.

### Sprint body rules are Done

**Why**: The user confirmed the live sprint bodies and the EN seed.

**What changed**: Sprint body rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Sprint item table rules is WIP.

**Verification**: Current OGT row 1 is Sprint item table rules, status WIP. Closed row 1 is Sprint body rules.

### Sprint body rule is a template

**Why**: The sprint heading, Sprint Goal, and status line had no template in `sdd-scrum-practices.md`.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the confirmed sprint body template and how-to notes. The old sprint heading notes are that template. The live sprint sections and the EN seed already follow it. Sprint body rules stays WIP until the user confirms both files.

**Verification**: Sprint 4 has a Sprint Goal, a depends line, `**Status: WIP**`, and a progress note. EN Sprint 1 has `**Status: Done** (every item is complete)` and no depends line.

### Definition of Done rules are Done

**Why**: The user confirmed the live Definition of Done section and the EN seed.

**What changed**: Definition of Done rules left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). Sprint body rules is WIP.

**Verification**: Current OGT row 1 is Sprint body rules, status WIP. Closed row 1 is Definition of Done rules.

### Definition of Done rule is a template

**Why**: The Definition of Done section had no template in `sdd-scrum-practices.md`.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the confirmed template and how-to notes. The live Definition of Done section in [`sprint-backlog.md`](./sprint-backlog.md) stays as it is. The EN seed names the quality link Definition of Done and adds the Item acceptance sentence. Definition of Done rules stays WIP until the user confirms both files.

**Verification**: The practices file has `#### Definition of Done` with `##### Template` and `##### How to write`. The live checklist is unchanged.

### RID Log rules are Done, and RID coverage is removed

**Why**: The user confirmed the RID Log. The coverage table is not part of that section.

**What changed**: RID Log rules left Current OGT. The RID coverage section is removed from [`sprint-backlog.md`](./sprint-backlog.md), the EN seed, and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). Definition of Done rules is WIP. The Definition of Done section is unchanged.

**Verification**: Neither sprint-backlog file has a RID coverage heading. The Definition of Done heading and its checklist remain.

### RID tables sort by time, then severity

**Why**: The RID tables had no row order.

**What changed**: The RID Log how-to in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) sorts each table by time, newer first, then by severity: Fetal, Broken, Blocking, High, Medium, Low. Open RIDs use Created Sprint. Closed RIDs use Closed Sprint. The live Open RIDs already follow that order.

**Verification**: D-2 and D-3 are Blocking in Sprint 2, and R-1 is Medium in Sprint 2, so R-1 stays last.

### RID Log uses open and closed tables

**Why**: The RID Log used one table with type, status, handling note, and an open severity scale.

**What changed**: The RID Log rule in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) is a template and how-to notes. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use an intro, Open RIDs, and Closed RIDs. Severity is Fetal, Broken, Blocking, High, Medium, or Low. The id is `{type}-{number}`, such as `D-1` and `R-1`. RID Log rules stays WIP until the user confirms both files.

**Verification**: The live file has D-2, D-3, and R-1 in Open RIDs, and D-1 in Closed RIDs. The EN seed has R-1 in Open RIDs and D-1 in Closed RIDs.

### A section rule is a template plus how to write

**Why**: A section rule in `sdd-scrum-practices.md` listed the same facts again as narrative bullets.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) says a section rule has a template and a how-to note for each placeholder. The notes are not restated as a narrative list. The header in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) is that template and those notes. The template is in a code block.

**Verification**: The header section has `##### Template` and `##### How to write`. It has no Content, Format, Writing, or Terms list.

### Header rules for sprint-backlog.md are Done

**Why**: The user confirmed the live header and the EN seed header.

**What changed**: Header rules for `sprint-backlog.md` left Current OGT and is row 1 of Last 15 closed OGTs in [`status.md`](./status.md). RID Log rules for `sprint-backlog.md` is WIP. The oldest closed row dropped off the list of 15.

**Verification**: Current OGT row 1 is RID Log rules, status WIP. Closed row 1 is Header rules, closed in Sprint 4.

### Back to the top, and the section name is RID Log

**Why**: The return link opened the Index, and the section name was still RID Registry.

**What changed**: Each sprint and the RID section in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed use `[Back to the top](#sprint-backlog-frameworksddworks)` in the live file and `[Back to the top](#sprint-backlog-pokymon-card-collection)` in the seed. The target is the H1. The section heading is `## RID Log (Risks,Impediments, Dependencies)`, and the Index link is `#rid-log-risksimpediments-dependencies`. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`status.md`](./status.md), and [`framework-design.md`](./framework/framework-design.md) use the name RID Log.

**Verification**: The live file has the top link under the RID Log heading and under Sprint 1 through Sprint 16. The EN seed has the top link under the RID Log heading, Sprint 1, and Sprint 2.

### Each sprint links back to the index

**Why**: A reader who opens a sprint from the Index had no link back to that list.

**What changed**: The line after each `## Sprint` heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `[Back to the index](#index)`. The heading stays `## Sprint` plus the number, so the preview id stays `sprint-1` and the same pattern for each later sprint. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records that line under Sprint heading.

**Verification**: The live file has the link under Sprint 1 through Sprint 16. The EN seed has the link under Sprint 1 and Sprint 2. The target `#index` is the `### Index` heading.

### Index heading returns under Current project progress

**Why**: The jump links sat in the Current project progress list with no heading.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed place `### Index` after the Sprint goal bullet. The RID Registry link and the sprint links stay under that heading. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) require that heading.

**Verification**: Both files show `### Index` before `[RID Registry](#rid-registry-risksimpediments-dependencies)`.

### RID Registry heading uses commas

**Why**: The heading with slashes produced the preview id `rid-registry-risks---impediments---dependencies`, and the jump link did not match it.

**What changed**: The heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `## RID Registry (Risks,Impediments, Dependencies)`. The jump link is `#rid-registry-risksimpediments-dependencies`. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) use that heading and that id.

**Verification**: Cursor turns spaces into hyphens, then removes commas and parentheses. That heading becomes `rid-registry-risksimpediments-dependencies`.

### RID Registry jump link uses the heading name

**Why**: The heading `RID Registry (Risks / Impediments / Dependencies)` gets the preview id `rid-registry-risks---impediments---dependencies`. The link `#rid-registry-risks-impediments-dependencies` did not match that id.

**What changed**: The heading in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed is `## RID Registry`. The jump link is `[RID Registry](./sprint-backlog.md#rid-registry)`. The Index heading is removed. The jump links stay in the Current project progress list. The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) match that shape.

**Verification**: Cursor builds a heading id by turning spaces into hyphens, then removing punctuation. `## RID Registry` becomes `rid-registry`.

### Current project progress adds an index

**Why**: Current project progress named the WIP sprint and did not list a jump to the RID Registry or to every sprint.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) add an Index under Current project progress. The Index links the RID Registry, then each sprint, in sprint order. The link text is the name only. [`sprint-backlog.md`](./sprint-backlog.md) lists Sprint 1 through Sprint 16. The EN seed lists Sprint 1 and Sprint 2. Header rules stays WIP until the user confirms both files.

**Verification**: Each Index link uses the heading slug for that section. The RID Registry link is `#rid-registry-risks-impediments-dependencies`. A sprint link is `#sprint-1` and the same pattern for each later sprint.

### Sprint planning principles link the terminology store

**Why**: The principle lines named Sprint Goal, Increment, MVP, SBI, and OGT with no link, and the terminology store was not named in the seed building guide.

**What changed**: [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) adds Sprint Goal and MVP. The principle lines in [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed link Sprint Goal, Increment, MVP, SBI, and OGT there. Current WIP sprint is a bold heading link, and the bullet says to click the link to jump to that sprint. [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) names Terminology in practice as the terminology store.

**Verification**: The live file links those five headings under `sdd-scrum-practices.md` and shows `[**Sprint 4**](./sprint-backlog.md#sprint-4)`. The EN seed links the same headings and shows Sprint 2.

### Sprint backlog header shows planning principles and progress

**Why**: The header stated the current sprint in one sentence and the sprint rule in another, with no jump to the current sprint.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) add Sprint planning principles as the last blockquote item, and add a Current project progress section after the blockquote. Current project progress names the total sprints, links the current WIP sprint heading, and copies that Sprint Goal. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow those rules. Header rules stays WIP until the user confirms both files.

**Verification**: The live file links [Sprint 4](./sprint-backlog.md#sprint-4) and copies the Sprint 4 goal. The EN seed links Sprint 2 and copies the Sprint 2 goal. Sprint Goal, Increment, and OGT link [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md).

### Sprint backlog header content

**Why**: The header purpose still described a short-cycle list, and the header still had a Framework line.

**What changed**: The header rules in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) say `sprint-backlog.md` is the Sprint Backlog artifact and lists every sprint. The file owns the schedule, the item status, and the latest project progress. Related links are `artifacts-map.md`, `scrum-in-sdd.md`, `status.md`, `product-backlog.md`, and `sdd-scrum-practices.md`. [`sprint-backlog.md`](./sprint-backlog.md) and the EN seed follow those rules. Header rules stays WIP until the user confirms both files.

**Verification**: Neither header has a Framework line. The Sprint Backlog term links [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md#sprint-backlog). The SBI term links [Terminology](./framework/seeds/templates/EN/scrum-in-sdd.md#terminology).

### The seed follows the live example

**Why**: A section was done when only the live artifact passed.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) adds a step before the stop. After the live example passes, the same section is updated in the EN seed under `specs/framework/seeds/templates/EN/`, using the Pokymon Card Collection example. The pass checks cover both files, and the user confirms both files.

**Verification**: Step 5 is the seed update. Step 6 starts the next section only after both files are confirmed. The Pass section names both files.

### Seed artifacts building guide

**Why**: The method for writing an artifact seed was only in the chat.

**What changed**: [`seed-artifacts-building-guide.md`](./seed-artifacts-building-guide.md) records the method. Section rules stay only in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). A term that already has a meaning there is a link. [`artifacts-map.md`](./artifacts-map.md) lists the guide.

**Verification**: The user confirmed the draft. The file matches that draft.

### Sprint backlog header rules

**Why**: The header of `sprint-backlog.md` restated row order, and that sentence disagreed with the practices.

**What changed**: [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) records the header rules under `### sprint-backlog.md`. [`sprint-backlog.md`](./sprint-backlog.md) follows those rules. [`status.md`](./status.md) tracks seven section tasks, and Header rules is WIP. Sprint 4 feature-04 stays ToDo.

**Verification**: The header has one H1, one tight blockquote, plain links, and two sentences before the rule. Numbering and row order are not in the header.

**Boundary**: The RID Registry rules are not written yet.

### sdd-update-status moves to Sprint 4

**Why**: [ADR-065](./adr/ADR-065-skill-update-status.md) names the write skill `sdd-update-status`. The ship item was still Sprint 8 under the retired name `sdd-tracking`.

**What changed**: Sprint 4 feature-30 is ToDo, immediately after feature-04. [Skill-07](./product-backlog.md#pb-27) projects Sprint 4. Sprint 8 keeps feature-02, Ethan updates status. [`status.md`](./status.md) lists feature-30 after feature-04.

**Verification**: Sprint 4 order is feature-04, feature-30, feature-24, feature-22. Skill-07 names `sdd-update-status` and `skill_update_status`.

**Boundary**: The seed folder is still `specs/framework/seeds/skills/sdd-tracking/`. `constants.md` still lists `skill_tracking`. This move does not rename those files.

## 2026-09-30

### Feature-23 initial sdd-audit-artifacts is Done

**Why**: Ethan confirmed the audit skill is working. The skill block is the feature-23 check.

**What changed**: Sprint 4 feature-23 is Done. [Skill-10](./product-backlog.md#pb-30) is Done. The seed is [`SKILL.md`](./framework/seeds/skills/sdd-audit-artifacts/SKILL.md). [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) records that. [`status.md`](./status.md) names feature-24 as the next item. The fixture OGT for `CE-AUDIT-01` through `CE-AUDIT-17` is closed.

**Verification**: [`results.md`](./framework/fixtures/sdd-audit-artifacts/results.md) marks every CE-AUDIT skill block Pass except CE-AUDIT-13 Windows.

**Boundary**: CE-AUDIT-13 Windows stays Not observed. Onboard sentence fails stay on `sdd-ethan-audit-verdict`. feature-24 stays ToDo.

### Feature-21 changes-log and issues-log seeds are Done

**Why**: The user confirmed both EN seeds are usable.

**What changed**: Sprint 4 feature-21 is Done. [Spec-seeds-08](./product-backlog.md#pb-39) and [Spec-seeds-13](./product-backlog.md#pb-84) are Done. The EN [`artifacts-map.md`](./framework/seeds/templates/EN/artifacts-map.md) seed now says Open issues hold Open, Fixed, and Deferred rows, and Closed issues hold Closed rows. [`status.md`](./status.md) drops feature-21 from the next items.

**Verification**: The seed tree names `changes-log.md` and the two issues-log tables the same way as [ADR-075](./adr/ADR-075-issues-log-tables.md), the design, and the practices. No seed says the issues-log status is only Open or Closed.

**Boundary**: HanS and HanT bodies stay on i18n-02.

### The writing rule is friendly-language.mdc

**Why**: The always-on writing rule file is now `friendly-language.mdc`.

**What changed**: The seed is `specs/framework/seeds/rules/friendly-language.mdc`. The heading is Rule - Friendly language. [`framework-design.md`](./framework/framework-design.md) names that file and the loaded path `~/.cursor/rules/friendly-language.mdc`. The personal copy and the rules catalog use the same name.

**Verification**: No spec or rule copy names `communication-friendly.mdc` or `write-friendly.mdc`. Mentions of `writing-style.mdc` stay, because that is the rule this one replaced.

### The read skill is sdd-review-status

**Why**: The read-only skill folder is now `sdd-review-status`.

**What changed**: The seed moved from `specs/framework/seeds/skills/sdd-get-status/` to `specs/framework/seeds/skills/sdd-review-status/`. The frontmatter name is `sdd-review-status`. The heading is Review status. Living specs use that name. The constants key stays `skill_get_status`. Feature-24 stays ToDo.

**Verification**: Living files name `sdd-review-status`. Closed OGT rows and older entries in this file still name `sdd-get-status`.

**Boundary**: The ADR-073 file name stays. This does not rewrite `~/.cursor`.

### The conclusion record is changes-log.md

**Why**: The conclusion record file is now `changes-log.md`.

**What changed**: This file moved from `specs/change-log.md` to `specs/changes-log.md`. The EN seed moved to `specs/framework/seeds/templates/EN/changes-log.md`. Both titles are Changes log. Living specs, skills, and the published guide name `changes-log.md`. [Spec-seeds-08](./product-backlog.md#pb-39) stays ToDo.

**Verification**: Those living files name `changes-log.md`. The 2026-09-27 product-backlog row still names `change-log.md`.

**Boundary**: The ADR-070 file name stays. This does not rewrite `~/.cursor`.

### Change log entries use one shape

**Why**: The live log and the EN seed described a conclusion, and they did not state the day order or the entry labels.

**What changed**: This file, [`changes-log.md`](./framework/seeds/templates/EN/changes-log.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), and [`framework-design.md`](./framework/framework-design.md) state the same shape. Days are `## YYYY-MM-DD`, newest first. Each entry is **Why**, **What changed**, and **Verification**. **Boundary** is optional. [Spec-seeds-08](./product-backlog.md#pb-39) stays ToDo.

**Verification**: The four files name those labels and the day order. This file's day headings run from `2026-09-30` down to `2026-09-21`.

### Feature-28 reads the guide and practices when the step needs them

**Why**: Reading both files during onboard pulls them into a reply that only needs the ledger and the audit.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) reads `scrum-in-sdd.md` when the user asks what a Scrum in SDD name means, and `sdd-scrum-practices.md` when a job from the table is about to run. Onboard does not open either file. [`framework-design.md`](./framework/framework-design.md) §7 and §14 match. Sprint 4 feature-28 is Done. The next item is feature-23.

**Verification**: The seed and §14 are the same text. Both file names and both read triggers are in the Knowledge section. Onboard still reads the ledger and follows `sdd-audit-artifacts`.

### The step is named onboard

**Why**: The prompt already named the once-per-chat step onboard. Living specs still used the previous name for that step.

**What changed**: That previous name is now onboard in [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-test.md), [`sprint-backlog.md`](./sprint-backlog.md), [`status.md`](./status.md), [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md), [ADR-073](./adr/ADR-073-skill-get-status.md), the two skill descriptions, and the earlier entries in this file.

**Verification**: A search of the specs finds no previous name for this step. Feature-28 stays ToDo.

### Open OGT heading names the abbreviation

**Why**: The section title `Current OGT` did not say what the letters stand for.

**What changed**: The heading is `Current OGT(On-going Tasks)` in the EN status seed, [`status.md`](./status.md), [Spec-seeds-07](./product-backlog.md#pb-38), [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md) AC3, [`framework-test.md`](./framework/framework-test.md) CE-TPL-08, and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md).

**Verification**: A search of living specs finds `Current OGT` only in this file's earlier entry. The seed heading is `## Current OGT(On-going Tasks)`.

### Portal guide uses the three artifact groups

**Why**: The instructions-page copies of the guide still listed `artifacts-map.md` under Framework artifacts and used `{model_name}`.

**What changed**: [`scrum-in-sdd.en.md`](../src/content/scrum-in-sdd/scrum-in-sdd.en.md), [`scrum-in-sdd.zh-Hans.md`](../src/content/scrum-in-sdd/scrum-in-sdd.zh-Hans.md), and [`scrum-in-sdd.zh-Hant.md`](../src/content/scrum-in-sdd/scrum-in-sdd.zh-Hant.md) now list Core, Framework, and Engineering artifacts, plus pack files beside those groups. Engineering uses `{stem}` and includes `issues-log.md`. The Chinese ADD heading is `SDD 核心工件`, so it stays distinct from the KEEP heading `核心工件`.

**Verification**: None of the three portal files still contains `{model_name}`. The HanS seed stays on i18n-01. OGT 1 is closed.

### Guide names three artifact groups; missing seeds added

**Why**: The English guide put `artifacts-map.md` under Framework artifacts, had no Core group, omitted `issues-log.md`, and used `{model_name}`. The design named authoring seeds that were not in the seed tree.

**What changed**: [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md) lists Core artifacts (`scrum-in-sdd.md`, `sdd-scrum-practices.md`, `artifacts-map.md`), Framework artifacts (`product-backlog.md`, `sprint-backlog.md`, `status.md`, `change-log.md`), and Engineering artifacts (`architecture.md`, `{stem}-stories.md`, `{stem}-design.md`, `{stem}-test.md`, `deployment.md`, `.secrets`, `issues-log.md`). `constants.md` and `.sdd-installed.json` are pack files beside those groups. The ADD Core group is not Scrum's KEEP core artifacts. New draft seeds: `seeds/.sdd-installed.json` (field example, `pack_complete: false`, outside the install allow-list), `templates/EN/issues-log.md`, `templates/EN/.secrets`, `rules/dod.mdc`, `rules/incremental-delivery.mdc`, `rules/realtime-status.mdc`, `rules/artifacts-map.mdc`, `skills/sdd-audit-artifacts/SKILL.md`, and `skills/sdd-get-status/SKILL.md`. [`framework-design.md`](./framework/framework-design.md) records the ledger example and the draft seeds. `skills/sdd-update-status/` was not added; `sdd-tracking` stays the status-write folder.

**Verification**: The seed tree has every authoring seed path the design names except the skills still listed as not in the tree and the HanS/HanT bodies. The `.secrets` seed has no value. The ledger example has `pack_complete: false`. OGT 2, feature-23, feature-24, Rule-01 through Rule-04, Spec-seeds-11, and Spec-seeds-13 stay open until the user confirms them.

## 2026-09-29

### Affected SBIs are bullets

**Why**: Several SBIs in one cell were one comma-separated line, so the list was hard to scan.

**What changed**: Each Affected SBIs item is its own bullet in the cell. The bullet is the code and the SBI name. Updated [Spec-seeds-07](./product-backlog.md#pb-38), [`framework-design.md`](./framework/framework-design.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`sdd-tracking`](./framework/seeds/skills/sdd-tracking/SKILL.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-test.md), the EN status seed, and [`status.md`](./status.md).

**Verification**: The open OGT row that names four SBIs shows four bullets. The EN seed sample cell is a bullet list.

### status.md progress rows fold by status

**Why**: The progress table repeated a sprint goal that already lives on the sprint backlog, and it listed every sprint on its own row.

**What changed**: The progress table is `Sprint`, `Status`, `Note`. Consecutive Done sprints share one row. Consecutive ToDo sprints share one row. Where we are now adds one sentence after the sprint name. What is next follows the current sprint, the current SBI, and the sprint item order. Affected SBIs shows the code and the SBI name. The file ends with Last updated, a timestamp, and the agent name. Updated [Spec-seeds-07](./product-backlog.md#pb-38), [`framework-design.md`](./framework/framework-design.md), [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-stories.md`](./framework/framework-stories.md), [`framework-test.md`](./framework/framework-test.md), the EN status seed, and [`status.md`](./status.md).

**Verification**: The live progress table has three sprint rows: Sprint 1 - 3 Done, Sprint 4 WIP, Sprint 5 - 16 ToDo. The EN seed sprint header has no Sprint Goal column. The live file ends with Last updated.

### status.md starter has one section list

**Why**: Design §2.3, the templates section, ADR-070, and `sdd-get-status` described different slices of `status.md`. Feature-27 had no story or test for the starter.

**What changed**: [`framework-design.md`](./framework/framework-design.md) §2.3 and the `status.md` template section name Project progress, where we are now, what could be the next, Current OGT, and the latest 15 closed OGTs. [`framework-stories.md`](./framework/framework-stories.md) AC3–AC8 and [`framework-test.md`](./framework/framework-test.md) CE-TPL-08 and CE-TPL-09 cover that shape. The EN seed keeps its comments and samples. [`status.md`](./status.md) is reshaped for review. Feature-27 stays WIP.

**Verification**: The EN seed title is `The latest status of [product name]`. Its header has no `status:` line and no `as_of` line. The live status file uses the same five sections.

### Sprint items use one Definition of Done section

**Why**: Every sprint row repeated a DoD cell, and later sprints had put that row’s acceptance in the same cell.

**What changed**: [`sprint-backlog.md`](./sprint-backlog.md) and the EN sprint-backlog seed drop the DoD column. One Definition of Done checklist sits above the first sprint. Sprints 3, 4, and 5 state a replacement checklist. A row that had its own check keeps it as an item-acceptance line under that sprint. [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-design.md`](./framework/framework-design.md), [`framework-stories.md`](./framework/framework-stories.md), and [`framework-test.md`](./framework/framework-test.md) match.

**Verification**: Sprint item headers are `#`, Code, SBI, Parent PBI, Module/Type, Related specs, Status. The EN seed header matches. No sprint item header still contains DoD.

### Product Backlog requirements leave the Description column

**Why**: The Description cell was holding the requirement, and every row repeated the same DoD checklist.

**What changed**: The requirement is a paragraph under the feature name. Description is a short summary. The Product Backlog DoD column is removed. One Definition of Done checklist sits above the Product Backlog table. Updated [`product-backlog.md`](./product-backlog.md), the EN product-backlog seed, [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md), [`framework-design.md`](./framework/framework-design.md), and [`framework-stories.md`](./framework/framework-stories.md).

**Verification**: The live table header is Category, PBI Code, PBI, Description, Related, Sprint, Status. The EN seed header matches. Spec-seeds-07’s status starter stays in the requirement paragraph under that feature.

### sdd-audit-artifacts design matches the stories

**Why**: Stories and tests already covered a template-folder map, a file outside `specs/`, an absolute stored path, and a locale value. The design section did not.

**What changed**: [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) now states those path and locale rules. The verdict table is unchanged. `SKILL.md` is still not added. Feature-23 stays ToDo.

**Verification**: AC3, AC4, AC7, and AC10–AC12 in [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts) each have a sentence in that design section.

### sdd-audit-artifacts is specified

**Why**: Onboard follows the audit verdict, and the test plan still described the retired install-and-copy recovery.

**What changed**: [Skill-10](./product-backlog.md#pb-30) states the read-only verdict. [`framework-design.md`](./framework/framework-design.md#sdd-audit-artifacts) states how the skill reaches it. [`framework-stories.md`](./framework/framework-stories.md#sdd-audit-artifacts) and [`framework-test.md`](./framework/framework-test.md) cover the three verdicts, an empty locale, and the read-only stop. Sprint 4 feature-23 stays ToDo. `SKILL.md` is not added.

**Verification**: The design verdict table is unchanged. Feature-23 related specs point at the design section and the stories. Feature-27 stays WIP. Feature-28 stays the ethan guide-and-practices read.

### Skill authoring skill is sdd-create-skill

**Why**: The pack had two authoring skills. One is tied to a single tool. The other ships an eval harness this pack does not run. New skills must land at `{client_root}/{skills_dir}/`.

**What changed**: [ADR-074](./adr/ADR-074-sdd-create-skill.md). Seed [`sdd-create-skill`](./framework/seeds/skills/sdd-create-skill/SKILL.md). Constants key `skill_create_skill`. [Skill-16](./product-backlog.md#pb-87) is not on the current sprint. Pack copies of `skill-creator` and `create-skill` are removed.

**Verification**: The skill file names only `{client_root}` and `skills_dir` from `constants.md`. The guide lists `sdd-create-skill`. OGT 9 is closed.

### Seed tree moves under specs/framework/seeds

**Why**: The pack seeds and the framework design belong in one folder.

**What changed**: `specs/framework.seeds/` is now [`specs/framework/seeds/`](./framework/seeds/). Living specs point at that path.

**Verification**: `framework.seeds` is gone from the tree. Links from the English practices seed resolve to `framework-design.md` and ADR-060.

### Framework design, stories, and tests live under specs/framework/

**Why**: The coach design and the artifact design were two files. One design covers every framework category.

**What changed**: [`framework-design.md`](./framework/framework-design.md) is the overall design, with sections for framework-artifacts, agents, rules, skills, and templates. [`framework-stories.md`](./framework/framework-stories.md) and [`framework-test.md`](./framework/framework-test.md) hold the former agent stories and tests under agents, and add sections for skills, rules, core-artifacts, process-artifacts, and engineering-artifacts. `specs/agent-ethan/` and `specs/framework.seeds/framework-design.md` are removed.

**Verification**: Product backlog, sprint backlog, artifacts map, practices, and architecture links resolve to `specs/framework/`.

### Sprint 3 is the portal and MCP. Onboard moves to Sprint 4

**Why**: Sprint 3 was mixing the R2 portal and MCP work with Ethan’s onboard.

**What changed**: Sprint 3 keeps the MCP and web-portal rows, all Done. task-01 and task-03 through task-06 are not separate increments. task-02 stays. Framework rows move to Sprint 4, whose goal is that Ethan completes onboard. Kickoff and update-project move to Sprint 5. The former Sprint 5 through Sprint 15 become Sprint 6 through Sprint 16.

**Verification**: Sprint 3 status is Done. The current item is Sprint 4 feature-27.

### Sprint 3 adds the onboard prompt and the design merge

**Why**: Onboard does not yet read the guide and practices, and Ethan’s design still lives in a second file.

**What changed**: Sprint 3 feature-28 is `ethan.md` reading `scrum-in-sdd.md` and `sdd-scrum-practices.md` during onboard, and adding the skills that load names. feature-29 merges [`agent-design.md`](./framework/framework-design.md) into [`framework-design.md`](./framework/framework-design.md). Both sit after the status seed.

**Verification**: The open order is feature-27, feature-28, feature-29, then feature-23.

### status.md keeps the last 15 closed OGTs

**Why**: Finished on-going tasks were either struck through in the open list or dropped. The open list was no longer only open work.

**What changed**: [`status.md`](./status.md) keeps open OGTs in the current table. A new section holds the latest 15 closed OGTs, newest first. [`framework-design.md`](./framework/framework-design.md) states that rule.

**Verification**: The current table has tasks 3 and 6. The closed section has 15 rows.

### status.md is its own Sprint 3 item

**Why**: A Usable audit opens `status.md`, and `sdd-get-status` reads it. The seed was only a parent on the Done map-seed row, while [Spec-seeds-07](./product-backlog.md#pb-38) stayed ToDo.

**What changed**: Sprint 3 feature-27 is the `status.md` seed, after feature-23 and before feature-24. feature-03 now parents only the artifacts-map seed.

**Verification**: The open list names feature-27. Spec-seeds-07 remains Sprint 3 ToDo.

### Next SBI is sdd-audit-artifacts

**Why**: Onboard follows `sdd-audit-artifacts` immediately after the ledger. The row was Sprint 3 feature-23 at open place 26, after the artifacts-map rule.

**What changed**: Open Sprint 3 order follows onboard. Next is feature-23 `sdd-audit-artifacts`. Then feature-24 `sdd-get-status`, feature-25 `sdd-update-project`, feature-26 Ethan runs that skill, feature-21 the remaining seeds, feature-01 kickoff, feature-02 Ethan runs kickoff, and feature-22 the artifacts-map rule. Sprint 4 has no SBIs. Skill-15, Skill-04, and Agent-09 project Sprint 3.

**Verification**: The first open Sprint 3 row is feature-23.

### sdd-audit-artifacts moves to Sprint 3

**Why**: Onboard follows `sdd-audit-artifacts` before kickoff. The skill was scheduled in Sprint 4.

**What changed**: The initial skill is Sprint 3 feature-23, after the remaining seeds and before `sdd-kickoff-project`. Sprint 3 already uses feature-03 for the map seed, so the code is feature-23. [Skill-10](./product-backlog.md#pb-30) projects Sprint 3. Sprint 4 keeps `sdd-get-status` and `sdd-update-project`.

**Verification**: Sprint 3 open order is feature-22, feature-21, feature-23, feature-01, feature-02. Sprint 4 no longer contains the audit skill.

### Sprint 1 and Sprint 2 use the DoD rule

**Why**: Those sprint rows still held the old acceptance text after the column became DoD.

**What changed**: Every Sprint 1 and Sprint 2 row in [`sprint-backlog.md`](./sprint-backlog.md) uses the four default checks. Sprint 2 feature-12 and feature-13 are one row each again, with their related specs restored.

**Verification**: Sprint 1 has 4 rows and Sprint 2 has 15. Each DoD cell is the default checks. Status on the repaired rows is Done.

### Product Backlog DoD cells use the default checks

**Why**: The column was renamed to DoD, and the cells still held the old acceptance text.

**What changed**: Every row in [`product-backlog.md`](./product-backlog.md) uses the four default checks: the DoD rule, user confirmation, linked acceptance criteria, and the quality bar in [`agent-test.md`](./framework/framework-test.md), [`mcp-test.md`](./mcp/mcp-test.md), and [`app-test.md`](./admin-portal/app-test.md).

**Verification**: The Product Backlog table has one DoD cell shape on every row.

### Code is the second sprint column, and Product Backlog uses DoD

**Why**: `Code` was hard to scan after the item name. The Product Backlog still called its done-check column acceptance criteria after the sprint table had moved to DoD.

**What changed**: Sprint item columns are `#`, `Code`, `SBI`, Parent PBI, Module/Type, DoD, Related specs, Status. The Product Backlog column is `DoD`. The English product-backlog seed uses the same default DoD checks as the sprint seed. This repo’s product backlog keeps each row’s existing checks under that header. [`framework-design.md`](./framework/framework-design.md) and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) match.

**Verification**: Sprint tables have eight cells and `Code` is column 2. Product Backlog headers say `DoD`.

### Sprint item column is DoD

**Why**: The sprint row was mixing story acceptance criteria with the check that marks the row done.

**What changed**: The sprint-item column is `DoD` in [`sprint-backlog.md`](./sprint-backlog.md), the EN seed, [`framework-design.md`](./framework/framework-design.md), and [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). The seed default is the DoD rule, user confirmation, linked acceptance criteria, and the quality standard. Sprint 3 uses its own three checks: confirmed usable, pack cross-review, and TRUE AGENT. Product Backlog acceptance criteria stay on the PBI.

**Verification**: Sprint tables use `DoD`. Sprint 4 and earlier sprints keep their previous cell text under that header. Sprint 3 feature-18 is one row again.

### Seed prompt matches the audit onboard

**Why**: `agents/ethan.md` still classified a project from a missing `artifacts-map.md`. The design already moved that judgment into `sdd-audit-artifacts`.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) now follows §2.2, §2.4, and the §3 job index in [`agent-design.md`](./framework/framework-design.md). Onboard is the pack gate, then `sdd-audit-artifacts`, then one of `sdd-kickoff-project`, `sdd-update-project`, or `sdd-get-status`. Report status stays `skill_update_status`, and the prompt says to use `skill_tracking` until `constants.md` is renamed.

**Verification**: The seed no longer treats a missing map as a new project. It does not call `sdd_install_framework` or `sdd_update_framework`.

### Prompt wording and §14 stay identical

**Why**: Locale is an address the job reads, and the job table must not invent skill folder names. The design and the seed had started to diverge.

**What changed**: [`agents/ethan.md`](./framework/seeds/agents/ethan.md) reads `locale` from `{workspace}/artifacts-map.md` when a job needs it. Allowed values include `EN`, `HanS`, and `HanT`. Onboard names four skills by folder. Jobs in the table use the folder from `constants.md`. [`agent-design.md`](./framework/framework-design.md) §14 is that same prompt. Sprint 3 feature-11 is Done.

**Verification**: §14 and the seed file match. Feature-11 acceptance criteria are met. Parent [Agent-02](./product-backlog.md#pb-7) stays ToDo.

### Audit reports an empty locale

**Why**: A missing `locale` is a header field. Ethan was left to notice it himself, and a chat question does not write the map.

**What changed**: `sdd-audit-artifacts` reports `locale` empty only when it opened the map and the field is missing. That report does not change the verdict. On `Usable`, onboard still follows `sdd-get-status`. When a later job needs a locale and the report says it is empty, Ethan proposes `sdd-update-project` and waits for confirm. [`framework-design.md`](./framework/framework-design.md), [`agent-design.md`](./framework/framework-design.md) §2.2 and §14, and the seed prompt match. Skill-10 and Sprint 4 feature-03 include the report.

**Verification**: An empty `locale` is not `Uninitialized` or `Index broken`. §14 and the seed match.

---

## 2026-09-28

### Onboard uses an audit verdict

**Why**: A missing root `artifacts-map.md` is not enough to call a project new, and a readable map is not enough to call the tree healthy. Listing every layout in `ethan.md` does not scale.

**What changed**: [`agent-design.md`](./framework/framework-design.md) §2.2 and §2.4. After the pack gate, Ethan follows the skill `sdd-audit-artifacts`. `Uninitialized` proposes `sdd-kickoff-project`. `Index broken` proposes `sdd-update-project`. `Usable` follows the skill `sdd-get-status` ([ADR-073](./adr/ADR-073-skill-get-status.md)). A missing skill, rule, or seed template sets `pack_complete` to false. The MCP tools `sdd_install_framework` and `sdd_update_framework` are not pack files, and Ethan does not call them to repair a missing file. [`framework-design.md`](./framework/framework-design.md) records the three skills. [Skill-15](./product-backlog.md#pb-86) is Sprint 4. [Skill-10](./product-backlog.md#pb-30) and [Skill-04](./product-backlog.md#pb-24) move their initial files to Sprint 4. The seed `agents/ethan.md` is not updated yet.

**Verification**: §2.2 names the three verdicts. §6 no longer tells Ethan to call install. Sprint 4 lists feature-03 (`sdd-audit-artifacts`), feature-04 (`sdd-get-status`), feature-01 (`sdd-update-project`), and feature-02.

---

## 2026-09-27

### Constants rules and audit skill key

**Why**: The guide names rule files without an `sdd-` prefix and includes `artifacts-map.mdc`. `constants.md` still used the old prefixed names, omitted that rule, and keyed the audit skill by folder name while Skill-10 names `skill_audit_artifacts`.

**What changed**: [`constants.md`](./framework/seeds/templates/constants.md) rules are `dod.mdc`, `incremental-delivery.mdc`, `realtime-status.mdc`, and `artifacts-map.mdc`. The audit skill key is `skill_audit_artifacts`. Rule-01–03, Sprint 11 rows, the agent-design ledger example, ADR-065, and instruction mocks use the no-prefix names. Guide Rules lists and Features catalogs name `artifacts-map.mdc`. Feature-22 stays ToDo and does not write the `.mdc` file.

**Verification**: A search of living specs finds no `sdd-dod.mdc`, `sdd-incremental-delivery.mdc`, or `sdd-realtime-status.mdc`. `constants.md` lists four rules and `skill_audit_artifacts`.

### No combined ADR for the artifact index

**Why**: The artifact-index decisions are already in `framework-design.md`, ADR-070, and ADR-072. One more ADR would repeat them.

**What changed**: [`framework-design.md`](./framework/framework-design.md) states that those decisions are not restated in a combined ADR.

**Verification**: That sentence is in the Framework files section.

### Rule artifacts-map

**Why**: `sdd-audit-artifacts` runs only when asked. An ordinary turn can add a project file and leave the project map unchanged.

**What changed**: [ADR-072](./adr/ADR-072-rule-artifacts-map.md). The rule file is `artifacts-map.mdc`, with no `sdd-` prefix. The EN guide lists it. [Rule-04](./product-backlog.md#pb-85) is Sprint 3 feature-22, which still has to write `specs/framework/seeds/rules/artifacts-map.mdc` and update the remaining spec lists.

**Verification**: Both Rules lists in `templates/EN/scrum-in-sdd.md` name `artifacts-map.mdc`. Sprint 3 feature-22 is ToDo.

### Portal markdown paths move under content/

**Why**: Features files at the pack root sit next to the installable pack. Scrum in SDD needs the same local-read path without joining that root.

**What changed**: [ADR-071](./adr/ADR-071-portal-content-paths.md). Sync still stores the whole pack locally. Features reads `<unpacked>/content/features/`. Scrum in SDD reads `<unpacked>/content/scrum-in-sdd/` with fallback `src/content/scrum-in-sdd/`. Third tab on `/` and `/instructions` (`?tab=scrum-in-sdd`). Label stays `Scrum in SDD` in all locales.

**Verification**: Unit tests for both readers and the tab. Install omit for both folders. Playwright instructions 5/5. Browser check on `localhost:3040`. Ethan confirmed the `.scrum-body` heading scale on 2026-09-27.

### Guide and practices stay on the client root

**Why**: The guide and the practices are framework text. Copying them into every project makes a second copy that drifts from the pack.

**What changed**: [`framework-design.md`](./framework/framework-design.md) keeps `scrum-in-sdd.md` and `sdd-scrum-practices.md` at `{client_root}/templates/framework.sdd.works/{locale}/`. Kickoff does not copy them into the project.

**Verification**: The Framework files section and kickoff step 3 state this.

### Change log and issues log are both process files

**Why**: A finished change and an open defect are different records. One file cannot hold both without mixing them.

**What changed**: [ADR-070](./adr/ADR-070-change-log-and-issues-log.md). Process files under `artifacts_root` are the product backlog, the sprint backlog, status, the change log, and the issues log. [Spec-seeds-08](./product-backlog.md#pb-39) moves to Sprint 3. [Spec-seeds-13](./product-backlog.md#pb-84) is the issues-log seed. Sprint 3 feature-21 writes both EN starters. Sprint 5 no longer schedules the change-log seed.

**Verification**: The ADR, the Process files section in `framework-design.md`, the product-backlog rows, and Sprint 3 feature-21 agree. Sprint 5 has no change-log seed row.

### Kickoff writes the map, then copies missing seeds

**Why**: A new project has no `artifacts-map.md`. Kickoff cannot start by reading that file.

**What changed**: [`framework-design.md`](./framework/framework-design.md) states the `sdd-kickoff-project` order: ask for the product name, `artifacts_root`, locale, and module folders; write the map; copy a seed only where the target file is missing. A file that already has content is left as it is.

**Verification**: The Kickoff section states this order.

### Module engineering files use a stem

**Why**: Identical basenames such as `design.md` collide in the `@` menu when a project has more than one module. The folder is not visible in that menu until the user picks a row.

**What changed**: [`framework-design.md`](./framework/framework-design.md) names module files `{stem}-design.md`, `{stem}-stories.md`, and `{stem}-test.md`. The default stem is the folder name. A shorter stem is stored once on that module, with the three local paths. Stems are unique across modules. Paths in the map are relative to `artifacts_root`. The worked line is `web-app/app-design.md` with `stem: app`.

**Verification**: The Module engineering files section states the stem rule, the `@` reason, and the path example.

### Sprint 3 feature-20: start-project skill is sdd-kickoff-project

**Why**: The designed folder `sdd-new-project` did not match how the job kicks off an SDD project, and Ethan’s “no kickoff-project skill” line would conflict once that folder name is used.

**What changed**: [Skill-03](./product-backlog.md#pb-23) is `sdd-kickoff-project`. Constants key stays `skill_start_project`. Practices job 2 stays Start a new project. [ADR-069](./adr/ADR-069-skill-kickoff-project.md). Living guide lists, Features catalog, mocks, and locale keys updated. Ethan and agent-design say job 2 uses only that folder. No `SKILL.md` in this row; feature-01 still writes it.

**Verification**: A search of living specs and Features markdown finds no `sdd-new-project`. `samectx-notes/` left as history.

### Sprint 3 feature-16 design: Scrum in SDD tab

**Why**: Readers need the guide next to Features without hard-coding the body.

**What changed**: [Web-portal-12](#pb-81) requirement names the third tab, cache-first files, and `GET /api/sdd/scrum-in-sdd`. Feature-16 Notes list six tasks. Design pass builds HanT plus three `src/content/scrum-in-sdd/` files, AC18, and the mockup spike. Live page stays two tabs until Ethan confirms.

**Verification**: Specs and mockup only in this entry.

## 2026-09-26

### Guide filename is scrum-in-sdd.md

**Why**: The guide’s common name is Scrum-in-SDD; the seed path still said `sdd-scrum-guide.md`, so Ethan and catalogs opened a name that did not match the artifact label.

**What changed**: EN and HanS seeds are [`scrum-in-sdd.md`](./framework/seeds/templates/EN/scrum-in-sdd.md). Living pointers (Ethan, practices, maps, process headers, Spec-seeds-02 / i18n-01, Features catalog, instruction mocks, feature-16 / Web-portal-12) use the new name. [ADR-068](./adr/ADR-068-scrum-in-sdd-filename.md). Sprint 3 feature-18 (rename) and feature-19 (portal catalog and unbuilt tab path). Dated history keeps the old name. Practices stay `sdd-scrum-practices.md`.

**Verification**: Both locale seeds exist under the new name. Ethan onboard names `scrum-in-sdd.md`. A search of living specs and Features markdown finds no `sdd-scrum-guide.md` except dated history and `samectx-notes/`.

### Pokymon sample for the artifact index

**Why**: The labeled-list decision needed a worked file, and artifact seeds do not need their own status or last-update line.

**What changed**: [`framework-design.md`](./framework/framework-design.md) records that seeds omit status and last-update. The EN seed [`artifacts-map.md`](./framework/seeds/templates/EN/artifacts-map.md) is the Pokymon Card Collection labeled list. It replaces the old table catalog.

**Verification**: The seed is a labeled list with product name, `artifacts_root`, locale, and one block per file the example project already has. No status line and no timestamp on a row.

### Artifact index is a labeled config

**Why**: The map was acting as a reading catalog. Ethan needs a short config that names the product, the artifacts root, and the files this project has.

**What changed**: [`framework-design.md`](./framework/framework-design.md) now specifies a labeled list with no tables. Header fields are product name, `artifacts_root`, and locale. There is no new-project flag in the file. Each existing artifact has a name and a workspace-relative local path. Seed paths are pack-relative and omitted when they follow `templates/{locale}/<name>`. The seed template is not rewritten yet.

**Verification**: The Artifact index section in `framework-design.md` states this shape.

### Artifact index at the workspace root

**Why**: Ethan has to find the project index before he knows whether the artifacts root is `specs` or `docs`.

**What changed**: `{workspace}/artifacts-map.md` names `artifacts_root`. The default is `specs`. The user may set `docs`. Paths in the map are relative to that folder. The filename stays `artifacts-map.md`. [`framework-design.md`](./framework/framework-design.md) moved from `templates/EN/` to `specs/framework/seeds/`.

**Verification**: The old path is gone. Live links point at `specs/framework/framework-design.md`.

### Sprint 3 feature-17: Get secret moves to Setup

**Why**: Get secret is a setup action. The Features tab is the catalog.

**What changed**: [Web-portal-13](./product-backlog.md#pb-83) is Sprint 3 feature-17. [ADR-067](./adr/ADR-067-get-secret-on-setup.md). The form sits after the tools table on Setup. Features has no form. Lookup behavior is unchanged. The page matches the mockup.

**Verification**: InstructionsPage unit tests (14) and Playwright instructions (4) pass. Ethan confirmed usable 2026-09-26. Browser: Setup shows Get secret after Tools; Features does not; blank and unknown names stay on Setup.

### Sprint 3 feature-16 and Sprint 15 feature-07: two new backlog items

**Why**: The instructions page needs a tab for the sdd-scrum guide. The three Features markdown files at the pack root still need a review before go-live.

**What changed**: [Web-portal-12](./product-backlog.md#pb-81) is Sprint 3 feature-16. [Spec-seeds-12](./product-backlog.md#pb-82) is Sprint 15 feature-07, before the go-live copy.

**Verification**: Backlog rows only. No page change in this entry.

### Sprint 3 feature-07: Features tab reads synced markdown

**Why**: The Features tab needed the pack’s own markdown, in three locales, without an admin editor and without copying those files onto the client.

**What changed**: `/` and `/instructions` render `#features-body` from the latest unpack, then from `src/content/features/` when that unpack has no English file. `GET /api/sdd/features` uses the same reader. Install does not copy `features.en.md`, `features.zh-Hans.md`, or `features.zh-Hant.md`. Lists in that body use a disc and sit inset from the heading.

**Verification**: Unit and API tests cover cache, Chinese cache, English fallback, package fallback, and HTML escaping. Install test omits the three files. Ethan synced commit `30cde7ac` and confirmed the page usable on 2026-09-26. `source` was `cache`.

### Sprint 3 feature-15: implementation skill is sdd-implement

**Why**: The Features catalog already called the skill `sdd-implement`. The backlog id was still `sdd-implement-feature`.

**What changed**: [Skill-13](./product-backlog.md#pb-65) is `sdd-implement`. [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md) records the rename in the same decision as `sdd-design`. Initial file: `specs/framework/seeds/skills/sdd-implement/SKILL.md`. It loads `sdd-update-specs` and `sdd-tdd` when the SBI needs them, and it stops after that SBI.

**Verification**: Living specs, Features markdown, and locale strings use `sdd-implement`. The old id remains only in the 2026-09-24 backlog history lines and in this change log.

### Sprint 3 feature-13 and feature-14: sdd-design and initial sdd-tracking

**Why**: An SBI needs a design gate before implementation. The tracking skill id existed, and the file did not.

**What changed**: [Skill-14](./product-backlog.md#pb-80) is `sdd-design`. [ADR-066](./adr/ADR-066-sdd-design-before-implementation.md). Initial skills are `specs/framework/seeds/skills/sdd-design/SKILL.md` and `specs/framework/seeds/skills/sdd-tracking/SKILL.md`. Practices job 6 is still unfilled. Sprint 7 still owns that section and the install check. `sdd-design` is not a practices job. Implementation stays `sdd-implement-feature`.

**Verification**: Skill lists in the guides, constants, Features markdown, locale strings, and the instructions story include `sdd-design`. Both `SKILL.md` files use a frontmatter name that matches the folder.

### Sprint 3 feature-12: status skill is sdd-tracking

**Why**: The unbuilt skill id `sdd-update-status` named one file edit. Job 6 keeps the live project picture current.

**What changed**: The skill folder is `sdd-tracking` and the constants key is `skill_tracking`. Practices job 6 stays titled Report status. [ADR-065](./adr/ADR-065-skill-update-status.md). Sprint 7 still writes the skill file.

**Verification**: A search of living specs, Features markdown, and locale strings no longer finds `sdd-update-status` or `skill_update_status`.

### Sprint 3 feature-11: ethan onboard

**Why**: The seed prompt stopped after six files. It did not say which copy to read, and it did not read the other process and tracking files named in the map.

**What changed**: Sprint 3 feature-11 updates `agents/ethan.md`. Onboard is one numbered list: read the ledger, stop when `pack_complete` is not true, then read constants, the map, the guide, the practices, and the other process and tracking files. The first existing copy wins. `adr/` and `knowledge/` stay unread. Design §2.2 and §14 match that list. Toggle A install recovery stays out of the prompt.

**Verification**: Seed and [`agent-design.md`](./framework/framework-design.md) §14 use the same eight steps. Feature-11 is WIP until the start is confirmed usable.

### Features catalog plan, and Get secret is one feature

**Why**: The Features tab should show whatever markdown the pack publishes, in three languages, and still be usable when that file cannot be loaded. Get secret’s server lookup and its button were two feature rows for one product behavior.

**What changed**: [Web-portal-07](./product-backlog.md#pb-73) describes the three files. The page prefers the sync cache. If that cache cannot be read, it reads `src/content/features/features.en.md`, `features.zh-Hans.md`, and `features.zh-Hant.md` from the deployed `src/` tree. There is no unavailable message. Sprint 3 feature-05 absorbs the old feature-06. feature-07 stays ToDo, with task-01 through task-06 as the build order. Stories AC12–AC16, the instructions design, the mockups, and app-test §7 record the plan. No application code in this change.

**Verification**: Spec review only. Implementation has not started.

### MCP-01 scheduled on Sprint 15

**Why**: The installer stories are Done in Sprint 2. The remaining ToDo slice is go-live, and it waits until the seed folder is finalized.

**What changed**: [MCP-01](./product-backlog.md#pb-16) sprint is Sprint 15. Sprint 15 feature-06 covers pack copy, GitHub Releases for the five `sdd-mcp` binaries, and admin-portal sync. Sprint 2 installer stories stay Done.

**Verification**: Product backlog sprint column, Sprint 15 feature-06, and `status.md` name Sprint 15 for that slice.

### Sprint 2 closed

**Why**: Every Sprint 2 SBI is Done. Go-live pack copy, GitHub Releases, and admin-portal sync were never Sprint 2 stories.

**What changed**: Sprint 2 status is Done. Current sprint is Sprint 3. [MCP-01](./product-backlog.md#pb-16) stays ToDo for the go-live slice. [ADR-064](./adr/ADR-064-e2e-must-not-wipe-seed-admin.md): Playwright must not delete the operator seed admin.

**Verification**: Sprint backlog SBI rows are Done. Retrospective recorded on the Sprint 2 section.

### Tracking cleanup

**Why**: `status.md` had copied every Sprint 2 SBI and still listed finished on-going tasks.

**What changed**: Sprint status is a projection table. Finished OGTs are removed. Sprint 2’s section heading is Done. [Agent-01](./product-backlog.md#pb-6) is Done with the closed Sprint 1 spike.

**Verification**: Sprint 3 remains WIP. Open SBIs are feature-01, feature-02, feature-03, and feature-07.

### Fix reset copy, Get secret layout, and local admin (WA-10 / WA-11 / WA-12)

**Why**: Previous reset sentence and Get secret layout were still wrong in application code. Local Postgres had no seed admin and leftover empty-hash Playwright rows forced set-password.

**What changed**: Restored `admin.reset.sent` without `{email}`; reset route logs skip / Resend-accepted without printing the URL. Get secret scrolls the result; found value is `.codeblock` + copy at lookup-row width. Deleted leftover `empty-*` admins; Playwright cleans up its fixture; seed created the local seed admin and keeps an existing non-empty hash. WA-10, WA-11, and WA-12 closed.

**Verification**: Unit tests for ResetPasswordPage and InstructionsPage (17 passed). Browser: reset success shows the previous sentence; Get secret not-found stays on `?tab=features`, matches lookup width, and is in view.

### Reset copy, local mail cause, Get secret layout (WA-10 / WA-11) — specs only

**Why**: Success copy must be the previous `admin.reset.sent` (no `{email}`). Local reset showed success with no inbox mail while production sent. Get secret result must scroll into view as a code block with copy at lookup-row width. Same class of bugs kept returning after “fixes.”

**What changed**: Opened WA-10 and WA-11. Restored previous sent sentences in backlog, stories, design, mockups, app-test, and Sprint 3 feature-10 / feature-06. Documented local-vs-production mail cause in [`knowledge/agent/admin-portal-seed-and-logo.md`](./knowledge/agent/admin-portal-seed-and-logo.md). Documented regression pattern in [`knowledge/agent/web-app-fix-regression.md`](./knowledge/agent/web-app-fix-regression.md).

**Verification**: Specs and mockups updated. Application code (catalog restore, logging, Get secret UI) is a later pass.

### Reset success copy and Get secret (WA-08 / WA-09)

**Why**: Reset success did not name the email and could disappear on a document GET. Get secret left Features and never showed a value or not-found.

**What changed**: Reset control is `type="button"`; `admin.reset.sent` interpolates `{email}`. Public `POST /api/sdd/secret` exact-name lookup. Features Get secret stays on `?tab=features` and shows a code block or `admin.guide.secret_missing`. WA-08 and WA-09 closed. Web-portal-11 and Web-portal-08 Done.

**Verification**: Unit ResetPasswordPage + InstructionsPage. Playwright auth + instructions (12 passed). Browser: reset names email; Get secret not-found stays on Features.

**Boundary**: Exact name only; no fuzzy match.

### Reset success copy and Get secret display (specs)

**Why**: After reset mail sends, the success callout does not name the email and can disappear on a document GET. Get secret leaves Features and never shows a value or not-found.

**What changed**: Issues WA-08 and WA-09. [Web-portal-11](./product-backlog.md#pb-79). Extended [Web-portal-08](./product-backlog.md#pb-74). Stories, design, mockups, app-test, Sprint 3 feature-10 and feature-06. Specs and mockups only.

**Verification**: Specs and mockups updated. Application code is a later pass (feature-10 then feature-06).

**Boundary**: Does not change live React or API routes in this change.

### Reset mail skipped on interactive dev (WA-07)

**Why**: Port 3040 was left with Playwright capture env. Reset returned `{ ok: true }` without Resend; the success screen kept the request lead, so the page looked unchanged and no mail arrived.

**What changed**: Skip Resend only when `E2E_SKIP_MAIL=1`. Capture paths (`E2E_RESET_FILE` / `E2E_INVITE_FILE`) name the file only. Playwright `webServer` sets the skip flag and does not reuse an existing server. Reset success hides `admin.reset.lead`. Issue WA-07 in [`issues-log.md`](./issues-log.md).

**Verification**: Unit `ResetPasswordPage` (lead hidden on success). Playwright `e2e/auth.spec.ts` + `e2e/accounts.spec.ts`. Browser reset on clean `npm run dev` (no skip flag).

**Boundary**: Does not change Resend templates or set-password token rules.

### MCP tools without sdd_list_versions (MCP-03)

**Why**: The person installs latest. `sdd_install_framework` already resolves omitted `version`. MCP has no private tool, so a registered catalog tool is a wasted round trip. Pack inventory for people is the Features tab.

**What changed**: [MCP-03](./product-backlog.md#pb-78) and [ADR-063](./adr/ADR-063-unregister-sdd-list-versions.md). Sprint 3 feature-08 unregisters the tool on stdio and HTTP and updates the tool-list tests. Feature-09 updates `GET /setup` (setup version `2026-09-26.v5`) and the instructions Tools table. `listVersions()` and `GET /api/sdd/versions` stay server-internal. No MCP resource.

**Verification**: `create-server.test.ts`, `local-binary.test.ts`, `InstructionsPage.test.tsx`, `sdd-api.test.ts`, `list-versions.test.ts`. Ethan confirmed both stories usable on 2026-09-26.

**Boundary**: Does not delete `listVersions()`. Does not rebuild `~/.sdd/sdd-mcp`. The placed binary stays on the previous tool list until `npm run mcp:build` and `npm run mcp:place`.

### Reset submit and Features tab (Web-portal-10)

**Why**: Reset mail submit reloaded the form with no success or error. The Features tab on the instructions guide did not open the features panel.

**What changed**: [Web-portal-10](./product-backlog.md#pb-77). Issues WA-05–WA-06. Reset stays on `/reset-password` with success callout or keyed error. Features tabs sit above the hero hit area. Mockup reset form intercepts submit.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (11 passed). Browser: Features selects panel; reset stays on `/reset-password` with success callout. WA-05–WA-06 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Web-app UI fixes (Web-portal-09)

**Why**: `/` still showed the logo-card home. Footer scrolled away. Reset success linked to home. Accounts with a password stayed on the empty-account set-password screen.

**What changed**: [Web-portal-09](./product-backlog.md#pb-76). Issues WA-01–WA-04 in [`issues-log.md`](./issues-log.md). `/` serves the instructions guide. Footer is fixed. Reset success uses Back to login. Set-password redirects when `passwordHash` is already set. E2E setup does not overwrite an existing seed password hash.

**Verification**: Stories, design, tests, mockups. Unit: `ResetPasswordPage` + `InstructionsPage`. Playwright `e2e/auth.spec.ts` + `e2e/instructions.spec.ts` (10 passed). WA-01–WA-04 closed in [`issues-log.md`](./issues-log.md).

**Boundary**: Does not implement secret lookup (feature-05 / feature-06).

### Sprint 3 feature-04 — secret form design

**Why**: Feature-04 is the Features-tab form chrome for [Web-portal-08](./product-backlog.md#pb-74). The sprint row named 繁體 without writing the strings. Stories, design, and tests needed enough coverage before implementation.

**What changed**: [`app-stories.md`](./admin-portal/app-stories.md) AC7 covers placement, three locale strings, Setup-tab absence, and inert submit. [`app-design.md`](./admin-portal/app-design.md) `/instructions` specifies the form layout, keys, CSS sizes, and reserves result nodes for feature-06. [`app-test.md`](./admin-portal/app-test.md) adds unit and E2E cases. Sprint 3 feature-04 and [Web-portal-08](./product-backlog.md#pb-74) name the 繁體 hint and button.

**Verification**: Specs only. Catalog already in `messages/{en,zh-Hans,zh-Hant}.json` and mock [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html).

**Boundary**: No UI code in this pass. Feature-05 owns the lookup. Feature-06 owns showing a value or not-found. Status stays ToDo until implementation.

## 2026-09-25

### Spec-seeds-01 constants.md confirmed

**Why**: Sprint 2 feature-04. Pack lookup needs a confirmed seed on the client root.

**What changed**: Spec-seeds-01 and Sprint 2 feature-04 are Done. User confirmed the seed and practices writing guidance. Cross-review: seed, practices, ADR-060, and ethan/agent links match. Filename is `constants.md`; not copied into workspace `specs/`.

**Verification**: User confirmed 2026-09-25. Seed at [`templates/constants.md`](./framework/seeds/templates/constants.md).

**Boundary**: Go-live pack copy stays separate. Does not close Sprint 2.

### Local binary ~/.sdd/sdd-mcp (MCP-02)

**Why**: The setup prompt named `~/.sdd/sdd-mcp`, and no Product Backlog row owned building that program. Agent tools block downloading an executable from the network.

**What changed**: [MCP-02](./product-backlog.md#pb-75) is Sprint 2 feature-14. `npm run mcp:build` compiles five OS/arch targets. `npm run mcp:place` copies the host file to `~/.sdd/sdd-mcp`. The stdio entry uses `createStdioMcpServer` so Prisma stays out of the binary. `GET /setup` starts that local file when present and does not download an executable. `npm run mcp:stdio` stays the contributor entry.

**Verification**: [`mcp/mcp-stories.md`](./mcp/mcp-stories.md) `sdd-mcp-local-binary`; [`src/mcp/local-binary.test.ts`](../src/mcp/local-binary.test.ts); `/setup` tests in [`sdd-api.test.ts`](../src/app/api/sdd/sdd-api.test.ts). Host binary placed at `~/.sdd/sdd-mcp`. Ethan confirmed usable from TRAE CN on 2026-09-26 (`tools/list` + `sdd_list_versions` against local `SDD_SERVER_URL`).

**Boundary**: GitHub Release upload is not this story.

### Instructions page re-design (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#pb-71). The public instructions page must match the Setup / Features mock after the stdio transport change. The old PBI title (“shows the ethan prompt”) was wrong.

**What changed**: PBI and SBI renamed to Instructions page re-design. `/instructions` gains Setup and Features tabs, the one-line `/setup` copy, one stdio `mcp.json`, a fixed Features catalog, and an inert secret form. Pack `features.md` sync and live secret lookup stay later items.

**Verification**: [`app-stories.md`](./admin-portal/app-stories.md) AC1, AC5, AC6; [`InstructionsPage.test.tsx`](../src/components/features/InstructionsPage.test.tsx); mock [`01-home.html`](./admin-portal/ui-mockup/01-home.html). User confirmed usable 2026-09-25.

**Boundary**: Does not implement [Web-portal-07](./product-backlog.md#pb-73) or [Web-portal-08](./product-backlog.md#pb-74) live lookup. Does not change `GET /setup` (backend-01).

### Instructions page looks up one secret (Web-portal-08)

**Why**: `sdd_get_key` is HTTP-only, so the stdio setup path cannot return a secret without a token in `mcp.json`. The lookup moves to the instructions page. The one-line setup prompt stays without a key.

**What changed**: [Web-portal-08](./product-backlog.md#pb-74) is Sprint 3 feature-04, feature-05, and feature-06. The Features tab mock has a name field and a Get secret button after the template list. A click in the mock shows a stand-in value. The live lookup is Sprint 3.

**Verification**: Product backlog row, Sprint 3 rows, and [`01-home.html`](./admin-portal/ui-mockup/01-home.html).

**Boundary**: No new admin token system. Stdio does not gain `sdd_get_key`. The setup prompt does not embed `MCP_AUTH_TOKEN`.

### Setup prompt URL is /setup (ADR-061)

**Why**: The instructions page keeps one paste sentence. The stdio contract stays in the markdown that sentence fetches. The public path should be `https://framework.sdd.works/setup`. Manual setup is one `mcp.json`.

**What changed**: [ADR-061](./adr/ADR-061-setup-prompt-public-path.md). Paste text is `Fetch and execute the setup instructions from https://framework.sdd.works/setup`. `GET /agent-setup` redirects to `GET /setup`. Source file stays `public/agent-setup/prompt.md`. Manual setup shows the `command` entry only. No second HTTP `mcp.json` and no `curl | sh` on that section. Feature-11 owns the page copy sentence. `backend-01` owns the public `/setup` route and redirect. Feature-12 owns the single sample. Feature-13 tests both.

**Verification**: ADR-061, [`mcp-design.md`](./mcp/mcp-design.md) §2.1, [`app-design.md`](./admin-portal/app-design.md) `/instructions`, [`app-stories.md`](./admin-portal/app-stories.md) AC3 and AC4, sprint feature-11–13 and `backend-01`, and the instructions mockup. The app route is not changed in this pass.

**Boundary**: HTTP fallback stays inside the fetched markdown. Terminal install stays in go-live. Closed Phase 1 snapshots that still say `/agent-setup` stay as history.

### Sprint 2 backend-01; Features tab to Sprint 3

**Why**: The one-line pastes needs a Backend SBI for the route that connects agent tools to MCP. The Features tab is not required to close Sprint 2.

**What changed**: Sprint 2 `backend-01` (Module MCP, Type Backend): one-line prompt automatically connects agent tools to MCP. [Web-portal-07](./product-backlog.md#pb-73) moved to Sprint 3 as feature-07.

**Verification**: [`sprint-backlog.md`](./sprint-backlog.md) Sprint 2 and Sprint 3. Product backlog Sprint column for pb-73 is Sprint 3.

### Features tab reads pack features.md (Web-portal-07)

**Why**: The Features list should change with the pack, using the sync cache that already updates on manual sync and every 30 minutes. An admin editor would be a second store.

**What changed**: [Web-portal-07](./product-backlog.md#pb-73) is Sprint 3 feature-07 (moved from Sprint 2). `features.md` at the pack root is the catalog. The public Features tab reads it from `.data/sdd-packages/<commit>/`. Four headings only: Agents, Skills, Rules, Templates. Each row is `name: sentence`. No admin editor and no parsed sidecar. Install does not copy the file onto `{client_root}`.

**Verification**: Product backlog row and Sprint 3 feature-07. Not implemented.

**Boundary**: Page chrome stays i18n keys. Sentences stay in the language of `features.md`.

### Instructions page becomes the public landing page (feature-10)

**Why**: Sprint 2 [Web-portal-05](./product-backlog.md#pb-71). The public site should open on install instructions. The old paste prompt and WoodenSward Dojo tools intro no longer match stdio-primary setup (ADR-058) or the ethan ledger gate.

**What changed** (requirement; live site not implemented in this pass). The paste sentence and the manual `mcp.json` in the bullets below are superseded by [ADR-061](./adr/ADR-061-setup-prompt-public-path.md) in the entry above:

- `/` is the instructions page. The logo-card home goes away. There is no Back to home link.
- Two tabs: **Setup** and **Features**.
- Remove the “Paste this prompt…” body, the “Paste this prompt” label, and the fetch-`/agent-setup` code block.
- Copy button and manual setup use a connect prompt with local `sdd-mcp` (`command` + `SDD_SERVER_URL`) first and HTTP `"url": "https://framework.sdd.works/mcp"` as fallback. Manual setup shows the command block first and the URL block as fallback. The terminal `curl | sh` block stays.
- Remove the Tools intro that mentions WoodenSward Dojo. Tools table drops the Channel column. Install description: “Install agents, skills, rules, and other capabilities from framework.sdd.works.” Update description: “Update the framework.”
- Body text and code blocks share one content width.
- Footer, right edge aligned to that column: Admin portal link, then `copyright © Ethan Huang`.
- Features tab lists only Agents, Skills, Rules, and Templates from [`sdd-scrum-guide.md`](./framework/seeds/templates/EN/sdd-scrum-guide.md) lines 314–349 (Artifacts map to Templates). Workflows and Knowledge are omitted. Each row is a name and one sentence.

**Verification**: UI mock at [`admin-portal/ui-mockup/01-home.html`](./admin-portal/ui-mockup/01-home.html) and [`13-instructions.html`](./admin-portal/ui-mockup/13-instructions.html). User confirms the mock before app implementation.

**Boundary**: Does not change `src/` or the live site. Per-client call-up research stays Sprint 13.

### Pack lookup renamed to constants.md

**Why**: The lookup file was named `project-constants.md`, which suggested a workspace copy under `specs/`. Ethan must read one pack file on the client root.

**What changed**: Filename is `constants.md`. Authoring seed is `specs/framework/seeds/templates/constants.md`. Live path is `{client_root}/templates/framework.sdd.works/constants.md`. Not copied into the workspace or into `specs/`. [ADR-060](./adr/ADR-060-constants-on-client-root.md). Writing guidance is under Templates in the EN practices. Spec-seeds-01, ethan, agent specs, MCP ledger examples, and the install fixture name the new file.

**Verification**: Grep for `project-constants` under live specs only hits ADR-056 and ADR-060 historical notes. Seed file exists at `templates/constants.md`.

**Boundary**: User review of the seed and seed-tree cross-review stay open on Sprint 2 feature-04. Does not implement portal UI.

### Sprint 1 closed

**Why**: The EN guide and practices seeds were confirmed. The archive path still said `phase1-specs/`.

**What changed**: Sprint 1 feature-01 and documentation-01 are Done. Spec-seeds-02 and Spec-seeds-03 are Done. Phase 1 archive links point at [`phase1-process-specs/`](./phase1-process-specs/). Sprint 1 status is Done. Next is Sprint 2.

**Verification**: Every Sprint 1 SBI is Done. Seed files are under `templates/EN/`. No remaining `phase1-specs/` path under live `specs/`.

**Boundary**: Does not add `constants.md`, `.secrets`, or HanS/HanT translations. Does not implement the installer.

## 2026-09-24

### Every product item has a sprint row

**Why**: `.secrets` is named in the guide and had no product item. Change-log, architecture, and deployment seeds had no sprint. Spec-01 and the remaining locale copies of the guide and practices had no sprint row.

**What changed**: [Spec-seeds-11](./product-backlog.md#pb-66) is the `.secrets` seed (the guide spelling). [Spec-seeds-08](./product-backlog.md#pb-39) is Sprint 5. [Spec-seeds-09](./product-backlog.md#pb-40), [Spec-seeds-10](./product-backlog.md#pb-41), and Spec-seeds-11 are Sprint 14. Sprint 1 records Spec-01 and the open HanT guide and HanS/HanT practices copies.

**Verification**: Each PBI code in `product-backlog.md` appears as a parent on at least one sprint row. No product row has an empty Sprint cell.

**Boundary**: Does not write the `.secrets` file or copy secret values.

### Sprint item columns and one retrospective per sprint

**Why**: Sprint rows used `#` and Category. A second retrospective in the same sprint was a second section.

**What changed**: Sprint tables use Code, Parent PBI, Module, Type, SBI. Code is the type plus a number, such as `feature-01`. A seed is a Feature. Research, Bug-fix, and Documentation are the other named types. Task is supporting work that is none of those. An SBI and a PBI status is only `ToDo`, `WIP`, or `Done`. Apply the Definition of Done rule before `Done`. Parent PBI shows the code and the name. The product backlog column stays Category. One Retrospective section per sprint, with timestamped Learnings and Opportunities. Shape: [`framework/framework-design.md`](./framework/framework-design.md). Same-category product rows: [`framework/seeds/templates/EN/sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) §3.1.

**Verification**: Live and seed `sprint-backlog.md` use the new columns. No second Retrospective heading in Sprint 1.

**Boundary**: Does not implement the installer or call `/ethan`.

## 2026-09-22

### Artifact taxonomy: guide vs practices; process / tracking / knowledge / optional

**Why**: Live pointers still said practices were “columns only.” The guide and map mixed process, tracking, and knowledge. Seeds under `.cursor/templates/` would reinstall that story.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) names process, tracking, knowledge, and optional/JIT artifacts, plus seeds vs working copies. [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) owns eight jobs and Templates (what/how/when). [`artifacts-map.md`](./artifacts-map.md) regroups by those categories. Sprint/product AC (`s2-guide`, pb-8), architecture/deployment headers, and agent-design/test pointers aligned. EN and HanS templates updated to match.

**Verification**: Map has Framework / Process / Tracking / Knowledge / Optional / This product sections. No remaining “writing conventions only” claim in live headers. Historical entries below keep their original wording.

**Boundary**: Does not fill remaining MVP 1 terms or implement Coach MVP 1.

### Rename agent-ethan folder and sprint-backlog file

**Why**: Shorter agent design path; the execution file is the Sprint Backlog, not a separate “plan” filename.

**What changed**: `specs/agent-coach-ethan/` → [`specs/agent-ethan/`](./agent-ethan/). Live and EN-template `sprint-plan.md` → [`sprint-backlog.md`](./sprint-backlog.md). Links in process docs retargeted. HanS template still uses `sprint_plan.md` until that pack is aligned.

**Verification**: No remaining `agent-coach-ethan` or `sprint-plan.md` paths under live `specs/` (Phase 1 `sprintN-plan.md` archive names unchanged).

**Boundary**: Does not implement the coach prompt or fill the Scrum guide.

### coach-ethan presence: local Cursor agent

**Why**: The coach must edit project specs, call Cursor skills, chat, and AskQuestion. Remote MCP cannot own the user’s `specs/` folder.

**What changed**: [`framework/framework-design.md`](./framework/framework-design.md) records presence, jobs, knowledge loading, and MVP capabilities. [D1](./sprint-backlog.md#rid-d1) is Closed (local Cursor agent). [`architecture.md`](./architecture.md) §2, [`artifacts-map.md`](./artifacts-map.md), and coach rows in [`product-backlog.md`](./product-backlog.md) point at that design.

**Verification**: Design file states local agent and non-goals. RID D1 status is Closed. No agent prompt file and no skill implementation in this change.

**Boundary**: This does not implement the coach prompt, fill the Scrum guide, or build process skills.

### Three MVPs for sdd-scrum-guide and coach-ethan

**Why**: The framework definition and the coach were one wide backlog row each. Feasibility needs small, complete loops of guide plus coach.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is the framework SSOT (stub sections). [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) stays writing conventions only. coach-ethan is a parent with MVP 1–3 (pb-8–10) on Sprint 2–4. Install, templates, full skills, and Instructions leave the current sprint. D1 notes that local Cursor agent is the feasibility path; MCP is undecided.

**Verification**: Sprint 2 has guide + coach MVP 1 rows. Sprint 3 and 4 exist for MVP 2 and 3. pb-2, pb-4, pb-6, pb-7 have empty Sprint. No agent prompt body and no guide prose beyond stubs.

**Boundary**: This does not implement the coach, the `plan` skill, or fill the guide.

## 2026-09-21

### Phase 2 backlog split into install, practices, templates, skills, coach-ethan, and Instructions

**Why**: One coach item and a wide template list hid the practices file, the six process skills, and the Instructions page. coach-ethan presence was being treated as already chosen.

**What changed**: [`product-backlog.md`](./product-backlog.md) now has PRACTICES-01, SKILLS-01, and INSTRUCT-01. TEMPLATES-01 is the four process files only. COACH-01 is coach-ethan (prompt, spike, presence TBD). Sprint 2 lists those stories as ToDo. [D1](./sprint-backlog.md#rid-d1) records the MCP-vs-local dependency as Pending.

**Verification**: Each new requirement in the backlog overview has a backlog row (pb-2 through pb-7). Sprint 2 has a matching ToDo row. No application code, skill files, or Instructions UI were changed.

**Boundary**: This does not implement install, write `sdd-scrum-practices.md` as the Scrum framework, or pick MCP vs local.

### Phase 2 specs use the new process shape

**Why**: Phase 1 Scrum files and the copied sample product cannot both be the live backlog. Phase 2 needs process files that can take new stories.

**What changed**: Phase 1 Scrum files stay archived under [`phase1-process-specs/`](./phase1-process-specs/). Live [`product-backlog.md`](./product-backlog.md), [`sprint-backlog.md`](./sprint-backlog.md), and [`artifacts-map.md`](./artifacts-map.md) now describe framework.sdd.works Phase 2 only (SPEC-01 done; ARTIFACTS-01, COACH-01, TEMPLATES-01 not started). Earlier portal and MCP entries were removed from this log.

**Verification**: Live process files contain no sample-product rows. `*-old.md` copies are deleted. Links among backlog, sprint backlog, and artifacts map resolve.

**Boundary**: This does not change application code, install scope, or the Phase 1 archive contents.
