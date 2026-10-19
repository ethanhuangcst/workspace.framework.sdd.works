---
title: Proxy port leaks into middleware redirects
type: ops-lesson
status: active
as_of: 2026-10-19
tags:
  - web-app
  - deploy
related_spec: specs/release.md
related:
  - specs/go-live/20261019/go-live-plan.md
---

# Proxy port leaks into middleware redirects

## Summary

Behind Nginx Proxy Manager the Next.js middleware `request.nextUrl` carries the container port (3000). Setting `url.host = CANONICAL_HOST` on the cloned `NextURL` keeps that port, so the legacy-host 301 pointed visitors at `https://sdd.works:3000/...`, which Cloudflare does not proxy.

## Evidence

- Pre-flight curl on 2026-10-19: `GET https://framework.sdd.works/instructions` returned `301` with `location: https://sdd.works:3000/instructions`.
- `curl https://sdd.works:3000/` timed out; Cloudflare only proxies a fixed port list that excludes 3000.
- Reproduced on a local production server: `curl -H 'Host: framework.sdd.works:3000' http://127.0.0.1:3112/instructions` returned the same `:3111`-style location.
- Unit tests passed because the test `NextRequest` URLs had no port; the leak needed a request URL that carries one.
- Fix in `src/middleware.ts`: clear `url.port = ""` after setting the host; commit `9eae528`, deployed image `9eae528c...` on 2026-10-19; live location is now `https://sdd.works/instructions`.

## Lesson / guidance

When a middleware builds a redirect from a cloned request URL behind a proxy, clear the port explicitly. Write one unit test whose request URL includes an internal port, so the test reproduces the proxy shape instead of the clean local shape.

## Links

- [release.md](../../release.md) §7.1 legacy-host smoke
- [go-live plan 2026-10-19](../../go-live/20261019/go-live-plan.md)