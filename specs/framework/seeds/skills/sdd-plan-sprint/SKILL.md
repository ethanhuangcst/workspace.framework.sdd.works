---
name: sdd-plan-sprint
description: >
  Assign existing product backlog items (PBIs) to sprints so each sprint
  delivers one MVP. Propose the next ToDo sprint by default, or the sprints
  the user names. List the sprint, the PBIs, and why that set is one MVP.
  Change a process file only after the user replies in chat. Write those picks in one
  pass. Do not open a question card. After each PBI has one sprint row, list extra tasks the sprint still needs.
  Use when the user asks to plan a sprint, plan the next sprint, assign
  PBIs, sprint planning, or sdd-plan-sprint. sdd-refine-backlog writes or
  splits PBIs. sdd-review-status compares the board with the work.
  sdd-close-sprint closes or starts a sprint. sdd-update-project writes
  artifacts-map.json.
---

# Sprint proposal

Send the MVP list and **Your choice** in one chat message. Stop. Wait for the reply in that chat.

Do not write "Which option for Sprint" or "The options are in chat." The choices are the numbered lines under **Your choice**.

The five process files change only after that reply. One write pass runs after the last sprint reply.

A product backlog item (PBI) is one row on `product-backlog.md`.

A sprint backlog item (SBI) is one row in a sprint table on `sprint-backlog.md`.

An on-going task (OGT) is temporary or side work on `status.md`. An OGT stays on `status.md` only.

The five process files are changes-log, issues-log, status, sprint-backlog, and product-backlog.

`{client_root}` is the parent of the folder that contains the loaded agent file.

You pick what happens to each proposed sprint.

## Capabilities

This skill runs the steps below in order. Within a step, one clarifying question is allowed when the sprint row type or the sprint goal is still unclear.

| Capability | Result for you |
| --- | --- |
| Locate the five process files | Planning uses the paths in `artifacts-map.json` |
| Name target sprint(s) | Default is the next ToDo sprint, or the sprint after the last Done section |
| Propose MVP options in chat | Each option is a numbered list: code and short name, then Now, then If you accept. If you accept names the SBI and `sprint-backlog.md`. When the job needs an Epic or Theme, that item stays off the sprint and names an on-going task. A PBI whose sprint items are still unnamed sits under Not ready |
| Collect a sprint-level pick | **Your choice** sits under the list in the same chat message. The reply in chat is the pick. No question card |
| Write accepted picks | One pass updates changes-log, issues-log, status, sprint-backlog, product-backlog |

## Knowledge

| Source | Load when |
| --- | --- |
| `{workspace}/artifacts-map.json` | Start of the run; read `locale` when present |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, headings `1. Plan sprints by MVP`, `2. Slice product to MVPs`, and `4. Size product backlog` | Building MVP options. When `locale` is missing, use `EN` |
| `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`, heading `5. Feature break down`, subsection `Plan a sprint` | Naming Feature SBIs and extra Task SBIs |
| Done `## Sprint` sections in the `sprint-backlog.md` path from step 1 | Match the Done sprint goal and the parent PBIs before you build options |
| Heading `Sprint goal line` in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` | Before each sprint goal line in chat |
| Headings `Task` and `OGT` in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` | When you list an extra task or an on-going task. Read those two rows only |
| Headings `product-backlog.md` and `sprint-backlog.md` in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` | Write pass when those files change |
| `{client_root}/rules/friendly-language.mdc` | Wording in chat |

## Run the plan

### 1. Find the five process files

Read `{workspace}/artifacts-map.json` to locate the five process files.

- Stored paths are the strings in `files` and the strings in each module's `files` list.
- Open each stored path as `{workspace}/<path>`, so the skill reads the file the map names.
- When `{workspace}/artifacts-map.json` is missing, name that missing file, send these two lines, and stop.
  `artifacts-map.json` is missing, so the five process files cannot be located.
  Next step: run `sdd-audit-artifacts`.
- Leave `sdd-audit-artifacts` unrun, so this skill stays on the plan.
- When a process file fails to open, name the process file and stop.
- Leave a missing process file uncreated, so this skill stays on the plan.

### 2. Pick the target sprints

Default is one sprint: the earliest sprint whose status line in `sprint-backlog.md` is `ToDo`.

- When every sprint section is Done and none is ToDo, the default is the next sprint after the last Done section. Example: after Sprint 4 Done, the default is Sprint 5.
- When you name a sprint, or ask for several sprints, use that list in sprint order.
- Leave a sprint past the last section uncreated, so a new sprint section appears only when you ask for that sprint.

### 3. Read backlog and MVP rules

`{locale}` is the value in `{workspace}/artifacts-map.json`. When `locale` is missing, use `EN`.

Load each Knowledge row when its Load when column matches this step. For a practices heading, start at that heading in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` and stop at the next heading of the same level.

