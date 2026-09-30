---
name: sdd-create-skill
description: >
  Create or revise an agent skill as SKILL.md under {client_root}/{skills_dir}/.
  Use when the user wants a new skill, wants to change an existing skill, asks
  how a skill file should be structured, or says to turn a workflow into a skill.
  Writes only after the user confirms the skill folder path. Not for feature
  implementation (sdd-implement) or SBI design (sdd-design).
---

# Create a skill

A skill is a folder with `SKILL.md`. The agent already knows how to follow clear steps. This skill adds the pack path, the file shape, and the confirm-before-write rule.

## 1. Discover

Infer purpose, triggers, and output from the conversation. Ask only what is still unknown:

- What the skill enables
- When it should trigger
- Domain knowledge the agent would not already have
- Output format
- An existing pattern to follow

If the user gives exact wording for the skill, copy it verbatim: same words, same order, same language. Chat in the locale the audit reported.

## 2. Name and path

Choose `<name>`: at most 64 characters, lowercase letters, numbers, and hyphens.

`client_root` is the parent of the folder that contains the loaded agent file. Do not name a tool folder. Read `skills_dir` from the Paths table in `{client_root}/templates/framework.sdd.works/constants.md`.

## 3. Stop when the pack lookup is missing

If that `constants.md` cannot be read, or `skills_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.md`.

- Do not write any file.
- Do not assume the folder name `skills`.
- Do not copy a replacement `constants.md`.
- Do not change `{client_root}/.sdd-installed.json`.

## 4. Where the folder goes

- New skill: `{client_root}/{skills_dir}/<name>/`.
- That folder already exists: revise it in place and keep `name`. Do not create a second folder.
- Sibling reference files and scripts stay in that folder.

Do not copy the skill into the workspace. Do not call `sdd_install_framework` or `sdd_update_framework`.

## 5. Confirm the folder

State the folder path and the files you will write in it. Wait for the user to confirm.

A request to create a skill is not this confirm. One yes covers every file in that folder. A pack file is written only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## 6. Write SKILL.md

Frontmatter is `name` and `description` only. Do not add a tool-specific invocation flag unless the user names a tool that requires it.

The description is third person. State what the skill does and when to use it, including the phrases that should trigger it. When another skill owns a nearby job, name it so the agent does not pick the wrong one. Keep it under 1024 characters. Do not write it as “I can” or “you can”.

The body holds only what the agent does not already know. Explain why a step matters. Prefer that over rigid always/never lines.

Keep `SKILL.md` under 500 lines. Put long reference material in a sibling file and link it once from `SKILL.md`. Do not nest references.

Match how specific the instructions are to how fragile the task is:

- Several valid approaches: short prose
- A preferred shape with some variation: a template
- A fragile, repeated operation: one script, and say whether to execute it or read it

Use one term for one concept. Use forward-slash paths. Give one default when a library or method is required, and one escape hatch. Do not date an instruction.

Useful body pieces, when the skill needs them: an output template, a concrete input/output example, a short checklist, a branch (“creating” versus “editing”), and a validate-then-continue step.

Do not write a skill whose purpose is unauthorized access, data exfiltration, or a description that misleads about what it does.

Example:

```markdown
---
name: release-notes
description: >
  Draft release notes from merged changes since the last tag. Use when the user
  asks for release notes, a changelog entry, or what shipped in a version.
---

# Draft release notes

1. List changes merged since the last tag.
2. Group them by user-visible effect.
3. Show the draft and wait for confirm before writing a file.
```

## 7. Check

Before you finish:

- The description states what and when, in third person, with trigger phrases, and names a nearby skill when one owns the adjacent job
- `<name>` follows the name rule
- Verbatim user wording is unchanged
- The body is under 500 lines and uses one term per concept
- File links are one level deep
- There is no dated instruction and no backslash path
- Every file is inside the confirmed folder `{client_root}/{skills_dir}/<name>/`

## 8. Test prompts

Propose 2 or 3 prompts a real user would type. Ask whether they look right, then stop. Do not run them. Do not say the skill is usable; the user decides that. Do not run an eval harness, a grader, a description optimizer, or a package step.

## 9. Constants row

After the skill folder is written, you may propose one row for the Skills table in `{client_root}/templates/framework.sdd.works/constants.md`: skill key and folder. Wait for a second confirm before editing that file. Do not edit the product backlog or the sprint backlog.
