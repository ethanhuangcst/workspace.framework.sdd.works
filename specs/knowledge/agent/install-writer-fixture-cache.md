---
title: Install writer copied a fixture cache and named GitHub
type: ops-lesson
status: active
as_of: 2026-10-09
tags:
  - mcp
  - install
related_spec: specs/mcp/mcp-design.md
related:
  - specs/adr/ADR-129-url-mcp-server-plan-local-writer.md
---

# Install writer copied a fixture cache and named GitHub

## Summary

A CodeBuddy install on 2026-10-09 copied six stub files over real client files. The tool result told the agent to download the writer from a GitHub release that has no published files. The package the writer copied was the in-process GitHub fixture, not the real pack already stored beside it.

## Evidence

- On 2026-10-09, `writer_required` in `src/core/tools/install-http.ts` set `release_repo` to `https://github.com/ethanhuangcst/workspace.framework.sdd.works/releases`. That repository has no published release, so the download returned 404. The tool result no longer returns that field.
- `.data/sdd-packages/manifest.json` points `latestCommit` at `sha-v1.0.0` with `syncedAt` `2026-10-08T11:38:59.941Z`. The tarball there is 421 bytes. Those bytes match `createFixtureGitHubPort` in `src/github/sync.ts` (`# atdd v1.0.0`, `# reviewer`, `# workflow`).
- A real pack remains at `.data/sdd-packages/ac6605fd35a4ba541f13ee8c368f6f24f41d6b9d/` from 2026-10-08 16:26. The manifest no longer points at it.
- `ensurePackageCacheFresh` returns `fresh` when the live tip equals `latestCommit`. The fixture port's live tip is `sha-` plus the tag, so a fixture sync looks fresh.
- `dist/sdd-mcp-darwin-arm64` and `~/.sdd/sdd-mcp` were built at 2026-10-09 10:46. They contain `--write` and `/api/sdd/install-plan`. They do not contain `cache_stale`. Source for that check was edited at 11:32 and was not compiled. The other four `dist/sdd-mcp-*` files are from 2026-09-25.
- At the time of the incident, Playwright started `npm run dev` with `GITHUB_FIXTURE=1` (`playwright.config.ts`). That flag selected the fixture port. The server now ignores `GITHUB_FIXTURE`. Production has no fixture port.

## Lesson / guidance

A unit suite on a temp cache does not prove the portal cache or the binary on disk. After an install change, rebuild the writer and read the portal's `manifest.json` `latestCommit` before any `--write`. The agent download URL is a path on this server. A GitHub repository URL stays out of the tool result.

## Links

- [mcp-design.md](../../mcp/mcp-design.md) Decisions TBD1–TBD5
- [ADR-129](../../adr/ADR-129-url-mcp-server-plan-local-writer.md)
- [src/github/sync.ts](../../../src/github/sync.ts)
