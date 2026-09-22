---
title: SDD Scrum guide
type: framework-guide
status: stub
as_of: 2026-09-22
related:
  - sdd-scrum-practices.md
  - product-backlog.md
  - artifacts-map.md
  - status.md
---

# SDD Scrum guide

This file is the **single source of truth** for names and meaning in the refined Scrum framework in Spec-Driven Development (SDD): terminologies, artifacts, and events.

What to do, how, and when (including the eight agent jobs) lives in [`sdd-scrum-practices.md`](./sdd-scrum-practices.md). That file does **not** redefine terms.

Content is filled across three MVPs. Do not treat empty sections as finished.

## 1. Terminologies

**OGT** (on-going task): a small task created while executing an SBI. OGT rows are written only in [`status.md`](./status.md), never in the sprint backlog.

*(MVP 1 — remaining terms)*

## 2. Artifacts

**Process** (at least): product backlog, sprint backlog, artifacts map.

**Tracking** (not a second sprint backlog): [`status.md`](./status.md) (current sprint, current SBI, next, OGT table) and [`change-log.md`](./change-log.md) (conclusion-level changes).

**Knowledge** (framework; used by the retrospective skill): [`adr/`](./adr/) for durable decisions, [`knowledge/`](./knowledge/) for reusable notes that are not themselves a decision. Create these trees when needed; they are not optional product extras.

**Optional / JIT**: architecture, deployment, and `{component}-stories` / `{component}-design` / `{component}-test` are not required. Projects add them when they need them; the coach supplies just-in-time guidance later. Instances for this project are listed only in [`artifacts-map.md`](./artifacts-map.md).

**Seeds vs working copies**: files under `.cursor/templates/framework.sdd.works/<locale>/` are seeds. Live process, tracking, and knowledge files under the artifacts root (default `specs/`) are working copies. Do not treat seeds as the running process. When to copy or refresh is in [`sdd-scrum-practices.md`](./sdd-scrum-practices.md#templates).

*(MVP 1 — one-line role each; MVP 3 — maintenance rules)*

## 3. Events

Named events include at least: `plan`, `track`, `retrospective`.

*(MVP 1 — names only; MVP 2 — definition and skill each event calls)*

## 4. To be decided

*(MVP 1 — list open questions.)*
