---
name: sdd-review-status
description: >
  Compare the five process files with the work related to the current sprint's
  sprint backlog items (SBIs). List each mismatch. Change a process file only
  after every mismatch has a pick. Write those picks in one pass. Use when the
  user asks where we are, where the project is, what is next, what to do next,
  report status, review status, update status, or whether the plan matches
  the work. sdd-audit-artifacts checks whether artifacts-map.json matches the
  files. The pack stays uninstalled, so the skill stays on the compare.
---

# Review status

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

The skill compares the five process files with the work related to the current sprint's sprint backlog items (SBIs).

The user picks the handling for each mismatch.

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

Every sentence the user reads is written from the user's view. It names the item, the status the user already sees, and what will happen to that item. A sentence that only tells what the agent found in a file fails.

### Summarize the findings

Send the sprint, the open sprint backlog items, and the mismatches as a list the user can read. Leave the findings out of a code block, so the lines wrap on the screen.

- Sprint: {current sprint}
- Open sprint backlog items
  - {SBI code} {SBI name}: {actual status or not checked}
- Mismatches
  - {process file} says {SBI} is {recorded status}; the actual status is {actual status} because {what the work shows}

- Name the sprint and each open item from `sprint-backlog.md`.
- An empty mismatch list is the word `none`.

#### Example

This is the message the user reads. No file has changed yet.

- Sprint: Sprint 2
- Open sprint backlog items
  - feature-03 Card list view: WIP
- Mismatches
  - sprint-backlog.md says feature-03 Card list view is ToDo; the actual status is WIP because the card list page is already in the web app

### Propose actions

Ask one mismatch at a time. Use AskQuestion for that mismatch. Wait for the answer before you ask the next mismatch.

The question follows the rule above: it is written from the user's view. It names the code and the name. It names the file that records one status and the file that records the other. It asks what we should do with this item.

The user reads: "In sprint-backlog.md, feature-03 Seed artifacts-map is WIP, but status.md already says this item is Retired. What should we do with this item?"

Each choice names what happens to the item. A choice that only says "Update process artifacts now" fails. The later choice says "Create an OGT (On-going Task) in status.md". A choice that says "write a task" fails.

The user reads:

- Set feature-03 Seed artifacts-map to Retired. It stays in the sprint. It is not removed, and it is not Done.
- Create an OGT (On-going Task) in status.md to set feature-03 Seed artifacts-map to Retired later.
- Leave feature-03 Seed artifacts-map as it is. I will change it myself.

The user may type their own handling.

After the user picks, record that choice. Leave the five process files unchanged. Ask the next mismatch.

After the last mismatch has a choice, write every recorded change in one pass. Do not ask for a second yes.

### Confirm the action

The pick is the confirmation. Record the change that choice names. Write every recorded change after the last mismatch, in one pass.

#### Update process artifacts now

- Record the new lines for the process files the mismatch changes.
- After the last mismatch has a choice, write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.
- When the mismatch changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When a process file is about to change, read only that file's `####` section in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Examples: `#product-backlogmd`, `#sprint-backlogmd`, `#statusmd`, `#issues-logmd`, `#changes-logmd`. Start at that heading. Stop at the next `####` heading.

##### Example

The user reads this sentence. The recorded picks write it after the last mismatch.

```text
In sprint-backlog.md, set feature-03 Card list view from ToDo to WIP.
```

#### Record an OGT and update later

- Record one on-going task (OGT) row for `status.md`. Write the task as a sentence the user can read.
- Add the recorded OGT row to `status.md` in the same pass as the other recorded changes, after the last mismatch has a choice.
- The OGT definition is [OGT](../../templates/EN/sdd-scrum-practices.md#term-ogt) in Terminology in practice.
- When the mismatch is an untracked defect, the OGT row says "track defect xyz in issues-log".
- Leave the issues-log row for a later write, so the pick adds only the OGT row.

##### Example

The user reads this row. The recorded pick adds it to `status.md` after the last mismatch. The implementation stays as it is.

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
