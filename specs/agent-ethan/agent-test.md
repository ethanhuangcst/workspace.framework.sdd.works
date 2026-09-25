# coach-ethan — test strategy and plan

**Area:** coach-ethan local Cursor agent (start load, ledger gate, missing-file recovery, MVP coaching)
**Design:** [`agent-design.md`](./agent-design.md) · **Stories:** [`agent-stories.md`](./agent-stories.md) · **Backlog:** [Agent-07](../product-backlog.md#pb-17) · [Agent-01](../product-backlog.md#pb-6) · [Agent-03](../product-backlog.md#pb-8)
**Installer reference:** [`../mcp/mcp-design.md`](../mcp/mcp-design.md) (`sdd_install_framework`, `sdd_update_framework`)
**Quality bar:** common-test-strategy — critical path 100% for load/recovery once the prompt exists; overall ≥80% where measurable.

> **Status:** plan · as_of 2026-09-25 · seed prompt exists at [`../framework.seeds/agents/ethan.md`](../framework.seeds/agents/ethan.md). CE-GATE cases match Sprint 2 feature-03. Automation waits on fixture harness. Cases below are expected outcomes for fixture and manual verification.

---

## 1. Strategy

| Layer | Scope | Default CI | Live / manual |
| --- | --- | --- | --- |
| **Unit / fixture** | Search-order resolver; Toggle A/B decision table; no-overwrite rules | When resolver helpers exist | — |
| **Integration** | Prompt + fixture workspace trees; mock MCP install return shape | When prompt exists | — |
| **Manual / E2E** | Real Cursor agent chat; real HTTP MCP install extract | Opt-in | Operator machine |

**Principles**

- Prefer fixture trees under a temp workspace over live `~/.cursor` in default CI.
- Never assert that tarball extraction wrote into `specs/`.
- Never overwrite an existing `specs/` file in Toggle B cases.
- Critical path: ledger gate → find `artifacts-map.md` → load listed process files → Toggle A/B recovery → visible error when both fail.
- MVP 1: coaching edits remain forbidden; Toggle B seed-copy after confirm is allowed as start recovery.

**Abbreviations**

| Token | Meaning |
| --- | --- |
| CR | Client root pack/templates (`~/.cursor` or fixture) |
| WS-t | `<workspace>/.cursor/templates/framework.sdd.works/<locale>/` |
| WS-s | `<workspace>/specs/` |
| Call | Cursor workspace (product repo or opened client root) |

---

## 2. Install ledger gate (`CE-GATE-01` … `CE-GATE-04`)

Matches [`agent-design.md`](./agent-design.md) §2.4 and [`agent-stories.md`](./agent-stories.md) `sdd-ethan-pack-complete-gate`. Ethan reads only `{client_root}/.sdd-installed.json` before any greeting or job list.

| Id | Setup | Act | Assert |
| --- | --- | --- | --- |
| CE-GATE-01 | Ledger file missing at CR | Start ethan | Instructions URL; stop; no job list; no project-file reads; no install/update |
| CE-GATE-02 | Ledger exists; no `pack_complete` field | Start ethan | Same stop as CE-GATE-01 |
| CE-GATE-03 | Ledger has `pack_complete: false` | Start ethan | Same stop as CE-GATE-01 |
| CE-GATE-04 | Ledger has `pack_complete: true` | Start ethan | Continues start load; missing project files are a stage, not a stop |

Instructions URL: `instructions_url` from `{client_root}/templates/framework.sdd.works/constants.md` when that file can be read; otherwise `https://framework.sdd.works/instructions`.

---

## 3. Search-order cases

| Id | Setup | Act | Assert |
| --- | --- | --- | --- |
| CE-ORDER-01 | Same filename in WS-s and WS-t | Start load | Reads WS-s |
| CE-ORDER-02 | Filename only in WS-t and CR | Start load | Prefers WS-t over CR for read when both present and WS-s absent |
| CE-ORDER-03 | Filename only in CR | Start load | Reads CR template |
| CE-ORDER-04 | Map lists process rows; domain `adr/` exists | Start load | Does not load `adr/` at start |
| CE-ORDER-05 | Locale: `EN` and `HanS` both exist under WS-t | Resolve map | Uses `EN` first |
| CE-ORDER-06 | Only `HanS` exists | Resolve map | Uses `HanS` |
| CE-ORDER-07 | Map names `sprint-backlog.md`; disk has `sprint_plan.md` only | Resolve | Documented alias or fail with clear message (implementer picks one rule and tests it) |

---

## 4. Load / recovery matrix (`CE-LOAD-01` … `CE-LOAD-16`)

Matches [`agent-design.md`](./agent-design.md) §6 case table.

| Id | CR | WS-t | Call from | Missing | Toggle | Expected |
| --- | --- | --- | --- | --- | --- | --- |
| CE-LOAD-01 | yes | no | CR | CR files | A | Calls install/update; extract to `extractTarget` / `paths`; files restored under CR |
| CE-LOAD-02 | no | yes | WS | WS-t files | A | MCP then retry; if still missing, stop with visible error; no fake specs |
| CE-LOAD-03 | yes | no | WS | WS-s | B | Ask confirm; copy CR templates → WS-s; then load WS-s |
| CE-LOAD-04 | yes | no | WS | CR | A | MCP repair CR; if WS-s exists, coach from WS-s without blocking on CR templates |
| CE-LOAD-05 | yes | no | WS | CR and WS-s | A then B | MCP repair CR; ask; copy to WS-s; load WS-s |
| CE-LOAD-06 | no | yes | WS | WS-s | B | Ask; copy WS-t → WS-s; load WS-s |
| CE-LOAD-07 | no | yes | WS | WS-t | A | MCP creates CR; then B if WS-s still empty |
| CE-LOAD-08 | no | yes | CR | CR | A | MCP install to CR; does not require deleting WS-t |
| CE-LOAD-09 | yes | yes | WS | CR | A | MCP repair CR; load WS-s if present else WS-t |
| CE-LOAD-10 | yes | yes | WS | WS-t | A | Ignores missing WS-t; uses CR and/or WS-s |
| CE-LOAD-11 | yes | yes | WS | WS-s | B | Ask; copy from WS-t first, else CR; never overwrite if partial WS-s |
| CE-LOAD-12 | yes | yes | WS | both CR and WS-t | A | MCP; then B if WS-s empty |
| CE-LOAD-13 | yes | yes | WS | CR, WS-t, WS-s | A then B | MCP; ask; copy to WS-s |
| CE-LOAD-14 | yes | yes | CR | CR | A | MCP; does **not** write a product `specs/` |
| CE-LOAD-15 | yes | yes | CR | WS-t or WS-s | — | Coaches from CR templates; does not treat WS gaps as this call’s failure |
| CE-LOAD-16 | no | no | WS or CR | all | A | MCP install; if still no map, stop; no invented specs |

---

## 5. Toggle B safety

| Id | Setup | Act | Assert |
| --- | --- | --- | --- |
| CE-SEED-01 | Templates exist; WS-s empty | Start without confirm | No copy until user confirms |
| CE-SEED-02 | User declines seed | Start | No `specs/` writes; explain next step |
| CE-SEED-03 | WS-s has `product-backlog.md`; missing `sprint-backlog.md` | Confirm seed | Copies only missing names; backlog unchanged |
| CE-SEED-04 | WS-t and CR both have templates | Confirm seed | Copy source is WS-t, not CR |
| CE-SEED-05 | No templates after Toggle A failed | Start | No invent; visible error |

---

## 6. MCP install / extract discipline

| Id | Setup | Act | Assert |
| --- | --- | --- | --- |
| CE-MCP-01 | HTTP install returns `packageUrl`, `extractTarget`, `paths`, `manifest` | Agent extracts | Files under `extractTarget` / `paths` only; `specs/` untouched |
| CE-MCP-02 | Manifest lists agent `coach-ethan.md`; file missing on disk | Integrity check | Forces extract (does not skip) |
| CE-MCP-03 | `sdd_update_framework` | Same as install | Same extract rules as `sdd_install_framework` |
| CE-MCP-04 | MCP unavailable; CR incomplete; WS-t absent | Start | Visible error; no silent empty coach |

---

## 7. MVP 1 coaching (after successful load)

| Id | Setup | Act | Assert |
| --- | --- | --- | --- |
| CE-MVP1-01 | WS-s has guide, backlog, sprint backlog | “What now?” | Answer cites current ToDo / WIP; no file edits |
| CE-MVP1-02 | Same | “What’s next?” | Names next item without writing the repo |
| CE-MVP1-03 | Same | User asks to mark Done | Refuses coaching mutation (MVP 1) or defers to later MVP |

---

## 8. Negative / honesty

| Id | Assert |
| --- | --- |
| CE-NEG-01 | Does not treat this repo’s `.cursor/` edit copy as the only valid CR for end users |
| CE-NEG-02 | Does not load domain trees at start |
| CE-NEG-03 | Does not host coach as remote MCP |
| CE-NEG-04 | Sample template product names are not asserted as the user’s live backlog after seed without user edit |

---

## 9. Verification commands (when implemented)

| When | How |
| --- | --- |
| Fixture resolver | Unit tests on search-order helpers (path TBD with prompt) |
| Manual MVP 1 | Cursor: invoke coach slash name; fixtures for CE-LOAD and CE-MVP1 |
| MCP extract | Follow HTTP `instructions` against a disposable `extractTarget`; assert `specs/` empty of package trees |

---

## 10. Related docs

| Doc | Role |
| --- | --- |
| [`agent-design.md`](./agent-design.md) | Presence, stores, toggles, case table, §14 prompt |
| [`agent-stories.md`](./agent-stories.md) | Agent-07 start-gate stories and ACs |
| [`../framework.seeds/agents/ethan.md`](../framework.seeds/agents/ethan.md) | Seed prompt |
| [`../artifacts-map.md`](../artifacts-map.md) | Project index the coach loads (process rows at start) |
| [`../mcp/mcp-test.md`](../mcp/mcp-test.md) | Installer tool contracts |
| [`../product-backlog.md`](../product-backlog.md) | MVP acceptance |
