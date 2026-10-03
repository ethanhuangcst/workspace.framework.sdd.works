---
name: sdd-audit-artifacts
description: >
  Read-only audit of the project's process files. Use during onboard after the
  install ledger passes, or when the user asks whether the project files and
  artifacts-map.md match. Returns one verdict: Uninitialized, Index broken, or
  Usable, with the paths opened, the paths that failed, and locale. Does not
  create or edit a project file or the install ledger. sdd-review-status reads
  status after a Usable verdict. This skill does not report status.
---

# Audit artifacts

The verdict decides what Ethan does next.

- The skill only reads.
- The skill does not repair.

## Process files

The skill uses the names `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md`.

## Steps

### 1. Workspace file

The skill reads `{workspace}/artifacts-map.md`.

- The skill reads `{workspace}/artifacts-map.md` only.
- The skill does not read `artifacts-map.md` under a template folder.
- The skill does not open another case folder.
- The skill does not read `results.md`.

#### Unreadable file

The verdict is `Index broken`.

- A permission error means `{workspace}/artifacts-map.md` cannot be read.
- The skill reports `artifacts-map.md` as failed.
- The skill does not open `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, or `issues-log.md`.
- The skill does not report `locale`.

### 2. Stored paths

The skill opens each stored path in `{workspace}/artifacts-map.md`.

- The skill opens each stored path as `{workspace}/<path>`.
- The skill does not prefix `artifacts_root`.
- The skill does not strip an absolute machine path down to a relative one.
- When an open fails, the skill reports the stored path as failed.
- The skill does not use another copy of the file.

### 3. Missing file

The skill searches one folder.

- When `{workspace}/artifacts-map.md` is missing, the skill looks for `product-backlog.md`, `sprint-backlog.md`, `status.md`, `changes-log.md`, and `issues-log.md` only under `{workspace}/specs/`.
- The skill does not open a copy under `docs/` or any other folder.

### 4. Verdict

The skill chooses one verdict.

| What opened | Verdict |
| --- | --- |
| `{workspace}/artifacts-map.md` is missing, and none of the process files open under `specs/` | `Uninitialized` |
| `{workspace}/artifacts-map.md` is present, and `artifacts-map.md` lists no process-file path | `Uninitialized` |
| `{workspace}/artifacts-map.md` exists and cannot be read | `Index broken` |
| A stored path fails to open | `Index broken` |
| At least one process file opens, and `{workspace}/artifacts-map.md` is missing or a stored path does not open the process file | `Index broken` |
| `{workspace}/artifacts-map.md` opens the process files `artifacts-map.md` lists, including `status.md` and `sprint-backlog.md` | `Usable` |

#### Failed stored path

The verdict stays `Index broken` when `opened` is `none`.

- A stored path that fails is `Index broken`.
- `{workspace}/artifacts-map.md` names a file that does not open.
- The skill does not open another copy to change the verdict.

#### Verdict token

The token stays one of three words.

- The verdict token is `Uninitialized`, `Index broken`, or `Usable` on every OS and in every locale.
- The skill does not translate the token.
- A slash or backslash in the workspace path does not change the verdict.

### 5. Locale

The skill reports `locale` only after `{workspace}/artifacts-map.md` opened.

| `artifacts-map.md` field `locale` | Report |
| --- | --- |
| Field missing | `empty` |
| `EN`, `HanS`, or `HanT` | The stored value |
| Any other value, such as `FR` | The skill quotes the stored value and does not rewrite the value to `EN` |

#### Empty or unknown locale

An empty `locale` keeps the verdict.

- An unknown `locale` keeps the verdict.

## Reply

The skill returns the report block.

- The labels stay `verdict`, then `locale`, then `opened`, then `failed`, in every locale.
- Values stay as stored.
- Sentences to the user stay outside the report block.

```text
verdict: Usable
locale: EN
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

### Report block lines

The report block keeps five rules.

- The `locale` line is present only after `{workspace}/artifacts-map.md` opened.
- `opened` is always present.
- `failed` is always present.
- An empty list is the word `none`.
- Each path is the stored path text, one path per line.

### Unknown locale

The skill quotes the stored value.

- `FR` is reported as `"FR"`.

```text
verdict: Usable
locale: "FR"
opened:
- specs/status.md
- specs/sprint-backlog.md
failed:
- none
```

### Unreadable-file report block

A permission error on `{workspace}/artifacts-map.md` returns the unreadable-file report block.

- The report block has no `locale` line.

```text
verdict: Index broken
opened:
- none
failed:
- artifacts-map.md
```

## Do not

The skill does not write.

- The skill does not create or edit a project file.
- The skill does not change `{client_root}/.sdd-installed.json`.
- The skill does not call the MCP tools `sdd_install_framework` or `sdd_update_framework`.
- The skill does not write a rule that updates `artifacts-map.md`.
