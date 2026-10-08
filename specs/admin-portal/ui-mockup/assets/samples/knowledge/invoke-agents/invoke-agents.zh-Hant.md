# 各 IDE 如何啟動自訂智能體（Ethan）

框架包內建 `agents/ethan.md`。各 IDE 從自己的目錄讀這類檔案。本文說明檔案放哪、怎麼叫出 Ethan、什麼時候要再叫 Ethan（下一句誰回）。

**本 repo 已實測（2026-09-30）：** Cursor、TRAE、TRAE CN。

**僅依廠商文件（同日）：** Claude Code、CodeBuddy CN、Cline、Codex、Copilot CLI。

**共通說明**

- Onboard 在 Ethan 第一次進對話時跑（依提示讀 ledger、做稽核）。開新對話可能再跑一輪 Onboard。
- Codex 用 `*.toml` 定義智能體。Copilot CLI 用 `*.agent.md`。只放 `ethan.md` 在這兩個工具裡不會生效。

## 再叫 Ethan（三種模式）

| 模式 | 說明 |
| --- | --- |
| 同一對話 | 不換視窗，在這串對話繼續聊。Ethan 一直回，直到你開新對話。 |
| 單次任務 | Ethan 做完一件事。主助手接下一句。下一件事要再叫 Ethan。 |
| 獨立對話 | Ethan 在另一串對話跑。主對話多半還是主助手在回。 |

## Cursor

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.cursor/agents/ethan.md` 或 `<專案>/.cursor/agents/ethan.md`（專案優先）。Frontmatter 的 `name` 就是斜線指令 `/ethan`。`templates/` 底下不算智能體。 |
| 啟動 Ethan | 輸入 `/ethan`，通常放在對話開頭。 |
| 再叫 Ethan | 同一對話。這串對話的追問還是 Ethan。 |
| 新對話 | 直接打字不會進 Ethan。要再輸 `/ethan`。Onboard 可能再跑。 |

## TRAE

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.trae/agents/ethan.md` |
| 前置設定 | Settings → Beta → 開 Subagents。 |
| 啟動 Ethan | 輸入 `@`。內建助手會在你的描述符合檔案裡 `description` 時叫 Ethan。`/ethan` 不能用。 |
| 再叫 Ethan | 獨立對話。文件沒保證主對話會一直停在 Ethan。 |

## TRAE CN

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.trae-cn/agents/ethan.md` |
| 前置設定 | 設定 → Beta → Subagents → 啟用 Subagents 目錄。 |
| 啟動 Ethan | `@` 或 @智能體。描述符合 `description` 時由內建助手叫 Ethan。`/ethan` 不能用。 |
| 再叫 Ethan | 獨立對話。與 TRAE 相同。 |

## Claude Code

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.claude/agents/` 或 `.claude/agents/`（Markdown）。斜線指令在 `commands/`，不在 `agents/`。 |
| 啟動 Ethan（單次） | 內文提到 Ethan，或 `@` 後選 Ethan。 |
| 再叫 Ethan（單次） | 單次任務。下一句是主 Claude。Ethan 看不到整段主對話。 |
| 啟動 Ethan（整段工作階段） | 執行 `claude --agent ethan` |
| 再叫 Ethan（整段工作階段） | 同一對話。這個終端機工作階段的一般輸入都給 Ethan，直到離開或刪掉智能體檔。 |
| 備註 | `/agents` 只是提醒你看 agents 目錄（v2.1.198）。 |

## CodeBuddy CN

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.codebuddy/agents/`（使用者或專案）。`/ethan` 這類斜線指令在 `commands/`，不在 `agents/`。 |
| 啟動 Ethan（自動委派） | 主助手在任務符合 `description` 時委派給 Ethan。 |
| 再叫 Ethan（自動委派） | 單次任務。主助手佔著對話，直到再次委派。 |
| 啟動 Ethan（手動） | 在 Agent 框選 Ethan。 |
| 再叫 Ethan（手動） | 同一對話。直到你換別的智能體。 |
| CLI 單次 | 提示詞點名 Ethan，或用 `--agents` JSON 跑一輪。 |
| CLI 整段 | `--agent ethan`。該工作階段後續輸入都給 Ethan。 |

## Cline

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.cline/agents/` 或專案 `.cline/agents/`。`~/.cline/data/settings/agents/` 是外掛另一套路徑。 |
| 啟動 Ethan | 主工作階段用預設 `name` 呼叫 `start_subagent`。沒有斜線指令能在當前對話切成 Ethan。 |
| 再叫 Ethan | 獨立對話。追問要帶 subagent 的 session id。新任務要重新呼叫。 |

## Codex

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.codex/agents/*.toml` 或 `.codex/agents/*.toml`（含 `name`、`description`、`developer_instructions`）。不是 `ethan.md`。 |
| 啟動 Ethan | 請 Codex 委派到 TOML 的 `name`。 |
| 再叫 Ethan | 獨立對話。每次委派都是新 instance。`/agent` 只切換已有執行緒，不會新建智能體。 |
| 已知限制 | 有些工作階段依名稱拉不起專案智能體（GitHub #15250、#26408）。 |

## Copilot CLI

| 項目 | 說明 |
| --- | --- |
| 智能體檔 | `~/.copilot/agents/*.agent.md` 或 `.github/agents/*.agent.md`（使用者覆寫 repo）。Id 為去掉 `.agent.md` 的檔名（如 `ethan.agent.md`）。 |
| 啟動 Ethan（互動） | `/agent` 選設定檔，或在提示詞寫 Ethan。 |
| 再叫 Ethan（互動） | 文件沒寫會一直維持該設定。要再 `/agent` 或在提示詞點名 Ethan。 |
| 單次指令 | `copilot --agent=ethan --prompt "..."` |
