---
name: sdd-build-agent
description: >
  Create or revise an agent file at {client_root}/{agents_dir}/<name>.md.
  Use when the user wants a new agent, a coach, or an assistant file, or asks
  how an agent prompt should be structured. Writes only after the user confirms
  the file path. A skill file is sdd-create-skill. Product code is sdd-implement.
---

# Build an agent

An agent file is a prompt the host already runs. This skill adds the pack path, the file shape, and the confirm-before-write rule. Read the TRUE AGENT section in the framework design before you write. That section stays there. Do not copy it into this skill or into the agent file.

## 1. Discover

Infer purpose from the conversation. Ask only what is still unknown:

- What the agent is for
- Which host actions it needs
- Which file it should read when a step needs that knowledge
- What it is allowed to do, and what needs a confirm
- What the reply must contain

A capability is a host action the tool already offers. Start with the smallest set that can do the job. Add one only when the agent cannot do the job without it. Do not invent a tool, a server, or a loop. Do not collect a workflow.

If the user gives exact names or limits, keep those words. If they hand over a step sequence, rewrite it as capabilities and limits, show that rewrite, and wait for confirm before it becomes the file. Chat in the locale the audit reported.

## 2. Name and path

Choose `<name>`: at most 64 characters, lowercase letters, numbers, and hyphens.

`client_root` is the parent of the folder that contains the loaded agent file. Do not name a tool folder. Read `agents_dir` from the Paths table in `{client_root}/templates/framework.sdd.works/constants.md`.

## 3. Stop when the pack lookup is missing

If that `constants.md` cannot be read, or `agents_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.md`.

- Do not write any file.
- Do not assume the folder name `agents`.
- Do not copy a replacement `constants.md`.
- Do not change `{client_root}/.sdd-installed.json`.

## 4. Where the file goes

Write `{client_root}/{agents_dir}/<name>.md`.

When that file already exists, revise it in place and keep `name`. Do not create a second file.

Do not create a workspace agent file. Do not copy the agent into the workspace. Do not call `sdd_install_framework` or `sdd_update_framework`. Do not start a Python loop, an API server, or any other runtime. The host already runs the loop.

A request for a skill file belongs to `sdd-create-skill`. A request to implement product code belongs to `sdd-implement`.

## 5. Confirm the path

State the file path and the rewrite, when there is one. Wait for the user to confirm.

A request to build an agent is not this confirm. One yes covers that file. The file is written only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## 6. Write the agent file

Frontmatter is `name` and `description` only. Do not add a tool-specific invocation flag unless the user names a tool that requires it.

The description is third person. State what the agent does and when to use it, including the phrases that should trigger it. When another agent or skill owns a nearby job, name it. Keep it under 1024 characters. Do not write it as "I can" or "you can".

The body states capabilities and limits. Explain why a limit matters. A numbered procedure that the model must follow is a workflow. Leave the sequence to the model. The agent file does not link to the framework design.

When the knowledge is long, name the file the agent reads when the step needs it. Do not paste that material into the prompt.

Use one term for one concept. Use forward-slash paths. Do not date an instruction.

Example:

```markdown
---
name: release-notes
description: >
  Draft release notes from merged changes since the last tag. Use when the user
  asks for release notes, a changelog entry, or what shipped in a version.
---

# Release notes

Capabilities: read merged changes since the last tag, group them by user-visible effect, show a draft.

Limits: wait for confirm before writing a file.
```

## 7. Check

Before you finish:

- The description states what and when, in third person, with trigger phrases, and names a nearby skill or agent when one owns the adjacent job
- `<name>` follows the name rule
- Names and limits the user gave are unchanged
- A step sequence from the user was rewritten into capabilities and limits, and the user confirmed that rewrite
- The body states capabilities and limits, and does not prescribe a workflow
- Long knowledge is a file name, not a paste into the prompt
- There is no tool-specific invocation flag unless the user named the tool
- There is no dated instruction and no backslash path
- The only write is the confirmed file `{client_root}/{agents_dir}/<name>.md`
- No row was proposed for the Skills table

## 8. Test prompts

Propose 2 or 3 prompts a real user would type. Ask whether they look right, then stop. Do not run them. Do not say the agent is usable; the user decides that. Do not run an eval harness, a grader, or a package step.

Do not propose a Skills-table row for the agent file. A row for this skill is a separate edit, and only after its own confirm.
