---
name: sdd-refine-backlog
description: >
  Review and consolidate product-backlog.md against Evaluate Product Backlog Readiness.
  Send one findings list in chat, then one confirm. Change a process file only after
  the user picks. Write that pick in one pass. Use when the user asks to refine the
  product backlog, consolidate the backlog, review product-backlog, or
  sdd-refine-backlog. sdd-refine-backlog sets PBI Size and splits or tightens rows.
  User Stories and Acceptance Criteria stay with sdd-atdd or sdd-spec-to-build.
  sdd-plan-sprint schedules only Implementable PBIs. sdd-review-status compares the
  board with the work.
---

# Refine the product backlog

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

A product backlog item (PBI) is one row on `product-backlog.md`.

A sprint backlog item (SBI) is one row in a sprint table on `sprint-backlog.md`.

`{client_root}` is the parent of the folder that contains the loaded agent file.

The skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `sdd-atdd` or `sdd-spec-to-build`.

The user picks what to do with the findings list.

## Capabilities

| Capability | Result |
| --- | --- |
| Locate the five process files | The review uses the paths in `artifacts-map.json` |
| Load readiness and Size | The review applies practices §3 and §4 |
| Send findings in chat | One numbered list: Issue, then Proposed fix |
| Collect one confirm | The same chat message lists the choices. The user's reply is the confirm. AskQuestion stays unused. |
| Write the accepted pick | One pass updates the process files the pick names |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start of the run; read `locale` when present |
| [3. Evaluate Product Backlog Readiness](../../templates/EN/sdd-scrum-practices.md#3-evaluate-product-backlog-readiness) and [4. Size product backlog](../../templates/EN/sdd-scrum-practices.md#4-size-product-backlog) in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` | The review; when `locale` is missing, use `EN` |
| `{workspace}/specs/adr/ADR-087-refine-one-confirm.md` when that file is present | The findings list and the confirm choices |
| Term rows under [Terminology in practice](../../templates/EN/sdd-scrum-practices.md#terminology-in-practice) | A fail names that term: Feature, Task, on-going task (OGT), Issue, RID, or a PBI Size |
| [friendly-language.mdc](../../rules/friendly-language.mdc) | Wording in the findings list and the confirm choices |
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

A split or a new PBI is allowed only when the user picks it. The new row is a code, a noun, a `Size`, and requirement bullets. A new user story and a new acceptance criterion stay with `sdd-atdd` or `sdd-spec-to-build`.

After the fail list, follow [Findings in chat](#findings-in-chat).

## Findings in chat

Every sentence the user reads is written from the user's view. Readiness item numbers stay in the skill check, not in the findings list.

### State the skill boundary

Send this before the list:

This skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `sdd-atdd` or `sdd-spec-to-build`.

### Send the findings list

Send one numbered list for a person at the desk, not for another agent parsing the repo.

Each item uses this shape:

1. **{PBI code} — {noun}**
- Issue: {one or two plain sentences}
- Proposed fix: {one plain sentence}

**Headline**

- `{PBI code}` is the code on the board, such as `Web-portal-07`.
- `{noun}` is the short Description on the Product Backlog table, or the noun line in Requirements when the table row is missing.
- Use an em dash between code and noun. Do not send a code alone.

**Issue**

- Say what is wrong in everyday English. The reader should recognize the row or section without opening other files first.
- You may name a verdict word (missing, broken, wrong, inaccurate, duplicate) only when it fits a normal sentence. Do not open with a template like `{part} is {verdict}.`
- One or two sentences. No comma chains of paths, anchor ids, or cross-file inventories.
- Name a file or sprint at most once per item, and say what that place shows (for example “Sprint 3 is Done here” or “this row still says ToDo”).

**Proposed fix**

- Say what you will change and what the board will look like after. Use remove or delete when the PBI should go away.

- An empty fail list is the word `none`. Then stop. Leave the confirm out. Leave the write out.

When every item is only an edit to an existing PBI (`Size`, requirement bullets, or both), say that **Accept all and update specs** is offered. When any item is a split, a merge, a new PBI, or removal of an SBI, say that **Accept all** is not offered and name why in one sentence.

After the list, list the choices in the same message. Leave AskQuestion uncalled. The host shows a question card before the chat text, so a list sent with AskQuestion appears only after the question.

Offer **Accept all and update specs** only when every row is an edit to an existing PBI.

Always list:

1. I will enter instructions in chat.
2. Create an OGT to record these findings and I will refine later.
3. Leave it to me.

The user's reply that names one choice is the confirmation. Follow [Write the picks](#write-the-picks).

## Write the picks

- Record the new lines for the process files the pick changes.
- Write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the pick changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When `product-backlog.md` is about to change, read only [product-backlog.md](../../templates/EN/sdd-scrum-practices.md#product-backlogmd) in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that heading. Stop at the next `####` heading.
- When another process file is about to change, read only that artifact's `####` heading in the same practices file, with the same start-and-stop rule.
- When the user picks a split or a shrink for an Epic row, apply the Epic row in §3 and remove the sprint rows that section forbids, in the same write pass.
- When the user picks a split or tighten, set `Size`, requirement bullets, and related rows.

### product-backlog.md

- Write the Requirements list and the table with the same code, the same noun, and the same `Size`, so both sections stay matched.
- Write the `Size` cell on `product-backlog.md` and on Unplanned PBIs when that PBI appears there.
- A split or a new PBI the user picked is a code, a noun, a `Size`, and requirement bullets.
- Leave a User Story and an Acceptance Criterion unwritten, so those stay with `sdd-atdd` or `sdd-spec-to-build`.
- Status words stay `ToDo`, `WIP`, and `Done`. When the user picks removal, delete the PBI row and the Requirements entry.
- Leave a PBI unmarked as `Done` while its Definition of Done checklist is open. A PBI status change waits for the user to name that status.

### sprint-backlog.md

- Write the same change on the sprint row, the parent link, and Unplanned PBIs, so the schedule stays matched.
- Leave a new sprint section uncreated, so sprint planning stays on `sdd-plan-sprint`.

### status.md

- Update Project progress and "what could be the next" when a PBI status change affects them.
- When the user picks **Create an OGT to record these findings and I will refine later**, add one OGT row that points at the findings list in chat or summarizes each item in one line.
- Load [OGT](../../templates/EN/sdd-scrum-practices.md#term-ogt) when the pick parks work on `status.md`.

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
- Leave User Stories and Acceptance Criteria unwritten, so those stay with `sdd-atdd` or `sdd-spec-to-build`.
- Leave a new sprint unplanned, so that job stays on `sdd-plan-sprint`.
- Leave the Size ladder in practices §4, so this skill links that section and does not copy the examples.
- Leave AskQuestion uncalled for this confirm, so the findings list stays above the choices in the same chat message.
