# ADR-133: Manual mcp.json setup guide returns on Setup tab

## Status

Accepted

## Context

[ADR-122](./ADR-122-instructions-guide-hero-and-setup-tab.md) removed the on-page Manual setup block and the Tools table from the public instructions guide. That shortened the Setup tab but left visitors whose agent cannot edit MCP configuration without a visible copy path on the portal.

The authoritative setup document remains `GET /setup` (`public/agent-setup/prompt.md`). Operators approved mockup **feature-98** ([Web-portal-41](../product-backlog.md)) to restore a Manual setup section while keeping the Tools table removed.

## Decision

### Setup tab (partial reversal of ADR-122)

| Element | Rule |
| --- | --- |
| Placement | After the setup card, before `#agents` |
| Section | `.setup-manual`, `data-testid="setup-manual"` |
| Sample | Full `mcpServers` JSON with one entry `framework.sdd.works` and **only** `"url": "{origin}/mcp"` (no `command`) |
| Copy sample | `copy-manual-mcp` |
| Clients (order) | Claude Code (CLI command + copy), Codex (CLI command + copy), Cursor (paste into path), CodeBuddy CN / WorkBuddy CN (paste), TRAE CN (paste) |
| Commands | Match `prompt.md` with `{origin}` filled by `getVisitorPasteOrigin()` at render time |
| Tools table | **Still not** rendered (`#tools` absent) |

### Source of truth and drift

- Constants and helpers live in `src/lib/setup-manual.ts`.
- Automated tests assert the portal strings stay aligned with `public/agent-setup/prompt.md` (**AC61**).

## Rationale

Most visitors should use the copy-prompt path. Manual blocks serve agents or environments that cannot apply MCP changes from the setup prompt alone. Duplicating the sample on the page is acceptable when it mirrors the same URL-only entry documented in `/setup` and is guarded by drift tests.

## Consequences

- [ADR-122](./ADR-122-instructions-guide-hero-and-setup-tab.md) remains accepted for hero, Tools removal, and update preface; only Manual setup on the portal is superseded for that row.
- Regression coverage moves from “Manual absent” to “Manual present” in [`app-tests.md`](../admin-portal/app-tests.md) §35.
- i18n keys `admin.guide.manual_*` are required again in production components.

## Related

- [Web-portal-41](../product-backlog.md#pb-140) / feature-98
- [AC60](../admin-portal/app-stories.md), [AC61](../admin-portal/app-stories.md)
- [`app-design.md`](../admin-portal/app-design.md) Manual mcp.json setup guide
- [ADR-061](./ADR-061-setup-prompt-public-path.md)
