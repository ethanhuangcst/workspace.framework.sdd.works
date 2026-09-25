# ADR-054: Hybrid HTTP MCP + AI tarball extraction

## Status
Accepted — **primary end-user path superseded by [ADR-058](./ADR-058-stdio-end-user-http-fallback.md).** HTTP install/update behavior in this ADR remains the **fallback** when the local program cannot be installed or the client accepts only a URL.

## Context
End users need a simple MCP setup: no binary path in `mcp.json`, no terminal commands, and AI-driven install/update from chat. ADR-051 (zero-dep stdio binary) and ADR-053 (thin stdio client) solved server-side package distribution but still required a local binary and `command` in MCP config.

SkillsMP demonstrated prompt-based setup: the user pastes one prompt, the AI fetches setup instructions and writes a remote HTTP MCP URL to config. Install/update of local files still requires a local process — either a stdio binary or the AI agent itself using shell tools.

## Decision
1. **HTTP MCP is the primary end-user transport.** End-user `mcp.json` contains only `"url": "https://framework.sdd.works/mcp"`.
2. **Prompt-based setup (SETUP-01):** The server serves agent-specific instructions (modeled on SkillsMP). Users paste one prompt; the AI configures MCP. The public path is `GET /setup` ([ADR-061](./ADR-061-setup-prompt-public-path.md)). This ADR’s earlier path `GET /api/agent-setup` remains the handler the public path rewrites to.
3. **Hybrid install/update:** On HTTP channel, `sdd_install_framework` and `sdd_update_framework` return `{ packageUrl, paths, manifest, instructions }` instead of writing files. The AI agent downloads the tarball via shell (`curl | tar`) and writes `.sdd-installed.json`.
4. **Stdio retained for dev contributors only** — run from source with `npm run mcp:stdio`; stdio still writes files directly.
5. **`scripts/install.sh` kept as fallback** for users who prefer terminal binary setup; not the primary path.

## Rationale
- No binary download, no OS/arch matrix, no `${userHome}` path for end users.
- Server is always current — no client binary update problem.
- `tar` extraction preserves content exactly (deterministic, unlike AI Write tool).
- Reuses existing `/api/sdd/package` tarball endpoint (ADR-053).
- Prompt-based setup matches SkillsMP UX and works across Cursor, Claude Code, Codex.

## Consequences
- Install reliability depends on AI following instructions (shell + manifest write).
- HTTP install cannot verify local filesystem; optional `installed_commit` / `installed_version` args support idempotency when AI reads local manifest first.
- `local_install_required` error code is deprecated for HTTP install (stdio-only dev path unchanged).
- ADR-051 binary distribution de-emphasized for end users; Bun build remains for dev stdio.

## Date
2026-09-18
