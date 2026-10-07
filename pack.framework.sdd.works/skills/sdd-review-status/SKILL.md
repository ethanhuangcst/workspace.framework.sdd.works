---
name: sdd-review-status
description: >
  Compare the five process files with open SBIs in the current sprint and with
  Open RIDs on sprint-backlog.md. Send a short lead sentence, a numbered mismatch
  table, and four choices. Change a process file only after the user picks in
  chat. Use when the user asks where we are, review status, update status, or
  whether the plan matches the work. sdd-audit-artifacts checks
  artifacts-map.json.
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
| Send one findings message | Lead sentence, numbered mismatch table, optional SBI and RID lines, four choices |
| Write after pick | One pass updates only the process files the pick names |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start of the run |
| [response.md](./response.md) | Composing the findings message |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, RID Log section and `#term-rid` under Terminology in practice | Open RIDs or a RID write |
| `{client_root}/rules/sdd-dod.mdc` | Before closing an RID; before an SBI or PBI Done write |
| `{client_root}/skills/sdd-retrospective/SKILL.md` or pack seed `sdd-retrospective` | Before any pick that sets SBI or PBI to Done |
| `{client_root}/rules/friendly-language.mdc` | Wording checks for the findings message, when that file exists |
| Artifact `####` headings in the same practices file | Before a process file write |

## Steps

### Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Open each path in `files` as `{workspace}/<path>`.
- When `{workspace}/artifacts-map.json` is missing, name that file, tell the user to run `sdd-audit-artifacts`, and stop.
- When a process file fails to open, name that file and stop.
- Leave a missing process file uncreated.

### Record and compare

Read the five process files and open SBIs in the current sprint whose Status is ToDo or WIP.

- `sprint-backlog.md` holds the newest status for each SBI.
- When another process file records a different SBI status, that is one mismatch. `sprint-backlog.md` is the source of truth for SBI status.
- Read work related to each open SBI. When board status differs from checked work, that is one mismatch or one SBI status gap line.
- When an SBI names no related work, mark that SBI as not checked.

Read the Open RIDs table on `sprint-backlog.md`.

- When Impact PBIs or SBIs are Done and Solution is verifiably in place, add a RID close suggestion.
- When blocking work is still ToDo or WIP, note the RID as still valid.
- When the same RID id appears in both Open and Closed tables, or a closed row lacks Closed Sprint, add one mismatch table row.

### Respond to the user

Follow [response.md](./response.md). Stop until the user picks in chat.

## Response limits

These limits apply to the chat message only. They do not change compare logic.

- The first sentence is the lead from [response.md](./response.md).
- Mismatches use the numbered table with columns `#`, File, Problem, Fix.
- List every mismatch in the table. Do not cap the row count or add a “more mismatches” summary row.
- Omit the SBI status gap block when every open SBI matches the board.
- Problem and Fix cells are one sentence each. No “actual is”, no “because”, no semicolon chains.
- Use file basenames and names from the board. Do not invent row content from this skill file.

## Your choice

After the message body, list the four choices from [response.md](./response.md). Do not open a question card.

The user's reply that names row numbers or choices is the confirmation for the picks. Record every pick, then follow [Write the picks](#write-the-picks) in one pass. Do not ask for a second yes to apply non-Done picks. When a pick sets **Done**, that reply must name **Done** for that SBI or PBI and count as **close confirm** only if the thread already shows the user accepted the deliverable, or the pick explicitly closes that row after review. Otherwise list the pick as suggested and ask the **close confirm** question from `sdd-dod.mdc` before writing **Done**.

Each pick names what happens. bad example: Update process artifacts now. good example: In sprint-backlog.md, move {rid id} from Open RIDs to Closed RIDs with Closed Sprint {n}.

When the pick is an untracked defect, the OGT row says track the defect in issues-log. Leave the issues-log row for a later write.

## Write the picks

- When a pick sets an SBI or PBI to **Done**, run **sdd-retrospective** for that scope in the same turn before any **Done** row write. Read `{client_root}/skills/sdd-retrospective/SKILL.md` or the pack seed at `{client_root}/{skills_dir}/sdd-retrospective/SKILL.md`. Follow its Steps and Write rules.
- Several **Done** picks in one sprint may share one retrospective run. Set `{trigger}` to list each SBI or PBI code, comma-separated.
- Write order: retrospective outputs first (ADR, knowledge, `changes-log.md` from that skill, `sprint-backlog.md` Retrospective), then the recorded pick lines in this order: changes-log (remaining picks only), issues-log, status, sprint-backlog, product-backlog.
- When a pick changes no line in a process file, leave that file unchanged.
- Before a process file write, read only that artifact's `####` heading in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. Start at that heading. Stop at the next `####` heading.
- Before closing an RID, apply `{client_root}/rules/sdd-dod.mdc` for a RID (Common quality gate and defaults).
- Before an SBI or PBI **Done** write, apply `{client_root}/rules/sdd-dod.mdc` for that type (defaults include **sdd-retrospective** completed).

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`. Allowed values are `EN`, `HanS`, and `HanT`. When `locale` is missing, reply in the language of the user's request.
- Leave each process file in its current language.
- Keep a write inside the five process files.
- Set an SBI to **Done** only when the user pick names **Done** for that code, **close confirm** for that SBI is in the thread, **sdd-retrospective** finished in the same turn when required, and DoD checks pass.
- Set a PBI to Done only when the user pick names Done, DoD passes, and **sdd-retrospective** has finished in the same turn for that PBI.
- Close an RID only when the user pick names that close and pack dod passes for the RID.
- Do not read an adr folder. Those files belong to the workspace that wrote them.
- Leave secrets out of the changes log.
- Leave `{client_root}/.sdd-installed.json` unchanged.
- Leave `sdd-audit-artifacts` unrun from this skill.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled.

## Anti-patterns

- A long bullet list instead of the numbered mismatch table.
- Six always-on subsections when most are empty.
- Mismatch text that only describes what the agent read in a file.
- Test case ids in the user message when the user did not ask about tests.
- OGT row numbers instead of OGT task titles in Problem or Fix cells.
