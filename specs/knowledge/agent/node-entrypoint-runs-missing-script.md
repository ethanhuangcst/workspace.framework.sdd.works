---
title: Node image entrypoint runs a missing shell script as node
type: ops-lesson
status: active
as_of: 2026-11-09
tags:
  - ops
  - docker
related_spec: specs/go-live/20261108/go-live-plan.md
related:
  - specs/adr/ADR-135-repo-structure-app-web-mcp-shared.md
  - Dockerfile
  - docker-entrypoint-web.sh
---

# Node image entrypoint runs a missing shell script as node

## Summary

The official Node image starts a command with `node` when that command is missing or not executable. Image `b5d50ff` omitted `docker-entrypoint-web.sh` from the runner stage, so `framework-sdd-web` crash-looped with `Cannot find module '/app/docker-entrypoint-web.sh'` while Portainer still showed the container as running. A local directory that invoked the shell script directly did not catch it.

## Evidence

- Production on `b5d50ffa436c59c52c4138a80323dfd0fd03b9c7` returned 502 for `https://sdd.works/` and timed out on `POST /mcp` until NPM was saved, then the web log repeated `MODULE_NOT_FOUND` for `/app/docker-entrypoint-web.sh`.
- The MCP container on the same image stayed up, because its command is `npx tsx app/mcp/http-server.ts` and does not use the web entrypoint.
- `Dockerfile` runner stage copied the standalone tree and production `node_modules` and set `CMD ["./docker-entrypoint-web.sh"]`, and it did not `COPY` the script. Commit `2a3b839` adds `COPY --chmod=755`.
- A hand-assembled `/tmp` tree ran `sh docker-entrypoint-web.sh` and returned 200. That path never executes the Node image entrypoint, so the missing file stayed invisible.

## Lesson / guidance

After a Dockerfile change, start the web container from the built image and read the first log lines for `[entrypoint] starting Next.js web`. Do not treat a reconstructed directory, or a Portainer state of running, as proof the entrypoint file is in the image and executable.

## Links

- [ADR-135](../../adr/ADR-135-repo-structure-app-web-mcp-shared.md)
- [Go-live plan 2026-11-08](../../go-live/20261108/go-live-plan.md)
- [Dockerfile](../../../Dockerfile)
