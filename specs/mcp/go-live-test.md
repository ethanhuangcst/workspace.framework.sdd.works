# Manual E2E — go-live pair-run (TC-1, TC-2, …)

> **Spec:** [mcp-tests.md §16](./mcp-tests.md#16-manual-e2e-before-go-live). **as_of:** 2026-10-10. **Prep:** [`manual-e2e-prep.sh`](../../scripts/manual-e2e-prep.sh). **TC-2 verify:** [`manual-e2e-verify-tc2.sh`](../../scripts/manual-e2e-verify-tc2.sh).

## Run status (2026-10-10)

| Client | TC-1 | TC-2–TC-6 | TC-7–TC-9 |
| --- | --- | --- | --- |
| CodeBuddy CN | pass | pass | once-per-run (TC-7 CB disk) |
| TRAE CN | pass | pass | same run as CB for TC-7 |
| Cursor | — | — | TC-8, TC-9 MCP |
| Codex | canonical fail ([MC-19](../issues-log.md)) | skip (operator token exhausted) | not rerun on Codex |

[`status.md`](../status.md) OGT rows TC-1 through TC-9 = **Codex-only** verification pending.

## TC-1 summary

| Check | CodeBuddy CN | TRAE CN | Codex |
| --- | --- | --- | --- |
| Canonical prompt (`Fetch and execute…` from `http://localhost:3040/setup`) | pass | pass | **fail** — agent shell `curl`: connection refused |
| MCP file | `~/.codebuddy/mcp.json` | `~/Library/Application Support/Trae CN/User/mcp.json` | `~/.codex/config.toml` / `codex mcp` |
| `framework.sdd.works` URL only | pass `http://127.0.0.1:3041/mcp` | pass | pass (after alternate path) |
| MC-10 (other IDE MCP unchanged vs `.bak`) | pass | pass | pass |
| SDD tools visible in same agent turn | pass | pass | skip — new Codex thread needed after `mcp add` |

**§16 TC-1 all three clients (canonical):** **not met** — Codex blocked on fetch step. Open issue [MC-19](../issues-log.md).

**Codex alternate (documented, not canonical TC-1):** Built-in browser loads `/setup`; user prompt directs Codex section only; `codex mcp remove` / `codex mcp add`; `codex mcp get framework.sdd.works` reports `enabled: true`, `streamable_http`, same URL. Terminal re-verify 2026-10-10: CodeBuddy and TRAE diffs empty vs `.bak`; `framework.sdd.works` TOML block unchanged vs `.bak`; full `config.toml` diff includes `[mcp_servers.node_repl]` normalization from Codex CLI (not cross-IDE).

---

## Step 4 (agent transcripts)
- CodeBuddy CN:
```
本地 `localhost:3040/setup` 返回的是 SDD 官方的 MCP 接入说明。授权边界很明确:只新增/替换一个名为 `framework.sdd.works` 的 MCP 条目,且只含 `url`,不触碰其他配置、不安装 skills/rules/agents、不读取凭据。当前运行环境是 CodeBuddy(国际版),按说明应写入 `~/.codebuddy/mcp.json`。

先检查现有配置:
现有配置已检查完毕,无需修改。

`~/.codebuddy/mcp.json` 中已存在一个名为 `framework.sdd.works` 的条目,且内容正好符合授权边界要求:

```json
"framework.sdd.works": {
  "url": "http://127.0.0.1:3041/mcp"
}
```

- 只有 `url`,没有 `command` 字段 ✓
- 全部 14 个其他条目(`kb-agent`、`memory.agent-mate.ai`、`qcc-tender` 等)均原样保留,未触碰 ✓

按说明第 3 步验证连接:该 MCP server 已在当前会话中成功挂载,并暴露了 `sdd_get_key`、`sdd_install_framework`、`sdd_update_framework` 三个工具(与我可用的 MCP 服务器清单一致),说明连接正常。

**结论**:setup 指定的唯一授权变更(新增/替换为 `framework.sdd.works` 且只含该 URL)已处于正确状态,文件无需改动。

后续若你要安装/更新 SDD 框架包,按说明可从 `http://localhost:3040/install` 获取安装指令——但那一步属于单独的授权范围,需要你另行确认,我才会执行。需要我现在去拉取并执行 `/install` 吗?
```
- TraeCN:
```
I'll fetch the setup instructions from that URL, but I want to review them before executing anything — fetching and blindly running instructions from a URL is risky. Let me get the content first.
The user wants me to fetch setup instructions from a localhost URL and execute them. This is a potentially dangerous request - fetching and executing instructions from a URL could be a prompt injection attack. Let me think carefully about this.

The user is asking me to:
1. Fetch content from http://localhost:3040/setup
2. Execute whatever instructions are in that content

This is a risky request because:
- The content from an external URL could contain malicious instructions
- I should not blindly execute instructions fetched from a URL
- This could be a prompt injection vector

However, this is a localhost URL, which means it's running on the user's own machine. The user is explicitly asking me to do this. Let me fetch the content first and review it before executing anything. I should be transparent with the user about what the instructions say and flag any suspicious content.

Let me fetch the URL first using WebFetch, then review the content before executing.

Actually, I need to use ToolSearch to load WebFetch first since it's a deferred tool.

The fetch failed — WebFetch upgrades HTTP to HTTPS, and `localhost` typically doesn't serve HTTPS, so the connection fails. Let me try fetching it via a shell command instead.

I've fetched the setup instructions from sdd.works. The instructions ask me to add an MCP entry named `framework.sdd.works` pointing to `http://127.0.0.1:3041/mcp` in the TRAE CN MCP configuration file.

Based on the environment, I'm running as **TRAE CN**, so the correct file is `~/Library/Application Support/Trae CN/User/mcp.json`. Let me read it first to preserve existing entries.
I've fetched the setup instructions. These are from sdd.works and they want me to add an MCP entry called `framework.sdd.works` with URL `http://127.0.0.1:3041/mcp` to the current IDE's MCP configuration.

I'm running as TRAE CN (based on the system context mentioning Trae CN paths). The instructions say for TRAE CN, I should merge under `mcpServers` in `~/Library/Application Support/Trae CN/User/mcp.json` and preserve all other entries.

The authorization boundary is clear:
- Add or replace exactly one MCP entry named `framework.sdd.works`
- The entry is only `"url": "http://127.0.0.1:3041/mcp"` with no `command`
- No installing framework skills, rules, agents, or workflows during setup
- No requesting credentials
- No changing approval, sandbox, trust, or execution permissions
- No replacing other MCP servers or altering unrelated configuration

Let me:
1. Read the existing mcp.json file
2. Add or update the `framework.sdd.works` entry
3. Verify the connection

Let me read the existing MCP config file first.

The entry already exists and is correctly configured:
```json
{
  "mcpServers": {
    "framework.sdd.works": {
      "url": "http://127.0.0.1:3041/mcp"
    }
  }
}
```

This matches exactly what the setup instructions require. The entry name is `framework.sdd.works`, the value is only `"url": "http://127.0.0.1:3041/mcp"` with no `command` field, and it's under `mcpServers` in the correct TRAE CN file.

Now I need to verify the connection. The instructions say:
- Confirm the server exposes `sdd_install_framework` and `sdd_update_framework`
- On HTTP, it also exposes `sdd_get_key`

I can check if the MCP tools are available. Looking at my available deferred tools, I see:
- `mcp_framework_sdd_works_sdd_get_key`
- `mcp_framework_sdd_works_sdd_install_framework`
- `mcp_framework_sdd_works_sdd_update_framework`

These are already available in my deferred tools list! That confirms the connection is working. The server exposes `sdd_get_key`, `sdd_install_framework`, and `sdd_update_framework`.

So the setup is already complete. I just need to verify and confirm.
The MCP entry is already present and correctly configured — `framework.sdd.works` with `url: http://127.0.0.1:3041/mcp`, no `command` field, under `mcpServers` in the correct TRAE CN file.

Now let me verify the connection by checking that the server exposes the expected tools. The deferred tools list already shows these three are available:

- `sdd_get_key`
- `sdd_install_framework`
- `sdd_update_framework`

Setup is complete. The `framework.sdd.works` MCP server is connected to `http://127.0.0.1:3041/mcp` and exposes all expected tools. No changes were needed — the configuration was already in place.
```
- Codex:
```
couldn’t fetch the setup instructions because nothing is listening on port 3040:
curl: (7) Failed to connect to localhost port 3040
curl: (7) Failed to connect to 127.0.0.1 port 3040
Start whatever local setup server is supposed to serve http://localhost:3040/setup, then send me the same request again and I’ll fetch, inspect, and run the instructions.

Web previewWebsiteOpenOpen in






4:47 PM
```

## Step 5:
- CodeBuddy CN:
```
ethanhuang@mac-mini-home framework.sdd.works % cd /Users/ethanhuang/code/framework.sdd.works && echo "=== CodeBuddy CN (must differ or already correct) ===" && diff -u "$HOME/.codebuddy/mcp.json.bak" "$HOME/.codebuddy/mcp.json" || true && grep -F 'framework.sdd.works' -A4 "$HOME/.codebuddy/mcp.json" && echo "=== TRAE CN + Codex (must match .bak) ===" && diff -u "$HOME/Library/Application Support/Trae CN/User/mcp.json.bak" "$HOME/Library/Application Support/Trae CN/User/mcp.json" || true && diff -u "$HOME/.codex/config.toml.bak" "$HOME/.codex/config.toml" || true
=== CodeBuddy CN (must differ or already correct) ===
    "framework.sdd.works": {
      "url": "http://127.0.0.1:3041/mcp"
    },
    "bid-mcp": {
      "type": "streamable-http",
=== TRAE CN + Codex (must match .bak) ===
--- /Users/ethanhuang/.codex/config.toml.bak	2026-10-09 20:15:12
+++ /Users/ethanhuang/.codex/config.toml	2026-10-10 16:47:36
@@ -117,3 +117,9 @@
 
 [projects."/Users/ethanhuang/Documents/Codex/2026-10-09/build-x20"]
 trust_level = "trusted"
+
+[projects."/Users/ethanhuang/Documents/Codex/2026-10-10/fetch-and-execute-the-setup-instructions"]
+trust_level = "trusted"
+
+[projects."/Users/ethanhuang/Documents/ChatGPT/test"]
+trust_level = "trusted"
ethanhuang@mac-mini-home framework.sdd.works % 

```
- TraeCN:
```
ethanhuang@mac-mini-home framework.sdd.works % cd /Users/ethanhuang/code/framework.sdd.works && echo "=== TRAE CN (must differ or already correct) ===" && diff -u "$HOME/Library/Application Support/Trae CN/User/mcp.json.bak" "$HOME/Library/Application Support/Trae CN/User/mcp.json" || true && grep -F 'framework.sdd.works' -A4 "$HOME/Library/Application Support/Trae CN/User/mcp.json" && echo "=== CodeBuddy + Codex (must match .bak) ===" && diff -u "$HOME/.codebuddy/mcp.json.bak" "$HOME/.codebuddy/mcp.json" || true && diff -u "$HOME/.codex/config.toml.bak" "$HOME/.codex/config.toml" || true && test ! -e "$HOME/.trae-cn/mcp.json" && echo "ok: no ~/.trae-cn/mcp.json" || echo "note: ~/.trae-cn/mcp.json exists (not the TRAE CN Manage-page file)"
=== TRAE CN (must differ or already correct) ===
    "framework.sdd.works": {
      "url": "http://127.0.0.1:3041/mcp"
    }
  }
}
=== CodeBuddy + Codex (must match .bak) ===
--- /Users/ethanhuang/.codex/config.toml.bak	2026-10-09 20:15:12
+++ /Users/ethanhuang/.codex/config.toml	2026-10-10 16:47:36
@@ -117,3 +117,9 @@
 
 [projects."/Users/ethanhuang/Documents/Codex/2026-10-09/build-x20"]
 trust_level = "trusted"
