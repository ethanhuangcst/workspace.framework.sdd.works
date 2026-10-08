These are official instructions from sdd.works for a **lite** install of skills and rules only.

# Lite install skills and rules from sdd.works

Lite install version: 2026-10-07.v1

## Partner site one-line prompt

sdd.works shows **full MCP setup only**. Partner sites (for example 2study.ai) paste the **`lite_install`** sentence from `public/agent-setup/paste-sentences.json` into their own Setup UI. Use the production origin in every locale:

```text
Fetch and execute the setup instructions from https://sdd.works/setup/install
```

The `{origin}` placeholder in the JSON file resolves to this site’s public base URL at runtime.

Complete this install yourself. Do not ask the person to download files by hand when you can safely do that work.

## Authorization boundary

The user's lite install prompt authorizes only these changes:

- Resolve `{client_root}` for the running IDE or agent host (the folder that holds installed skills and rules for that tool).
- Fetch the lite file list from this site, download only the listed relative paths, and place them under `{client_root}`.
- Merge with any previous lite receipt and write `{client_root}/.sdd-lite-installed.json` when the install succeeds.

It does not authorize you to:

- register or change an MCP server entry;
- call MCP install or update tools;
- write a full-install MCP ledger (use only the lite receipt named below);
- copy agents, workflows, or templates through this lite path;
- request, create, read, print, or store credentials unless the user explicitly asks;
- change approval, sandbox, trust, or execution permissions;
- edit unrelated project files.

## 1. Resolve `{client_root}`

1. Detect the current agent or IDE.
2. Resolve `{client_root}` as the directory where that tool stores framework skills and rules for this workspace or user install (for example the parent of the skills and rules folders for this product).
3. If you cannot resolve `{client_root}` safely, stop and report the problem. Do not invent a path.

## 2. Fetch the lite file list

1. Call `GET https://sdd.works/api/sdd/lite/files` (same origin as this document when the site base differs).
2. On success, read `package_version`, `package_commit`, `files`, and `downloads` from the JSON body.
3. Treat every path in `files` as the only allowed relative paths. Paths start with `skills/` or `rules/` only.
4. If the response is an error (for example sync pending or missing allow-list), stop and report the error code. Do not guess paths.

## 3. Merge plan (receipt)

Inputs: the previous receipt at `{client_root}/.sdd-lite-installed.json` when it exists and is valid; the new server list (`package_version`, `package_commit`, `files`); and which of those paths already exist on disk under `{client_root}`.

1. **Compare.** When `package_version`, `package_commit`, and every path in `files` already match the receipt and those files exist on disk, stop. No download and no delete.
2. **Download.** Fetch every path in the new `files` list into a staging area before any delete. For each path, use `GET https://sdd.works/api/sdd/lite/file?path=` with the path URL-encoded, or the matching `url` from `downloads`. Download only paths that appear in `files`.
3. **Delete.** After every new file is staged, delete a file under `{client_root}` only when its path is in the previous receipt `files` and absent from the new `files`.
4. **Place.** Copy staged files onto `{client_root}` at those relative paths.
5. **Write receipt.** Write `{client_root}/.sdd-lite-installed.json` only when every path in the new `files` list is a file on disk. The receipt keys are only: `schema_version` (`1`), `package_version`, `package_commit`, `installed_at` (ISO-8601), and `files` (sorted, same strings as the server list).

Failure rules:

- A first install that does not place every new path writes no receipt.
- A later install that does not place every new path leaves the previous receipt unchanged.
- A partial copy does not write a new receipt.

## 4. Verify

1. Confirm every path in the new `files` list exists under `{client_root}`.
2. Confirm `.sdd-lite-installed.json` lists that full set with matching `package_version` and `package_commit`.
3. Report success to the user with the pack version and how many paths were installed or updated.
