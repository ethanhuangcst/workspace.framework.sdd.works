These are official instructions from sdd.works for installing or updating the full SDD framework pack over MCP.

# Install or update the SDD framework pack

Install page version: 2026-10-10.v1

Use this page when MCP is already connected and the person asks to install or update the SDD framework pack. Complete the install yourself. Do not scaffold project specs or copy pack files by hand when the MCP tool can do the work.

## Authorization boundary

The user's install request authorizes only these changes:

- Read `{client_root}/.sdd-installed.json` when it exists.
- Call `sdd_install_framework` or `sdd_update_framework` with `client`, `os`, and the ledger or no ledger.
- Download the pack tarball from the `packageUrl` on this server.
- Copy only the file paths listed in the tool result into the resolved client root.
- Delete only the paths listed in the deletions list.
- Write `{client_root}/.sdd-installed.json` last with `pack_complete: true`.

It does not authorize you to:

- register or change an MCP server entry (that work belongs on the setup page);
- name a git host or download a release asset from outside this server;
- extract the tarball into the client root as a single archive drop;
- write `framework.sdd.works.json`;
- request, create, read, print, or store credentials unless the user explicitly asks;
- edit unrelated project files.

## 1. Read the ledger

1. Resolve `{client_root}` as the folder where the running IDE stores installed skills, rules, agents, workflows, and templates for this product.
2. Read `{client_root}/.sdd-installed.json` when it exists. Pass its contents as the `ledger` argument on the next tool call. When the file is absent, omit `ledger` for a first install.
3. When you cannot resolve `{client_root}` safely, stop and report the problem. Do not invent a path.

## 2. Call the install tool

1. Identify `client` from the running session or the person (for example `cursor`, `claude`, `codex`, `codebuddy`, `trae`, `trae-cn`).
2. Identify `os` as `darwin`, `linux`, or `win32`.
3. For a client in the seed map, call `sdd_install_framework` with `client`, `os`, and `ledger` only. Omit `root`. The server resolves the root from the path map.
4. When the result code is `root_required`, ask the person for the client config root where that IDE stores skills and rules. Retry with the same `client`, `os`, `ledger`, and the validated `root`.
5. When the result is `noop`, tell the person the framework is already up to date. Stop.
6. When the result is `rewrite_ledger`, write `.sdd-installed.json` with the ledger from the result. Do not copy files. Stop.
7. When the result is `apply`, continue with the steps below.

## 3. Download the tarball

1. Download the pack from the `packageUrl` in the tool result to a temp path outside `{client_root}`.
2. The tarball URL is on this server only. Do not fetch pack files from a git host or a third-party release page.

## 4. Extract listed paths

1. Copy only the paths in the `files` list from the staged tarball into the resolved root from the tool result.
2. Delete only the paths in the deletions list from the resolved root. Do not delete a parent directory to remove one file.
3. Do not extract the archive into the client root. Do not copy paths that are not in the plan.

## 5. Write the ledger last

1. Write `{client_root}/.sdd-installed.json` last with the ledger from the tool result and `pack_complete: true`.
2. Report the resolved root, the version, and how many paths were written.

## Rollback

Remove only the pack files listed in the last successful install ledger and delete `.sdd-installed.json`. Do not remove unrelated user files under `{client_root}`.
