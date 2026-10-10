---
title: Lite pack allow-list is a pack file
type: ops-lesson
status: active
as_of: 2026-10-10
tags:
  - mcp
  - lite-install
related_spec: specs/mcp/mcp-design.md
related:
  - specs/adr/ADR-107-lite-pack-allowlist-filename.md
---

# Lite pack allow-list is a pack file

## Summary

`lite-pack.allowlist.json` is a file at the root of the framework pack repository. It is not application source. Admin Framework sync copies it into the package cache. A portal image deploy does not copy that file by itself.

## Evidence

- Authoring copy: `pack.framework.sdd.works/lite-pack.allowlist.json`.
- After local sync on 2026-10-10, `GET /api/sdd/versions` listed `lite-pack.allowlist.json` under `inventory.other` for commit `3d5880c042f00547ba9716c2957f80e56464e14b`.
- `GET http://127.0.0.1:3040/api/sdd/lite/files` returned 200 and 13 paths from that file.
- The same path on `https://sdd.works` returned HTML 404 on 2026-10-10 because the deployed image did not include `src/app/api/sdd/lite/files/route.ts`. The allow-list was already in the production cache inventory.

## Lesson / guidance

On the next deploy, ship the portal image that contains the lite routes, then run Framework sync if `latestCommit` is behind the pack repo. Confirm `inventory.other` still names `lite-pack.allowlist.json` and that `GET /api/sdd/lite/files` returns JSON 200.

## Links

- [mcp-design.md](../../mcp/mcp-design.md) §2.5
- [ADR-107](../../adr/ADR-107-lite-pack-allowlist-filename.md)
