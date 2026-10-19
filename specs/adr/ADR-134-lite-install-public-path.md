# ADR-134: Lite install instructions live at /lite/install

## Status

Accepted

## Context

Lite install is skills and rules only. The agent fetches one markdown page, then calls `GET /api/sdd/lite/files` and `GET /api/sdd/lite/file`. That page is [public/agent-setup/install.md](../../public/agent-setup/install.md).

Today the public URL is `GET /setup/install` ([ADR-061](./ADR-061-setup-prompt-public-path.md) consequence, [ADR-127](./ADR-127-public-hostnames-sdd-and-learn.md) decision 3). Next rewrites that path to `/api/agent-setup/install` ([setup-paths.ts](../../src/mcp/setup-paths.ts)). The partner sentence in [paste-sentences.json](../../public/agent-setup/paste-sentences.json) key `lite_install` is `Fetch and execute the setup instructions from {origin}/setup/install`.

`GET /setup` is MCP connection only. `GET /install` is the full pack sequence (`sdd_install_framework`). Putting lite under `/setup/install` makes lite look like a step of MCP setup. The product wants the public URL to be `https://sdd.works/lite/install`.

This ADR records the path. It does not change routes, markdown, or tests.

## Decision

1. The public lite instruction URL is `GET /lite/install`. Production paste text is: `Fetch and execute the setup instructions from https://sdd.works/lite/install`.
2. The markdown source stays `public/agent-setup/install.md`. The HTTP handler stays `GET /api/agent-setup/install`. Only the public path changes.
3. `GET /lite/install` rewrites to `/api/agent-setup/install`. Same pattern as `GET /setup` → `/api/agent-setup`.
4. `GET /setup/install` redirects to `GET /lite/install` (temporary, same style as `GET /agent-setup` → `GET /setup`). Prompts already pasted keep working.
5. `lite_install` in `paste-sentences.json` uses `{origin}/lite/install`. `getLiteInstallSetupUrl()` in [brand.ts](../../src/mcp/brand.ts) returns that path.
6. These stay unchanged:
   - `GET /setup` (MCP connection)
   - `GET /setup/node` (Node prerequisite)
   - `GET /install` (full pack via MCP)
   - `GET /api/sdd/lite/files` and `GET /api/sdd/lite/file` (file APIs, not the instruction page)
7. [ADR-127](./ADR-127-public-hostnames-sdd-and-learn.md) decision 3 path `/setup/install` is superseded by this ADR. The host `https://sdd.works` stays. [ADR-061](./ADR-061-setup-prompt-public-path.md) still owns `GET /setup`. Its example path `GET /setup/install` is superseded here.

## Rationale

| Option | Result |
| --- | --- |
| Keep `/setup/install` | Lite stays nested under MCP setup. Rejected. |
| Serve markdown at `/lite/install` with a new App Router page | Duplicates the rewrite pattern already used for `/setup` and `/install`. Rejected. |
| Rewrite `/lite/install` to the existing handler, redirect the old path | One markdown file, one handler, old prompts still resolve. Chosen. |
| Drop `/setup/install` with no redirect | Partner sites that already paste the old sentence get 404. Rejected for the first release of this path. |

`/lite/install` does not collide with `/api/sdd/lite/*`. Those are JSON file routes. The instruction page is markdown.

## Consequences

Implementation is a later change. This file does not edit application code.

### Route table (after the code change)

| Public path | Mechanism | Target |
| --- | --- | --- |
| `GET /lite/install` | rewrite in `SETUP_REWRITES` | `/api/agent-setup/install` |
| `GET /setup/install` | redirect in `SETUP_REDIRECTS` | `/lite/install` |

[next.config.ts](../../next.config.ts) already spreads those two arrays. No new config module.

### Code and content to edit together

| File | Change |
| --- | --- |
| [src/mcp/setup-paths.ts](../../src/mcp/setup-paths.ts) | Rewrite source `/setup/install` becomes `/lite/install`. Add redirect `/setup/install` → `/lite/install`. |
| [src/mcp/setup-paths.test.ts](../../src/mcp/setup-paths.test.ts) | Assert the new rewrite and redirect. |
| [src/mcp/brand.ts](../../src/mcp/brand.ts) | `getLiteInstallSetupUrl()` path `/lite/install`. |
| [public/agent-setup/paste-sentences.json](../../public/agent-setup/paste-sentences.json) | `lite_install` template `{origin}/lite/install`. |
| [public/agent-setup/install.md](../../public/agent-setup/install.md) | Example sentence and version line name `/lite/install`. File-list URLs stay `/api/sdd/lite/files` and `/api/sdd/lite/file`. |
| [src/mcp/paste-sentences.test.ts](../../src/mcp/paste-sentences.test.ts) | Expected sentence uses `/lite/install`. |
| [src/mcp/hostname-defaults.regression.test.ts](../../src/mcp/hostname-defaults.regression.test.ts) | Same path assertion. |

Handlers [src/app/api/agent-setup/install/route.ts](../../src/app/api/agent-setup/install/route.ts) and [src/app/api/sdd/lite/](../../src/app/api/sdd/lite) stay. Module-boundary list does not gain a route file.

### Specs to align in the same change (not this ADR)

- [specs/admin-portal/app-stories.md](../admin-portal/app-stories.md) AC that locks `https://sdd.works/setup/install`
- [specs/admin-portal/app-tests.md](../admin-portal/app-tests.md) and [specs/admin-portal/app-design.md](../admin-portal/app-design.md) where they name `GET /setup/install` as the instruction page
- [specs/mcp/mcp-design.md](../mcp/mcp-design.md) setup-backend path list
- [specs/release.md](../release.md) curl of `/setup/install`
- [specs/go-live/20261008/hostname-cutover-inventory.md](../go-live/20261008/hostname-cutover-inventory.md) path list

Historical sprint and closed-issue rows that name `/setup/install` stay as history.

### Check after the code change

- `GET /lite/install` returns `text/markdown` and the lite body (no `sdd_install_framework`).
- `GET /setup/install` responds with a redirect to `/lite/install`.
- `GET /setup`, `GET /install`, and `GET /api/sdd/lite/files` behave as before.
- Partner sentence resolves to `https://sdd.works/lite/install`.

### Risk

A redirect loop happens if `/lite/install` is also listed as a redirect to itself. The rewrite and the redirect must use different sources. Deploy both in one image so production does not 404 the new path while partners still use the old one.

## Date

2026-10-19
