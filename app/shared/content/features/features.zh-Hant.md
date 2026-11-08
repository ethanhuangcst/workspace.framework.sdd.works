# 框架簡介

Scrum in SDD：定義與 Scrum 對齊的規格驅動開發（SDD）方法。
SDD.works：可安裝的框架包，在 Harness Engineering 治理下實施 Scrum in SDD。

---
## 智能體


| 名稱  | 角色                                   |
| ----- | -------------------------------------- |
| ethan | 本地 Scrum in SDD 教練；不安裝框架包 |


## 技能（Scrum 與流程）


| 名稱                | 角色                                                         |
| ------------------- | ------------------------------------------------------------ |
| sdd-update-project  | 設定規格目錄與模組對應；確認後寫入 `artifacts-map.json`      |
| sdd-audit-artifacts | 唯讀稽核：未初始化、索引損壞或可用                             |
| sdd-review-status   | 對照五份過程檔案並給出下一步建議                               |
| sdd-refine-backlog  | 審查產品待辦就緒度；使用者選定後再寫入                         |
| sdd-plan-sprint     | 將 PBI 分配到衝刺；同一技能涵蓋衝刺開啟與關閉                  |
| sdd-retrospective   | DoD 後、衝刺結束或按需進行回顧                                 |
| sdd-spec-to-build   | 單個 SBI 的工程就緒後再建置                                    |
| sdd-update-specs    | 使工程規格與實作保持一致                                       |
| atdd-expert         | 使用者故事與 Gherkin 驗收標準                                  |
| sdd-build-agent     | 確認後建立或修訂智能體檔案                                     |
| sdd-create-skill    | 確認後建立或修訂技能檔案                                       |
| sdd-create-rule     | 確認後建立或修訂規則檔案                                       |




## 技能（建構輔助）


| 名稱               | 角色                           |
| ------------------ | ------------------------------ |
| testing-expert     | 測試策略、分層與執行           |
| fullstack-engineer | 依專案技術棧端到端交付 Web 功能 |
| frontend-developer | UI 元件、頁面與用戶端 wiring     |
| frontend-designer  | 新建或改版 UI 的視覺設計         |
| ai-architect       | AI 與 ML 系統設計              |
| rag-expert         | RAG 架構與建議                 |
| mcp-expert         | MCP 伺服器設計與整合           |
| improve-prompt     | 改寫草稿提示詞供貼上使用         |




## 規則


| 檔案                         | 角色                           |
| ---------------------------- | ------------------------------ |
| sdd-dod.mdc                  | 完成定義（DoD）；待辦關閉時寫入 |
| sdd-incremental-delivery.mdc | 完成一個 SBI 後再開始下一個    |
| sdd-realtime-status.mdc      | 過程檔案的 WIP 檢查點          |
| friendly-language.mdc        | 清晰的對話與 Markdown 文案     |




## 產物



### 框架產物


| 檔案                   | 角色                                   |
| ---------------------- | -------------------------------------- |
| pack-scrum-in-sdd.md   | Scrum in SDD 的名稱與含義              |
| sdd-scrum-practices.md | 每項工作的內容、方式與時機             |
| artifacts-map.json     | 工作區根目錄的索引                     |
| constants.json         | 技能鍵、規則鍵、說明頁 URL             |




### 流程產物（五份檔案）


| 檔案               | 角色                     |
| ------------------ | ------------------------ |
| product-backlog.md | PBI 與產品完成定義       |
| sprint-backlog.md  | 衝刺目標、SBI 與 RID     |
| status.md          | 目前項與進行中的 OGT     |
| changes-log.md     | 已交付變更歷史           |
| issues-log.md      | 缺陷紀錄                 |




### 工程產物（按模組）


| 模式                | 角色                           |
| ------------------- | ------------------------------ |
| `{stem}-stories.md` | 使用者故事與驗收標準             |
| `{stem}-design.md`  | 設計規格                       |
| `{stem}-tests.md`   | 測試規格                       |
| architecture.md     | 產品架構範本                   |
| release.md          | 本地啟動與上線順序             |
| test-strategy.md    | 產品測試策略                   |
| `.secrets`          | 僅密鑰名稱；值保存在 git 之外 |