Read the Product Backlog table in `product-backlog.md` from step 1. Read the Unplanned PBIs table in `sprint-backlog.md` from step 1.

Read Done sprint sections per the Knowledge table, so each new option matches a Done sprint goal and its parent PBIs.

Scheduled candidates are PBIs whose status is not `Done`, whose `Sprint` cell is `—`, this sprint, or a later sprint, and whose `Size` cell is Implementable.

- Apply the Epic and Theme rule in the loaded §1 and §2. Do not copy a list of product cases into the proposal.
- A PBI already named on an earlier unfinished sprint is a move. Show it as a move. Leave that PBI on its current sprint until you pick the move.

### 4. Propose MVP candidates in chat

- For each target sprint from step 2, build at least one candidate MVP. Label the first Option A, the second Option B, the third Option C. When only one set passes the slice rules, send Option A only.
- Option letters name different MVP slices when several pass the slice rules. They can also name the same PBIs with an extra-task item versus the same PBIs with that item omitted.
- Name one Feature SBI per Implementable PBI in the candidate set, per practices §5 Plan a sprint. SBI codes and names are for the write pass after you pick. They stay in the numbered list.
- After the PBI set is named, list any extra tasks that sprint still needs, per practices §5 Plan a sprint. Load the Task row and the OGT row in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md` when you list an extra task or an on-going task. Each extra task is one SBI with Type Task. The parent PBI is the PBI that sprint row delivers.
- Park side work as an OGT when you name it in the pick.
- After the Implementable set for an option is chosen, name each Epic or Theme the job needs, using the loaded §1 and §2. Leave off any coarse PBI the job does not need. Those items are not in the numbered list of items this sprint will schedule, and they get no SBI. The Now line and the on-going task name are the ones in [MVP candidates in chat](#mvp-candidates-in-chat). `sdd-refine-backlog` still changes Size, bullets, and splits.
- A new product outcome stays on `sdd-refine-backlog`.
- When no extra task passes the Task row, omit the extra-task item.
- When one option lists an Extra task and the same PBIs can ship without that Task SBI, add the next option letter with the same PBIs and omit the extra-task item. The choices under the list stay on option letters only.
- Follow the loaded §1. When a PBI still needs sprint rows that are not named, list it under Not ready for this sprint. That list names the PBI and the unnamed rows. That PBI is not an option letter.
- Before you send the message, apply the option-size sentence in the loaded §1. Count the new Implementable Feature SBIs in each option. When the largest count and the smallest count differ by more than one, drop the options that are a different size, or send the single honest option alone. Do not add PBIs the job does not need.

Send [MVP candidates in chat](#mvp-candidates-in-chat) and **Your choice** in one message, then stop.

After the chat block, follow [User pick for each sprint](#user-pick-for-each-sprint).

## MVP candidates in chat

Every sentence you read names the sprint, the PBI or the SBI, and what will happen. A sentence that only states what was read in a file fails.

Send each target sprint as Markdown in the chat message. Leave the proposal out of a code block, so the lines wrap on the screen. Use a numbered list. Do not use a table.

For each sprint, send a header, then Not ready when a PBI still lacks named sprint items, then one block per option.

**Sprint {sprint number}**

**Not ready for this sprint**

1. **{PBI code} — {short name}**
- Now: {which sprint items are still unnamed, in everyday words}.
- Further refinement is needed before this sprint can include {short name}.

Send this block only when at least one PBI belongs there.

For each option (A, then B, then C when present):

**Option {letter}**

Sprint goal for Sprint {sprint number}: {sprint goal line from Sprint goal line in practices}

Reason: {the job you finish in this sprint}

1. **{PBI code} — {short name}**
- Now: {where this item stands: ToDo, WIP, or Done, and whether it is already on a sprint}.
- If you accept: a new SBI '{SBI name}' will be added to Sprint {sprint number} in `sprint-backlog.md`. {When another SBI is already on that sprint, name it in single quotes and say it stays.}

The headline is the PBI code, then the short Description. Do not send a code alone.

**Now** is the board fact. Use the status words and the sprint name that are already on the backlog.

**If you accept** is the change. Name each new or moved SBI in single quotes. Name the sprint. Name `sprint-backlog.md`. When an SBI is already on that sprint and stays, name that SBI in single quotes too.

When the PBI moves from another sprint, **Now** names that sprint. **If you accept** says the SBI will be added to this sprint in `sprint-backlog.md` and removed from the sprint it leaves.

An extra task is its own numbered item after the PBIs. **Now** says why the sprint needs it. **If you accept** names that task SBI in single quotes, names the parent PBI, and names `sprint-backlog.md`. Omit the extra-task item when the sprint does not need one. When one option includes that task and the same PBIs can ship without it, the next option letter repeats the PBIs and omits the task item.

**In this MVP, refine before the sprint delivers it**

1. **{PBI code} — {short name}** ({Epic or Theme})
- Now: {why this job needs this outcome, from the loaded §1 and §2, in everyday words}.
- If you accept: an on-going task 'Refine {Epic or Theme} PBI {PBI code} {short name}' will be added on `status.md`. {short name} stays off Sprint {sprint number} in `sprint-backlog.md` until that refine is done.

The on-going task name is the Size word, the PBI code, and the short Description. It does not name the sprint or the sprint job.

Send this block only when at least one Epic or Theme belongs in the job. Omit it when none do. Do not add an SBI for a PBI that appears only in this block.

After the option blocks for this sprint, send the choices in the same message. Leave a question card unopened. The reply in chat is the pick. Follow [User pick for each sprint](#user-pick-for-each-sprint).

For several target sprints, repeat the header, the option blocks, and the choices once per sprint. Wait for the reply before the next sprint. Each later sprint starts from PBIs not used in an earlier candidate.

#### Example

This is one sprint. The names show the shape. They are not a rule about accounts or card lists.

**Sprint 2**

**Option A**

Sprint goal for Sprint 2: A collector sees their cards in a list so that they can pick one to price

Reason: the collector opens the list and sees their cards before the next sprint starts

1. **Collect-02 — Card list view**
- Now: Card list view is ToDo. It is not on a sprint yet.
- If you accept: a new SBI 'Card list' will be added to Sprint 2 in `sprint-backlog.md`. The other SBI 'My binder', which is already on Sprint 2, stays.

**In this MVP, refine before the sprint delivers it**

1. **ACC-01 — Account management** (Epic)
- Now: The collector cannot keep a list that is theirs unless they have an account, and that outcome is still one Epic.
- If you accept: an on-going task 'Refine Epic PBI ACC-01 Account management' will be added on `status.md`. Account management stays off Sprint 2 in `sprint-backlog.md` until that refine is done.

**Your choice**

1. Option A
2. I will enter what to add to Sprint 2 in chat.
3. Cancel planning. Specs stay unchanged for Sprint 2.
4. Stop planning. Update specs for what is already accepted.

## User pick for each sprint

Send the proposal and **Your choice** in one chat message.

When the sprint row type or the sprint goal is still unclear, ask one question in that same chat style, wait for the reply, then send the proposal. Do not send the proposal before that reply.

One sprint at a time. Wait for the reply in chat before you send the next sprint.

After the list, list the choices in the same message. Offer one line per option letter that appears for this sprint. Then always list:

1. I will enter what to add to Sprint {n} in chat.
2. Cancel planning. Specs stay unchanged for Sprint {n}.
3. Stop planning. Update specs for what is already accepted.

The reply that names one choice is the confirmation. Follow the write table below.

#### Write pass for each pick

| Pick | Write pass |
| --- | --- |
| Option A, B, or C | The Implementable PBIs in the numbered list, each SBI named in an If you accept line, and each on-going task named in the refine block. When the option has no extra-task item, write no Task SBI. Do not set Sprint or add an SBI for a PBI that is only in the refine block. |
| I will enter what to add to Sprint {n} in chat | None until you list what goes in the sprint; then step 4, chat again, one more pick |
| Cancel planning | Nothing for this sprint |
| Stop planning | Nothing for sprints not yet accepted; update specs for what already accepted in this run |

When you enter what to add, record what you list. Run step 4 on that set, send the chat block again, and wait for one reply.

The accepted choice is the confirm. Write only the PBI rows, the SBI rows, and any OGT row named in that choice.

After you pick, record that choice. Leave the five process files unchanged. Ask the next proposed sprint.

After the last sprint has a choice, write the recorded lines in [Write the picks](#write-the-picks).

## Write the picks

Write the recorded lines in this order: changes-log, issues-log, status, sprint-backlog, product-backlog.

- When the pick changes no line in a process file, leave that process file unchanged, so the file keeps its current text.
- When `product-backlog.md` changes, read the `product-backlog.md` section in `{client_root}/templates/framework.sdd.works/{locale}/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that `####` heading. Stop at the next `####` heading.
- When `sprint-backlog.md` changes, read the `sprint-backlog.md` section in that practices file. Start at that `####` heading. Stop at the next `####` heading.
- Cancel planning writes nothing for that sprint.
- Stop planning updates specs only for what already accepted in this run.

