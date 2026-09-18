# ADR-051: Zero-dependency stdio MCP via Bun compile

## Status
Accepted

## Context
NFR-9 requires that the client operating system install no runtime dependencies (Node, npm, Bun, etc.) to call `sdd_install_framework` / `sdd_update_framework` over stdio. The dev entrypoint `npx tsx src/mcp/stdio.ts` requires Node and npm on the client, which violates that requirement. The tech-spec already described "stdio binary local" but no packaging existed.

## Decision
- Distribute the stdio MCP entry as a **single self-contained executable** per supported OS/arch, built with **`bun build --compile`** (Bun is a **devDependency only** — build-time, never shipped to clients).
- Cross-compile targets from one CI runner: `darwin-arm64`, `darwin-x64`, `windows-x64`, `linux-arm64`, `linux-x64`.
- Publish binaries to **GitHub Releases** on version tags.
- **Dev path unchanged:** operators and contributors continue to use `npm run mcp:stdio` (`tsx src/mcp/stdio.ts`) during development.
- **Configuration vs dependency:** `DATABASE_URL`, `QWEN_*`, and `GITHUB_TOKEN` are operator-supplied env values, not installed packages.

## Rationale
- Bun `--compile` bundles the runtime and application into one binary; clients download one file and point `mcp.json` `command` at it.
- Cross-compilation from a single Linux/macOS CI runner avoids a matrix of OS runners.
- HTTP MCP remains unchanged for remote read-only tools (`sdd_list_versions`, `sdd_get_key`); install/update still require stdio on the developer machine.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Prisma 6.x native query engine may not embed cleanly in a Bun-compiled binary | Verify on each target in CI. If blocked: use a pure-JS Postgres driver (`pg`) in a thin `db-stdio` port for the three stdio DB reads (settings URL, key lookup); portal keeps Prisma. |
| Binary size (~50 MB) | Acceptable for a desktop MCP server; document download per OS/arch. |
| Per-OS/arch release matrix | Automated via `scripts/build-mcp-binary.sh` and release workflow. |

## Consequences
- Clients need no Node/npm/Bun; they need the correct binary for their OS/arch and a writable config (env or `.env` beside the binary).
- Release process adds `npm run mcp:build` and GitHub Release asset upload on tags.
- Instructions page and operator docs show binary download, not `npx tsx`.

## Date
2026-09-17
