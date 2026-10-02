# ADR-073: Read skill `sdd-review-status`

## Status
Accepted. Decision 4 and decision 6 are superseded by [ADR-076](./ADR-076-review-status-one-skill.md) on 2026-10-02. The skill compares the board with the current sprint's named work and writes only after the second yes.

## Context
On a Usable audit, onboard needs the current project picture. That picture is five process files, and each file has one authority. Putting that list in `ethan.md` front-loads the procedure into the agent prompt.

[ADR-065](./ADR-065-skill-update-status.md) writes `status.md` after confirm. Using that skill to answer “where are we” mixes a read with a write.

## Decision
1. The skill folder is `sdd-review-status`. The constants key is `skill_get_status`.
2. The skill reads the five process files the audit opened:
   - `status.md` — current sprint, current item, and what is next
   - `sprint-backlog.md` — the sprint item list and the schedule
   - `product-backlog.md` — requirements and acceptance
   - `changes-log.md` — decisions already recorded
   - `issues-log.md` — open defects
3. It states where the project is and proposes the next-step options those files support. In a long file, it reads the current sprint and the open items.
4. It does not create or edit a project file.
5. It is not a practices job. Onboard follows it when the audit verdict is Usable. A user who asks where the project is follows it.
6. The confirmed write of `status.md` stays `sdd-update-status`.

## Rationale
The agent prompt names the capability. The skill holds the file roles. Ethan judges the next steps from the files.

## Consequences
- This record does not create `specs/framework/seeds/skills/sdd-review-status/SKILL.md`.
- Onboard follows this skill on a Usable verdict. The agent-prompt edit is separate.
- When `sdd-update-status` is next edited, its description drops the “where are we” and “what is next” triggers.

## Date
2026-09-28
