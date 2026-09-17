# ADR-050: Optional MCP HTTP bearer for local development

## Status
Accepted (amends ADR-049)

## Context
ADR-049 required `MCP_AUTH_TOKEN` for all Streamable HTTP MCP traffic and refused to start without it. Local Cursor users hit HTTP 401 when the bearer in `mcp.json` did not match, and operators asked to connect without a key for local smoke tests.

## Decision
- If `MCP_AUTH_TOKEN` is **unset or empty**: HTTP MCP allows requests **without** a bearer (open local mode). Log a startup warning.
- If `MCP_AUTH_TOKEN` is **set**: every request must present `Authorization: Bearer <exact token>` (ADR-049 behavior unchanged).
- Production / shared endpoints SHOULD set `MCP_AUTH_TOKEN`. Portal cookies still never authorize MCP.
- Stdio remains local-process trust (no bearer).

## Rationale
Local Cursor + sibling `:3041` is single-user loopback. Forcing a bearer for every smoke test blocked usability. Production can still require a token by setting the env var.

## Consequences
- Operators who want auth must set `MCP_AUTH_TOKEN` and put the same value in Cursor `headers`.
- Operators who want no key: leave `MCP_AUTH_TOKEN` empty when starting `mcp:http`, and omit `Authorization` from `mcp.json`.
- Do not expose an open HTTP MCP on a public host.

## Date
2026-09-17
