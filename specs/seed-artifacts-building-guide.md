# Seed artifacts building guide

This guide is the method for writing an artifact seed. An artifact seed is the starter a new project copies. Section rules live only in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). The live artifact is the example. The live artifact follows the rules and does not restate the rules.

## Tracking

One OGT (on-going task) tracks one section type. A section that repeats, such as Sprint 1 through Sprint 16, shares that one task. The task names the artifact and the section. Created is the current sprint. The affected SBI (sprint backlog item) is the seed item. The section in progress is WIP. Later sections stay ToDo.

## Rules for one section

Agree the four groups with the user before the edit. Record the four groups only under that artifact in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md).

1. Content: what the section documents, and what the section leaves to another section.
2. Format: the headings, the lines, the tables, and the links.
3. Writing: the checks that decide whether a line passes.
4. Terms: each name the section uses. Link the heading for that name in [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice). Do not copy the meaning.

## Section rule shape

A section rule in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) has two parts.

1. Template: the section shape, with a placeholder for each fact that changes.
2. How to write: one note for each placeholder. The note says what to write in that placeholder.

Do not restate those notes as a narrative list.

## Terminology

The terminology store is [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) in `sdd-scrum-practices.md`.

- A name used in an artifact links the heading for that name.
- The artifact does not copy the meaning.
- Add a missing name to Terminology in practice before the artifact links that name.

## Review and update

Work one section at a time.

1. Agree the four groups with the user.
2. Read [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) and keep that file aligned with the agreed groups.
3. Update the live artifact in this workspace as the example to test. Leave later sections unchanged.
4. Read the example against [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc). Edit, then review again, until every line passes.
5. Update the same section in the EN seed under [`specs/framework/seeds/templates/EN/`](./framework/seeds/templates/EN/). The seed uses the Pokymon Card Collection example. Read the seed against [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc). Edit, then review again, until every line passes.
6. Stop. The next section starts only after the user confirms the live example and the seed.

## Pass

A section passes when all four checks are true.

- The practices file holds the four groups, and no other file copies the groups.
- The live example and the EN seed both follow the groups.
- The live example and the EN seed both pass [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc).
- The user has confirmed the live example and the EN seed.
