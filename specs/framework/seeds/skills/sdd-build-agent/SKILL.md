---
name: sdd-build-agent
description: >
  Create or revise an agent file at {client_root}/{agents_dir}/<name>.md.
  Use when the user wants a new agent, a coach, or an assistant file, or asks
  how an agent prompt should be structured. Writes only after the user confirms
  the file path. A skill file is sdd-create-skill. Product code for an SBI is
  sdd-spec-to-build.
---

# Build an agent

The user gets one agent file after they confirm the path.

This skill adds the pack path, the file shape, and that confirm.

Read the TRUE AGENT section in `framework-design.md` before you write, so the agent file follows that section. Leave that section in `framework-design.md`, so this skill and the agent file have no copy of it.

## State what the agent is for

Read the conversation, to state the agent's purpose, the host actions, the file it reads, and what waits for a yes.

Ask only what is still unknown:

- What the agent is for
- Which host actions it needs
- Which file it should read when a step needs that knowledge
- What it is allowed to do, and what needs a confirm
- What the reply must contain

A capability is a host action the tool already offers.

- Name the host actions the job needs, so a missing action is the only reason to add one.
- Leave a new tool, server, and loop out, so the host actions stay the ones the tool already offers.
- Rewrite a step sequence as capabilities and limits, so the agent file has no numbered procedure.

Keep the names and limits the user gave, so those words stay in the file.

Show the rewrite, and wait for a yes, so the file uses the rewrite the user confirmed.

Chat in the language of the user's request.

## Choose the file path

Choose `<name>` from lowercase letters, numbers, and hyphens, at most 64 characters, so the file name matches the pack rule.

Name `client_root` as the parent of the loaded agent file, so the path starts at that file.

Read `agents_dir` from `{client_root}/templates/framework.sdd.works/constants.json`, so the folder name comes from that file.

## Stop when the pack lookup is missing

If that `constants.json` cannot be read, or `agents_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.json`.

- Stop before writing a file, so the pack stays unchanged.
- Stop before assuming the folder name `agents`, so the path comes from `constants.json`.
- Stop before copying a replacement `constants.json`, so the user's file stays as it is.
- Leave `{client_root}/.sdd-installed.json` unchanged.

## Place the agent file

Write `{client_root}/{agents_dir}/<name>.md`, so the agent file sits in the pack.

Revise the existing file in place and keep the name, so one agent keeps one file.

- Leave the agent file off the workspace, so the pack stays on the client root.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- Leave a second runtime unstarted, so the host keeps the loop.

A request for a skill file belongs to `sdd-create-skill`. A request to design or implement a sprint backlog item belongs to `sdd-spec-to-build`.

## Confirm the file path

State the file path and the rewrite, when there is one, so the user can confirm that path. Wait for the user to confirm.

- A request to build an agent still needs that yes.
- One yes covers that file.
- Write the file only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## Write the confirmed agent file

### Write the description the host shows

- Frontmatter is `name` and `description` only, so the host reads those two fields.
- Add a tool-specific invocation flag only when the user names a tool that requires it.
- Write the description in the third person, so the file states what the agent does.
- Include the phrases a user types, so those phrases trigger the agent.
- Name the other agent or skill when it owns a nearby job, so the user opens the file that owns that job.
- Keep the description under 1024 characters, so the host can load it.

### State capabilities and limits

- State capabilities and limits in the body, so the model chooses the next step.
- Explain why a limit matters, so the agent file states the reason for the wait.
- Leave a numbered procedure out of the agent file, so the sequence stays with the model.
- Name the file the agent reads, so the prompt stays free of that text.
- Use one term for one concept, so the same row keeps one name.
- Use a forward-slash path, so the path opens on the host.
- Leave the date off an instruction, so the instruction stays usable later.

### Show the draft the user confirms

The user reads the notes since the last tag, grouped by what the user sees. A yes writes that draft to the file the user confirmed.

```markdown
---
name: release-notes
description: >
  Draft release notes from merged changes since the last tag. Use when the user
  asks for release notes, a changelog entry, or what shipped in a version.
---

# Release notes

Capabilities: read the merged changes since the last tag, and group them by what the user sees.

Limits: a yes writes that draft to the confirmed file.
```

## Check the file

Before you finish:

- The description states what and when, in the third person, with the phrases a user types, and names a nearby skill or agent when one owns the adjacent job
- `<name>` follows the name rule
- Names and limits the user gave are unchanged
- A step sequence from the user is capabilities and limits, and the user confirmed that rewrite
- The body states capabilities and limits, so the model chooses the next step
- Long knowledge is a file name, so the prompt stays free of that text
- A tool-specific invocation flag is present only when the user named the tool
- No instruction carries a date, so the instruction stays usable later
- Every path uses a forward slash, so the path opens on the host
- The only write is the confirmed file `{client_root}/{agents_dir}/<name>.md`
- The user sees no new skill key. The `skills` object stays as it is.

## Propose the prompts

Propose 2 or 3 prompts a real user would type. Ask whether the prompts look right, so the user can accept or change them.

Stop after the prompts, so no test run starts, the user decides whether the agent is usable, and no eval harness, grader, or package step runs.

Leave the `skills` object unchanged, so an agent file adds no skill key. A row for this skill is a separate edit, and only after its own confirm.
