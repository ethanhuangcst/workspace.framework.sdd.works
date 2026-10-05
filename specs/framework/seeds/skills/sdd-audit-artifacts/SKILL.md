---
name: sdd-audit-artifacts
description: >
  Read-only audit of the project's process files. Use during onboard after the
  install ledger passes, or when the user asks whether the project files and
  artifacts-map.json match. Returns one verdict: Uninitialized, Index broken, or
  Usable, with the paths opened, the paths that failed, and locale. Does not
  create or edit a project file or the install ledger. sdd-review-status reads
  status after a Usable verdict. This skill does not report status.
---

# Audit artifacts

Return one verdict, so the user sees Uninitialized, Index broken, or Usable.

- Read files, so the verdict comes from what opened.
- Leave every project file unchanged, so this skill does not repair the map.

## Process files

The five process files are `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

## Steps

### 1. Read the workspace map

Read `{workspace}/artifacts-map.json`, so the audit uses the workspace-root map.

- Leave a map under a template folder unread, so a seed copy is not the project map.
- Leave another case folder unread, so one run uses one workspace.
- Leave `results.md` unread, so a past score does not change the verdict.

#### Return Index broken when the map cannot be read

Return `Index broken`, so a map that cannot be read stops the audit.

- Report `artifacts-map.json` as failed, so the report block names the unreadable file.
- Leave the five process files unopened, so a permission error does not become a path result.
- Leave `locale` out of the report block, so an unread map does not report a language.
- Treat invalid JSON as an unreadable file, so the verdict is `Index broken`.

### 2. Open each stored path

Open each stored path, so the verdict uses the paths the map names.

- Read strings in `files` and in each module `files` list, so those strings are the stored paths.
- Open each stored path as `{workspace}/<path>`, so the file is the one the map names.
- Leave `artifacts_root`, `locale`, `adr`, and `knowledge` unopened as file paths, so those keys stay settings or directory roots.
- Leave `artifacts_root` off the front of a path, so a stored path is not prefixed twice.
- Leave an absolute path as stored, so a machine path stays the path that failed or opened.
- Report a stored path that does not open as failed, so the report block names that path.
- Leave a second copy of that file unread, so another folder does not change the verdict.

#### Check adr and knowledge roots

When the map names `adr` or `knowledge`, check each root as a directory under `{workspace}`.

- When the path is a directory, list it under `opened`, so the report block names the root.
- When the path is missing or not a directory, list it under `failed`, so the report block names the root.
- A missing or broken adr or knowledge root does not alone change the verdict from `Usable` when the five process files still open from the map. [ADR-090](../../../../adr/ADR-090-adr-knowledge-map-roots.md).

### 3. Search specs when the map is missing

Search `{workspace}/specs/`, so a missing map still has one place to look.

- Look for the five process files only under `{workspace}/specs/` when `{workspace}/artifacts-map.json` is missing, so the search stays in the default specs folder.
- Leave a copy under `docs/` or any other folder unread, so a file outside `specs/` does not count.

### 4. Choose the verdict

Choose one row, so the report block has one verdict.

| What opened | Verdict |
| --- | --- |
| `{workspace}/artifacts-map.json` is missing, and none of the process files open under `specs/` | `Uninitialized` |
| `{workspace}/artifacts-map.json` is present, and the map lists no process-file path | `Uninitialized` |
| `{workspace}/artifacts-map.json` exists and cannot be read | `Index broken` |
| A stored path in `files` or in a module `files` list fails to open | `Index broken` |
| At least one process file opens, and `{workspace}/artifacts-map.json` is missing or a stored process-file path does not open | `Index broken` |
| `{workspace}/artifacts-map.json` opens the process files the map lists, including `status.md` and `sprint-backlog.md` | `Usable` |

#### Keep the verdict token

Keep the token as one of three words, so every host reports the same verdict.

- Use `Uninitialized`, `Index broken`, or `Usable`, so the token is one of those three words.
- Leave the token untranslated, so the word stays the same on every OS and in every locale.
- Leave a slash or a backslash in the workspace path out of the verdict, so the path does not change the token.

### 5. Report the locale

Report `locale` after `{workspace}/artifacts-map.json` opened, so the report block names the language the map stores.

| `locale` key | Report |
| --- | --- |
| Key missing | `empty` |
| `EN`, `HanS`, or `HanT` | The stored value |
| Any other value, such as `FR` | The stored value in quotes |

- Leave the verdict unchanged when `locale` is missing or unknown, so the language does not change the row in the verdict table.

## Report the verdict

The user reads this block. The block names the verdict, what opened, and what failed.

- Keep the labels in this order: `verdict`, `locale`, `opened`, `failed`, so every locale uses the same labels.
- Keep each value as stored, so the report block does not rename a path.
- Leave the block as labels and values, so the report block is the whole message.

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

### Keep these lines in the report block

- Include the `locale` line only after `{workspace}/artifacts-map.json` opened, so an unread map has no language line.
- Include `opened` on every report block, so the block always names what opened.
- Include `failed` on every report block, so the block always names what failed.
- Write `none` for an empty list, so an empty list is a word.
- Write each path on its own line, so one line is one stored path.

### Quote a locale that is not EN, HanS, or HanT

Use this block when `locale` is not `EN`, `HanS`, or `HanT`, so the stored value stays in quotes.

```text
verdict: Usable
locale: "FR"
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

### Show a map that cannot be read

A permission error on `{workspace}/artifacts-map.json` returns this block, so the report block has no `locale` line.

```text
verdict: Index broken
opened:
- none
failed:
- artifacts-map.json
```

## Limits

- Leave a project file uncreated and unedited, so the audit stays a read.
- Leave `{client_root}/.sdd-installed.json` unchanged, so the install ledger stays as it is.
- Leave `sdd_install_framework` and `sdd_update_framework` uncalled, so install stays outside this skill.
- Leave `artifacts-map.json` unwritten, so a failed path stays in the report block.
