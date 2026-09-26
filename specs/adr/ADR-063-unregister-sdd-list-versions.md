# ADR-063: Unregister `sdd_list_versions` from MCP

## Status
Accepted

## Context
The MCP server registered four tools historically: `sdd_install_framework`, `sdd_update_framework`, `sdd_list_versions`, and (HTTP only) `sdd_get_key`. `sdd_list_versions` returned package version ids and a high-level pack inventory so the model could choose a version before install.

The person in the IDE installs or updates the latest pack. They do not pick a version from a tool. `sdd_install_framework` already resolves omitted `version` to latest via `resolveCachedVersion` and `GET /api/sdd/package`. A catalog call before install does not change that path.

MCP has no private tool. If a name is on `tools/list`, the model can call it. Keeping `sdd_list_versions` registered wastes a round trip and invites discovery questions the Features tab ([Web-portal-07](../product-backlog.md#pb-73)) owns for people.

Server-side listing still matters for the sync cache, package API, and tests.

## Decision
1. Both stdio and HTTP MCP stop registering `sdd_list_versions`.
2. Keep `listVersions()` in `src/core/tools/list-versions.ts` and `GET /api/sdd/versions` as server-internal APIs. They are not MCP tools.
3. Do not expose the same payload as an MCP resource (for example `sdd://framework/versions`). A resource is still client-visible.
4. `sdd_install_framework` and `sdd_update_framework` keep an optional `version` argument. Omitted or `latest` resolves from the sync cache. An unknown id returns `version_not_found`.
5. Stdio `tools/list` is `sdd_install_framework` and `sdd_update_framework` only. HTTP adds `sdd_get_key`. Setup and instructions copy name those tools only.
6. Phase 1 “four tools” wording under `phase1-process-specs/` stays archived history.

## Rationale
Install already picks latest on the server. A read-only catalog on the tool list does not help the default user path and cannot be “internal” while registered. Pack inventory for people lives on the Features tab. Operators and tests keep the versions REST route.

## Consequences
- [MCP-03](../product-backlog.md#pb-78) owns the change. Sprint 3 feature-08 unregisters the tool and updates the tool-list tests. Feature-09 updates setup and instructions copy.
- Living MCP stories, design §3, and tests no longer expect `sdd_list_versions` on `tools/list`.
- Go-live checklists that still list the tool must be updated when this PBI lands.

## Date
2026-09-26
