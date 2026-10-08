---
name: sdd-create-skill
description: >
  Create or revise an agent skill as SKILL.md under {client_root}/{skills_dir}/.
  Use when the user wants a new skill, wants to change an existing skill, asks
  how a skill file should be structured, or says to turn a workflow into a skill.
  Writes only after the user confirms the skill folder path.
---

# Create a skill

A skill is a folder with `SKILL.md`.

The model is the agent. The host runs the loop. A skill file states what the agent may do, what files to load, and what waits for a person. Leave step order to the model. A numbered procedure belongs only in a skill that owns one fragile, repeated job.

This skill adds the install path, the default body shape, and confirm-before-write.

`{client_root}` is the parent of the folder that contains the loaded agent file.

## Capabilities

The host picks order from the thread.

| Action | When |
| --- | --- |
| Discover purpose, triggers, and output | The user asks for a new skill or a change |
| Choose `<name>` and state the folder path | The purpose is clear enough to name the folder |
| Show the draft body shape | Before the folder yes, when the default or fragile-job shape is ready |
| Write `SKILL.md` and siblings in the confirmed folder | After the user confirms the folder path |
| Propose 2 or 3 test prompts | After the file is written |
| Propose one `skills` key in constants | After the folder write, only when `constants.json` exists and a registry key is needed |

If the user gives exact wording for the skill, copy it verbatim: same words, same order, same language. Chat in the language of the user's request.

## Resolve `{skills_dir}`

`{skills_dir}` defaults to `skills`.

Read `{client_root}/templates/framework.sdd.works/constants.json` when that file exists. When the JSON has `skills_dir`, use that value.

The default folder path is `{client_root}/{skills_dir}/<name>/`.

## Knowledge

| Source | Load when |
| --- | --- |
| `{client_root}/templates/framework.sdd.works/constants.json` | Before naming the folder path, when the file exists; read `skills_dir` |
| `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, named heading | The new skill uses a pack term and that file exists. When `locale` is missing, use `EN`. Start at that heading. Stop at the next heading of the same level |
| `{client_root}/rules/friendly-language.mdc` | Wording checks for chat and for the new skill body, when that file exists |
| An existing skill folder under `{client_root}/{skills_dir}/` | The user names a pattern to follow |

Do not load `framework-design.md` from the workspace unless the user names that file.

## Limits

- Do not copy a replacement `constants.json`. Do not change `{client_root}/.sdd-installed.json`.
- Do not call `sdd_install_framework` or `sdd_update_framework`.
- The default write path is on `{client_root}`. Write on a workspace path only when the user names that path in the confirm.
- Do not ship `skill-creator` or a second folder at `{client_root}/skills/create-skill/` (Cursor built-in name).
- One yes covers every file in the confirmed folder. That **path confirm** is the confirm for this skill when it runs alone.
- A second yes covers one new key in the `skills` object in constants. Leave the product backlog and sprint backlog unchanged.
- When `{workspace}/artifacts-map.json` and `{client_root}/rules/sdd-dod.mdc` both exist and an SBI or PBI in scope is being closed for pack skill work, follow **close confirm** before any **Done** row write. Path confirm is not **close confirm**.
- When no SBI or PBI is in scope, do not write or invent rows on process files. The user decides usability in chat; this skill does not mark backlog items **Done**.
- Stop after test prompts. No eval harness, grader, description optimizer, or package step.
- Leave out a skill whose purpose is unauthorized access or data exfiltration.

## Default body for the skill you write

Frontmatter is `name` and `description` only. Add a tool-specific invocation flag only when the user names a tool that requires it.

### Description

- Write in the third person. State what and when. Include phrases the user types.
- Leave an internal name out of the description.
- Name another skill when it owns an adjacent job.
- Keep the description under 1024 characters.

### Body sections

Write these sections unless the user limits the skill to one concern:

| Section | Content |
| --- | --- |
| Capabilities | Table: action and when. The host picks order |
| Knowledge | Table: source path and load when. One link deep from `SKILL.md` |
| Limits | What stops, what waits for a person, what this skill refuses |
| Anti-patterns | A few failures that break the job |

Put long reference text in one sibling file (`reference.md`, `examples.md`) and link it once from `SKILL.md`. Keep `SKILL.md` under 500 lines.

### Instruction craft

- Put in the body only facts the agent lacks.
- Each instruction names the verb, the work, and the result.
- Write the skill so it runs when called alone.
  bad example: "Chat in the locale the audit reported."
  good example: "Chat in the language of the user's request."
- A heading names what the reader gets. A single verb fails.
  bad example: `Reply`
  good example: `Summarize the findings`
- User-facing lines use the user's view: the status, the reason, and the change.
- When a practices file exists at `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`, name the heading for a defined term and leave the definition in that file. When that file does not exist, define the term in the new skill.
- When `friendly-language.mdc` is absent, the instruction craft in this skill is the wording check.
- Use one term for one concept. Use forward-slash paths. Leave dates off instructions.
- Match specificity to fragility: prose when several approaches work; a template when the shape is fixed; one script when the operation must repeat the same way. Name one default and one escape hatch.

Add when the skill needs them: an output template, a concrete example, a short checklist, a create versus edit branch, a validate-then-continue step.

## Fragile job branch

When one repeated operation must stay identical, show a numbered procedure or one script. Say whether the agent executes the script or reads it. Show that rewrite and wait for a yes before it goes in the file.

Example fragment after the user confirmed a fragile release-notes job:

```markdown
## Draft release notes

1. List changes merged since the last tag, to name what shipped.
2. Group those changes by user-visible effect, to draft the notes.
3. Show the draft and wait for confirm, so a file is written only after the user says yes.
```

Do not use a numbered list as the default body when the job is not fragile.

## Example default skill

```markdown
---
name: release-notes
description: >
  Draft release notes from merged changes since the last tag. Use when the user
  asks for release notes, a changelog entry, or what shipped in a version.
---

# Release notes

## Capabilities

| Action | When |
| --- | --- |
| List merged changes since the last tag | The user names a version or tag |
| Group changes by user-visible effect | Before showing a draft |
| Show a draft and wait for confirm | Before writing any file |

## Knowledge

| Source | Load when |
| --- | --- |
| Git log since the last tag | Building the change list |

## Limits

- Write a file only after the user confirms the draft.
- Do not invent shipped items that are not in the log.

## Anti-patterns

- A bullet list of every commit with no user-visible grouping.
```

## Confirm the folder

State the confirmed folder path and the files you will write. Wait for a yes. Write only after that yes.

## Check

Before you finish:

- The description states what and when, in the third person, with phrases the user types, and names a nearby skill when one owns an adjacent job
- The default body is capabilities, knowledge, limits, and anti-patterns unless the user limited scope
- A numbered procedure appears only after a fragile-job yes
- The skill runs when called alone
- Verbatim user wording is unchanged
- `<name>` follows the name rule: lowercase letters, numbers, hyphens, at most 64 characters
- The body is under 500 lines and uses one term per concept
- File links from `SKILL.md` are one level deep
- No instruction carries a date
- Every path uses a forward slash
- Every file is inside the confirmed folder

## Test prompts

Propose 2 or 3 prompts a real user would type. One prompt is a near-miss that should stay with another skill. Ask whether they look right, then stop.

## Constants row

When `{client_root}/templates/framework.sdd.works/constants.json` exists, you may propose one key for the `skills` object: skill key and folder. Wait for a second confirm before editing that file. When the file is absent, skip the key.
