---
name: sdd-review-status
description: >
  Compare the five process files with the work related to the current sprint's
  sprint backlog items (SBIs). List each mismatch. Change a process file only
  after the user says yes to the sentences for that mismatch. Use when the
  user asks where we are, where the project is, what is next, what to do next,
  report status, review status, update status, or whether the plan matches
  the work. sdd-audit-artifacts checks whether artifacts-map.md matches the
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

Read `{workspace}/artifacts-map.md` to locate the five process files.

- Open each stored path as `{workspace}/<path>`, so the skill reads the file the map names.
- When `{workspace}/artifacts-map.md` is missing, name that missing map and stop.
- When a process file fails to open, name the process file and stop.
- Leave a missing process file uncreated, so the skill stays on the compare.

### 2. Summarize the five process files

Read the five process files to state what each file says.

- Record a disagreement among the five process files as one mismatch.
- Use `sprint-backlog.md` as the schedule, so a disagreement still has one schedule.

### 3. Summarize the current sprint

Read each SBI in the current sprint whose Status is ToDo or WIP, to list open work.

- Read the work related to that SBI, to state the actual status of that SBI.
- When an SBI names no related work, mark that SBI as not checked, so the summary stays on the named work.

### 4. List each mismatch

List each mismatch, so the user can pick a handling.

- A disagreement among the five process files is one mismatch.
- A difference between what the five process files say and the actual status of an SBI is one mismatch.

### 5. Ask for a handling

Ask the user to pick one handling for each mismatch, or to type their own.

- Update process artifacts now
- Record an on-going task (OGT) and update later
- Leave to me, I will manually update later

## Reply

Return the reply block before a file change, so the user sees the status first.

```text
sprint: {current sprint}
open SBI:
- {SBI code} {SBI name}: {actual status or not checked}
mismatches:
- {what the process files say}; {what the work shows}
```

- `sprint-backlog.md` stays the schedule inside the reply block.
- An empty mismatch list is the word `none`.

## Sentences to write

Show the sentences for the handling the user picked, so the user can say yes or no.

Write the shown sentences after the user says yes.

### Update process artifacts now

- Show the new lines for the process files the mismatch changes.
- Write the new lines after the user says yes, in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the mismatch changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- Load the Definition and How to write for the process file from [sdd-scrum-practices.md](../../templates/EN/sdd-scrum-practices.md) when the process file is about to change.

### Record an OGT and update later

- Show one on-going task (OGT) row for `status.md`.
- Add the OGT row to `status.md` after the user says yes.
- The OGT definition is in [sdd-scrum-practices.md](../../templates/EN/sdd-scrum-practices.md).
- When the mismatch is an untracked defect, the OGT row says "track defect xyz in issues-log".
- Leave the issues-log row for a later write, so the yes adds only the OGT row.

### Leave to me, I will manually update later

- Leave the write sentences out for the mismatch, so the user has nothing to confirm.
- Leave the five process files unchanged, so the mismatch writes nothing.
- The next run lists the mismatch again.

## Limits

- Read `locale` from `{workspace}/artifacts-map.md`, so the reply uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- Set an SBI to Done when the user says Done and that SBI's definition of done is met.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
