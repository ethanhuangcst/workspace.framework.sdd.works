---
name: sdd-review-status
description: >
  Read-only project status. Use during onboard when the audit verdict is Usable,
  or when the user asks where the project is or what to do next. Reads the
  process files the audit opened, states where the project is, and proposes
  next-step options. Does not create or edit a project file. Writing status.md
  is sdd-update-status.
---

# Review status

## Steps

1. Use the paths under `opened` in the `sdd-audit-artifacts` reply. Do not run the audit again. When no audit reply is available in this session, run `sdd-audit-artifacts` once and continue only on `Usable`.
2. Open each path as `{workspace}/<path>`. Each file has this authority when it is in that list:

| File | Authority |
| --- | --- |
| `status.md` | Project progress, current sprint, current SBI, what is next, the open OGT table, and the latest 15 closed OGTs |
| `sprint-backlog.md` | Sprint item list and schedule |
| `product-backlog.md` | Requirements and acceptance |
| `changes-log.md` | Decisions already recorded |
| `issues-log.md` | Open, fixed, and deferred defects, and closed defects |

The sprint backlog stays the SBI list. When `status.md` and `sprint-backlog.md` disagree on an item's status, say so and treat the sprint backlog as the schedule.

3. In a long file, read the current sprint and the open items first.
4. State where the project is: the current sprint and its status, the current SBI, open OGTs, and open defects.
5. Propose the next-step options those files support. Follow the current sprint, the current SBI, and the sprint item order.
6. Chat in the locale the audit reported. Allowed values are `EN`, `HanS`, and `HanT`. If that report says `locale` is empty, do not assume English. Do not rewrite the process files into the reply locale.

## Do not

- Create or edit a project file, including `status.md`. That write is `sdd-update-status`.
- Mark an item Done.
- Change `{client_root}/.sdd-installed.json`.
