# Plan sprint reply

Load this file when composing the MVP proposal for the user.

**Key** is the PBI code, or `Task:` plus the task name for an extra task. **Problem** is the board fact (the old Now line). **Fix** is the change if the user accepts (SBI, `sprint-backlog.md`, or an on-going task on `status.md`). Number rows from 1 inside each table. Restart at 1 for the next table.

## Message order

Per target sprint:

1. **Lead:** one sentence with sprint number, status, option count, and not-ready count when non-zero.
2. **Sprint header:** `**Sprint {n}**`
3. **Not ready for this sprint** table when at least one PBI belongs there. Omit when empty.
4. For each **Option A**, **B**, **C:** sprint goal line, Reason line, schedule table, then refine table when Epic or Theme rows apply.
5. **Your choice** for this sprint.

Leave the proposal out of a code block. One sprint at a time. Wait for the reply before the next sprint.

## Lead sentence

Template:

`Sprint {n} is {ToDo or WIP}. {O} MVP option(s). {R} PBI(s) not ready for this sprint.`

When `{R}` is zero, omit the not-ready clause.

## Not ready for this sprint

Number rows starting at 1.

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{PBI code}` | `{which sprint items are still unnamed, in everyday words}.` | Further refinement is needed before this sprint can include {short name}. |

## Option block

**Option {letter}**

Sprint goal for Sprint {n}: {sprint goal line from practices Sprint goal line}

Reason: {the job you finish in this sprint}

### Schedule table

Implementable PBIs and extra tasks for this option. Number rows starting at 1.

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{PBI code}` | `{Now: board fact}.` | `{If you accept: SBI in single quotes, sprint-backlog.md, stays and moves as needed}.` |
| 2 | `Task: {name}` | `{why the sprint needs this task}.` | `{If you accept: task SBI in single quotes, parent PBI, sprint-backlog.md}.` |

**Key** for a move names the PBI code. **Problem** names the sprint the PBI leaves when it moves. **Fix** names the new sprint and any SBI that stays.

Omit the task row when the option has no extra task.

### Refine before sprint delivers

Send only when at least one Epic or Theme belongs in the job. Number rows starting at 1.

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | `{PBI code}` | `{why the job needs this outcome} ({Epic or Theme}).` | An on-going task 'Refine {Epic or Theme} PBI {code} {short name}' will be added on `status.md`. {short name} stays off Sprint {n} in `sprint-backlog.md` until that refine is done. |

Do not add an SBI for a PBI that appears only in this table.

## Your choice

Offer one line per option letter that appears for this sprint. Then always list:

1. I will enter what to add to Sprint {n} in chat.
2. Cancel planning. Specs stay unchanged for Sprint {n}.
3. Stop planning. Update specs for what is already accepted.

Example when only Option A exists:

**Your choice**

1. Option A
2. I will enter what to add to Sprint 2 in chat.
3. Cancel planning. Specs stay unchanged for Sprint 2.
4. Stop planning. Update specs for what is already accepted.

The reply that names one choice is the confirmation. Do not open a question card.

## Example shape

**Sprint 2**

**Option A**

Sprint goal for Sprint 2: A collector sees their cards in a list so that they can pick one to price

Reason: the collector opens the list and sees their cards before the next sprint starts

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | Collect-02 | Card list view is ToDo and is not on a sprint yet. | A new SBI 'Card list' will be added to Sprint 2 in `sprint-backlog.md`. The SBI 'My binder', which is already on Sprint 2, stays. |

**In this MVP, refine before the sprint delivers it**

| # | Key | Problem | Fix |
| --- | --- | --- | --- |
| 1 | ACC-01 | The collector cannot keep a list that is theirs without an account (Epic). | An on-going task 'Refine Epic PBI ACC-01 Account management' will be added on `status.md`. Account management stays off Sprint 2 in `sprint-backlog.md` until that refine is done. |

**Your choice**

1. Option A
2. I will enter what to add to Sprint 2 in chat.
3. Cancel planning. Specs stay unchanged for Sprint 2.
4. Stop planning. Update specs for what is already accepted.
