---
name: sdd-review-status
description: >
  Compare the five process files with open SBIs in the current sprint and with
  Open RIDs on sprint-backlog.md. List each mismatch and RID status-change
  suggestions. Change a process file only after the user picks in chat. Write
  those picks in one pass. Use when the user asks where we are, review status,
  update status, or whether the plan matches the work. sdd-audit-artifacts
  checks artifacts-map.json. The pack stays uninstalled, so the skill stays on
  the compare.
---

# Review status

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

`{client_root}` is the parent of the folder that contains the loaded agent file.

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

The practices file for this run is `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`.

The skill compares the five process files with open work in the current sprint and with Open RIDs on `sprint-backlog.md`.

The user picks handling in chat. One reply can cover every mismatch.

## Capabilities

| Capability | Result |
| --- | --- |
| Locate the five process files | Paths come from `{workspace}/artifacts-map.json` |
| Compare SBIs | Open SBIs in the current sprint match board text and related work |
| Compare Open RIDs | Each open RID matches Impact, Solution, and related work |
| Send one findings message | Sprint, open SBIs, RID notes, RID suggestions, mismatches, and choices |
| Write after pick | One pass updates only the process files the pick names |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start of the run |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, RID Log section and `#term-rid` under Terminology in practice | Open RIDs or a RID write |
| `{client_root}/rules/dod.mdc` | Before closing an RID |
| Artifact `####` headings in the same practices file | Before a process file write |

## Steps

### 1. Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Open each path in `files` as `{workspace}/<path>`.
- When `{workspace}/artifacts-map.json` is missing, name that file, tell the user to run `sdd-audit-artifacts`, and stop.
- When a process file fails to open, name that file and stop.
- Leave a missing process file uncreated.

### 2. Record the five process files

Read the five process files to state what each file says.

- Record a disagreement among the five process files as one mismatch.
- `sprint-backlog.md` holds the newest status for each SBI.
- When another process file records a different SBI status, the mismatch names `sprint-backlog.md` as the source of truth for that SBI.

### 3. Record the actual status

Read each SBI in the current sprint whose Status is ToDo or WIP.

- Read the work related to that SBI and state the actual status.
- When an SBI names no related work, mark that SBI as not checked.

Read the Open RIDs table on `sprint-backlog.md`.

- For each open RID, read Impact, Solution, and Related. Follow links to PBIs, SBIs, and specs. Inspect related work.
- When Impact PBIs or SBIs are Done and Solution is verifiably in place, add a **RID status-change suggestion**: move that RID to Closed RIDs with Closed Sprint set to the sprint that finished the work, or the current WIP sprint when none is WIP.
- When blocking work is still ToDo or WIP, note the RID as still valid. Do not suggest a status change.
- When the same RID id appears in both Open and Closed tables, or a closed row lacks Closed Sprint, list a mismatch with a fix sentence.

### 4. List each mismatch

- A disagreement among the five process files is one mismatch.
- A difference between board status and the actual status of an open SBI is one mismatch.
- A RID table drift row is one mismatch.
- A stale open RID (suggestion in step 3) is one mismatch when the user should confirm close.

### 5. Respond to the user

Follow [Response to user](#response-to-user). Stop until the user picks in chat.

## Response to user

Every sentence the user reads is written from the user's view. It names the item, the status the user already sees, and what will happen. A sentence that only tells what the agent found in a file fails.

### Summarize the findings

Send one message the user can read. Leave the findings out of a code block.

- Sprint: {current sprint from sprint-backlog.md}
- Open sprint backlog items
  - {SBI code} {SBI name}: {actual status or not checked}
- Open RIDs (still valid)
  - {RID id} {title}: {one sentence why it stays open}
- RID status-change suggestions
  - {RID id} {title}: {proposed close or move}; {what the work shows}
- Mismatches
  - {item}: {board says X}; {actual is Y because Z}

- An empty subsection is the word `none`.
- RID status-change suggestions lists only RIDs that step 3 marked for a status change.

#### Example

- Sprint: Sprint 2
- Open sprint backlog items
  - feature-03 Card list view: WIP
- Open RIDs (still valid)
  - none
- RID status-change suggestions
  - D-2 Pack copy must use an allow-list: close this RID; MCP-01 is Done and the installer uses an allow-list.
- Mismatches
  - sprint-backlog.md says feature-03 Card list view is ToDo; the actual status is WIP because the card list page is already in the web app

### Your choice

After the list, list the choices in the same message. Do not open a question card.

Always list:

1. I will enter instructions in chat.
2. Apply the listed updates (name each SBI line and each RID close the user may accept).
3. Create an OGT on status.md for items I will handle later.
4. Leave it to me.

The user's reply that names items or choices is the confirmation. Record every pick, then follow [Write the picks](#write-the-picks) in one pass. Do not ask for a second yes.

Each pick names what happens. bad example: Update process artifacts now. good example: In sprint-backlog.md, move D-2 from Open RIDs to Closed RIDs with Closed Sprint 2.

When the pick is an untracked defect, the OGT row says track defect xyz in issues-log. Leave the issues-log row for a later write.

## Write the picks

- Write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When a pick changes no line in a process file, leave that file unchanged.
- Before a process file write, read only that artifact's `####` heading in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. Start at that heading. Stop at the next `####` heading.
- Before closing an RID, apply `{client_root}/rules/dod.mdc` for a RID (Common quality gate and defaults).

##### Example SBI write

```text
In sprint-backlog.md, set feature-03 Card list view from ToDo to WIP.
```

##### Example RID write

```text
In sprint-backlog.md, move D-2 from Open RIDs to Closed RIDs with Closed Sprint 2.
```

##### Example OGT row

```text
| 1 | Move D-2 to Closed RIDs on sprint-backlog.md | - D-2 Pack copy must use an allow-list | Sprint 2 | ToDo |
```

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`. Allowed values are `EN`, `HanS`, and `HanT`. When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language.
- Keep a write inside the five process files.
- Set an SBI to Done only when the user says Done and that SBI's definition of done is met.
- Close an RID only when the user pick names that close and pack dod passes for the RID.
- Do not read an adr folder. Those files belong to the workspace that wrote them.
- Leave secrets out of the changes log.
- Leave `{client_root}/.sdd-installed.json` unchanged.
- Leave `sdd-audit-artifacts` unrun from this skill.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled.
