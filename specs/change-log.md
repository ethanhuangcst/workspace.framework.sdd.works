# Change log (framework.sdd.works)

> This file records conclusion-level changes for Phase 2: what changed, why, and how it was verified.
> Step-by-step detail stays in `git log` and in each spec. This file does not replace any spec.
> **Scope**: [`product-backlog.md`](./product-backlog.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md) · [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) · [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md)
> Phase 1 history stays in git and [`phase1-specs/`](./phase1-specs/). Do not put secrets here.

---

## 2026-09-22

### Artifact taxonomy: guide vs practices; process / tracking / knowledge / optional

**Why**: Live pointers still said practices were “columns only.” The guide and map mixed process, tracking, and knowledge. Seeds under `.cursor/templates/` would reinstall that story.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) names process, tracking, knowledge, and optional/JIT artifacts, plus seeds vs working copies. [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) owns eight jobs and Templates (what/how/when). [`artifacts-map.md`](./artifacts-map.md) regroups by those categories. Sprint/product AC (`s2-guide`, pb-8), architecture/deployment headers, and agent-design/test pointers aligned. EN and HanS templates updated to match.

**Verification**: Map has Framework / Process / Tracking / Knowledge / Optional / This product sections. No remaining “writing conventions only” claim in live headers. Historical entries below keep their original wording.

**Boundary**: Does not fill remaining MVP 1 terms or implement Coach MVP 1.

### Rename agent-ethan folder and sprint-backlog file

**Why**: Shorter agent design path; the execution file is the Sprint Backlog, not a separate “plan” filename.

**What changed**: `specs/agent-coach-ethan/` → [`specs/agent-ethan/`](./agent-ethan/). Live and EN-template `sprint-plan.md` → [`sprint-backlog.md`](./sprint-backlog.md). Links in process docs retargeted. HanS template still uses `sprint_plan.md` until that pack is aligned.

**Verification**: No remaining `agent-coach-ethan` or `sprint-plan.md` paths under live `specs/` (Phase 1 `sprintN-plan.md` archive names unchanged).

**Boundary**: Does not implement the coach prompt or fill the Scrum guide.

### coach-ethan presence: local Cursor agent

**Why**: The coach must edit project specs, call Cursor skills, chat, and AskQuestion. Remote MCP cannot own the user’s `specs/` folder.

**What changed**: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) records presence, jobs, knowledge loading, and MVP capabilities. [D1](./sprint-backlog.md#rid-d1) is Closed (local Cursor agent). [`architecture.md`](./architecture.md) §2, [`artifacts-map.md`](./artifacts-map.md), and coach rows in [`product-backlog.md`](./product-backlog.md) point at that design.

**Verification**: Design file states local agent and non-goals. RID D1 status is Closed. No agent prompt file and no skill implementation in this change.

**Boundary**: This does not implement the coach prompt, fill the Scrum guide, or build process skills.

### Three MVPs for sdd-scrum-guide and coach-ethan

**Why**: The framework definition and the coach were one wide backlog row each. Feasibility needs small, complete loops of guide plus coach.

**What changed**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is the framework SSOT (stub sections). [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) stays writing conventions only. coach-ethan is a parent with MVP 1–3 (pb-8–10) on Sprint 2–4. Install, templates, full skills, and Instructions leave the current sprint. D1 notes that local Cursor agent is the feasibility path; MCP is undecided.

**Verification**: Sprint 2 has guide + coach MVP 1 rows. Sprint 3 and 4 exist for MVP 2 and 3. pb-2, pb-4, pb-6, pb-7 have empty Sprint. No agent prompt body and no guide prose beyond stubs.

**Boundary**: This does not implement the coach, the `plan` skill, or fill the guide.

## 2026-09-21

### Phase 2 backlog split into install, practices, templates, skills, coach-ethan, and Instructions

**Why**: One coach item and a wide template list hid the practices file, the six process skills, and the Instructions page. coach-ethan presence was being treated as already chosen.

**What changed**: [`product-backlog.md`](./product-backlog.md) now has PRACTICES-01, SKILLS-01, and INSTRUCT-01. TEMPLATES-01 is the four process files only. COACH-01 is coach-ethan (prompt, spike, presence TBD). Sprint 2 lists those stories as ToDo. [D1](./sprint-backlog.md#rid-d1) records the MCP-vs-local dependency as Pending.

**Verification**: Each new requirement in the backlog overview has a backlog row (pb-2 through pb-7). Sprint 2 has a matching ToDo row. No application code, skill files, or Instructions UI were changed.

**Boundary**: This does not implement install, write `sdd-scrum-practices.md` as the Scrum framework, or pick MCP vs local.

### Phase 2 specs use the new process shape

**Why**: Phase 1 Scrum files and the copied sample product cannot both be the live backlog. Phase 2 needs process files that can take new stories.

**What changed**: Phase 1 Scrum files stay archived under [`phase1-specs/`](./phase1-specs/). Live [`product-backlog.md`](./product-backlog.md), [`sprint-backlog.md`](./sprint-backlog.md), and [`artifacts-map.md`](./artifacts-map.md) now describe framework.sdd.works Phase 2 only (SPEC-01 done; ARTIFACTS-01, COACH-01, TEMPLATES-01 not started). Earlier portal and MCP entries were removed from this log.

**Verification**: Live process files contain no sample-product rows. `*-old.md` copies are deleted. Links among backlog, sprint backlog, and artifacts map resolve.

**Boundary**: This does not change application code, install scope, or the Phase 1 archive contents.
