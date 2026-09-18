# ADR-053: Server-side package sync + thin stdio client

## Status
Accepted

## Context
The stdio MCP binary was sharing code with the operator portal: `resolvePackage` and `listVersions` read `db.setting` (Prisma + PostgreSQL) and call GitHub via Octokit (`GITHUB_TOKEN`). That pulled Prisma, `DATABASE_URL`, `KEYS_ENCRYPTION_KEY`, and `@octokit/rest` into a client binary that should satisfy NFR-9 (zero client dependencies). Bun `--compile` also risked embedding the Prisma native engine (ADR-051).

The operator server already hosts Settings, the framework live view, and HTTP MCP. End users only need to download framework files and write them to local client paths — the same job as the original `npx sdd-full-global init` CLI.

## Decision
1. **Server-side sync job (SYNK-01):** The operator server fetches the framework package from the configured GitHub repo (using existing `GitHubPort.materializePackage`), stores unpacked files + tarball under `.data/sdd-packages/<commit-sha>/`, and writes a manifest (versions, inventory, latest commit/version).
2. **Package REST API (PKAPI-01):** Public endpoints `GET /api/sdd/versions` and `GET /api/sdd/package` serve cached package data. Admin `POST /api/admin/sync` triggers sync manually.
3. **Thin stdio client:** The stdio binary fetches package data from the operator REST API via built-in `fetch` (`SDD_SERVER_URL`). No Prisma, no PostgreSQL, no `GITHUB_TOKEN`, no `@octokit/rest` on the client.
4. **`sdd_get_key` HTTP-only:** Remove from stdio tool registration. Keys remain on HTTP MCP with bearer auth.

## Rationale
- Single GitHub token and rate limit on the operator server; N clients × M API calls becomes one periodic sync.
- stdio binary dependencies shrink to `@modelcontextprotocol/sdk` + `zod` + built-in `fetch` — Bun `--compile` is trivial.
- Mirrors npm registry / Docker mirror pattern: operator server is the package source of truth.
- Install/update filesystem logic (manifest-tracked merge, path detection, Qwen) stays on the client where the caller's home directory is visible.

## Consequences
- Operator server is required for stdio install/update (acceptable — portal and HTTP MCP already required).
- New `.data/sdd-packages/` cache directory on Server 2; gitignored.
- `package-resolve.ts` remains server-side only (sync job).
- HTTP MCP `sdd_list_versions` reads sync cache instead of live GitHub on every call.
- stdio `sdd_list_versions` calls `GET /api/sdd/versions`.
- Dev stdio uses `SDD_SERVER_URL=http://localhost:3040` when testing against local portal.

## Date
2026-09-18
