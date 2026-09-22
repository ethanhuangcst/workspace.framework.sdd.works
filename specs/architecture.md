# Architecture — framework.sdd.works

> **Purpose**: Point at the locked stack and hold Phase 2 decisions. Product behavior belongs in [`product-backlog.md`](./product-backlog.md). Optional / JIT (not a required process artifact).
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).

## 1. Stack

The Phase 1 stack lock remains [`phase1-specs/r1-tech-spec.md`](./phase1-specs/r1-tech-spec.md). Do not copy that document here.

Phase 1 portal and MCP design stay in [`admin-portal/`](./admin-portal/) and [`mcp/`](./mcp/).

## 2. Phase 2 decisions

**coach-ethan product presence: local Cursor agent** (installable prompt in the client `agents/` tree). Remote MCP stays the installer. Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). Decision: [D1](./sprint-backlog.md#rid-d1). Tracking: [coach-ethan](./product-backlog.md#pb-3).
