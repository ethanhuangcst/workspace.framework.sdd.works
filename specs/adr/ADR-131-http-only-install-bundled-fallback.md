# ADR-131: HTTP-only install, bundled pack fallback, no writer binary

## Status

Accepted. Partially superseded for root resolution by [ADR-132](./ADR-132-simplified-install-root-and-templates.md) (no `root_warning`, no agent detection chain, `root_required` for unknown clients). Supersedes [ADR-130](./ADR-130-simplified-installer-url-only-and-empty-cache.md) decisions 3, 4, and 6 for the install path. ADR-130 decisions 1, 2, 5, 7, 8, 9, and 10 stay. [ADR-129](./ADR-129-url-mcp-server-plan-local-writer.md) is fully superseded for the install path. Retires [ADR-051](./ADR-051-zero-dep-stdio-binary.md) and [ADR-058](./ADR-058-stdio-end-user-http-fallback.md).

## Context

ADR-130 kept the writer binary as the primary install path with an HTTP fallback. Manual tests on TRAE CN, CodeBuddy CN, and Codex found that the writer binary added complexity without value:

- The agent had to download, place, and run a binary with flags (`--write`, `--client`, `--os`, `SDD_SERVER_URL`).
- The binary stdout needed parsing and `accepted_root` confirmation.
- Two code paths (binary and fallback) had to produce the same result.
- Five OS and CPU build targets had to be built, tested, and distributed.
- The fallback already worked and was simpler.

The writer binary was a guardrail against a confused agent, not a security wall against a malicious one. The agent is already trusted to write the MCP config and run shell commands. The server validates the path and returns the plan. The agent copying files is the same trust level as writing the MCP config.

## Decision

1. **No writer binary.** Remove `~/.sdd/sdd-mcp`, the five OS and CPU build targets, the `--write`, `--client`, `--os`, and `SDD_SERVER_URL` flags, and the stdout JSON contract. The agent installs over HTTP MCP only.

2. **The server owns the install root for a known client.** The agent sends `client` and `os`. For a client in the seed map, the server uses that seed-map root. **Superseded by [ADR-132](./ADR-132-simplified-install-root-and-templates.md):** ADR-132 drops `root_warning` and the agent detection chain; unknown clients get `root_required`. For a client that is not in the seed map, the server requires `root`, validates it, and uses it. A missing `client` returns `client_unknown`.

3. **Bundled pack as cache fallback.** When the cache is empty or has a fixture commit, the server reads from the bundled pack under `pack.framework.sdd.works/` in the server repo. The agent never sees `cache_empty`, `fixture_pack`, or `sync_pending`. The server always returns a plan.

4. **Tarball URL for file delivery.** The server returns a tarball URL, not inline file contents. The tool result carries the plan, the file paths (no content), the deletions, the new ledger, and one tarball URL. The agent downloads one tarball, extracts the listed paths, and writes the ledger. The file contents never pass through the agent's context window.

5. **Sync stays.** The server syncs the pack from GitHub to the cache on a schedule. The cache is the primary source. The bundled pack is the fallback. The sync job updates `syncedAt` on every sync, including when the commit is unchanged (ADR-130 decision 5).

6. **Four failure codes.** `client_unknown`, `os_unsupported`, `path_rejected`, `unauthorized`. `noop` is a result, not an error. All other codes from ADR-130 are retired: `cache_empty`, `fixture_pack`, `sync_pending`, `cache_stale`, `llm_unavailable`, `not_found`, `already_up_to_date`, `package_unavailable`, `client_config_unresolved`, `version_not_found`.

7. **No stdio transport.** The MCP server is HTTP only (Streamable HTTP). The local portal uses `http://127.0.0.1:3041/mcp`. There is no stdio entry point and no local binary that speaks MCP.

## Consequences

- `src/mcp/write-mode.ts` is removed. No writer binary.
- `src/mcp/stdio-entry.ts` is removed. No stdio transport.
- `dist/` no longer holds five platform binaries. No GitHub release job for binaries.
- `~/.sdd/` is not created. No `SDD_SERVER_URL` env var for the agent.
- `src/core/tools/install-http.ts` is the only install path. For a known client it uses the seed-map root and ignores the agent-sent `root`. For an unknown client it requires and validates `root`. It checks the cache or bundled pack, builds the plan, and returns the tarball URL.
- `pack.framework.sdd.works/` holds the bundled fallback pack. It is already part of the server repo workspace.
- `packages/sdd-paths/paths.json` stays as the seed map. For a known client it is the install root. The agent does not override it.
- `public/agent-setup/prompt.md` is v11, URL only, no install section.
- All 14 open MC issues (MC-01 through MC-15) are closed by this design.

## Closes

- MC-01: No writer binary to be older than source.
- MC-02: No writer binary. Tarball URL is the pack on this server.
- MC-03: Fixture falls back to bundled pack.
- MC-04: No `--client-root` flag. Agent sends `root`, server validates.
- MC-05: No accepted root in plan request. Agent sends `root`, server validates.
- MC-06: Fixture falls back to bundled pack. No `fixture_pack` error.
- MC-07: HTTP tool list keeps `sdd_get_key`. Missing name returns `not_found`.
- MC-08: `mcp-design.md` rewritten. Old setup is gone.
- MC-10: Setup prompt v11, current client only.
- MC-11: No writer flags. Setup has no install section.
- MC-13: No writer binary. No stdout. Agent gets root from tool result.
- MC-14: No `cache_stale`. No age gate. Bundled fallback.
- MC-15: Templates path. Superseded by MC-18: the canonical installed path is `{client_root}/templates/framework.sdd.works/{locale}/...`, not `{client_root}/templates/{locale}/...`. The "already fixed" line in the original ADR was wrong; the flat layout did not match the paths skills and rules reference.

## Date

2026-10-09
