# ADR-049: MCP HTTP bearer auth for all tools including sdd_get_key

## Status
Accepted

## Context
Sprint 5 exposes Streamable HTTP MCP at `/mcp` and stdio for local clients. `sdd_get_key` returns plaintext secrets from the admin key store. Open questions in req-spec / tech-spec listed MCP bearer vs per-key token vs admin-issued API key.

## Decision
- HTTP: every request (including initialize and all tools) requires `Authorization: Bearer ${MCP_AUTH_TOKEN}`. Missing or wrong token → HTTP 401 with structured `unauthorized`; no tool execution; no stack traces.
- Portal session cookies never authorize MCP.
- `sdd_get_key` uses the **same** bearer as other HTTP tools (no separate per-key credential in MVP-5).
- Stdio: local-process trust (no bearer). `sdd_get_key` may run; responses still must not leak other key names on `not_found`.
- Fail closed if `MCP_AUTH_TOKEN` is unset when starting the HTTP MCP process.

## Rationale
One operator-managed secret matches the Sprint 5 plan and mcp-design provisional model. Per-key tokens add inventory/ops complexity without a product requirement yet.

## Consequences
- Operators must set `MCP_AUTH_TOKEN` for `mcp:http` (and in CI fixtures).
- Rotating the token disconnects all HTTP MCP clients until updated.
- Future ADR may introduce scoped key credentials without changing the transport gate.

## Date
2026-09-14
