---
name: sdd-plan-sprint
description: >
  Assign existing product backlog items (PBIs) to sprints so each sprint
  delivers one MVP. Propose the next ToDo sprint by default, or the sprints
  the user names. List the sprint, the PBIs, and why that set is one MVP.
  Change a process file only after the user picks. Write those picks in one
  pass. After each PBI has one sprint row, list extra tasks the sprint still needs.
  Use when the user asks to plan a sprint, plan the next sprint, assign
  PBIs, sprint planning, or sdd-plan-sprint. sdd-refine-backlog writes or
  splits PBIs. sdd-review-status compares the board with the work.
  sdd-close-sprint closes or starts a sprint. sdd-update-project writes
  artifacts-map.json.
---

# Sprint proposal

The skill assigns existing product backlog items (PBIs) so each sprint is one MVP (minimum viable product).

A sprint backlog item (SBI) is one row in a sprint table on `sprint-backlog.md`.

An on-going task (OGT) is temporary or side work in `status.md`. An OGT stays in `status.md` only.

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

`{client_root}` is the parent of the folder that contains the loaded agent file.

The user picks what happens to each proposed sprint.

## Steps

### 1. Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Stored paths are the strings in `files` and the strings in each module's `files` list.
- Open each stored path as `{workspace}/<path>`, so the skill reads the file the map names.
- When `{workspace}/artifacts-map.json` is missing, name that missing file, send these two lines, and stop.
  `artifacts-map.json` is missing, so the five process files cannot be located.
  Next step: run `sdd-audit-artifacts`.
- Leave `sdd-audit-artifacts` unrun, so this skill stays on the plan.
- When a process file fails to open, name the process file and stop.
- Leave a missing process file uncreated, so the skill stays on the plan.

### 2. Pick the target sprints

Default is one sprint: the earliest sprint whose status line in `sprint-backlog.md` is `ToDo`.

- When the user names a sprint, or asks for several sprints, use that list in sprint order.
- Leave a sprint past the last section uncreated, so a new sprint section appears only when the user asks for that sprint.

### 3. Propose the MVP

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

Read "1. Plan sprints by MVP" and "2. Slice product to MVPs" in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. Start at each heading. Stop at the next heading of the same level after each section.

Read the Product Backlog table in the `product-backlog.md` from step 1. Read the Unplanned PBIs table in the `sprint-backlog.md` from step 1.

Candidates are PBIs whose status is not `Done`, and whose `Sprint` cell is `—`, this sprint, or a later sprint.

- A PBI already named on an earlier unfinished sprint is a move. Show it as a move. Leave that PBI on its current sprint until the user picks the move.

### 4. Check extra sprint tasks

After you name one SBI per PBI for the proposal, list any extra tasks that sprint still needs.

Read the Task row and the OGT row under "Terminology in practice" in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Read those two rows. Stop after the OGT row.

- Each extra task is one SBI with Type Task. The parent PBI is the PBI that sprint row delivers.
- Park side work as an OGT in the same question when the user names it.
- A new product outcome stays on `sdd-refine-backlog`.
- When no extra task passes the Task row, the proposal and the question say `Extra tasks: none`.