### product-backlog.md

- Set the `Sprint` cell for each accepted Implementable PBI in the numbered list.
- Leave the `Sprint` cell unchanged for a PBI that appears only in the refine block.
- Leave the PBI status as it is.

### sprint-backlog.md

- Set the sprint goal when you accepted a new goal.
- Add one SBI per accepted PBI that has no SBI in that sprint.
- Add each extra Task SBI named in the accepted choice.
- Remove that PBI from Unplanned PBIs.
- Follow the sprint item columns and the sort rules in practices.

### status.md

- A new sprint section updates Project progress.
- A sprint goal you accepted updates "what could be the next".
- When the accepted choice parks side work, add that OGT row in the same write pass.
- Add one OGT row for each on-going task named in the refine block of the accepted option. The task name is the quoted name in that If you accept line. Affected SBIs are the feature SBIs this option adds for the Implementable PBIs.

### issues-log.md

- Write a row when you say the item is an issue.

### changes-log.md

- Write one entry for the schedule change: what changed, why, how to verify.

#### Example

You read this sentence. The recorded picks write it after the last sprint.

```text
In product-backlog.md, set Card list view to Sprint 2.
In sprint-backlog.md, add Card list under Sprint 2. Parent is Collect-02.
```

## Limits

- Read `locale` from `{workspace}/artifacts-map.json`, so the response uses the project's language.
- Allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- When `locale` is missing, reply in the language of your request.
- Leave each process file in its current language, so an EN file stays English, a HanS file stays Simplified Chinese, and a HanT file stays Traditional Chinese.
- Keep a write inside the five process files, so a file outside the five process files stays unchanged.
- A PBI status cell and an SBI status cell stay as they are.
- Leave secrets out of the changes log, so the changes log stays free of secrets.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- A new PBI stays on `sdd-refine-backlog`. Size changes, splits, and tightens stay on `sdd-refine-backlog`.
- Scope rules stay in practices §1 and §2. A PBI with unnamed sprint rows appears under Not ready for this sprint.
- Leave the Size ladder in practices §4, so this skill links that section and does not copy the examples.
- Leave Feature and Task breakdown examples in practices §5, so this skill links that section and does not copy the examples.
- Leave an Epic or Theme off the sprint backlog and off the Product Backlog `Sprint` cell until it is Implementable.
- Do not open a question card. The proposal list and **Your choice** are one chat message. The reply in chat is the pick.
