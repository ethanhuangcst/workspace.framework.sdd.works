# Seed artifacts building guide

This guide is the method for writing an artifact seed. An artifact seed is the starter a new project copies. Section rules live only in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md). The live artifact is the example. The live artifact follows the rules and does not restate the rules.

## Tracking

One OGT (on-going task) tracks one section type. A section that repeats, such as Sprint 1 through Sprint 16, shares that one task. The task names the artifact and the section. Created is the current sprint. The affected SBI (sprint backlog item) is the seed item. The section in progress is WIP. Later sections stay ToDo.

## Rules for one section

Agree the four groups with the user before the edit. Record them only as Template and How to write under that artifact in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md).

1. Content: what the section documents, and what the section leaves to another section.
2. Format: the headings, the lines, the tables, and the links.
3. Writing: [General writing principles](#general-writing-principles).
4. Terms: each name the section uses. Link the heading for that name in [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice). Do not copy the meaning.

## Section rule shape

A section rule in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md) has two parts.

1. Template: the section shape, with a placeholder for each fact that changes.
2. How to write: one note for each placeholder. The note names the verb, the placeholder, and the result.
   bad example: "Fill in the status."
   good example: "Write the SBI (sprint backlog item) status in `{status}`, so the row shows ToDo, WIP, or Done."

Do not restate those notes as a narrative list.

## General writing principles

These checks apply to every section. The same list is in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md#general-writing-principles).

**Wording**

- Use short, precise, accurate, concise wording. One sentence carries one fact.
- A name is a noun. A title is one short subject line.
- One fact stays one line, or one short paragraph when a line cannot carry it.
- Two or more facts become a bullet list. One fact is one bullet.
- In a table cell, each bullet is its own line, separated by `<br>`.
- Use one name for one thing in the whole file. Put the plain meaning beside a specialist term on first use.
- Write a name from the end user's view. Name the result.

**Structure**

- The file header is a blockquote of three lines. `Type` names the artifact group and the product. `as_of` is the date of the last edit. `Definition` links that file's section under [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice). One sentence per line. One link per line. The blockquote ends at the first `---`.
- A heading level matches the role: file title, section, entry or table, numbered point.
- Sections stay in the order named for that file.
- Indent a continuation two spaces under its bullet. Leave no blank line between the bullet and that line.
- Omit a line, a label, or a block the section does not need.

**Links and ownership**

- Keep the key point in this section. Put the detail in the file that owns it, and link that file.
- A link to a spec gives the id, the link, and the name.
- Link a term. Do not copy its definition into the artifact.
- Do not restate the section rules in the live body.
- Each artifact keeps its own job. Do not record a fact in a second file that already owns it.

**Examples**

- Add a good example and a bad example when the shape is easy to miss.
- The good example shows the required shape. The bad example shows one failure.

## Terminology

The terminology store is [Terminology in practice](./framework/seeds/templates/EN/sdd-scrum-practices.md#terminology-in-practice) in `sdd-scrum-practices.md`.

- A section uses the Terminology name for that thing, so the file keeps one name.
  bad example: call the same row an item after `SBI` is the Terminology name
  good example: use `SBI` for that row
- A name used in an artifact links the heading for that name.
- The artifact does not copy the meaning.
- Add a missing name to Terminology in practice before the artifact links that name.
- The artifact header has three lines: `Type`, `as_of`, and a Definition link to that file's section in Terminology in practice. `as_of` is the date of the last edit. The EN seed uses a sample date. After copying, replace the product name and the date.

## Review and update

Work one section at a time.

1. Agree the four groups with the user. The groups are Content, Format, Writing, and Terms.
2. Update that section in [`sdd-scrum-practices.md`](./framework/seeds/templates/EN/sdd-scrum-practices.md).
   - Write or replace `Template` and `How to write`.
   - `Template` is the section shape.
   - `How to write` is one note for each placeholder.
   - Both parts match the agreed groups. Do not add a second copy of the groups as a narrative list.
3. Follow [General writing principles](#general-writing-principles), update the same section in the live artifact in this workspace. That file is the example. Leave later sections unchanged.
4. Read the live example against [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc). Edit, then review again, until every line passes.
5. Update the same section in the EN seed under [`specs/framework/seeds/templates/EN/`](./framework/seeds/templates/EN/). The seed uses the Pokymon Card Collection example. Read the seed against [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc). Edit, then review again, until every line passes.
6. Stop. The next section starts only after the user confirms the live example and the EN seed.

## Pass

A section passes when all four checks are true.

- The practices file holds `Template` and `How to write` for that section, and those two parts match the agreed groups.
  General writing principles are the shared writing checks. A section's Content, Format, and Terms stay in that section's Template and How to write.
- The live example and the EN seed both follow the groups.
- The live example and the EN seed both pass [`friendly-language.mdc`](./framework/seeds/rules/friendly-language.mdc).
- The user has confirmed the live example and the EN seed.
