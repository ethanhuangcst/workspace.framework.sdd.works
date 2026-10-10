# Architecture — framework.sdd.works

> **Purpose**: Point at the locked stack and hold Phase 2 decisions. Product behavior belongs in [`product-backlog.md`](./product-backlog.md). Optional / JIT (not a required process artifact).
> **Practices**: [`sdd-scrum-practices.md`](../pack.framework.sdd.works/templates/framework.sdd.works/sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`pack-scrum-in-sdd.md`](../pack.framework.sdd.works/templates/framework.sdd.works/pack-scrum-in-sdd.md) (names and meaning).

## 1. Stack

The Phase 1 stack lock remains [`phase1-process-specs/r1-tech-spec.md`](./phase1-process-specs/r1-tech-spec.md). Do not copy that document here.

Phase 1 portal and MCP design stay in [`admin-portal/`](./admin-portal/) and [`mcp/`](./mcp/).

## 2. Pack sync cache (MCP-07)

The portal and MCP containers share one on-disk package cache (`SDD_PACKAGE_CACHE_DIR`). Admin Framework sync materializes the pack GitHub repo into that cache. Lite file links, package GET routes, and full MCP install read the cache on production after sync ([`mcp-design.md`](./mcp/mcp-design.md#25-production-pack-sync-feature-82--mcp-07) §2.5, [feature-82](./sprint-backlog.md#sprint-9)).

## 3. Phase 2 decisions

**coach-ethan product presence: local Cursor agent** (installable prompt in the client `agents/` tree). Remote MCP stays the installer. Design: [`framework/framework-design.md`](./framework/framework-design.md). Decision: [D1](./sprint-backlog.md#rid-d1). Tracking: [Agent-01](./product-backlog.md#L63).
