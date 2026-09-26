---
name: sdd-tracking
description: >
  Track real-time project status. Use when the user says report status, update
  status, where are we, what is next, track the sprint, or update on-going tasks
  (OGT). Read the sprint backlog as the schedule and write the short picture into
  status.md. Do not use this skill to plan a sprint, refine the product backlog,
  or mark a product item Done.
---

# Track status

`status.md` is the short picture Ethan and the human read. The sprint backlog remains the list of SBIs. This skill updates the picture. It does not create a second schedule.

Practices job 6 is still unfilled. Until that section is written, follow this file. The job title stays Report status. The skill id is `sdd-tracking` (ADR-065).

## Steps

1. Read `status.md` and the current sprint in `sprint-backlog.md`. If either file is missing, say so and stop. Do not create a project file on your own.
2. Draft the update from those files: current sprint, current SBI, what is next, and the OGT table for the current SBI. OGT rows are temporary tasks, not SBIs.
3. Show the draft and wait for the human to confirm.
4. Write only the confirmed text into `status.md`. Leave the sprint backlog rows as they are.
5. Do not mark a PBI Done. Do not invent a sprint, an SBI, or an OGT the backlog does not have.

## Why confirm

Status is the project’s live claim about progress. A wrong line sends the next session to the wrong SBI.
