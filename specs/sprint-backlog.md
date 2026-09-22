# sprint-backlog — framework.sdd.works

> **Purpose**: Short-cycle execution list — what to do, what is blocked, and how to accept it.
> **Single source of truth for schedule and status**: this file. The `Sprint` column in `product-backlog.md` is a projection of this file.
> **Related**: [`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md) · [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) · [`status.md`](./status.md)
> **Numbering**: `#N` is the item number inside that sprint. When citing another document, prefer the item name.
> **Practices**: [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) (what, how, when: jobs, templates, table conventions).
> **Framework**: [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) (names and meaning).
> **as_of**: 2026-09-22

---

## RID Registry (Risks / Impediments / Dependencies)

> This section records risks, impediments, and dependencies only. It does not belong to any sprint.

<!-- Pipe Markdown cannot set table width. HTML width works in Cursor/VS Code preview; GitHub often ignores style. -->

<table width="100%">
<colgroup>
  <col style="width:5%" />
  <col style="width:8%" />
  <col style="width:8%" />
  <col style="width:12%" />
  <col style="width:16%" />
  <col style="width:12%" />
  <col style="width:12%" />
  <col style="width:12%" />
  <col style="width:9%" />
  <col style="width:4%" />
  <col style="width:2%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Severity</th>
<th>Type</th>
<th>Title</th>
<th>Description</th>
<th>Impact</th>
<th>Solution (→ product-backlog)</th>
<th>Related docs</th>
<th>Handling note</th>
<th>Status</th>
<th>Updated</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="rid-d1"></a><strong>D1</strong></td>
<td><strong>Blocking</strong></td>
<td>Dependency</td>
<td>coach-ethan product presence (local Cursor agent)</td>
<td>Ship coach-ethan as a local Cursor agent (installable prompt in the client <code>agents/</code> tree). Remote MCP stays the installer. Local stdio MCP coach is out of scope unless a second client must edit files without Cursor skills.</td>
<td>Resolved: one presence model for product and MVPs.</td>
<td><a href="./product-backlog.md#pb-3">coach-ethan</a></td>
<td><a href="./agent-ethan/agent-design.md"><code>agent-design.md</code></a> · <a href="./architecture.md"><code>architecture.md</code></a> §2 · <a href="./product-backlog.md#pb-8">MVP 1</a></td>
<td>Decision recorded in agent-design.md. No separate ADR required for this choice.</td>
<td>Closed</td>
<td>2026-09-22</td>
</tr>
</tbody>
</table>

> **Severity**: **Blocking** = blocked product ship until closed. D1 is Closed (local Cursor agent).
> **Type**: dependency = work or decision required before the related product item ships.

### RID coverage

| RID | Solution (Backlog item) | Acceptance criteria and design/test location | Sprint location |
|---|---|---|---|
| D1 | [coach-ethan](./product-backlog.md#pb-3) | [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) · [`architecture.md`](./architecture.md) §2 | Closed: local Cursor agent for MVPs and product |

---

## Sprint 1

Sprint Goal: Phase 1 Scrum files are archived, and live process files at `specs/` follow the new shape.

**Status: closed** (every item is complete)

### ToDo

<table width="100%">
<colgroup>
  <col style="width:4%" />
  <col style="width:16%" />
  <col style="width:8%" />
  <col style="width:8%" />
  <col style="width:28%" />
  <col style="width:18%" />
  <col style="width:12%" />
  <col style="width:6%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Item</th>
<th>Category</th>
<th>Module</th>
<th>Acceptance criteria</th>
<th>Related docs</th>
<th>Note</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="s1-spec"></a>1</td>
<td>Phase 2 specs restructure</td>
<td>Task</td>
<td>Specs</td>
<td>Phase 1 files live only under <code>phase1-specs/</code>. Live backlog, sprint backlog, and artifacts map use the new process columns. No application code change.</td>
<td><a href="./product-backlog.md#pb-1">Phase 2 specs restructure</a> · <a href="./artifacts-map.md"><code>artifacts-map.md</code></a></td>
<td>Archive and process-shaped live files are in place.</td>
<td>Done</td>
</tr>
</tbody>
</table>

### Retrospective

**What went well**

- Phase 1 stayed in `phase1-specs/` instead of being rewritten into the new backlog.

**What to improve**

- Start the next story only after one Sprint 2 item is chosen.

**What we learned**

- The `Sprint` column is a projection. Execution status stays in this file.

---

## Sprint 2 — MVP 1: vocabulary and “what now”

Sprint Goal: The guide has vocabulary and named artifacts; a local coach answers what to do now and next without editing files.

**Status: in progress** (items not started)

### ToDo

<table width="100%">
<colgroup>
  <col style="width:4%" />
  <col style="width:16%" />
  <col style="width:8%" />
  <col style="width:8%" />
  <col style="width:28%" />
  <col style="width:18%" />
  <col style="width:12%" />
  <col style="width:6%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Item</th>
<th>Category</th>
<th>Module</th>
<th>Acceptance criteria</th>
<th>Related docs</th>
<th>Note</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="s2-guide"></a>1</td>
<td>Guide MVP 1 slice</td>
<td>Task</td>
<td>Specs</td>
<td><code>sdd-scrum-guide.md</code> has terminologies; named artifacts by category — process (product backlog, sprint backlog, artifacts map), tracking (<code>status.md</code>, change log), knowledge (<code>adr/</code>, <code>knowledge/</code>), optional/JIT (architecture, deployment, <code>{component}-*</code>); events listed by name only; and a TBD section.</td>
<td><a href="./product-backlog.md#pb-5">sdd-scrum-guide</a> · <a href="./product-backlog.md#pb-8">MVP 1</a></td>
<td>Do this before the coach slice.</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="s2-coach"></a>2</td>
<td>Coach MVP 1 — what now</td>
<td>Task</td>
<td>Framework</td>
<td>A local Cursor agent prompt reads the guide plus live backlog and sprint backlog, and answers what to do now and what is next. It does not edit files and does not call skills.</td>
<td><a href="./product-backlog.md#pb-8">MVP 1</a> · <a href="./product-backlog.md#pb-3">coach-ethan</a></td>
<td>Local Cursor agent per <a href="./agent-ethan/agent-design.md">agent-design.md</a>. D1 Closed.</td>
<td>ToDo</td>
</tr>
</tbody>
</table>

Finish item 1, then item 2. Do not start Sprint 3 until both are Done.

### Retrospective

**What went well**

- —

**What to improve**

- —

**What we learned**

- Slash-invoke (`/ethan`) uses Cursor `agents/` trees, not WS-t. Knowledge: [`knowledge/agent/cursor-agent-callup.md`](./knowledge/agent/cursor-agent-callup.md). Design: [`agent-ethan/agent-design.md`](./agent-ethan/agent-design.md) §2.

---

## Sprint 3 — MVP 2: plan event writes sprint backlog

Sprint Goal: The guide defines plan / track / retrospective; the coach runs plan once and updates this file.

**Status: not started**

### ToDo

<table width="100%">
<colgroup>
  <col style="width:4%" />
  <col style="width:16%" />
  <col style="width:8%" />
  <col style="width:8%" />
  <col style="width:28%" />
  <col style="width:18%" />
  <col style="width:12%" />
  <col style="width:6%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Item</th>
<th>Category</th>
<th>Module</th>
<th>Acceptance criteria</th>
<th>Related docs</th>
<th>Note</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="s3-guide"></a>1</td>
<td>Guide MVP 2 slice</td>
<td>Task</td>
<td>Specs</td>
<td>The guide defines events <code>plan</code>, <code>track</code>, and <code>retrospective</code>, and names the skill each calls.</td>
<td><a href="./product-backlog.md#pb-5">sdd-scrum-guide</a> · <a href="./product-backlog.md#pb-9">MVP 2</a></td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="s3-coach"></a>2</td>
<td>Coach MVP 2 — run plan</td>
<td>Task</td>
<td>Framework</td>
<td>The coach runs <code>plan</code> only via a minimal <code>plan</code> skill and updates <code>sprint-backlog.md</code> using practices columns. Track and retrospective are not executed.</td>
<td><a href="./product-backlog.md#pb-9">MVP 2</a> · <a href="./product-backlog.md#pb-6">Process skills</a> (minimal <code>plan</code> only)</td>
<td>—</td>
<td>ToDo</td>
</tr>
</tbody>
</table>

### Retrospective

**What went well**

- —

**What to improve**

- —

**What we learned**

- —

---

## Sprint 4 — MVP 3: chat maintains backlog and change log

Sprint Goal: The guide states maintenance rules; the coach applies a small backlog refinement and a change-log entry from chat.

**Status: not started**

### ToDo

<table width="100%">
<colgroup>
  <col style="width:4%" />
  <col style="width:16%" />
  <col style="width:8%" />
  <col style="width:8%" />
  <col style="width:28%" />
  <col style="width:18%" />
  <col style="width:12%" />
  <col style="width:6%" />
</colgroup>
<thead>
<tr>
<th>#</th>
<th>Item</th>
<th>Category</th>
<th>Module</th>
<th>Acceptance criteria</th>
<th>Related docs</th>
<th>Note</th>
<th>Status</th>
</tr>
</thead>
<tbody>
<tr>
<td><a id="s4-guide"></a>1</td>
<td>Guide MVP 3 slice</td>
<td>Task</td>
<td>Specs</td>
<td>The guide states maintenance rules for product-backlog, sprint-backlog, change-log, and artifacts-map (what the coach may change).</td>
<td><a href="./product-backlog.md#pb-5">sdd-scrum-guide</a> · <a href="./product-backlog.md#pb-10">MVP 3</a></td>
<td>—</td>
<td>ToDo</td>
</tr>
<tr>
<td><a id="s4-coach"></a>2</td>
<td>Coach MVP 3 — maintain artifacts</td>
<td>Task</td>
<td>Framework</td>
<td>From a chat turn, the coach applies one small backlog refinement and appends one change-log entry. Local Cursor agent per <a href="./agent-ethan/agent-design.md">agent-design.md</a>.</td>
<td><a href="./product-backlog.md#pb-10">MVP 3</a> · <a href="./change-log.md"><code>change-log.md</code></a></td>
<td>—</td>
<td>ToDo</td>
</tr>
</tbody>
</table>

### Retrospective

**What went well**

- —

**What to improve**

- —

**What we learned**

- —
