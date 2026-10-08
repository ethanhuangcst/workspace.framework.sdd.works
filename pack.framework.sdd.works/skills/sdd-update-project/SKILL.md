---
name: sdd-update-project
description: >
  Set the language, the specs folder, ADR and Knowledge roots, and the module
  folders for a project, then write artifacts-map.json after the user confirms
  the tree. Recommends copying the .secrets seed to {artifacts_root}/.secrets
  when the product uses database, API, or auth secrets. Use when the user
  starts a project, updates project settings, sets the specs folder, or changes
  the language of future specs. sdd-audit-artifacts checks whether
  artifacts-map.json matches the files and does not write them.
  sdd-review-status compares the plan with the work and does not set the map.
---

# Update project settings

The skill sets `locale`, `artifacts_root`, optional `adr` and `knowledge` roots, and the modules, then writes `{workspace}/artifacts-map.json`.

`artifacts_root` is one folder name relative to the workspace. `specs` is the default.

Each module has a `files` list (required). `folder` and `stem` are optional. Rules and examples in `sdd-scrum-practices.md`, section **artifacts-map.json**, cover foldered, flat + stem, and singleton layouts.

The secret name registry lives at `{workspace}/{artifacts_root}/.secrets`, not at workspace root. Practices `#secrets` defines the dotenv-shaped body. This skill does not duplicate that shape.

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
  Omit `adr` and `knowledge` until tasks 5 and 6 set them.
  Leave the Pokymon Card Collection example uncopied, so this project does not receive that product's paths.
  This starter write does not wait for the task 8 confirm.
- When `{workspace}/artifacts-map.json` is present, leave the file unchanged, so this step does not overwrite an existing map.

### 2. Read the workspace

Read the workspace the user named, to list folders that can hold specs.

- Ask one question when the workspace has more than one folder that can hold specs, so the next task uses the user's answer.
  The user reads: "Which of these folders are the spec root for a sub-system or a module? A spec root is the folder that holds that part's specs. A folder you skip stays in the project. Nothing is deleted."
- Name each part in words the user uses, such as the operator app, so the question does not say stem, map, or keep.
- Use AskQuestion when the host provides it, so the user picks from those parts.
- Leave the pack seed tree unread as this project's specs, so a seed copy is not treated as the project.

### 3. Set the locale

List the languages already used in the project's spec files, to show the user what exists.

- Ask which language future specs use.
  The user reads: "Which language should future specs use? English, Simplified Chinese, or Traditional Chinese."
- Store English as `EN`, Simplified Chinese as `HanS`, and Traditional Chinese as `HanT`, so the file key stays `locale`.
- Keep the chosen value for task 8, so the map receives one `locale`.
- Leave the language of an existing spec file unchanged, so a current file stays in its current language.

### 4. Set artifacts_root

List the candidate folders, so the user can pick `artifacts_root`.

- Propose `specs` when the project is new, or when no candidate folder exists, so the user still has one default.
- Create the chosen folder only after the user asks for that folder, so an unasked folder stays uncreated.
- Keep the chosen name for task 8, so the map receives one `artifacts_root`.
- Store the folder name, such as `specs`, so `artifacts_root` does not hold a full path.

### 5. Set ADR root

Tell the user what the ADR root is for, then ask whether to store it in the map.

- The user reads: "ADR root — An ADR (Architecture Decision Record) is a durable decision about how the product is built or run. The adr key in artifacts-map.json is the folder where those records live. It is part of process knowledge, alongside the five process files."
- Propose `{artifacts_root}/adr` as the default path, so the key matches the usual layout.
- When that directory already exists, say so and keep the default unless the user changes it.
- Ask whether to include this ADR root in the map. When the user says no, omit the `adr` key in the write pass.
- Create the directory only after the user asks to create it, so an unasked folder stays uncreated.
- Keep the chosen path for task 8 when the user included it.

### 6. Set Knowledge root

Tell the user what the Knowledge root is for, then ask whether to store it in the map.

- The user reads: "Knowledge root — Knowledge notes capture what the team learned while doing the work: research, ops lessons, and agent runbooks. The knowledge key in artifacts-map.json is the folder for those notes."
- Propose `{artifacts_root}/knowledge` as the default path, so the key matches the usual layout.
- When that directory already exists, say so and keep the default unless the user changes it.
- Ask whether to include this Knowledge root in the map. When the user says no, omit the `knowledge` key in the write pass.
- Create the directory only after the user asks to create it, so an unasked folder stays uncreated.
- Keep the chosen path for task 8 when the user included it.