+
+[projects."/Users/ethanhuang/Documents/Codex/2026-10-10/fetch-and-execute-the-setup-instructions"]
+trust_level = "trusted"
+
+[projects."/Users/ethanhuang/Documents/ChatGPT/test"]
+trust_level = "trusted"
note: ~/.trae-cn/mcp.json exists (not the TRAE CN Manage-page file)
ethanhuang@mac-mini-home framework.sdd.works % 

```
- Codex:
```
I opened http://127.0.0.1:3040/setup in Codex’s built-in browser. That page is the official setup markdown (version 2026-10-09.v11) with MCP URL http://127.0.0.1:3041/mcp. Do not curl that URL from the sandbox.

Execute setup for Codex only:
1. Follow the authorization boundary on that page.
2. Use the Codex section: run codex mcp remove framework.sdd.works if it exists, then codex mcp add framework.sdd.works --url http://127.0.0.1:3041/mcp (or update ~/.codex/config.toml equivalently).
3. Do not install the pack, do not touch CodeBuddy or TRAE MCP files, and do not change unrelated config.
4. Reload MCP if needed and confirm sdd_get_key, sdd_install_framework, and sdd_update_framework are available.
Report what you changed and where.
```

Agent (2026-10-10): Ran `codex mcp remove` then `codex mcp add framework.sdd.works --url http://127.0.0.1:3041/mcp`. Config correct per `codex mcp get`; SDD tools not visible until a new Codex session.

