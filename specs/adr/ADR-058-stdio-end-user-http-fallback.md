# ADR-058: End-user stdio installer with HTTP fallback

## Status
Accepted

## Context
ADR-054 made Streamable HTTP the primary end-user path: `mcp.json` holds only `"url": "https://framework.sdd.works/mcp"`. `sdd_install_framework` and `sdd_update_framework` return a download link and instructions. The agent in the IDE unpacks the archive and writes `.sdd-installed.json`. A production call on 25 Sep 2026 confirmed that path. The eight client-root scenarios need a deterministic writer. An agent that follows or skips those instructions can keep or lose user files.

ADR-051 already defines a zero-dependency binary (`~/.sdd/sdd-mcp`) for stdio. Cursor and CodeBuddy do not install Node.js for the user. `npx` is not a reliable MCP `command` from the GUI. NFR-9 previously forbade a binary download for end users so the HTTP path could stay one URL.

## Decision
1. **Primary end-user path is a local program (stdio).** The person pastes one website prompt. The agent downloads the matching binary to `~/.sdd/sdd-mcp` (or the Windows user-profile equivalent), writes a `command` entry in that agent’s MCP config, and does not ask the person to edit the file by hand. After MCP reload, `sdd_install_framework` and `sdd_update_framework` run inside that program and write the client folder.
2. **HTTP is the fallback.** If the agent cannot start a local program, or the binary download fails, the prompt writes `"url": "https://framework.sdd.works/mcp"`. Install then returns `packageUrl`, paths, manifest, and instructions. The server does not write the caller disk. The agent writes the files.
3. **Setup prompt:** The markdown (source `public/agent-setup/prompt.md`) authorizes download of the binary and a single MCP entry named `framework.sdd.works`. It does not authorize installing the framework pack. Pack install stays a later tool call. The public path is `GET /setup` ([ADR-061](./ADR-061-setup-prompt-public-path.md)). `GET /agent-setup` redirects there.
4. **Binary targets** stay those in ADR-051: `darwin-arm64`, `darwin-x64`, `linux-arm64`, `linux-x64`, `windows-x64`. No Node.js on the client.
5. **Install record** stays ADR-057: one `{client_root}/.sdd-installed.json` with `pack_complete` set true in the same write as version, commit, and the file list. File outcomes are the Expected column of the eight client-root scenarios in [`mcp-design.md`](../mcp/mcp-design.md).
6. **NFR-9 amendment:** End users SHALL NOT require Node, npm, Bun, PostgreSQL, or operator secrets. One OS-specific binary download for the MCP program is allowed. Pack content still arrives from `https://framework.sdd.works` (`SDD_SERVER_URL`).

## Rationale
- The tool call is the writer, so the eight Expected outcomes live in one program.
- No Node.js dependency for end users.
- Same paste-prompt UX as SkillsMP and the current website flow.
- HTTP remains for clients that only accept a URL, and when the binary cannot be installed.

## Consequences
- ADR-054 is no longer the primary end-user path. HTTP install behavior in ADR-054 remains the fallback contract.
- `public/agent-setup/prompt.md` must change from “add the HTTP URL only” to “download the binary and write `command`,” with the URL as the documented fallback. **Sprint 2 feature-05** owns that markdown rewrite. Binary publish for all targets stays ADR-051 / go-live. The public URL in the paste sentence is `https://framework.sdd.works/setup` ([ADR-061](./ADR-061-setup-prompt-public-path.md)).
- Pack updates do not require a new binary. Installer-rule changes do.

## Date
2026-09-25
