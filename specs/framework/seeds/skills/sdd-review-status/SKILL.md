---
name: sdd-review-status
description: >
  Compare the five process files with the work related to the current sprint's
  sprint backlog items (SBIs). List each mismatch. Change a process file only
  after the user says yes to the sentences for that mismatch. Use when the
  user asks where we are, where the project is, what is next, what to do next,
  report status, review status, update status, or whether the plan matches
  the work. sdd-audit-artifacts checks whether artifacts-map.json matches the
  files. The pack stays uninstalled, so the skill stays on the compare.
---

# Review status

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

The skill compares the five process files with the work related to the current sprint's sprint backlog items (SBIs).

The user picks the handling for each mismatch.

## When

- Run the same steps when the user asks where we are, where the project is, what is next, what to do next, report status, review status, update status, or whether the plan matches the work.

## Steps

### 1. Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Stored paths are the strings in `files` and the strings in each module's `files` list.
- Open each stored path as `{workspace}/<path>`, so the skill reads the file the map names.
- When `{workspace}/artifacts-map.json` is missing, name that missing file, send these two lines, and stop.
  `artifacts-map.json` is missing, so the five process files cannot be located. //issue 1
  Next step: run `sdd-audit-artifacts`.

- Leave `sdd-audit-artifacts` unrun, so this skill stays on the compare.
- When a process file fails to open, name the process file and stop.
- Leave a missing process file uncreated, so the skill stays on the compare.

### 2. Record the five process files

Read the five process files to state what each file says.

- Record a disagreement among the five process files as one mismatch.
- `sprint-backlog.md` holds the newest status for each sprint backlog item (SBI).
- When another process file records a different status, the mismatch names `sprint-backlog.md` as the newest status.

### 3. Record the actual status

Read each SBI in the current sprint whose Status is ToDo or WIP, to list open work.

- Read the work related to that SBI, to state the actual status.
- When an SBI names no related work, mark that SBI as not checked, so the summary stays on the named work.

### 4. List each mismatch

List each mismatch, so the user can pick a handling.

- A disagreement among the five process files is one mismatch.
- A difference between what the five process files say and the actual status of an SBI is one mismatch.

### 5. Respond to the user

After the mismatch list, follow [Response to user](#response-to-user).

## Response to user

### Summarize the findings

Send the sprint, the open sprint backlog items, and the mismatches before you propose an action.

```text
sprint: {current sprint}
open SBI:
- {SBI code} {SBI name}: {actual status or not checked}
mismatches:
- {process file} says {SBI} is {recorded status}; the actual status is {actual status} because {what the work shows}
```

- Name the sprint and each open item from `sprint-backlog.md`.
- An empty mismatch list is the word `none`.

#### Example

This is the message the user reads. No file has changed yet.

```text
sprint: Sprint 2
open SBI:
- feature-03 Card list view: WIP
mismatches:
- sprint-backlog.md says feature-03 Card list view is ToDo; the actual status is WIP because the card list page is already in the web app
```

### Propose actions

For each mismatch, propose a handling. The user picks one, or types their own.

- Update process artifacts now
- Record an on-going task (OGT) and update later
- Leave to me, I will manually update later

### Confirm the action

Show the lines for the handling the user picked. Write those lines only after the user says yes. Write the change in words the user can read.

#### Update process artifacts now

- Show the new lines for the process files the mismatch changes.
- Write the new lines after the user says yes, in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the mismatch changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- Load the Definition and How to write for the process file from [sdd-scrum-practices.md](../../templates/EN/sdd-scrum-practices.md) when the process file is about to change.

##### Example

The user reads this sentence. A yes writes it. A no leaves the files unchanged.

```text
In sprint-backlog.md, set feature-03 Card list view from ToDo to WIP.
```

#### Record an OGT and update later

- Propose one on-going task (OGT) row for `status.md`. Write the task as a sentence the user can read.
- Add the OGT row to `status.md` after the user says yes.
- The OGT definition is in [sdd-scrum-practices.md](../../templates/EN/sdd-scrum-practices.md).
- When the mismatch is an untracked defect, the OGT row says "track defect xyz in issues-log".
- Leave the issues-log row for a later write, so the yes adds only the OGT row.

##### Example

The user reads this row. A yes adds it to `status.md`. The implementation stays as it is.

```text
| 1 | Set feature-03 Card list view to WIP in sprint-backlog.md | - feature-03 Card list view | Sprint 2 | ToDo |
```

#### Leave to me, I will manually update later

- Leave the write lines out for the mismatch, so the user has nothing to confirm.
- Leave the five process files unchanged, so the mismatch writes nothing.
- The next run lists the mismatch again.

##### Example

The user sees no lines to confirm for feature-03 Card list view. The five process files stay as they are.

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`, so the response uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- Set an SBI to Done when the user says Done and that SBI's definition of done is met.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
