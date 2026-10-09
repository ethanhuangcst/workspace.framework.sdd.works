# ADR-128: Install binary path, client root, and who writes

## Status

Accepted for the four decisions below. Not implemented. [ADR-058](./ADR-058-stdio-end-user-http-fallback.md) stays the running install path until a later story changes the code.

One question stays open and is not a decision in this ADR: whether an agent may write files when the local program cannot run.

## Context

The end-user install has two different jobs: name the folder, and write the pack. [ADR-058](./ADR-058-stdio-end-user-http-fallback.md) puts both jobs in the local program `~/.sdd/sdd-mcp`. A literal `~` in an MCP `command` is not a path. The shell expands `~`. A process started without a shell does not.

`{client_root}` is the user agent config root, such as `~/.cursor` on Cursor ([ADR-056](./ADR-056-single-user-root-framework-pack.md)). It is not the open project.

## Decision

### 1. Binary path

1. The program file lives at the home directory plus `.sdd/sdd-mcp`. On Windows the file name is `sdd-mcp.exe`.
2. Home is the directory from `os.homedir()`: `$HOME` on macOS and Linux, `USERPROFILE` on Windows.
3. The MCP `command` value is that absolute path, or a token that client expands (`${userHome}` or `${HOME}`).
4. A `command` or `args` value that still contains `~` is invalid. The setup step must not write that string.

### 2. Who names `{client_root}`

1. The agent sends a candidate root and the evidence it used, such as the config file it found.
2. The local program accepts or rejects that candidate. The agent does not get the final say.
3. The program rejects a path outside the home directory, a path that contains `..`, and a path on a forbidden prefix (`/etc`, `/usr`, `/bin`, `/sbin`).
4. For a known client, the program compares the candidate with the environment override, the config file, and the `@sdd/paths` table. On a conflict, the program's result wins.
5. For an unknown client, the program may accept the candidate only when the path checks pass. The tool result names that folder before any write.

### 3. Who decides the write plan

1. The local program sends the whole `{client_root}/.sdd-installed.json` when that file exists.
2. It also sends the accepted `{client_root}`, the client, the operating system, `force` when the user asked for a reinstall, and `missing` (recorded paths that are not on disk).
3. It does not send file bodies. It does not send an up-to-date flag. The server makes that decision.
4. The server composes one plan from that inventory and the pack allow-list for the commit: `noop`, `rewrite_ledger`, or `apply` with the delete list and the file list.
5. The same ledger, the same `missing` list, and the same commit always return the same plan.

### 4. Who writes

1. The local program is the only writer on the primary path.
2. It checks the plan, writes the listed files, and writes `{client_root}/.sdd-installed.json` last with `pack_complete: true`.
3. A delete is allowed only for a path that was in the ledger the program sent. Every written path stays under the accepted root.

## Rationale

The folder `.sdd/sdd-mcp` is stable. The characters `~/.sdd/sdd-mcp` are not a path every MCP host will parse.

A wrong `{client_root}` still produces `pack_complete: true`. The write cannot tell that the real client root was left empty. The program's check is what stops that.

One writer keeps the eight client-root outcomes in one place. The program still has to read the disk and reject a bad plan, or a forged plan can delete a user file.

## Consequences

- Setup markdown must expand home before it writes `command`. This ADR does not edit that markdown.
- [ADR-058](./ADR-058-stdio-end-user-http-fallback.md) remains the implemented primary path and the implemented HTTP fallback.
- The up-to-date rule lives on the server. A rule change does not require a new binary. The program still reads the disk and rejects a plan that deletes a path outside the ledger it sent.

## Date

2026-10-09
