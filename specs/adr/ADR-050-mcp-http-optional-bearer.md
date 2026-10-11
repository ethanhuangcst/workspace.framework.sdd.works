# ADR-050: Optional MCP HTTP bearer for local development

## Status
Accepted (amends ADR-049)

**Public host (MC-20, 2026-10-11):** `https://sdd.works/mcp` follows [ADR-130](./ADR-130-simplified-installer-url-only-and-empty-cache.md). `MCP_AUTH_TOKEN` stays unset on that host. A client with only the URL is authorized. The optional bearer below still applies when an operator sets `MCP_AUTH_TOKEN` on a private host.

## Context
ADR-049 required `MCP_AUTH_TOKEN` for all Streamable HTTP MCP traffic and refused to start without it. Local Cursor users hit HTTP 401 when the bearer in `mcp.json` did not match, and operators asked to connect without a key for local smoke tests.

## Decision
- If `MCP_AUTH_TOKEN` is **unset or empty**: HTTP MCP allows requests **without** a bearer. The public host `https://sdd.works/mcp` stays in this mode so `mcp.json` remains a URL only (MC-20, ADR-130).
- If `MCP_AUTH_TOKEN` is **set** on a private host: every request must present `Authorization: Bearer <exact token>` (ADR-049 behavior unchanged).
- Portal session cookies never authorize MCP.
- Stdio remains local-process trust (no bearer).

## Rationale
Local Cursor + sibling `:3041` is single-user loopback. Forcing a bearer for every smoke test blocked usability. The public host leaves the variable unset. A private host can still require a token by setting it.

## Consequences
- Operators who set `MCP_AUTH_TOKEN` on a private host must put the same value in that host's client `headers`.
- The public host leaves `MCP_AUTH_TOKEN` unset and omits `Authorization` from `mcp.json`.

## Date
2026-09-17
