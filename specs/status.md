<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: the current status of sdd-scrum execution
type: tracking-spec
status: active
as_of: 2026-09-25
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
- Still ToDo: `constants.md` seed (feature-04). Seed and [ADR-060](./adr/ADR-060-constants-on-client-root.md) are written; user review and seed-tree cross-review are still open.
- feature-10 is Done: instructions page re-design — Setup / Features tabs, fixed catalog, inert secret form ([Web-portal-05](./product-backlog.md#pb-71)). User confirmed usable 2026-09-25.
- feature-11 is Done: the instructions page copies `Fetch and execute the setup instructions from https://framework.sdd.works/setup` in every locale ([Web-portal-06](./product-backlog.md#pb-72), [ADR-061](./adr/ADR-061-setup-prompt-public-path.md)).
- feature-12 and feature-13 are ToDo: manual setup shows one `command` `mcp.json`, and the page copy test covers that sample (page already matches; close after DoD).
- backend-01 is Done: `GET /setup` serves the stdio prompt; local `PUBLIC_BASE_URL` rewrites pack base and MCP URL; `GET /agent-setup` redirects to `/setup`.
- [Web-portal-07](./product-backlog.md#pb-73) (Features tab / `features.md`) moved to Sprint 3 as feature-07.
- Sprint 3 also has feature-04 through feature-06: the Features tab looks up one secret by name ([Web-portal-08](./product-backlog.md#pb-74)). The setup prompt stays without a token.

## where we are now:

- Which sprint are we working on now: **Sprint 2** (WIP). Sprint 1 is Done.
- What SBI are we working on now: none. Remaining ToDo: feature-04, feature-12, and feature-13.
- Pack copy, GitHub push, and admin-portal sync are go-live. They are not a Spec-seeds task.
- Design decision recorded: end-user stdio primary with HTTP fallback ([ADR-058](./adr/ADR-058-stdio-end-user-http-fallback.md)). The ledger lists pack files, not folder names ([ADR-059](./adr/ADR-059-ledger-lists-pack-files.md)). Pack lookup is `constants.md` on the client root ([ADR-060](./adr/ADR-060-constants-on-client-root.md)). The paste URL is `GET /setup` ([ADR-061](./adr/ADR-061-setup-prompt-public-path.md)). MCP-01 installer client-root scenarios C1–C8 and C2b are implemented. Agent-setup prompt body is feature-05. Instructions page re-design is feature-10.

## what could be the next:

- feature-12 / feature-13: close the remaining Web-portal-06 slices (manual `mcp.json` + copy test) — implementation already on `/instructions`.
- feature-04: `specs/framework.seeds/templates/constants.md` holds `instructions_url`, dir names, skill keys, and rule keys. Confirm the seed and the practices writing guidance, then run the seed-tree cross-review.

## Current on-going tasks
<!-- 
To keep tracking the temporary on-going tasks. (OGT, On-Going-Tasks)
OGT is different from the Sprint Backlog Items (SBIs) in sprint-backlog.md. They are the samller tasks created when AI agents are executing the SBI. Many of them are created by agents in PLAN mode and rely on agents to manage them, or created by human as the temporary tasks.
-->

None.
