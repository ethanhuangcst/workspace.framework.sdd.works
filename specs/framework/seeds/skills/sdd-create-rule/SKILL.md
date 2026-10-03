---
name: sdd-create-rule
description: >
  Create or revise a pack rule as <name>.mdc under {client_root}/{rules_dir}/.
  Use when the user wants a new rule, wants to change an existing rule, asks
  how a rule file should be structured, or says to turn a principle into a rule.
  Writes only after the user confirms the rule file path. A skill file is
  sdd-create-skill. Feature implementation is sdd-implement. SBI design is
  sdd-design.
---

# Create a rule

A rule is one `.mdc` file the host loads as standing guidance. The agent already knows how to write a short policy. This skill adds the pack path, the file shape, and the confirm-before-write rule.

## 1. Discover

Infer the policy from the conversation. Ask only what is still unknown:

- What the rule enforces
- Whether it applies to every session, or only when certain files are open
- When it is limited to files, the glob the user names
- An existing rule to follow

If the user gives exact wording, copy it verbatim: same words, same order, same language.

## 2. Name and path

Choose `<name>`: at most 64 characters, lowercase letters, numbers, and hyphens. Do not add an `sdd-` prefix. The file is `<name>.mdc`.

`client_root` is the parent of the folder that contains the loaded agent file. Do not name a tool folder. Read `rules_dir` from `{client_root}/templates/framework.sdd.works/constants.json`.

## 3. Stop when the pack lookup is missing

If that `constants.json` cannot be read, or `rules_dir` is missing or blank, stop. Tell the user the pack lookup is missing and name `{client_root}/templates/framework.sdd.works/constants.json`.

- Do not write any file.
- Do not assume the folder name `rules`.
- Do not copy a replacement `constants.json`.
- Do not change `{client_root}/.sdd-installed.json`.

## 4. Where the file goes

- New rule: `{client_root}/{rules_dir}/<name>.mdc`.
- That file already exists: revise it in place and keep `<name>`. Do not create a second file.
- Do not write a copy under the workspace, a project rules folder, or a built-in skills directory.

Do not call `sdd_install_framework` or `sdd_update_framework`.

## 5. Confirm the file

State the file path. Wait for the user to confirm.

A request to create a rule is not this confirm. One yes covers that file. A pack file is written only after the user agrees to that path, because the installed pack is shared by every project that uses this client root.

## 6. Write the rule

Frontmatter is `description` and `alwaysApply`. When the user limits the rule to files, also set `globs` to the pattern they named and set `alwaysApply` to false. Do not add a tool-specific invocation flag.

`description` is one sentence. The body is one concern and stays under 50 lines. Include a good example and a bad example when the rule is about a pattern. Keep lists tight: the continuation sits on the next indented line, with no blank line between them. Do not write a raw HTML anchor.

Use forward-slash paths. Do not date an instruction. Do not name a tool store or a built-in skills directory.

## 7. Check

Before you finish:

- The description states what and when, in third person, with trigger phrases, and names `sdd-create-skill` for skill files
- `<name>` follows the name rule and has no `sdd-` prefix
- Verbatim user wording is unchanged
- The rule body is under 50 lines and uses one term per concept
- `alwaysApply` is true, or it is false and `globs` is the pattern the user named
- The only write is the confirmed file `{client_root}/{rules_dir}/<name>.mdc`

## 8. Test prompts

Propose 2 or 3 prompts a real user would type. Ask whether they look right, then stop. Do not run them. Do not say the rule is usable; the user decides that.

## 9. Constants row

After the rule file is written, you may propose one row for the Rules table in `{client_root}/templates/framework.sdd.works/constants.json`: rule key and file name. Wait for a second confirm before editing that file. Do not edit the product backlog, the sprint backlog, or the scrum guide in that write.
