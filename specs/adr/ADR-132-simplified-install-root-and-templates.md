# ADR-132: Simplified install root, templates path, and install guidance

## Status

Accepted. Partially supersedes [ADR-131](./ADR-131-http-only-install-bundled-fallback.md) for root resolution, unknown-client flow, and templates layout. ADR-131 decisions that stay: HTTP-only install, bundled pack fallback, tarball URL delivery, no writer binary, no stdio transport, no LLM at install time, sync job, four base failure codes plus the additions below.

## Context

ADR-131 made the server authoritative for known clients: the seed map is the install root, and a differing agent-sent `root` returned `root_warning` while still installing to the seed-map root. Manual tests and product review found that model still pushed agents to detect roots from env vars, config files, and workspace folders. TRAE CN installed under a project directory when the agent sent `root` (MC-16). Codex scaffolded specs instead of calling the install tool (MC-17). Skills reference `{client_root}/templates/framework.sdd.works/...` but install wrote a flat `templates/{locale}/` tree (MC-18, MC-15).

The team chose a simpler contract: the agent sends identity and ledger only. The server resolves the root for known clients. Unknown clients get `root_required` so the person supplies the path once. Relocation env vars stay a documented limitation, not a detection chain.

## Decision

1. **Tool input.** The agent calls `sdd_install_framework` with `client`, `os`, and optional `ledger` (and optional `force`, `missing`). For a client in the seed map, the agent does not send `root`. The agent does not run an env-var or config-file detection chain to choose `root`.

2. **Known client root.** For a client in `packages/sdd-paths/paths.json`, the server resolves the root from the seed map using `client` and `os`. The server ignores any `root` the agent might send.

3. **Unknown client root.** For a client not in the seed map, when `root` is absent the server returns `root_required` with a short message the agent can show the person. The agent asks the person for the client config root, retries with `root`, and the server validates it against path policy. Invalid paths return `path_rejected`.

4. **Missing client.** When `client` is missing or not recognized for mapping purposes, return `client_unknown`.

5. **Relocation is a known limitation.** Users who relocate a first-class client with env vars such as `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `CLINE_DIR`, or `KIRO_HOME` install to the seed-map default until a future story addresses relocation. The seed map is canonical for known clients in this release.

6. **No `root_warning` or `resolution_source`.** The install result names the resolved `root` and the plan. It does not warn about a discarded agent root or report how the agent guessed a path.

7. **Nested templates path (MC-18).** Pack `templates/` holds a `framework.sdd.works/` subfolder. After install, locale seeds live at `{client_root}/templates/framework.sdd.works/{locale}/...`. Shared files such as `constants.json` and the AI-read trio live under `{client_root}/templates/framework.sdd.works/`.

8. **Install page (MC-17).** `GET /install` serves markdown that names the MCP install sequence: read the ledger, call the tool with `client` and `os`, download the tarball, extract listed paths, write the ledger last. `GET /setup` links to it from an After setup note and still has no install section.

9. **Sync timestamp (MC-14).** When a sync run finds the same commit as the cache and `force` is false, the server still rewrites `syncedAt` to now on the manifest before returning unchanged.

10. **Failure codes.**

| Code | Meaning |
| --- | --- |
| `client_unknown` | `client` is missing or cannot be mapped. |
| `root_required` | `client` is not in the seed map and `root` was not sent. |
| `os_unsupported` | `os` is not `darwin`, `linux`, or `win32`. |
| `path_rejected` | The resolved or sent path is outside home, contains `..`, or is a system path. |
| `unauthorized` | The caller is not authorized. Portal key only. |

`noop` and `rewrite_ledger` remain results, not errors.

## Related ADRs

051, 053, 054, 055, 058, 060, 063, 081, 126, 128, 129, 130, 131.

## Consequences

- [`mcp-design.md`](../mcp/mcp-design.md), [`mcp-stories.md`](../mcp/mcp-stories.md), and [`mcp-tests.md`](../mcp/mcp-tests.md) describe the simplified flow. Retired path-detection stories stay in history sections only where noted.
- [`client.paths.md`](../mcp/client.paths.md) keeps env-var research as operator reference; install does not consume it at runtime.
- Implementation SBIs feature-93 through feature-96 own `install-http.ts`, pack tree layout, install page, and `sync-job.ts`.
- [`issues-log.md`](../issues-log.md) MC-16, MC-14, MC-15, MC-17, MC-18 close when those SBIs ship, not when this ADR lands.

## Date

2026-10-10
