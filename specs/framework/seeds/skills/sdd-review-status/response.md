# Review status reply

Load this file when composing the findings message for the user.

This file uses **File** for the process basename. **Problem** is one sentence from the user's view. **Fix** is one imperative sentence.

## Message order

1. **Lead:** one sentence with sprint name, sprint status, open SBI counts, and mismatch count.
2. **Mismatches:** table when the count is greater than zero.
3. **SBI status gaps:** only when board status differs from checked work. Omit when every open row matches the board.
4. **RIDs:** one line, or two short lists when non-empty.
5. **Your choice:** four fixed options. Option 2 references row numbers from the mismatch table.

## Lead sentence

Template:

`{Sprint name} is {WIP or Done}. {N} open SBIs ({W} WIP, {T} ToDo). {M} mismatches.`

When `{M}` is zero, add: `Checked items match the board.`

## Mismatch table

List every mismatch. Number rows starting at 1.

| # | File | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{basename}` | `{one sentence}` | `{one imperative}` |

### Column rules

- **#:** row index for option 2 (`Apply rows 1–3`).
- **File:** basename of the process file only (`status.md`, `sprint-backlog.md`, `product-backlog.md`, `changes-log.md`, `issues-log.md`, or another file from the map when the mismatch is there).
- **Problem:** what looks wrong to the user. One sentence. No semicolon chains. No “actual is” or “because”.
- **Fix:** what to edit. One imperative sentence.

### Names in Problem and Fix

- Use SBI codes and backlog names from the board when that row is about an SBI.
- Use OGT task titles from `status.md`, not OGT row numbers.
- Use skill folder names for seed or test drift, not internal test case ids, unless the user asked about tests.
- Do not hard-code sprint names, SBI codes, or OGT numbers in this file. Fill them from the run.

## SBI status gaps

Show only when board status differs from checked work for that SBI.

Format per line:

`{code} {name}: board {Status}; set to {Status} or close after confirm.`

When every open SBI matches the board, omit this block.

## RIDs

When Open RIDs is empty and there are no close suggestions:

`Open RIDs: none.`

When suggestions exist:

**RIDs to close**

- `{id} {title} → Closed RIDs, sprint {name or number}`

When open RIDs stay valid:

**RIDs still open**

- `{id} {title}: {blocker in one phrase}`

## Your choice

Always list exactly:

1. I will enter instructions in chat.
2. Apply rows {list row numbers from the mismatch table, and name any RID close or SBI line from above}.
3. Create an OGT on status.md for items I will handle later.
4. Leave it to me.

## Good and bad

**Bad Problem cell**

`status.md current SBI: Names only feature-62 and feature-61; the sprint table lists six WIP rows.`

**Good row**

| # | File | Problem | Fix |
| --- | --- | --- | --- |
| 1 | status.md | “Current SBI” lists two items; the sprint board shows six WIP SBIs. | List all WIP SBIs in “where we are now”, or name one focus SBI. |

**Bad Problem cell**

`CE-SKILL-19 vs rag-expert seed: Test expects an Evaluation section in SKILL.md.`

**Good row**

| # | File | Problem | Fix |
| --- | --- | --- | --- |
| 2 | framework-tests.md | L1 test for rag-expert expects Evaluation in SKILL.md; eval moved to reference.md. | Update the test expected results or add a short Evaluation pointer in SKILL.md. |

## Empty run

Lead: `{Sprint name} is WIP. {N} open SBIs ({W} WIP, {T} ToDo). 0 mismatches. Checked items match the board.`

Skip the mismatch table. RIDs line as above. Then **Your choice**.