### 7. Set the modules

List the candidate parts of the product, so the user can pick the modules.

- Ask whether each module's design, stories, and tests live in a subfolder under `{artifacts_root}` or directly under `{artifacts_root}`. Follow the three layouts in `sdd-scrum-practices.md`, section **artifacts-map.json**.
- **Subfolder:** set `folder`, optional `stem` when the filename prefix differs from `folder`, and `files` as `{artifacts_root}/{folder}/{stem}-design.md` (and stories, tests). Create the subfolder only after the user asks.
- **Flat + stem:** omit `folder`, set `stem`, and `files` as `{artifacts_root}/{stem}-design.md` (and stories, tests).
- **Singleton:** when the map will have exactly one module entry, the user may choose `design.md`, `stories.md`, and `tests.md` under `{artifacts_root}` with no `folder` and no `stem`.
- Read the Confirm summary in [artifacts-map.json](../../templates/sdd-scrum-practices.md#artifacts-mapjson), so module paths match the chosen layout.
- Keep each module for task 8.

### 7b. Decide whether to recommend `.secrets`

Pick whether task 8 includes `{artifacts_root}/.secrets` in the Confirm summary.

- When the workspace has a typical software stack manifest, such as `package.json`, a lock file, `pyproject.toml`, `go.mod`, or `docker-compose.yml`, recommend `.secrets` for task 8.
- When the workspace is empty or has no stack manifest to infer a software product, ask one question before task 8 Confirm.
  The user reads: "Will this product use secrets, for example a database URL, API keys, or auth? "
- When the user says yes, include `{artifacts_root}/.secrets` in the Confirm summary.
- When the user says no, omit `{artifacts_root}/.secrets` from the Confirm summary.

### 8. Confirm, then write

Read only [artifacts-map.json](../../templates/sdd-scrum-practices.md#artifacts-mapjson) in `{client_root}/templates/framework.sdd.works/sdd-scrum-practices.md`. When `locale` is missing, use `EN`. Start at that heading. Stop at the next heading of the same level. Do not read the rest of that file.

- Show the Confirm summary from that section, filled with the user's answers, so the user sees the settings before a write.
- In that summary, write Language and the language name, so the user does not read `locale`. The file still stores `locale`.
- In that summary, name each spec root. A folder you skip stays in the project. Nothing is deleted.
- Include `adr:` and `knowledge:` lines only when the user included those roots in tasks 5 and 6.
- When task 7b recommends `.secrets`, include `{artifacts_root}/.secrets` under `files:` in the Confirm summary.
- When task 7b recommends `.secrets`, tell the user that line lists secret **names** only and is recommended when the product uses a database, API keys, or auth. The user opts out by removing that line before yes.
- The Pokymon Card Collection block in that section is an example. Leave that product name out of this project, so the map uses the name the user gave.
- Wait for a yes before replacing `{workspace}/artifacts-map.json` with the confirmed tree.
- Write the JSON from the Shape and Rules in that section, so the map matches the configuration.
- Store each file as a workspace-relative path, such as `specs/mcp/mcp-design.md`.
- When the confirmed summary included `{artifacts_root}/.secrets`, add that path to `files[]`.
- When the confirmed summary omitted `{artifacts_root}/.secrets`, do not add that path to `files[]` unless it was already on the map.
- Copy a seed only where the target file is missing, so a file that already has content stays as it is.
- Copy `test-strategy.md` only when that seed exists and the target is missing, so the skill does not invent the body.
- Copy `.secrets` from `{client_root}/templates/framework.sdd.works/{locale}/.secrets` to `{workspace}/{artifacts_root}/.secrets` only when the confirmed summary included that path and the target file is missing.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger keeps its current text.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.

When the user does not confirm the tree, leave the task 1 file in place, so the starter map stays. A folder the user already asked to create stays created.

## Limits

- Do not place `.secrets` at workspace root. Use `{artifacts_root}/.secrets` only.
- Do not write secret values into `.secrets`. Do not create, edit, or overwrite `.env`, `.env.local`, or `.env.example`.
- Do not overwrite an existing `.secrets` file that already has content.

## Anti-patterns

- A `.secrets` file at the repo root while the map points at `{artifacts_root}/.secrets`.
- Copying `.secrets` when the user removed that line from the Confirm summary.
- Pasting API keys or passwords into `.secrets` during onboarding.
