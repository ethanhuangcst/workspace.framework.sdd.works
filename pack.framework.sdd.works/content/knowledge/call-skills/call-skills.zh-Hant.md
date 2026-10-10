# 如何叫出 Agent Skills（SDD 框架包）

框架包在完整 MCP 安裝時內建 `skills/` 目錄。每個技能是一個含 `SKILL.md` 的資料夾。規則在 `rules/` 下，副檔名為 `.mdc`。各 IDE 從自己的路徑載入技能與規則。本文說明技能放哪、如何在對話裡掛上技能、以及模型何時會依技能執行。

**本 repo 已實測（2026-10-08）：** Cursor（桌面版對話與 Agent）。

**僅依廠商文件（同日）：** Claude Code 的 `.claude/skills/`。

**共通說明**

- 技能是給宿主模型用的說明。宿主決定何時讀 `SKILL.md`（附件、@ 提及或工具探索）。
- 包安裝會把技能複製到你工具使用的用戶端目錄（Cursor 常見為 `~/.cursor/skills/` 或 `<專案>/.cursor/skills/`）。
- Lite HTTP 安裝只帶一部分建置輔助技能以及 `friendly-language.mdc`（見「功能」內容頁）。
- 在對話裡使用的技能 **名稱** 應對應資料夾名（例如 `sdd-retrospective`，不是展示標題）。

## Cursor

| 項目 | 說明 |
| --- | --- |
| 技能目錄 | `~/.cursor/skills/<name>/SKILL.md` 或 `<專案>/.cursor/skills/<name>/SKILL.md`。同名時專案技能可覆蓋使用者技能。 |
| 規則 | `~/.cursor/rules/*.mdc` 或 `<專案>/.cursor/rules/*.mdc`。常駐規則無需掛技能也會生效。 |
| 對話中掛載 | 用 **@** 選技能，或在介面列出技能時用 `/` 選擇。Agent 模式下也可從技能選擇器附加。 |
| Agent 行為 | 附加後，模型應在該輪開始時讀取 `SKILL.md`，並依其中流程執行（能力、限制與確認門）。 |
| 包內技能 | SDD 流程類技能（`sdd-dod`、`sdd-plan-sprint`、`sdd-retrospective` 等）在包的 `skills/` 樹中。先同步或 MCP 安裝，再指望選擇器裡出現。 |
| 再叫一次 | 同一會話在去掉附件或開新對話前會保留上下文。換技能時在下一輪附加新技能即可。 |

## Claude Code

| 項目 | 說明 |
| --- | --- |
| 技能目錄 | `~/.claude/skills/<name>/SKILL.md` 或 `<專案>/.claude/skills/<name>/SKILL.md`。 |
| 啟動 | 依 Claude Code 文件用斜線或技能命令叫出。 |
| 再叫一次 | 同一會話有效，直到換技能或開新會話。 |

## 何時用技能、何時普通對話

| 場景 | 建議 |
| --- | --- |
| 在過程檔上關閉 SBI、衝刺或 RID | **sdd-retrospective** 或 `sdd-dod.mdc` 點名的流程技能 |
| 寫程式前的工程就緒 | **sdd-spec-to-build** |
| 跨 UI 與 API 的一個 Web 功能 | **fullstack-engineer**（隨任務附加） |
| 僅要 AI 或 RAG 架構建議 | **ai-architect** 或 **rag-expert**（諮詢；除非你要求，否則不寫基礎設施） |
| 快速改措辭 | **improve-prompt**（回傳可貼上文字；不替你執行任務） |

## 包內索引

`templates/framework.sdd.works/constants.json` 列出用戶端根目錄上應有的技能鍵。安裝後若缺鍵，在依賴選擇器之前請重新 MCP 安裝或從包 tarball 複製對應技能資料夾。
