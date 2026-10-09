# ADR-129: URL MCP, server write plan, local writer

## Status

Accepted. Not implemented. [ADR-051](./ADR-051-zero-dep-stdio-binary.md), [ADR-053](./ADR-053-server-side-sync-thin-stdio.md), [ADR-054](./ADR-054-hybrid-http-ai-tarball.md), [ADR-058](./ADR-058-stdio-end-user-http-fallback.md), [ADR-061](./ADR-061-setup-prompt-public-path.md), [ADR-127](./ADR-127-public-hostnames-sdd-and-learn.md), and [ADR-128](./ADR-128-install-root-and-writer.md) stay as they are. This ADR is the target. The running install path stays ADR-058 until a later story changes the code.

## Context

End users paste one sentence. The agent registers MCP, then install writes the framework pack on the user client root. The pack home stays [ADR-056](./ADR-056-single-user-root-framework-pack.md). The ledger stays [ADR-057](./ADR-057-install-ledger-pack-complete.md) and [ADR-059](./ADR-059-ledger-lists-pack-files.md).

## History

### 1. Local binary, no Node (ADR-051, 2026-09-17)

NFR-9 says the client machine installs no Node, npm, or Bun. `npx tsx` as the MCP `command` needs Node, so it was rejected. The main concern was a GUI client that does not install Node for the user.

The decision was one Bun-compiled binary per operating system and CPU, saved for the user, with `mcp.json` `command` pointing at that file. Bun stays a build tool. The cost is a local path in `mcp.json`.

### 2. Server holds the pack (ADR-053, 2026-09-18)

The binary was about to ship Prisma, a database URL, and a GitHub token so it could read the pack. That breaks NFR-9, and the Prisma engine may not embed in the binary. The main concern was client dependencies and a token on the user machine.

The decision was a server sync cache and `GET /api/sdd/package`. The binary downloads the pack with `fetch`. Install merge and path detection stay on the machine that can see the home directory. What triggered the next design was the setup UX, not this split. This split stays.

### 3. HTTP MCP and the agent unpacks (ADR-054, 2026-09-18)

People wanted one paste and no binary path, in the same shape as SkillsMP. The main concern with ADR-051 was the local `command` path and the OS matrix. The thought that triggered this design was a URL-only `mcp.json`.

The decision was Streamable HTTP as the primary connection. `sdd_install_framework` returns a tarball URL. The agent runs `curl | tar` and writes `.sdd-installed.json`. The main concern left open was that install then depends on the agent following those steps.

### 4. Local program writes, HTTP unpack is fallback (ADR-058, 2026-09-25)

A production call on 25 Sep 2026 used that HTTP path. The eight client-root scenarios need one writer. An agent that follows or skips the unpack can keep or drop user files. That call triggered this design. The main concern was file loss, not the paste sentence.

The decision was the local program as the primary writer again. HTTP stayed as fallback, and on that fallback the agent still unpacks. NFR-9 was amended: one binary download is allowed. No Node.js. [ADR-061](./ADR-061-setup-prompt-public-path.md) put the paste sentence on `GET /setup`. [ADR-127](./ADR-127-public-hostnames-sdd-and-learn.md) changed the host to `https://sdd.works` and left this behavior in place.

### 5. Server plan, program writes (ADR-128, 2026-10-09)

The thought that triggered this step was to keep the deterministic writer and stop putting a local path in `mcp.json`. ADR-128 records three rules and leaves the connection shape open:

- The writer file is the home directory plus `.sdd/sdd-mcp`. A `command` value that still contains `~` is invalid.
- The agent may name a candidate `{client_root}`. The program accepts or rejects it. For a known client, the program wins on a conflict.
- The program sends the whole `.sdd-installed.json` plus the accepted root, the client, the operating system, `force` when asked, and `missing`. The server composes the plan. The program writes that plan and writes the ledger last.

## Decision

1. **`mcp.json` is a URL only.** The entry name stays `framework.sdd.works`. The entry is `"url": "https://sdd.works/mcp"`. It has no `command`.
2. **Paste setup.** The person pastes one sentence. The agent fetches `GET /setup` and registers that entry. When an entry named `framework.sdd.works` is already present, the agent checks it and changes it so the entry is this URL. A previous `command`, a previous host, or a previous path is replaced. The person does not edit the file by hand.
3. **Primary write.** The local program is the writer. It sends the inventory from ADR-128. The server returns one plan: `noop`, `rewrite_ledger`, or `apply`. The program checks the plan, writes the listed files, and writes `.sdd-installed.json` last. The program is not the MCP process.
4. **Fallback write.** When that program cannot be downloaded or cannot run, the agent writes. The agent sends the whole `.sdd-installed.json` when that file exists, plus `missing`, the candidate root, the client, the operating system, and `force` when asked. The server composes the same plan from that inventory and returns the plan, the instruction, and the pack URL. The instruction copies only the planned paths, then writes the ledger last. The agent does not extract the archive into the client root. This path is only the fallback.
5. **Home directory.** The writer file path still follows ADR-128 decision 1. The agent expands home before it saves or starts that file. `mcp.json` does not store that path.

## Rationale

A URL entry matches the paste setup people already expect, and it removes the local path from `mcp.json`. The file rules stay in one server function so a rule change does not need a new binary. The program stays the writer so the eight outcomes do not depend on the agent. The fallback exists for a client that cannot run the program, and it uses the same plan so the file set does not change.

## Consequences

- `public/agent-setup/prompt.md` must tell the agent to write the URL and to replace an existing `framework.sdd.works` entry. This ADR does not edit that file.
- ADR-058 remains the implemented path until the code and the setup markdown change.
- A client that cannot run the program gets the agent writer. That writer can skip a file. The plan and the per-file instruction are the control.

## Date

2026-10-09
