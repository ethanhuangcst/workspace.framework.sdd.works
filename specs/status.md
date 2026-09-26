<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-26
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint-backlog.md
related:
  - product-backlog.md
  - change-log.md
  - artifacts-map.md
  - sprint-backlog.md
---



# status of the current sdd-scrum process

## Project Progress

Initialization and sprint milestones. Sprint Backlog remains the SBI list. Do not duplicate ToDo/WIP/Done columns here.

### Project initialization

- framework.sdd.works installed at `~/.cursor/` — Done (user root; ADR-056)
- artifacts root and map: `specs/artifacts-map.md` — Done
- `specs/product-backlog.md` created and in use — Done

### Sprint 1

- Seed tree `specs/framework.seeds/templates/EN/` holds the EN guide and practices — Done (user confirmed 2026-09-25)
- HanS guide is Sprint 15 — not a Sprint 1 item
- Root `specs/sdd-scrum-guide.md` and `specs/sdd-scrum-practices.md` removed; process docs point at the seed tree — Done
- Agent spike: call-up and job recorded in agent-design — Done
- Phase 1 archive under `phase1-process-specs/` — Done
- Sprint 1 closed — Done

### Sprint 2

- Current sprint. Status WIP.
- feature-02 is Done: `specs/framework.seeds/agents/ethan.md`, frontmatter name `ethan`.
- feature-01 is Done: first install copies the allow-list and writes a file-level `.sdd-installed.json` with `pack_complete: true`. No `framework.sdd.works.json`.
- feature-03 is Done: ethan start reads only the ledger; stop without true `pack_complete`.
- feature-06 is Done: update deletes only recorded pack files; an old folder name does not delete the skill directory.
- feature-07 is Done: same commit does not replace file bytes; missing `pack_complete` rewrites the flag only.
- feature-08 is Done: a new commit replaces recorded files and sets `pack_complete` true.
- feature-09 is Done: a failed download leaves the client folder and ledger unchanged.
- feature-05 is Done: the setup markdown downloads `~/.sdd/sdd-mcp`, writes a `command` entry, HTTP URL as fallback. Public path `GET /setup` is [ADR-061](./adr/ADR-061-setup-prompt-public-path.md); the route is `backend-01`.
- feature-04 is Done: `constants.md` seed confirmed. Lives at `templates/constants.md`; live path is client-root only ([ADR-060](./adr/ADR-060-constants-on-client-root.md)).
- feature-14 is Done: build and place `~/.sdd/sdd-mcp` ([MCP-02](./product-backlog.md#pb-75)). `npm run mcp:build` + `npm run mcp:place` produce the host binary. Setup starts that local file when present and does not download an executable. Ethan confirmed usable from TRAE CN on 2026-09-26 (OGT-1). TRAE CN user MCP path recorded in `GET /setup` `2026-09-26.v4` (OGT-2). Committed and story records closed 2026-09-26 (OGT-3, OGT-4).
- feature-10 is Done: instructions page re-design — Setup / Features tabs, fixed catalog, inert secret form ([Web-portal-05](./product-backlog.md#pb-71)). User confirmed usable 2026-09-25.
- feature-11 is Done: the instructions page copies `Fetch and execute the setup instructions from https://framework.sdd.works/setup` in every locale ([Web-portal-06](./product-backlog.md#pb-72), [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)).
- feature-12 is Done: manual setup shows one `command` `mcp.json` (no second HTTP sample, no `curl | sh`).
- feature-13 is Done: instructions-page copy test covers the one-line setup sentence and the single `command` sample.
- backend-01 is Done: `GET /setup` serves the stdio prompt; local `PUBLIC_BASE_URL` rewrites pack base and MCP URL; `GET /agent-setup` redirects to `/setup`.
- [Web-portal-07](./product-backlog.md#pb-73) (Features tab / `features.md`) moved to Sprint 3 as feature-07.
- Sprint 3 also has feature-04 through feature-06: the Features tab looks up one secret by name ([Web-portal-08](./product-backlog.md#pb-74)). The setup prompt stays without a token.
- [Web-portal-09](./product-backlog.md#pb-76) is Done: `/` is the instructions guide, fixed footer, reset → login, password gate. WA-01–WA-04 closed.

## where we are now:

- Which sprint are we working on now: **Sprint 2** (WIP). Sprint 1 is Done. Feature-14 and Web-portal-06 slices (feature-11–13, backend-01) are Done. Pack copy, GitHub Releases upload, and admin-portal sync remain go-live work outside Spec-seeds.
- What SBI are we working on now: none in the feature-14 close-out set. Next Sprint 2 open work is go-live (pack publish / Releases), not a new installer story.
- Design decision recorded: end-user stdio primary with HTTP fallback ([ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md)). The ledger lists pack files, not folder names ([ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)). Pack lookup is `constants.md` on the client root ([ADR-060](./adr/ADR-060-constants-on-client-root.md)). The paste URL is `GET /setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)). MCP-01 installer client-root scenarios C1–C8 and C2b are implemented. Agent-setup prompt body is feature-05. Instructions page re-design is feature-10. Local binary is feature-14 / [MCP-02](./product-backlog.md#pb-75).

## what could be the next:

- Go-live: pack copy, GitHub Releases for the five `sdd-mcp` binaries, admin-portal sync.
- Sprint 3: Features tab / `features.md` ([Web-portal-07](./product-backlog.md#pb-73)) and Get secret ([Web-portal-08](./product-backlog.md#pb-74)).

## Current on-going tasks
<!-- 
To keep tracking the temporary on-going tasks. (OGT, On-Going-Tasks)
OGT is different from the Sprint Backlog Items (SBIs) in sprint-backlog.md. They are the samller tasks created when AI agents are executing the SBI. Many of them are created by agents in PLAN mode and rely on agents to manage them, or created by human as the temporary tasks.
-->

Feature-14 close-out — all four Done 2026-09-26.

1. **Done** — Usability from a listed agent (TRAE CN), closed 2026-09-26. `tools/list` on `/Users/ethanhuang/.sdd/sdd-mcp` with `SDD_SERVER_URL=http://127.0.0.1:3040` returned exactly `sdd_list_versions`, `sdd_install_framework`, and `sdd_update_framework` (server `framework.sdd.works` 0.1.0). `sdd_get_key` was absent. After a TRAE CN reload, `sdd_list_versions` matched the live local server (fixture catalog `v1.0.0` / `v0.9.0` after the dev-server sync replaced the earlier `main` cache). Ethan closed this task.
2. **Done** — TRAE CN user MCP path, closed 2026-09-26. Manage page loads `~/Library/Application Support/Trae CN/User/mcp.json` (sibling of that app's `settings.json`). `~/.trae-cn/mcp.json` and `~/.trae/mcp.json` are not that list. Project MCP stays `<workspace>/.trae/mcp.json` when Enable Project MCP is on. `GET /setup` (setup version `2026-09-26.v4`) names the TRAE CN user file for primary and HTTP fallback and tells the agent not to write the other two homes. Recorded in `client.paths.md`, `read-client-config-results.md`, `mcp-stories.md` AC5, and `sdd-api.test.ts`.
3. **Done** — Commit the feature-14 tree: `src/mcp/create-server-stdio.ts`, `src/mcp/local-binary.test.ts`, `src/core/tools/install-http.ts`, `src/mcp/server-options.ts`, `scripts/place-mcp-binary.sh`, and the edits to `src/mcp/stdio.ts`, `src/mcp/create-server.ts`, `src/core/tools/install.ts`, `package.json`, `public/agent-setup/prompt.md`, and matching specs/tests.
4. **Done** — Close the story records. `status.md` marks feature-12, feature-13, and feature-14 Done. Product backlog marks [MCP-02](./product-backlog.md#pb-75) and [Web-portal-06](./product-backlog.md#pb-72) Done. Sprint backlog marks feature-14 Done. Retrospective run at close.
