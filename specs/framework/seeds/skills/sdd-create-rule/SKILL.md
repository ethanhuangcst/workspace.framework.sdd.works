---
name: sdd-create-rule
description: >
  Create or revise a pack rule as <name>.mdc under {client_root}/{rules_dir}/.
  Use when the user wants a new rule, wants to change an existing rule, asks
  how a rule file should be structured, or says to turn a principle into a rule.
  Writes only after the user confirms the rule file path. A skill file is
  sdd-create-skill. Spec-to-build for a sprint backlog item (SBI) is
  sdd-spec-to-build.
---

# Create a rule

The user gets one rule file after they confirm the path.

This skill adds the pack path, the file shape, and that confirm.

## State what the rule enforces

Read the conversation, to state what the rule enforces, when it loads, and the file pattern when the user limits it to files.

Ask only what is still unknown, so the rule uses the user's answers:

- What the rule enforces
- Whether it loads every session, or only when certain files are open
- When the user limits it to files, the pattern the user names
- An existing rule to follow

If the user gives exact wording, copy it verbatim, same words, same order, same language, so those words stay in the file.

Chat in the language of the user's request.

## Choose the file path

Choose `<name>` from lowercase letters, numbers, and hyphens, at most 64 characters, so the file name matches the pack rule.

When the rule reads or writes framework process artifacts (`artifacts-map.json`, the five process files, or pack practices for SDD writes), name the file `sdd-<name>.mdc` ([ADR-094](../../../adr/ADR-094-sdd-prefix-framework-rules.md)). Portable rules (for example copy-only rules like `friendly-language.mdc`) use `<name>.mdc` with no `sdd-` prefix.

Name the file on disk as chosen above, so the host loads that rule.

Name `client_root` as the parent of the loaded agent file, so the path starts at that file.

Read `rules_dir` from `{client_root}/templates/framework.sdd.works/constants.json`, so the folder name comes from that file.

## Stop when the pack lookup is missing

If that `constants.json` cannot be read, or `rules_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.json`.

- Stop before writing a file, so the pack stays unchanged.
- Stop before assuming the folder name `rules`, so the path comes from `constants.json`.
- Stop before copying a replacement `constants.json`, so the user's file stays as it is.
- Leave `{client_root}/.sdd-installed.json` unchanged.

## Place the rule file

Write `{client_root}/{rules_dir}/<name>.mdc`, so the rule file sits in the pack.

Revise the existing file in place and keep the name, so one rule keeps one file.

- Leave the rule file off the workspace, so the pack stays on the client root.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.

- A request for a skill file belongs to `sdd-create-skill`.
- A request to design or implement a sprint backlog item belongs to `sdd-spec-to-build`.

## Limits

- **Path confirm** for the rule file is the confirm for this skill when it runs alone.
- When `{workspace}/artifacts-map.json` opens and an SBI or PBI in scope is being closed for pack rule work, follow `{client_root}/rules/sdd-dod.mdc` **close confirm** before any **Done** row write. Path confirm is not **close confirm**.
- When no SBI or PBI is in scope (standalone pack authoring), do not write or invent rows on process files. The user decides usability in chat; this skill does not mark backlog items **Done**.

## Confirm the file path

State the file path and whether the rule loads every session or only for the named files, so the user can confirm that path. Wait for the user to confirm.

- A request to create a rule still needs that yes.
- One yes covers that file.
- Write the file only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## Write the confirmed rule

### Write the fields the host reads

- Frontmatter is `description` and `alwaysApply`, so the host reads those fields.
- When the user limits the rule to files, set `globs` to that pattern and set `alwaysApply` to false, so the rule loads for those files.
- Add a tool-specific invocation flag only when the user names a tool that requires it, so the host shows that flag only for that tool.
- Write `description` as one sentence, so the host shows that sentence.

### State the limit and the result

- State the limit and the result in the rule, so the user can apply that limit.
- Leave a numbered procedure in a skill, so the rule file holds the limit and the result.
- Keep the body to one concern and under 50 lines, so the rule stays one limit.
- Link `../../rules/friendly-language.mdc` for the wording checks, so the wording stays in that file.
- In the rule file, a heading names what the reader gets.
- In the rule file, an instruction names the verb, the work, and the result.
- In the rule file, a ban names the result.
- When the rule is about a pattern, include a bad example and a good example, so the user sees the limit and the change.
- Use one term for one concept, so the same limit keeps one name.
- Use a forward-slash path, so the path opens on the host.
- Leave the date off an instruction, so the instruction stays usable later.
- Write the rule in Markdown, so the file has no raw HTML tag.
- Keep a list tight, so the continuation sits on the next indented line.

### Show the rule the user reads

The user sees the limit, the reason, and the change.

```markdown
---
description: Keep a city list out of source, so a new city uses the same search.
alwaysApply: true
---

# City list in source

The city list stays out of source, so Lisbon uses the same search as every other city.

bad example: add Lisbon to the city table so that one city passes.
good example: Lisbon uses the same search as every other city, so the city table stays unchanged.
```

## Check the rule file

Before you finish:

- The description states what and when, in the third person, with the phrases a user types, and names a nearby skill when one owns the adjacent job
- `SBI` is expanded on first use in the description
- `<name>` follows the ADR-094 prefix rule for framework-bound vs portable rules
- Verbatim user wording is unchanged
- The skill chats in the language of the user's request
- The confirm states the path and whether the rule loads every session or only for the named files
- The rule states the limit and the result, and a numbered procedure stays in a skill, so the user can apply that limit
- Wording checks are a link to `../../rules/friendly-language.mdc`
- The rule body is under 50 lines and uses one term per concept
- `alwaysApply` is true, or it is false and `globs` is the pattern the user named
- No instruction carries a date, so the instruction stays usable later
- Every path uses a forward slash, so the path opens on the host
- The only write is the confirmed file `{client_root}/{rules_dir}/<name>.mdc`

## Propose the prompts

Propose 2 or 3 prompts a real user would type. Ask whether the prompts look right, so the user can accept or change them.

Stop after the prompts, so no test run starts and the user decides whether the rule is usable.

## Propose the constants row

After the rule file is written, propose one key for the `rules` object in `{client_root}/templates/framework.sdd.works/constants.json`: rule key and file name. Wait for a second confirm before editing that file. Leave the product backlog, the sprint backlog, and `sdd-scrum-practices.md` unchanged.
