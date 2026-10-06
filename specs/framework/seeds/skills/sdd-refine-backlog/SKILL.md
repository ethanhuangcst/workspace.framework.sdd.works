---
name: sdd-refine-backlog
description: >
  Review and consolidate product-backlog.md against Evaluate Product Backlog Readiness.
  Send a short lead sentence, a numbered findings table, then one confirm. Change a process file only after
  the user picks. Write that pick in one pass. Use when the user asks to refine the
  product backlog, consolidate the backlog, review product-backlog, or
  sdd-refine-backlog. sdd-refine-backlog sets PBI Size and splits or tightens rows.
  User Stories and Acceptance Criteria stay with atdd-expert or sdd-spec-to-build.
  sdd-plan-sprint schedules only Implementable PBIs. sdd-review-status compares the
  board with the work.
---

# Refine the product backlog

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

A product backlog item (PBI) is one row on `product-backlog.md`.

A sprint backlog item (SBI) is one row in a sprint table on `sprint-backlog.md`.

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

`{rules_dir}` is the value in `{client_root}/templates/framework.sdd.works/constants.json`.

The practices file for this run is `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`.

The skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `atdd-expert` or `sdd-spec-to-build`.

The user picks what to do with the findings list.

## Capabilities

| Capability | Result |
| --- | --- |
| Locate the five process files | The review uses the paths in `artifacts-map.json` |
| Load readiness and Size | The review applies practices §3 and §4 |
| Send findings in chat | Lead sentence, findings table, then choices per [response.md](./response.md) |
| Collect one confirm | The same chat message lists the choices. The user's reply is the confirm. |
| Write the accepted pick | One pass updates the process files the pick names |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start of the run; read `locale` when present |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, headings "3. Evaluate Product Backlog Readiness" and "4. Size product backlog" | The review |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, heading "5. Feature break down", subsection "Refine a backlog item" | The user picks a split, tighten, or merge that changes PBIs or requirement bullets |
| Term rows under the heading "Terminology in practice" in that practices file | A fail names that term: Feature, Task, on-going task (OGT), Issue, RID, or a PBI Size |
| `{client_root}/{rules_dir}/friendly-language.mdc` | Wording in the findings table and the confirm choices |
| [response.md](./response.md) | Composing the findings message |
| The matching `####` heading in that practices file | A write pass is about to change that process file |

## Run the review

### 1. Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Stored paths are the strings in `files` and the strings in each module's `files` list.
- Open each stored path as `{workspace}/<path>`, so the skill reads the file the map names.
- When `{workspace}/artifacts-map.json` is missing, name that missing file, send these two lines, and stop.
  `artifacts-map.json` is missing, so the five process files cannot be located.
  Next step: run `sdd-audit-artifacts`.
- Leave `sdd-audit-artifacts` unrun, so this skill stays on the refine.
- When a process file fails to open, name the process file and stop.
- Leave a missing process file uncreated, so the skill stays on the refine.

### 2. Load practices for the review

Load each Knowledge row when its Load when column matches this step.

For §3 and §4, start at that heading and stop at the next heading of the same level.

### 3. Review product-backlog.md

Read `product-backlog.md` and the related rows in the other process files, to list each readiness fail.

Apply the loaded §3 and §4 to each PBI. A Size fail names the current `Size` and the proposed `Size` from §4.

A split or a new PBI is allowed only when the user picks it. The new row is a code, a noun, a `Size`, and requirement bullets. A new user story and a new acceptance criterion stay with `atdd-expert` or `sdd-spec-to-build`.

After the fail list, follow [Findings in chat](#findings-in-chat).

## Findings in chat

Load [response.md](./response.md) and send one message in that order: boundary, lead, findings table, accept-all note when it applies, **Your choice**.

Every sentence the user reads is written from the user's view. Readiness item numbers stay in the skill check, not in the table.

When the fail list is empty, follow the empty-set rule in response.md. Then stop. Follow [Write the picks](#write-the-picks) only after a non-empty confirm.

## Write the picks

- Record the new lines for the process files the pick changes.
- Write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the pick changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When `product-backlog.md` is about to change, read only the heading "product-backlog.md" in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. Start at that heading. Stop at the next `####` heading.
- When another process file is about to change, read only that artifact's `####` heading in the same practices file, with the same start-and-stop rule.
- When the user picks a split or a shrink for an Epic row, apply the Epic row in §3 and remove the sprint rows that section forbids, in the same write pass.
- When the user picks a split or tighten, set `Size`, requirement bullets, and related rows. Apply the Refine subsection in practices §5. Do not copy §5 examples into this skill.

### product-backlog.md

- Write the Requirements list and the table with the same code, the same noun, and the same `Size`, so both sections stay matched.
- Write the `Size` cell on `product-backlog.md` and on Unplanned PBIs when that PBI appears there.
- A split or a new PBI the user picked is a code, a noun, a `Size`, and requirement bullets.
- Leave a User Story and an Acceptance Criterion unwritten, so those stay with `atdd-expert` or `sdd-spec-to-build`.
- Status words stay `ToDo`, `WIP`, and `Done`. When the user picks removal, delete the PBI row and the Requirements entry.
- Leave a PBI unmarked as `Done` while its Definition of Done checklist is open. A PBI status change waits for the user to name that status.

### sprint-backlog.md

- Write the same change on the sprint row, the parent link, and Unplanned PBIs, so the schedule stays matched.
- Leave a new sprint section uncreated, so sprint planning stays on `sdd-plan-sprint`.

### status.md

- Update Project progress and "what could be the next" when a PBI status change affects them.
- When the user picks **Create an OGT to record these findings and I will refine later**, add one OGT row. The task name is `Refine product backlog`. Under that name, one line per finding gives the PBI code and the short name. Leave the backlog unchanged.
- Load the OGT term row in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` when the pick parks work on `status.md`.

### issues-log.md

- Write a row only when the user says the item is an issue.

### changes-log.md

- Write one entry for the backlog change: what changed, why, how to verify.

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`, so the response uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- Write a process file only after the user picks, in one pass.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- Leave User Stories and Acceptance Criteria unwritten, so those stay with `atdd-expert` or `sdd-spec-to-build`.
- Leave a new sprint unplanned, so that job stays on `sdd-plan-sprint`.
- Leave the Size ladder in practices §4, so this skill links that section and does not copy the examples.
- Split proposals follow practices §5 good and bad shape. Do not turn one PBI row into a task list.
- Do not read an adr folder. Those files belong to the workspace that wrote them. This skill does not load them.
