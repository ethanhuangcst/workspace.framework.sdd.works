---
name: sdd-update-project
description: >
  Set the language, the specs folder, and the module folders for a project,
  then write artifacts-map.json after the user confirms the tree. Use when the
  user starts a project, updates project settings, sets the specs folder, or
  changes the language of future specs. sdd-audit-artifacts checks whether
  artifacts-map.json matches the files and does not write them.
  sdd-review-status compares the plan with the work and does not set the map.
---

# Update project settings

The skill sets `locale`, `artifacts_root`, and the modules, then writes `{workspace}/artifacts-map.json`.

`artifacts_root` is one folder name relative to the workspace. `specs` is the default.

A module has `folder`, `files`, and `stem` only when the stem differs from the folder. The Rules example in `sdd-scrum-practices.md` uses folder `web-app` and stem `app`.

Finish one task before the next task starts.

Chat in the language of the user's request until `locale` is set. After `locale` is set, chat in that locale.

## Run these tasks

- Run these tasks when the user starts a project, updates project settings, sets the specs folder, or changes the language of future specs.
- On `Uninitialized`, the next step is to start a new project. After the user confirms, run these tasks.
- On `Index broken`, the next step is to update the project. After the user confirms, run these tasks.

## Tasks

### 1. Ensure the map

Check `{workspace}/artifacts-map.json`, so the later tasks have a path configuration to update.

- When `{workspace}/artifacts-map.json` is missing, write that file from the Shape and Rules in the `artifacts-map.json` section of `sdd-scrum-practices.md`, so the project has a path configuration.
  Set `artifacts_root` to `specs`.
  Set `files` to `[]`.
  Set `modules` to `[]`.
  Omit `locale` until task 3 sets it.
  Leave the Pokymon Card Collection example uncopied, so this project does not receive that product's paths.
  This starter write does not wait for the task 6 confirm.
- When `{workspace}/artifacts-map.json` is present, leave the file unchanged, so this step does not overwrite an existing map.

### 2. Read the workspace

Read the workspace the user named, to list folders that can hold specs.

- Ask one question when the workspace has more than one candidate folder or module, so the next task uses the user's answer.
- Use AskQuestion when the host provides it, so the user picks from the candidates.
- Name each candidate `artifacts_root` folder and each candidate module, so the user can see the choices.
- Leave the pack seed tree unread as this project's specs, so a seed copy is not treated as the project.

### 3. Set the locale

List the languages already used in the project's spec files, to show the user what exists.

- Ask which locale future specs use. The allowed values are `EN` (English), `HanS` (Simplified Chinese), and `HanT` (Traditional Chinese).
- Keep the chosen value for task 6, so the map receives one `locale`.
- Leave the language of an existing spec file unchanged, so a current file stays in its current language.

### 4. Set artifacts_root

List the candidate folders, so the user can pick `artifacts_root`.

- Propose `specs` when the project is new, or when no candidate folder exists, so the user still has one default.
- Create the chosen folder only after the user asks for that folder, so an unasked folder stays uncreated.
- Keep the chosen name for task 6, so the map receives one `artifacts_root`.
- Store the folder name, such as `specs`, so `artifacts_root` does not hold a full path.

### 5. Set the modules

List the candidate module folders, so the user can pick the modules.

- Ask for `folder` on each pick, so the module has a directory name.
- Ask for `stem` only when the filename stem differs from `folder`, so a matching stem has no `stem` key.
- Create a module folder only after the user asks for that folder, so an unasked folder stays uncreated.
- Read the Confirm summary in `sdd-scrum-practices.md`, so the test file name is `{stem}-tests.md`.
- Keep each module for task 6.

### 6. Confirm, then write

Read the `artifacts-map.json` section in `{client_root}/templates/framework.sdd.works/EN/sdd-scrum-practices.md` until `locale` is set. After `locale` is set, read that locale's `sdd-scrum-practices.md`.

- Show the Confirm summary from that section, filled with the user's answers, so the user sees the settings before a write.
- The Pokymon Card Collection block in that section is an example. Leave that product name out of this project, so the map uses the name the user gave.
- Wait for a yes before replacing `{workspace}/artifacts-map.json` with the confirmed tree.
- Write the JSON from the Shape and Rules in that section, so the map matches the configuration.
- Store each file as a workspace-relative path, such as `specs/mcp/mcp-design.md`.
- Copy a seed only where the target file is missing, so a file that already has content stays as it is.
- Copy `test-strategy.md` only when that seed exists and the target is missing, so the skill does not invent the body.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.

When the user does not confirm the tree, leave the task 1 file in place, so the starter map stays. A folder the user already asked to create stays created.