This step fills the proposal and the question. The file write stays in [User pick and file write](#user-pick-and-file-write).

Then follow [Response to user](#response-to-user).

## Response to user

Every sentence the user reads is written from the user's view. It names the sprint, the PBI, and what will happen. A sentence that only tells what the agent found in a file fails.

### Summarize the proposal

Send each proposed sprint as a list the user can read. Leave the proposal out of a code block, so the lines wrap on the screen.

- Sprint: {n}
- Sprint goal: {the job}
- PBIs
  - {PBI code} {noun}: {why this item is in this MVP}
- Why this is one MVP: {the job, the parts that ship together, what the user can do before the next sprint}
- Already in this sprint: {current SBIs, or none}
- Moves: {PBI code from sprint A to this sprint, or none}
- Extra tasks: {task code} {task name} ({Module/Type}), parent {PBI code}, or none
  - {why this task is needed}. Omit this line when Extra tasks is none.

For several sprints, repeat that block once per sprint. Each later sprint starts from PBIs not used in an earlier proposal.

#### Example

mypoke.trade. This is the message the user reads. No file has changed yet.

- Sprint: Sprint 2
- Sprint goal: The collector sees their cards in a list
- PBIs
  - Collect-02 Card list view: the list is the page the collector opens
- Why this is one MVP: the collector opens the list and sees their cards before the next sprint starts
- Already in this sprint: feature-02 Binder
- Moves: none
- Extra tasks: task-01 Shared empty-state catalog (Collection/Task), parent Collect-02
  - feature-02 Binder and feature-03 Card list view share one catalog on the list and on the binder

### Propose actions

The user reads: "What should we do with Sprint {n}?"

- Put {PBI code} {noun} in Sprint {n}. Add {code} {SBI name} ({Module/Type}), parent {PBI code}. Extra tasks: {task code} {task name} ({Module/Type}), parent {PBI code}, or none.
- Add {code} {SBI name} only. Leave {task code} off Sprint {n}. Show this choice only when Extra tasks is not none.
- Change the PBIs. I will name which PBIs stay.
- Skip Sprint {n}. Write nothing for it.
- Stop planning.

The user may type their own handling.

#### Example

The user reads: "What should we do with Sprint 2?"

- Put Collect-02 Card list view in Sprint 2. Add feature-03 Card list view (Collection/Feature), parent Collect-02. Extra tasks: task-01 Shared empty-state catalog (Collection/Task), parent Collect-02.
- Add feature-03 Card list view only. Leave task-01 off Sprint 2.
- Change the PBIs. I will name which PBIs stay.
- Skip Sprint 2. Write nothing for it.
- Stop planning.

## User pick and file write

Ask one proposed sprint at a time. Use the question in [Propose actions](#propose-actions). Wait for the answer before you ask the next sprint.

- When Module/Type or the sprint goal is still unclear, ask that question with AskQuestion and wait. Then ask the sprint question.
- When the user says "Change the PBIs", replace the proposal with the PBIs the user names, run step 4 on that set, show that sprint again, and ask once.
- The accepted choice is the confirm. Write only the PBI rows, the SBI rows, and any OGT row named in that choice.
- After the user picks, record that choice. Leave the five process files unchanged. Ask the next proposed sprint.
- After the last sprint has a choice, write the recorded lines in [Write the picks](#write-the-picks).

## Write the picks

These are the lines the last section writes.

- Write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the pick changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When `product-backlog.md` changes, read the `product-backlog.md` section in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that `####` heading. Stop at the next `####` heading.
- When `sprint-backlog.md` changes, read the `sprint-backlog.md` section in that practices file. Start at that `####` heading. Stop at the next `####` heading.
- A skipped sprint writes nothing.
- Stop planning writes only the sprints already accepted.

### product-backlog.md

- Set the `Sprint` cell for each accepted PBI.
- Leave the PBI status as it is.

### sprint-backlog.md

- Set the sprint goal when the user accepted a new goal.
- Add one SBI per accepted PBI that has no SBI in that sprint.
- Add each extra Task SBI named in the accepted choice.
- Remove that PBI from Unplanned PBIs.
- Follow the sprint item columns and the sort rules in practices.

### status.md

- A new sprint section updates Project progress.
- A sprint goal the user accepted updates "what could be the next".
- When the accepted choice parks side work, add that OGT row in the same write pass.

### issues-log.md

- Write a row when the user says the item is an issue.

### changes-log.md

- Write one entry for the schedule change: what changed, why, how to verify.

#### Example

The user reads this sentence. The recorded picks write it after the last sprint.

```text
In product-backlog.md, set Card list view to Sprint 2.
In sprint-backlog.md, add feature-03 Card list view under Sprint 2.
In sprint-backlog.md, add task-01 Shared empty-state catalog under Sprint 2. Parent is Collect-02.
```

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`, so the response uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- A PBI status cell and an SBI status cell stay as they are.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- A new PBI stays on `sdd-refine-backlog`.
