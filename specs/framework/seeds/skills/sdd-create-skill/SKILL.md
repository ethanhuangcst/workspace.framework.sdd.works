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

A skill is a folder with `SKILL.md`.

The agent already knows how to follow a clear instruction. This skill adds the pack path, the file shape, and the confirm-before-write rule.

## 1. Discover

Infer purpose, triggers, and output from the conversation. Ask only what is still unknown:

- What the skill enables
- When it should trigger
- Domain knowledge the agent would not already have
- Output format
- An existing pattern to follow

If the user gives exact wording for the skill, copy it verbatim: same words, same order, same language. Chat in the language of the user's request.

## 2. Name and path

Choose `<name>`: at most 64 characters, lowercase letters, numbers, and hyphens.

`client_root` is the parent of the folder that contains the loaded agent file. Name that parent, so the path starts at the agent file's folder. Read `skills_dir` from `{client_root}/templates/framework.sdd.works/constants.json`.

## 3. Stop when the pack lookup is missing

If that `constants.json` cannot be read, or `skills_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.json`.

- Stop before writing a file, so the pack stays unchanged.
- Stop before assuming the folder name `skills`, so the path comes from `constants.json`.
- Stop before copying a replacement `constants.json`, so the user's file stays as it is.
- Leave `{client_root}/.sdd-installed.json` unchanged.

## 4. Where the folder goes

- New skill: `{client_root}/{skills_dir}/<name>/`.
- That folder already exists: revise it in place and keep `name`, so one skill keeps one folder.
- Sibling reference files and scripts stay in that folder.

- Leave the new skill out of the workspace, so the pack stays on the client root.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.

## 5. Confirm the folder

State the folder path and the files you will write in it.

- Wait for a yes to that folder path.
- A request to create a skill still needs that yes.
- One yes covers every file in that folder.
- Write a pack file only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## 6. Write SKILL.md

Frontmatter is `name` and `description` only. Add a tool-specific invocation flag only when the user names a tool that requires it.

### Description

- Write the description in the third person, so the file states what the skill does.
- Include the phrases a user types, so those phrases trigger the skill.
- Leave an internal name out of the description, so a user phrase selects the skill.
  bad example: "whether the board matches"
  good example: "whether the plan matches the work"
- Name the other skill when it owns a nearby job, so the agent picks the skill that owns that job.
- Keep the description under 1024 characters.

### Instructions

#### State the facts the agent lacks

- Put in the body the facts the agent lacks, so the skill stays short.
- Explain why an instruction matters.
- Give each instruction three parts: the verb, the work, and the result.
  "Read the work related to the SBI, to state the actual status of that SBI."
  verb: Read
  work: the work related to the SBI
  result: the actual status of that SBI

#### Run when called alone

- Write the skill so it runs when called alone, so a caller can invoke it with no earlier skill reply.
  bad example: "Chat in the locale the audit reported."
  good example: "Chat in the language of the user's request."
- Name a missing required file and stop, so this skill stays on its own job.
  Name `{workspace}/artifacts-map.json` and stop.

#### Write the message the user reads

- A heading names what the reader gets. A single verb fails.
  bad example: `Reply`
  good example: `Summarize the findings`
- An example states what the user understands.
  bad example: "the card-list file is already in the workspace"
  good example: "the actual status is WIP because the card list page is already in the web app"
- A line the user reads is written from the user's view: the status, the reason, and the change.
  good example: "In sprint-backlog.md, set feature-03 Card list view from ToDo to WIP."
- Give a fixed result one message shape.
  `sprint: {current sprint}`
  `open SBI:`
  `- {SBI code} {SBI name}: {actual status or not checked}`
  `mismatches:`
  `- sprint-backlog.md says feature-03 Card list view is ToDo; the actual status is WIP because the card list page is already in the web app`

#### Keep the file short and linked

- Link the file that owns a definition, so the definition stays in that file.
  Link the OGT definition in `../../templates/EN/sdd-scrum-practices.md`.
  Leave the definition text in that file.
- Keep `SKILL.md` under 500 lines.
- Put a long reference in one sibling file and link it once from `SKILL.md`.
- Link one file deep, so each reference is a direct link from `SKILL.md`.

### How specific

Match the instruction to how fragile the task is.

- Several valid approaches: write short prose, so the agent can choose.
- One shape with room for variation: give a template, so the agent fills the placeholders.
- A fragile, repeated operation: give one script, and say whether to execute it or read it, so the same operation repeats the same way.

### Terms and paths

- Use one term for one concept.
  Use `SBI` after that term is defined.
  Leave out `item` for the same row.
- Use a forward-slash path.
- Give one default when a library or method is required, and name one escape hatch.
- Leave the date off an instruction, so the instruction stays usable later.

Add a body piece when the skill needs it:

- An output template
- A concrete input and output example
- A short checklist
- A branch for creating versus editing
- A validate-then-continue step

Leave out a skill whose purpose is unauthorized access or data exfiltration.

Leave out a description that hides what the skill does.

Example:

```markdown
---
name: release-notes
description: >
  Draft release notes from merged changes since the last tag. Use when the user
  asks for release notes, a changelog entry, or what shipped in a version.
---

# Draft release notes

1. List changes merged since the last tag, to name what shipped.
2. Group those changes by user-visible effect, to draft the notes.
3. Show the draft and wait for confirm, so a file is written only after the user says yes.
```

## 7. Check

Before you finish:

- The description states what and when, in the third person, with the phrases a user types, and names a nearby skill when one owns the adjacent job
- An internal name stays out of the description
- Each instruction has a verb, the work, and the result
- The skill runs when called alone
- A missing required file is named, and the skill stops
- A message the user reads has a heading that names what the user gets, and one shape
- The shape uses the user's view: the status, the reason, and the change
- A definition is a link to the file that owns it
- `<name>` follows the name rule
- Verbatim user wording is unchanged
- The body is under 500 lines and uses one term per concept
- File links are one level deep
- No instruction carries a date
- Every path uses a forward slash
- Every file is inside the confirmed folder `{client_root}/{skills_dir}/<name>/`

## 8. Test prompts

Propose 2 or 3 prompts a real user would type. Ask whether they look right, then stop, so the user decides whether the skill is usable.

Stop after those prompts, so no eval harness, grader, description optimizer, or package step runs.

## 9. Constants row

After the skill folder is written, you may propose one key for the `skills` object in `{client_root}/templates/framework.sdd.works/constants.json`: skill key and folder. Wait for a second confirm before editing that file. Leave the product backlog and the sprint backlog unchanged.
