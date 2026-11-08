# Go-live plan — 2026-11-08 repository split

> Dated supplement to [release.md](../../release.md). This release ships `origin/main` at **`2a3b839c28a0dd330f68522b85b5ebb3928dd96c`**. Handbook §6 and §7 stay authoritative.

## What the new image adds

| Change | Detail | Commit |
| --- | --- | --- |
| Lite prompt files live in `lite-prompts/` | Public URLs stay the same. Version lines are `2026-11-08.v1`. | `0ff9a56` |
| App split into `app/web`, `app/mcp`, `app/shared` | One package, one GHCR image. MCP command is `["npx", "tsx", "app/mcp/http-server.ts"]`. | `1a7c9c9` |
| Standalone tree stays nested | Flattening broke the Prisma client symlink. Production deps come from `npm ci --omit=dev`. | `b5d50ff` |
| Web entrypoint is copied into the runner | Without the file, the Node image runs the path with `node` and the web container crash-loops. | `2a3b839` |

## Production smoke (2026-11-09 00:18 UTC+8)

Image `2a3b839c28a0dd330f68522b85b5ebb3928dd96c` on both containers.

| Check | Result |
| --- | --- |
| `GET /`, `/instructions`, `/login`, `/setup`, `/setup/node`, `/lite/install` | 200 |
| `GET /agent-setup` | 307 `https://sdd.works/setup` |
| `GET /setup/install` | 307 `https://sdd.works/lite/install` |
| `GET /en/home-en` | 301 `https://sdd.works/instructions` |
| `GET framework.sdd.works/instructions` | 301 `https://sdd.works/instructions` (no port) |
| `POST framework.sdd.works/api/github/webhook` | 401 (not 301) |
| `GET www.sdd.works/` | 301 `https://sdd.works/` (via Cloudflare address; local resolver missed the name) |
| Lite version / Node version | `2026-11-08.v1` |
| `GET /api/setup/node/catalog` | 200 JSON, `node_lts` `22.14.0` |
| `GET /api/sdd/versions` | 200, pack commit `3966e42b8491797c632425939337dd2fc42a9009` |
| `GET /api/sdd/lite/files` | 200 |
| `GET /api/sdd/package?version=latest` | 200 gzip, `x-sdd-commit` matches versions |
| `POST /mcp` initialize, no bearer | 200, server `framework.sdd.works` |
| `tools/list` | `sdd_get_key`, `sdd_install_framework`, `sdd_update_framework` |

## Rollback

1. Set `IMAGE_TAG` to `58515f94bc9f8af0db6fc418e6335e7e40ac8f93`.
2. Set the MCP command back to `["npx", "tsx", "src/mcp/http-server.ts"]`.
3. Recreate with image pull. Do not prune volumes. Save both NPM proxy hosts again.

`b5d50ff` is not a rollback target: its web container crash-loops because the entrypoint script is absent.

## Done when

- [x] `IMAGE_TAG` `2a3b839c28a0dd330f68522b85b5ebb3928dd96c` running (2026-11-09)
- [x] §7.1, §7.2, §7.3, §7.4 curls above pass
- [x] User close confirm for feature-100 (2026-11-09)
