v.0.1.0

## sdd-scrum 框架做什麼

- 提供 SDD-Scrum 的指南與實踐手冊：在 Harness Engineering 下，把規格驅動開發(SDD)與 Scrum 用於智能體程式設計。
- 在 Agent Tools 中安裝框架產物，為 AI 智能體劃定邊界，包括規則(rules)、技能(skills)及相關資產(artifacts)。
- 導入 AI 教練智能體：ethan。

## 功能

### 智能體

- ethan — SDD-Scrum 框架的 AI 智能體。

### 技能

- sdd-atdd — 驗收測試驅動開發：用使用者故事和驗收標準建立使用者故事地圖。
- sdd-tdd — 測試驅動開發，極限編程中的工程實務。
- sdd-update-project — 在智能體工具中依 SDD-Scrum 啟動專案並更新專案設定，包括規格資料夾路徑。修復缺失或錯誤的產物索引。不覆蓋已有內容的過程檔案。
- sdd-refine-pb — 梳理產品待辦：細化初始需求，建立 PBI，並補充使用者故事和驗收標準。
- sdd-plan-sprint — 規劃衝刺：把 PBI 分配到各衝刺，檢查覆蓋與可追溯性，並把 PBI 拆成細粒度 SBI。
- sdd-tracking — 追蹤並更新即時狀態，包括臨時 OGT（進行中任務）。
- sdd-retrospective — 在開發者與智能體之間，或智能體之間進行回顧。
- sdd-close-sprint — 關閉衝刺。
- sdd-audit-artifacts — 讀取工作區索引和過程檔案。回傳專案未初始化、索引已損壞，或索引可用。不編輯檔案。
- sdd-review-status — 讀取五份過程檔案，並提出這些檔案支持的下一步選項。不編輯檔案。
- sdd-update-specs — 使規格與實作保持一致。
- sdd-design — 在實作 SBI 之前完成設計與規劃：與開發者釐清未知項，完成設計，並做好實作準備。
- sdd-implement — 載入實作該 SBI 所需的技能，對照 DoD 及其驗收標準。

### 規則

- dod.mdc — 整個產品的完成定義。
- incremental-delivery.mdc — 完成一個 SBI 後再開始下一個。
- realtime-status.mdc — 即時追蹤狀態，並在每個 SBI 完成時更新 status.md。

## 產物

### sdd-scrum 框架

- scrum-in-sdd.md — SDD-Scrum 框架的單一事實來源。
- sdd-scrum-practices.md — 開發者與 AI 智能體協作時，Harness Engineering 與 SDD 實務的單一事實來源。
- artifacts-map.json — 產物路徑定義與專案對應。

### sdd-scrum 流程

- product-backlog.md — 產品待辦。
- sprint-backlog.md — 衝刺待辦。
- status.md — 即時狀態。
- changes-log.md — 變更管理。

### 工程產物

- architecture.md — 工程產物範本。
- design.md — 工程產物範本。
- test.md — 工程產物範本。
- deployment.md — 工程產物範本。
- issues-log.md — 問題紀錄與追蹤範本。