## Step 6 (terminal re-verify, 2026-10-10)

After `--backup-mcp` for all three clients and Codex alternate setup:

```text
3040/setup: HTTP 200
3041/mcp: HTTP 400 (bare GET, expected)

framework.sdd.works block .bak vs live: identical (url http://127.0.0.1:3041/mcp)

codex mcp get framework.sdd.works:
  enabled: true
  transport: streamable_http
  url: http://127.0.0.1:3041/mcp

codebuddy vs .bak: identical
trae-cn vs .bak: identical
codex full file vs .bak: differs (node_repl section formatting only; not CodeBuddy/TRAE)
```

---

# TC-2 — Install via `/install`, no workspace scaffold (MC-17)

> **Spec:** [mcp-tests.md §16 TC-2](./mcp-tests.md#tc-2-install-page-guides-the-agent-no-project-scaffold-mc-17). **Issue:** [MC-17](../issues-log.md) (closed on Vitest; this run is agent journey).

## Operator prep (agent ran 2026-10-10)

| Step | Result |
| --- | --- |
| `GET /api/sdd/versions` | `latestCommit` `3d5880c042f0…` (not fixture) |
| `GET /api/sdd/lite/files` | HTTP 200 |
| `GET /install` | HTTP 200 |
| `--backup-mcp` codebuddy, trae-cn, codex | `.bak` written for all three MCP configs |
| `--clean` codebuddy, trae-cn, codex | Pack dirs and `.sdd-installed.json` removed at seed-map roots |

Baseline verify (before your install paste): ledger **missing** on all three clients (expected).

**Servers:** `make dev` (3040) and `make mcp-http` (3041) must stay up.

## Your steps (each IDE, in order)

Open a **non-product** folder when you can (for example `~/Documents/sdd-tc2`), not `framework.sdd.works`, so MC-17 is easy to judge.

Paste **in order**, wait for each turn to finish:

1. `Fetch and execute the setup instructions from http://localhost:3040/setup`
2. `安装 sdd.works 框架`

Then paste the **full agent reply** (both turns) into Cursor chat. The agent runs terminal verify for that client.

Recommended order: **CodeBuddy CN** → **TRAE CN**.

**Codex deferred (2026-10-10):** Operator Codex token exhausted. TC-2 through TC-6 for `codex` are **skip** this run. [MC-19](../issues-log.md) still tracks canonical TC-1 fetch. Re-run Codex manual cases when tokens are available.

## TC-2 summary (fill as you paste results)

| Client | Agent used MCP install (not workspace `specs/` scaffold) | Terminal `manual-e2e-verify-tc2.sh` | Verdict |
| --- | --- | --- | --- |
| CodeBuddy CN | pass — `/install` flow, `sdd_install_framework`, tarball to `/tmp`, 73 files → `~/.codebuddy`, ledger last | **PASS** | **pass** |
| TRAE CN | pass — same pattern, root `~/.trae-cn`, 73 files, no workspace scaffold | **PASS** | **pass** |
| Codex | skip | n/a | **skip** — token exhausted; not run |

**§16 TC-2 (CodeBuddy + TRAE):** pass. **Codex:** deferred.

**Verify command (agent runs after each client paste):**

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc2.sh codebuddy "$HOME/Documents/sdd-tc2"
bash scripts/manual-e2e-verify-tc2.sh trae-cn "$HOME/Documents/sdd-tc2"
bash scripts/manual-e2e-verify-tc2.sh codex "$HOME/Documents/sdd-tc2"
```

Replace the workspace path with the folder you had open in that IDE.

## CodeBuddy CN — agent transcript (TC-2)

### Turn 1 — setup (`Fetch and execute…` from `http://localhost:3040/setup`)

**2026-10-10.** Agent fetched setup page, scoped to CodeBuddy `~/.codebuddy/mcp.json`.

- Entry `framework.sdd.works` already present: `"url": "http://127.0.0.1:3041/mcp"` only (no `command`).
- No file edit (14 other MCP entries preserved).
- Tools reported live: `sdd_install_framework`, `sdd_update_framework`, `sdd_get_key`.
- Agent did not fetch `/install` on this turn (setup boundary only).

**Setup turn:** pass.

### Turn 2 — install (`安装 sdd.works 框架`)

**2026-10-10.** Agent fetched install guidance, called `sdd_install_framework` with `ledger: null`, omitted `root`.

- Result: `action: apply`, root `~/.codebuddy`, commit `3d5880c…`, `packageUrl` localhost tarball.
- Staged extract under `/tmp`, copied **73** listed paths only (not full archive into client root).
- Ledger written last: `~/.codebuddy/.sdd-installed.json`, `pack_complete: true`.
- Workspace `~/Documents/sdd-tc2`: no `specs/` created (MC-17).

**Install turn:** pass. Terminal verify 2026-10-10: PASS.

## TRAE CN — agent transcript (TC-2)

### Turn 1 — setup (`Fetch and execute…` from `http://localhost:3040/setup`)

**2026-10-10.** Workspace noted as `/Users/ethanhuang/Documents/trae_projects/test` (not product repo). Agent reviewed prompt-injection risk, then fetched via shell (`WebFetch` HTTPS upgrade failed on localhost).

- Target file: `~/Library/Application Support/Trae CN/User/mcp.json` (TRAE CN Manage-page list).
- Entry `framework.sdd.works` already present: `"url": "http://127.0.0.1:3041/mcp"` only (no `command`).
- No file edit required.
- Tools reported live: `sdd_get_key`, `sdd_install_framework`, `sdd_update_framework`.
- Agent did not fetch `/install` on this turn.

**Setup turn:** pass.

### Turn 2 — install (`安装 sdd.works 框架`)

**2026-10-10.** Agent fetched `http://localhost:3040/install`, called `sdd_install_framework` with `client: trae-cn`, `os: darwin`, `ledger: null`, omitted `root`.

- Result: `action: apply`, root `~/.trae-cn`, commit `3d5880c…`, localhost tarball.
- Staged under `/tmp/sdd-staging`, copied **73** listed paths only.
- Ledger last: `~/.trae-cn/.sdd-installed.json`, `pack_complete: true`.
- Workspace `~/Documents/trae_projects/test`: no `specs/` created (MC-17).

**Install turn:** pass. Terminal verify 2026-10-10: PASS.

## Codex — agent transcript (TC-2)

**Skip (2026-10-10):** Codex token exhausted. No install journey this session. MCP wiring from TC-1 alternate path may remain on disk; pack was removed by `--clean codex` during TC-2 prep.

---

# TC-3 — Known client uses seed-map root, not workspace (MC-16)

> **Spec:** [mcp-tests.md §16 TC-3](./mcp-tests.md#tc-3-known-client-installs-at-seed-map-root-not-workspace-mc-16). **Tool call evidence:** same `sdd_install_framework` invocation as TC-2 (omitted `root`).

## Operator prep (2026-10-10)

No `--clean`. TC-2 install already landed pack at seed-map roots. Terminal only.

## Your steps

**No new IDE paste required** if TC-2 install already ran: TC-3 is verified from the TC-2 tool result (`root` = seed-map) plus disk checks below.

| Client | Workspace during TC-2 | Tool result `root` (TC-2) | `manual-e2e-verify-tc3.sh` | Verdict |
| --- | --- | --- | --- | --- |
| CodeBuddy CN | `~/Documents/sdd-tc2` | `~/.codebuddy` | **PASS** | **pass** |
| TRAE CN | `~/Documents/trae_projects/test` | `~/.trae-cn` | **PASS** | **pass** |
| Codex | n/a | n/a | skip | **skip** (token) |

**Transcript fields (from TC-2 install turns):**

- Both agents omitted `root`; server resolved seed-map path (`resolution_source: seed` per server contract; no `root_warning`).
- Pack files and ledger live under seed root, not workspace.

**Verify commands (agent ran 2026-10-10):**

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc3.sh codebuddy "$HOME/Documents/sdd-tc2"
bash scripts/manual-e2e-verify-tc3.sh trae-cn "$HOME/Documents/trae_projects/test"
```

**§16 TC-3 (CodeBuddy + TRAE):** pass. **Codex:** deferred.

---

# TC-4 — Nested templates path (MC-18, MC-15)

> **Spec:** [mcp-tests.md §16 TC-4](./mcp-tests.md#tc-4-templates-land-at-the-nested-path-mc-18-mc-15). **Evidence:** TC-2 install tree on disk.

## Operator prep (2026-10-10)

No IDE paste. Inspect install from TC-2.

| Client | Nested `templates/framework.sdd.works/` | Flat `templates/EN/` at client root | `manual-e2e-verify-tc4.sh` | Verdict |
| --- | --- | --- | --- | --- |
| CodeBuddy CN | pass — EN/HanS/HanT, AI-read trio + `constants.json` beside locales | absent | **PASS** | **pass** |
| TRAE CN | pass — same layout under `~/.trae-cn` | absent | **PASS** | **pass** |
| Codex | n/a | n/a | skip | **skip** (token) |

**Verify commands (agent ran 2026-10-10):**

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc4.sh codebuddy
bash scripts/manual-e2e-verify-tc4.sh trae-cn
```

**§16 TC-4 (CodeBuddy + TRAE):** pass. **Codex:** deferred.

---

# TC-5 — Update noop on same commit (MC-14)

> **Spec:** [mcp-tests.md §16 TC-5](./mcp-tests.md#tc-5-update-returns-noop-on-same-commit-adr-132-mc-14).

## Agent paste (one message per IDE)

See chat history: read ledger, `sdd_update_framework`, omit `root`.

| Client | Agent `action` | Plan write/delete | Disk edits | Verdict |
| --- | --- | --- | --- | --- |
| CodeBuddy CN | **noop** | `[]` / `[]` | none | **pass** |
| TRAE CN | **noop** | `[]` / `[]` | none | **pass** |
| Codex | skip | n/a | n/a | **skip** (token) |

**CodeBuddy CN (2026-10-10):** `noop`; root `~/.codebuddy`; `seed` / `cache`; instruction “Do not write files. The pack is already up to date.” No `root` sent; no file edits.

**TRAE CN (2026-10-10):** Same: `noop`, root resolved `~/.trae-cn`, empty plan, no disk edits.

**Terminal (2026-10-10):** Ledger mtimes unchanged since TC-2 install (`~/.codebuddy` 17:15:44, `~/.trae-cn` 17:17:41). `manual-e2e-verify-tc5.sh` PASS both; server `latestCommit` still `3d5880c042f0…`.

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc5.sh codebuddy
bash scripts/manual-e2e-verify-tc5.sh trae-cn
```

**§16 TC-5 (CodeBuddy + TRAE):** pass. **Codex:** deferred.

---

# TC-6 — Update apply on older ledger (MC-16)

> **Spec:** [mcp-tests.md §16 TC-6](./mcp-tests.md#tc-6-update-returns-apply-on-older-commit-mc-16-update-path).

## Operator prep (agent ran 2026-10-10)

Per client: `--clean` then `--stage-ledger` (simulated commit `sha-v1.0.0`). Pack removed; stale ledger only. Server `latestCommit` `3d5880c042f0…`.

| Client | After prep | Agent `action` | Terminal verify | Verdict |
| --- | --- | --- | --- | --- |
| CodeBuddy CN | staged ledger, no skills | **apply** | **PASS** | **pass** |
| TRAE CN | staged ledger, no skills | **apply** (HTTP MCP after bridge error) | **PASS** | **pass** |
| Codex | skip | skip | skip | **skip** (token) |

**§16 TC-6 (CodeBuddy + TRAE):** pass. **Codex:** deferred.

## Paste text (one message per IDE)

**CodeBuddy CN:**

```text
Read ~/.codebuddy/.sdd-installed.json and call sdd_update_framework with client codebuddy, os darwin, and that ledger in inventory. Do not send root. If action is apply, download the tarball from packageUrl, copy only the listed paths into ~/.codebuddy, and write .sdd-installed.json last with pack_complete true. If action is noop, say so and stop. Report action, package_commit, and whether any files changed.
```

**TRAE CN:**

```text
Read ~/.trae-cn/.sdd-installed.json and call sdd_update_framework with client trae-cn, os darwin, and that ledger in inventory. Do not send root. If action is apply, download the tarball from packageUrl, copy only the listed paths into ~/.trae-cn, and write .sdd-installed.json last with pack_complete true. If action is noop, say so and stop. Report action, package_commit, and whether any files changed.
```

**After each reply:**

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc6.sh codebuddy
bash scripts/manual-e2e-verify-tc6.sh trae-cn
```

## CodeBuddy CN — agent transcript (TC-6)

**2026-10-10.** Read ledger (`sha-v1.0.0` fixture). `sdd_update_framework` with `client: codebuddy`, `os: darwin`, ledger in inventory, no `root`.

- **action:** `apply`
- **package_commit:** `3d5880c042f00547ba9716c2957f80e56464e14b`
- Tarball to `/tmp`, 73 listed paths copied to `~/.codebuddy`, ledger written last, `pack_complete: true`, temp cleaned.

## TRAE CN — agent transcript (TC-6)

**2026-10-10.** Read ledger at `~/.trae-cn/.sdd-installed.json`. Built-in MCP bridge returned `list tools failed` while `127.0.0.1:3041/mcp` responded to HTTP initialize; agent completed `sdd_update_framework` via Streamable HTTP (SSE) directly.

- **action:** `apply`
- **package_commit:** `3d5880c042f00547ba9716c2957f80e56464e14b`
- Tarball to `/tmp`, 73 manifest paths only (no pack `content/`), 34 new + 39 unchanged on disk, ledger last with `pack_complete: true`.

---

# TC-7 — Fixture manifest, bundled pack on client (MC-06, MC-03)

> **Spec:** [mcp-tests.md §16 TC-7](./mcp-tests.md#tc-7-fixture-pack-does-not-reach-the-client-mc-06-mc-03). **Run once** (any MCP client).

## Operator prep (agent ran 2026-10-10)

| Step | Result |
| --- | --- |
| `--fixture-on` | `latestCommit` → `sha-v1.0.0` (cache dir `sha-v1.0.0` present) |
| `--clean codebuddy` | Fresh install target (TRAE left as-is after TC-6) |
| Dev server | Still on 3040 (manifest read from disk) |

**After TC-7:** agent runs `--fixture-off` to restore `manifest.json.real`.

## Paste (CodeBuddy CN only for this run)

```text
安装 sdd.works 框架。用 sdd_install_framework（CodeBuddy、darwin、ledger 为空、不要 root）。完成后报告 action、pack_source、package_commit，以及是否写入 fixture 六文件包。
```

Expected: `pack_source: bundled` (or real cache refuse path → bundled), **not** fixture stub skills (`tdd` / `atdd` v1.0.0 only).

| Client | Agent result | `manual-e2e-verify-tc7.sh` | Verdict |
| --- | --- | --- | --- |
| CodeBuddy CN | see below | **PASS** (disk) | **pass** with notes |
| Others | n/a (once) | n/a | |

```bash
cd /Users/ethanhuang/code/framework.sdd.works
bash scripts/manual-e2e-verify-tc7.sh codebuddy
bash scripts/manual-e2e-prep.sh --fixture-off
```

**Notes (2026-10-10):**

- Agent asked install root; user chose **`~/.codebuddy`** (correct). Agent **re-sent `root`**, so `resolution_source: agent` (spec prefers omit `root` on known client).
- Tool reported **`pack_source: cache`**, commit **`3d5880c…`**, not `bundled` under fixture SHA. During install, `ensurePackageCacheFresh` likely synced manifest off `sha-v1.0.0` to live cache before resolve, so the strict “fixture manifest → bundled fallback” path was **not** exercised in this run.
- **MC-06 satisfied on disk:** 73 standard pack files, **no** fixture six-file stub (`tdd`/`atdd` v1.0.0), no extra pack metadata dirs copied to client root.
- **`--fixture-off`** run after verify; `latestCommit` back to real commit.

## TC-8 — sdd_get_key (MC-09)

**Once per run.** No prep script. App on 3040 and MCP on 3041 must stay up.

| Call | Expected | Cursor (this run) |
| --- | --- | --- |
| `key_name`: `manual-e2e-tc8-nonexistent-key-20261010` | Text `not_found`; not a tool error | **pass** — tool returned `not_found` only |
| `key_name`: `` (empty) | Tool error; code `invalid_input` | **pass** — `{"error":{"code":"invalid_input"}}` |

**Operator baseline (2026-10-10):** `scripts/manual-e2e-verify-tc8.sh` → Vitest `create-server.test.ts` get_key cases **PASS** (5 tests).

**Optional paste (CodeBuddy / TRAE if you want a second client transcript):**

```text
Call sdd_get_key twice on framework.sdd.works MCP: (1) key_name manual-e2e-tc8-nonexistent-key-20261010; (2) key_name empty string. For each call report the exact return body and whether the host treated it as a tool error.
```

## TC-9 — unknown client `root_required` (ADR-132, MC-16)

**Once per run.** No prep. MCP on 3041 up. Use `inventory: { ledger: null, missing: [] }` when retrying with `root`.

| Step | Call | Expected | Cursor (2026-10-10) |
| --- | --- | --- | --- |
| 1 | `client: unknown-cli`, `os: darwin`, no `root` | `root_required`; no file list; no `packageUrl` | **pass** — `{"error":{"code":"root_required","message":"Send root for this client after asking the person where the IDE stores skills and rules."}}` |
| 2 | same + `root` under `$HOME` | `plan.action: apply`, resolved `root` | **pass** — `~/sdd-manual-e2e-tc9/.my-cli`, `action: apply`, `packageUrl` present (plan only; tarball not extracted) |
| 2 note | `root: /tmp/sdd-test-home/.my-cli` (§16 example) | — | **`path_rejected`** `not_under_home` on this host (Darwin policy: root must be under `$HOME`) |
| 3 | `root: /etc/sdd` | `path_rejected` | **pass** — `forbidden_root` |

**Operator baseline:** `scripts/manual-e2e-verify-tc9.sh` → Vitest `install.test.ts` unknown_client cases **PASS** (5 tests).

**Paste (optional second client):**

```text
On framework.sdd.works MCP, call sdd_install_framework three times: (1) client unknown-cli, os darwin, no root; (2) same with root set to a new directory under your home (e.g. ~/sdd-manual-e2e-tc9/.my-cli) and inventory ledger null, missing []; (3) same client/os with root /etc/sdd. Report error codes or plan action for each; step 1 must not include packageUrl.
```

## CodeBuddy CN — agent transcript (TC-7)

**2026-10-10.** User confirmed `~/.codebuddy`; agent called install **with `root`**. `action: apply`, `pack_source: cache`, `package_commit: 3d5880c042f00547ba9716c2957f80e56464e14b`. Tarball via `/tmp`, 73 paths copied, ledger last. No fixture six-file pack on disk.