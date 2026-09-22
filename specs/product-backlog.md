# Product overview — framework.sdd.works

> **Purpose**: Record what framework.sdd.works must do in Phase 2, where the boundary is, and how to accept it.
> **Status**: v1.2 · as_of 2026-09-22
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint-backlog.md`](./sprint-backlog.md) · [`artifacts-map.md`](./artifacts-map.md)
> **Conventions**: Column definitions and status meanings are in [`sdd-scrum-practices.md`](./sdd-scrum-practices.md).
> **Framework (Scrum in SDD)**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) is the single source of truth for the refined Scrum framework.
> **Schedule**: The `Sprint` column in the backlog table is a projection of [`sprint-backlog.md`](./sprint-backlog.md). Schedule changes belong in that file.
> **Phase 1 archive**: [`phase1-specs/`](./phase1-specs/) (closed). Do not reopen those items here.

framework.sdd.works is an MCP service plus an admin portal that installs and updates an SDD framework in the calling AI client. Phase 1 is closed. Phase 2’s top priority is to define the refined Scrum-in-SDD guide and prove coach-ethan in three small MVPs. Other Phase 2 themes stay on the backlog until those MVPs finish.

---------
## Scope boundary

### What Phase 2 does (priority first)

- Define [`sdd-scrum-guide.md`](./sdd-scrum-guide.md): terminologies, events, artifacts, and sections still to be decided.
- Build `coach-ethan` in three MVPs: “what now”, run one event (`plan`), then chat that maintains backlog and change log.
- Presence is a **local Cursor agent** ([D1](./sprint-backlog.md#rid-d1) Closed). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md).

Acceptance → [Backlog “sdd-scrum-guide”](#pb-5) · [Backlog “coach-ethan”](#pb-3) · [Backlog “MVP 1”](#pb-8) · [Backlog “MVP 2”](#pb-9) · [Backlog “MVP 3”](#pb-10)

### Later Phase 2 themes (not on the current MVP sprints)

- Install every top-level folder in the synced git package. → [Backlog “Install whole git artifacts”](#pb-2)
- Ship four process templates. → [Backlog “Artifact templates”](#pb-4)
- Ship the full six process skills. → [Backlog “Process skills”](#pb-6)
- Update the portal Instructions page. → [Backlog “Instructions page”](#pb-7)

### Explicitly out of scope

- **Rewriting Phase 1 portal or MCP behavior.**
- **Hosting coach-ethan on remote MCP** (installer MCP stays separate; see agent design).
- **Implementing install, the full skill pack, templates, or Instructions UI** while MVP 1–3 are the active sequence.

---------
# Requirements

> Executable detail is in the Product Backlog table. Back-references prefer the item name.

---------
## [Specs] Process files and guide

- Archive Phase 1 Scrum files. → [Backlog “Phase 2 specs restructure”](#pb-1)
- Write the refined Scrum-in-SDD framework in [`sdd-scrum-guide.md`](./sdd-scrum-guide.md). → [Backlog “sdd-scrum-guide”](#pb-5)

---------
## [Framework] coach-ethan (MVP sequence)

- Parent: coach that guides practices, runs events via skills, maintains artifacts, and chats. Presence: local Cursor agent — [`agent-design.md`](./agent-ethan/agent-design.md). → [Backlog “coach-ethan”](#pb-3)
- MVP 1: vocabulary in the guide; coach answers what to do now / next (read-only). → [Backlog “MVP 1 vocabulary and what now”](#pb-8)
- MVP 2: events defined in the guide; coach runs `plan` and updates `sprint-backlog.md`. → [Backlog “MVP 2 plan event”](#pb-9)
- MVP 3: maintenance rules in the guide; coach refines the backlog and appends to the change log. → [Backlog “MVP 3 chat maintains artifacts”](#pb-10)

---------
## [Framework] Later themes

- Install, templates, full skills pack, Instructions page. → [pb-2](#pb-2) · [pb-4](#pb-4) · [pb-6](#pb-6) · [pb-7](#pb-7)

---------
# Product Backlog

<!-- Pipe Markdown cannot set table width. HTML width works in Cursor/VS Code preview; GitHub often ignores style. -->

<table width="100%">
<colgroup>
  <col style="width:3%" />
  <col style="width:8%" />
  <col style="width:10%" />
  <col style="width:14%" />
  <col style="width:20%" />
  <col style="width:22%" />
  <col style="width:13%" />
  <col style="width:5%" />
  <col style="width:5%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Category</th>
<th>Parent</th>
<th>Title</th>
<th>Description</th>
<th>Acceptance criteria</th>
<th>Related</th>
<th>Sprint</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="pb-1"></a>1</td>
<td>[Specs]</td>
<td>—</td>
<td>Phase 2 specs restructure (SPEC-01)</td>
<td>Archive Phase 1 under <code>phase1-specs/</code>. Live process files use this shape.</td>
<td>Phase 1 Scrum files are only under <code>phase1-specs/</code>. Live process files exist at <code>specs/</code> for this product. No application code change for this item.</td>
<td><a href="./sprint-backlog.md#s1-spec">Sprint 1 “Phase 2 specs restructure”</a> · <a href="./artifacts-map.md"><code>artifacts-map.md</code></a></td>
<td>Sprint 1</td>
<td>Done</td>
</tr>
<tr>
<td><a id="pb-2"></a>2</td>
<td>[Framework]</td>
<td>—</td>
<td>Install whole git artifacts (ARTIFACTS-01)</td>
<td>Install and update copy every top-level folder in the synced git package, not only skills, rules, agents, and workflows.</td>
<td>The copied set matches the package’s top-level folders. Stdio and HTTP follow ADR-054. MCP design and stories are updated when this story is implemented.</td>
<td>—</td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-3"></a>3</td>
<td>[Framework]</td>
<td>—</td>
<td>coach-ethan (COACH-01)</td>
<td>Agent that coaches SDD-refined Scrum: guides what to do now and next, runs events by calling skills, maintains process artifacts, and replies from chat input. Delivered as three MVPs. Presence is a local Cursor agent (installable prompt in <code>agents/</code>). Design: <a href="./agent-ethan/agent-design.md"><code>agent-design.md</code></a>.</td>
<td>MVP 1–3 each meet their own acceptance criteria. Presence matches <a href="./sprint-backlog.md#rid-d1">D1</a> (Closed). The agent is not shipped as a remote MCP coach.</td>
<td><a href="#pb-8">MVP 1</a> · <a href="#pb-9">MVP 2</a> · <a href="#pb-10">MVP 3</a> · <a href="./agent-ethan/agent-design.md">agent-design.md</a> · <a href="./architecture.md">architecture.md</a> §2 · <a href="./sprint-backlog.md#rid-d1">D1</a></td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-4"></a>4</td>
<td>[Framework]</td>
<td>sdd-scrum-guide</td>
<td>Artifact templates (TEMPLATES-01)</td>
<td>Template pack of four files: <code>product-backlog.md</code>, <code>change-log.md</code>, <code>sprint-backlog.md</code>, <code>artifacts-map.md</code>.</td>
<td>The pack contains those four files and no extra required architecture or deployment template. They install with the framework package. The artifacts map lists them.</td>
<td>—</td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-5"></a>5</td>
<td>[Specs]</td>
<td>—</td>
<td>sdd-scrum-guide (GUIDE-01)</td>
<td><a href="./sdd-scrum-guide.md"><code>sdd-scrum-guide.md</code></a> is the single source of truth for the refined Scrum framework in SDD: terminologies, events, artifacts, and other to-be-decided contents. <a href="./sdd-scrum-practices.md"><code>sdd-scrum-practices.md</code></a> stays the writing convention only (columns, statuses, RID).</td>
<td>The file has sections for terminologies, events, artifacts, and TBD. Other docs link here for framework meaning instead of restating it. Practices.md does not claim to own the framework.</td>
<td><a href="./sprint-backlog.md#s2-guide">Sprint 2 “Guide MVP 1 slice”</a> · <a href="./sprint-backlog.md#s3-guide">Sprint 3</a> · <a href="./sprint-backlog.md#s4-guide">Sprint 4</a> · <a href="./artifacts-map.md"><code>artifacts-map.md</code></a></td>
<td>Sprint 2</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-6"></a>6</td>
<td>[Framework]</td>
<td>sdd-scrum-guide</td>
<td>Process skills (SKILLS-01)</td>
<td>Skills, plus rules or workflows where needed: <code>Initiate_project</code>, <code>organize_artifacts</code>, <code>backlog_refinement</code>, <code>plan</code>, <code>track</code>, <code>retrospective</code>. MVP 2 only needs a minimal <code>plan</code> skill; the full pack stays here.</td>
<td>Each name exists as an installable skill. Each is mapped to one Scrum event in the guide.</td>
<td><a href="#pb-5">sdd-scrum-guide</a></td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-7"></a>7</td>
<td>[Portal]</td>
<td>coach-ethan</td>
<td>Instructions page (INSTRUCT-01)</td>
<td>Update the portal Instructions page for full-repo install, the four templates, the process skills, and coach-ethan.</td>
<td>The page states the install set, names the four templates and six skills, and names coach-ethan. Copy is i18n keys.</td>
<td><a href="./admin-portal/app-stories.md"><code>admin-portal/app-stories.md</code></a></td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-8"></a>8</td>
<td>[Framework]</td>
<td>coach-ethan</td>
<td>MVP 1 — vocabulary and what now (COACH-MVP1)</td>
<td>Guide slice: terminologies; name the artifacts (product backlog, sprint backlog, change log, artifacts map); list events by name only; TBD section. Coach slice: local agent reads the guide plus live backlog and sprint backlog; answers what to do now and what is next. Does not edit files and does not call skills. Presence: <a href="./agent-ethan/agent-design.md">agent-design.md</a>.</td>
<td>Guide sections for terms, named artifacts, named events, and TBD exist. A local coach prompt answers “what now / what next” from those files without writing the repo.</td>
<td><a href="./sprint-backlog.md#s2-guide">Sprint 2 “Guide MVP 1”</a> · <a href="./sprint-backlog.md#s2-coach">Sprint 2 “Coach MVP 1”</a> · <a href="#pb-5">sdd-scrum-guide</a> · <a href="./agent-ethan/agent-design.md">agent-design.md</a></td>
<td>Sprint 2</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-9"></a>9</td>
<td>[Framework]</td>
<td>coach-ethan</td>
<td>MVP 2 — plan event writes sprint backlog (COACH-MVP2)</td>
<td>Guide slice: define events <code>plan</code>, <code>track</code>, <code>retrospective</code> and which skill each calls. Coach slice: run <code>plan</code> only via a minimal <code>plan</code> skill and update <code>sprint-backlog.md</code> using practices columns. Track and retrospective are named, not executed.</td>
<td>The guide defines the three events and skill names. The coach can run plan once and leave a valid ToDo row or status change in <code>sprint-backlog.md</code>.</td>
<td><a href="./sprint-backlog.md#s3-guide">Sprint 3 “Guide MVP 2”</a> · <a href="./sprint-backlog.md#s3-coach">Sprint 3 “Coach MVP 2”</a> · <a href="#pb-5">sdd-scrum-guide</a></td>
<td>Sprint 3</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="pb-10"></a>10</td>
<td>[Framework]</td>
<td>coach-ethan</td>
<td>MVP 3 — chat maintains backlog and change log (COACH-MVP3)</td>
<td>Guide slice: maintenance rules for product-backlog, sprint-backlog, change-log, artifacts-map. Coach slice: reply from chat plus those files; apply a small backlog refinement and append a change-log entry. Local Cursor agent per <a href="./agent-ethan/agent-design.md">agent-design.md</a>.</td>
<td>The guide states what the coach may change. One refinement appears in the backlog and one entry in the change log after a coach turn.</td>
<td><a href="./sprint-backlog.md#s4-guide">Sprint 4 “Guide MVP 3”</a> · <a href="./sprint-backlog.md#s4-coach">Sprint 4 “Coach MVP 3”</a> · <a href="#pb-5">sdd-scrum-guide</a> · <a href="./agent-ethan/agent-design.md">agent-design.md</a></td>
<td>Sprint 4</td>
<td>ToDo</td>
</tr>
</tbody>
</table>

---------

## Change record

| Date | Change |
| --- | --- |
| 2026-09-21 | Replaced the sample-product draft with Phase 2 items SPEC-01, ARTIFACTS-01, COACH-01, and TEMPLATES-01. |
| 2026-09-21 | Split Phase 2: practices SSOT, four templates, six process skills, coach-ethan (presence TBD), Instructions page. |
| 2026-09-22 | Priority: `sdd-scrum-guide.md` as framework SSOT; coach-ethan as three MVPs (Sprint 2–4); other themes cleared from Sprint. |
| 2026-09-22 | coach-ethan presence: local Cursor agent ([D1](./sprint-backlog.md#rid-d1) Closed). Design at [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md). |
