# Change log (framework.sdd.works)

> This file records conclusion-level changes for Phase 2: what changed, why, and how it was verified.
> Step-by-step detail stays in `git log` and in each spec. This file does not replace any spec.
> **Scope**: [`product-backlog.md`](./product-backlog.md) · [`sprint-plan.md`](./sprint-plan.md) · [`artifacts-map.md`](./artifacts-map.md) · [`sdd-scrum-practices.md`](./sdd-scrum-practices.md)
> Phase 1 history stays in git and [`phase1-specs/`](./phase1-specs/). Do not put secrets here.

---

## 2026-09-21

### Phase 2 backlog split into install, practices, templates, skills, coach-ethan, and Instructions

**Why**: One coach item and a wide template list hid the practices file, the six process skills, and the Instructions page. coach-ethan presence was being treated as already chosen.

**What changed**: [`product-backlog.md`](./product-backlog.md) now has PRACTICES-01, SKILLS-01, and INSTRUCT-01. TEMPLATES-01 is the four process files only. COACH-01 is coach-ethan (prompt, spike, presence TBD). Sprint 2 lists those stories as ToDo. [D1](./sprint-plan.md#rid-d1) records the MCP-vs-local dependency as Pending.

**Verification**: Each new requirement in the backlog overview has a backlog row (pb-2 through pb-7). Sprint 2 has a matching ToDo row. No application code, skill files, or Instructions UI were changed.

**Boundary**: This does not implement install, write `sdd-scrum-practices.md` as the Scrum framework, or pick MCP vs local.

### Phase 2 specs use the new process shape

**Why**: Phase 1 Scrum files and the copied sample product cannot both be the live backlog. Phase 2 needs process files that can take new stories.

**What changed**: Phase 1 Scrum files stay archived under [`phase1-specs/`](./phase1-specs/). Live [`product-backlog.md`](./product-backlog.md), [`sprint-plan.md`](./sprint-plan.md), and [`artifacts-map.md`](./artifacts-map.md) now describe framework.sdd.works Phase 2 only (SPEC-01 done; ARTIFACTS-01, COACH-01, TEMPLATES-01 not started). Earlier portal and MCP entries were removed from this log.

**Verification**: Live process files contain no sample-product rows. `*-old.md` copies are deleted. Links among backlog, sprint plan, and artifacts map resolve.

**Boundary**: This does not change application code, install scope, or the Phase 1 archive contents.
