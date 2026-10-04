---
name: sdd-refine-backlog
description: >
  Review and consolidate product-backlog.md against Evaluate Product Backlog Readiness.
  List each fail with a proposed fix. Change a process file only after every
  fail has a pick. Write those picks in one pass. Use when the user asks to
  refine the product backlog, consolidate the backlog, review product-backlog,
  or sdd-refine-backlog. User Stories and Acceptance Criteria stay with
  sdd-atdd or sdd-spec-to-build. sdd-plan-sprint assigns existing PBIs to
  sprints. sdd-review-status compares the board with the work.
---

# Refine the product backlog

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

The skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `sdd-atdd` or `sdd-spec-to-build`.

The user picks the handling for each fail.

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

### 2. Load the readiness checks

Read only [3. Evaluate Product Backlog Readiness](../../templates/EN/sdd-scrum-practices.md#3-evaluate-product-backlog-readiness) in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that heading. Stop at the next heading of the same level.

Link [friendly-language.mdc](../../rules/friendly-language.mdc) for the wording checks, so the wording stays in that file.

Use [PBI](../../templates/EN/sdd-scrum-practices.md#term-pbi), [SBI](../../templates/EN/sdd-scrum-practices.md#term-sbi), and the other rows in [Terminology in practice](../../templates/EN/sdd-scrum-practices.md#terminology-in-practice), so those definitions stay in that table.

Leave [3. Evaluate Product Backlog Readiness](../../templates/EN/sdd-scrum-practices.md#3-evaluate-product-backlog-readiness) in the practices file, so that checklist stays in that file.

### 3. Review product-backlog.md

Read `product-backlog.md` and the related rows in the other process files, to list each readiness fail.

Apply each line in [3. Evaluate Product Backlog Readiness](../../templates/EN/sdd-scrum-practices.md#3-evaluate-product-backlog-readiness). Leave that checklist in the practices file, so the skill applies the list from that heading.

A split or a new PBI is allowed only when the user picks it. The new row is a code, a noun, and requirement bullets. A new user story and a new acceptance criterion stay with `sdd-atdd` or `sdd-spec-to-build`.

After the fail list, follow [Response to user](#response-to-user).

### Record each pick

Ask one fail at a time. Use AskQuestion for that fail. Wait for the answer before you ask the next fail.

After the user picks, record that choice. Leave the five process files unchanged. Ask the next fail.

After the last fail has a choice, write every recorded change in one pass. Leave a second yes out, so the pick is the confirmation.

### Write in one pass

After the last fail has a choice, follow [Write the picks](#write-the-picks).

## Response to user

Every sentence the user reads is written from the user's view. It names the item, the status the user already sees, and what will happen to that item. A sentence that only tells what the agent found in a file fails.

### State the skill boundary

Send this before the table, and before any question, so the user knows the limit:

This skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `sdd-atdd` or `sdd-spec-to-build`.

### Summarize the findings

Send one table the user can read. Leave the findings out of a code block, so the lines wrap on the screen.

| PBI | Fail | Proposed fix |
| --- | --- | --- |
| {PBI code} {noun} | {fail} | {proposed fix} |

- Name the PBI from `product-backlog.md`.
- An empty fail list is the word `none`. Then stop. Leave the question out. Leave the write out.

#### Example

mypoke.trade. The user sees the boundary line, the fail table, and no process file change yet.

This skill reviews and consolidates `product-backlog.md`. User Stories and Acceptance Criteria are written when a feature is designed, with `sdd-atdd` or `sdd-spec-to-build`.

| PBI | Fail | Proposed fix |
| --- | --- | --- |
| APP-LOGIN-001 Login to mypoke.trade | APP-LOGIN-001 Login to mypoke.trade is ToDo. The requirement bullet is vague: the user can log in to mypoke.trade with multiple methods. | Shorten the bullet: the user can log in to mypoke.trade with a user name and a password. |

### Propose actions

Ask one fail at a time. Use AskQuestion for that fail. Wait for the answer before you ask the next fail.

The question follows the rule above: it is written from the user's view. It names the code and the name. It names the status and the fail. It asks what we should do with this item.

The user reads: "In product-backlog.md, APP-LOGIN-001 Login to mypoke.trade is ToDo, and the requirement bullet is vague: the user can log in to mypoke.trade with multiple methods. What should we do with APP-LOGIN-001?"

Each choice names what happens to the item. A choice that only says "Update process artifacts now" fails. The later choice says "Create an OGT (On-going Task) in status.md". A choice that says "write a task" fails.

The user reads:

- Keep APP-LOGIN-001 Login to mypoke.trade as ToDo. Shorten the requirement bullet to a user name and a password.
- Create an OGT (On-going Task) in status.md to fix APP-LOGIN-001 Login to mypoke.trade later.
- Leave APP-LOGIN-001 Login to mypoke.trade as it is. I will change it myself.

The user may type their own handling.

When the noun, the parent, or the status is still unclear, ask that question with AskQuestion and wait. Leave a guess out, so the file uses the words the user names.

After the user picks, record that choice. Leave the five process files unchanged. Ask the next fail.

After the last fail has a choice, write every recorded change in one pass.

### Confirm the action

The pick is the confirmation. Record the change that choice names. Write every recorded change after the last fail, in one pass.

## Write the picks

- Record the new lines for the process files the pick changes.
- After the last fail has a choice, write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the pick changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When `product-backlog.md` is about to change, read only [product-backlog.md](../../templates/EN/sdd-scrum-practices.md#product-backlogmd) in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that heading. Stop at the next `####` heading.
- When another process file is about to change, read only that artifact's `####` heading in the same practices file, with the same start-and-stop rule.

### product-backlog.md

- Write the Requirements list and the table with the same code and the same noun, so both sections stay matched.
- A split or a new PBI the user picked is a code, a noun, and requirement bullets.
- Leave a User Story and an Acceptance Criterion unwritten, so those stay with `sdd-atdd` or `sdd-spec-to-build`.
- Status words stay `ToDo`, `WIP`, and `Done`. Use `Retired` when the board already uses that word and the user picks retire.
- Leave a PBI unmarked as `Done` while its Definition of Done checklist is open. A PBI status change waits for the user to name that status.

### sprint-backlog.md

- Write the same change on the sprint row, the parent link, and Unplanned PBIs, so the schedule stays matched.
- Leave a new sprint section uncreated, so sprint planning stays on `sdd-plan-sprint`.

### status.md

- Update Project progress and "what could be the next" when a PBI status change affects them.
- An open question the user parked stays one OGT row in `status.md`, so that work is not a PBI row.
- The OGT definition is [OGT](../../templates/EN/sdd-scrum-practices.md#term-ogt) in Terminology in practice.

### issues-log.md

- Write a row only when the user says the item is an issue.

### changes-log.md

- Write one entry for the backlog change: what changed, why, how to verify.
- Leave secrets out of the changes log, so the changes log stays free of secrets.

##### Example

After the last pick, the user sees this line in the write pass.

```text
In product-backlog.md, APP-LOGIN-001 Login to mypoke.trade stays ToDo. Shorten the requirement bullet to a user name and a password.
```

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`, so the response uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- Leave User Stories and Acceptance Criteria unwritten, so those stay with `sdd-atdd` or `sdd-spec-to-build`.
- Leave a new sprint unplanned, so that job stays on `sdd-plan-sprint`.
