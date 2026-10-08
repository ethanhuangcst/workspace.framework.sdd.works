# Scrum in SDD

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-08
> **Author:** © 2026 Ethan Huang

---

本文說明在規格驅動開發（Spec-Driven Development）中如何採用 Scrum，並在 Harness Engineering 原則下開展 Agentic Programming。

《Scrum 指南》定義 Scrum。本文不取代它。

- **第一部分** 說明 Agentic Programming、Harness Engineering 和規格驅動開發。
- **第二部分** 說明經典 Scrum 在這一設定下沒有覆蓋的內容。
- **第三部分** 是定義：哪些保持不變，哪些新增，哪些改變。
- **附錄**：2020 版《Scrum 指南》的簡要摘要。該摘要是經典 Scrum 的基線。

## Index

- [第一部分 Agentic Programming、Harness Engineering，以及與敏捷實踐對齊的規格驅動開發（SDD）](#第一部分-agentic-programmingharness-engineering以及與敏捷實踐對齊的規格驅動開發sdd)
  - [Agentic Programming](#agentic-programming)
  - [Harness Engineering](#harness-engineering)
  - [Spec-Driven Development（SDD）](#spec-driven-developmentsdd)
  - [用 SDD 落實 Harness Engineering 原則](#用-sdd-落實-harness-engineering-原則)
  - [將極限編程實踐與 SDD 結合](#將極限編程實踐與-sdd-結合)
  - [將 Scrum 與 SDD 結合](#將-scrum-與-sdd-結合)
  - [將其他敏捷實踐與 SDD 結合](#將其他敏捷實踐與-sdd-結合)
- [第二部分 SDD 下的 Scrum 缺口](#第二部分-sdd-下的-scrum-缺口)
  - [需要加入 Scrum 實施的 SDD 概念](#需要加入-scrum-實施的-sdd-概念)
  - [Scrum in SDD 中需要調整的 Scrum 概念](#scrum-in-sdd-中需要調整的-scrum-概念)
- [第三部分 Scrum in SDD 指南](#第三部分-scrum-in-sdd-指南)
  - [概述](#概述)
  - [KEEP - 保持不變的內容](#keep---保持不變的內容)
  - [ADD - 新增的內容](#add---新增的內容)
  - [MODIFY：發生變化的內容](#modify發生變化的內容)
  - [Scrum in SDD 的最小配置](#scrum-in-sdd-的最小配置)
  - [運行原則](#運行原則)
- [附錄：2020 版《Scrum 指南》簡要摘要](#附錄2020-版scrum-指南簡要摘要)
  - [《Scrum 指南》的目的](#scrum-指南的目的)
  - [Scrum 的定義](#scrum-的定義)
  - [Scrum 理論](#scrum-理論-1)
  - [Scrum 價值觀](#scrum-價值觀-1)
  - [Scrum Team](#scrum-team)
  - [Scrum 事件](#scrum-事件-2)
  - [Scrum 工件](#scrum-工件-2)
  - [結語](#結語)

# **第一部分** Agentic Programming、Harness Engineering，以及與敏捷實踐對齊的規格驅動開發（SDD）

在 **Agentic Programming** 和 **Spec-Driven Development** 之下，並遵循 **Harness Engineering** 原則，軟體交付方式被從根本上重塑。

**與 Agentic Programming、SDD 和 Harness Engineering 的關係：** **Agentic Programming** 是在軟體工作中使用 AI agents 的更大範式。**Harness Engineering** 是讓它真正落地運行的基礎設施。**SDD** 是這一範式中的方法：agents 以規格（specification）作為 **source of truth** 開展工作。

**它們與 Scrum、極限編程（Extreme Programming，XP）、行為驅動開發（Behavior-Driven Development，BDD）和驗收測試驅動開發（Acceptance Test-Driven Development，ATDD）等敏捷實踐自然對齊。**

## Agentic Programming

**Agentic Programming** 是一種軟體開發方式。在這種方式中，**AI agents** 不再只是被動的代碼助手，而是工程流程中的**主動協作者**：它們參與**規劃、編碼、測試、調試、審查**，有時還參與軟體運行。其自主性受**人定義的目標、約束和監督**所限定。

## Harness Engineering

**Harness Engineering** 是設計**運行時框架**的學科，讓 AI agents 在真實環境中**可靠、安全、有效**地運行。它包括**工具集成、執行編排、上下文與記憶管理、權限與護欄、可觀測性，以及人工監督**。

- **工具集成**：把 agents 連接到文件、API 和系統
- **執行編排**：管理規劃、行動、檢查和重試
- **上下文與記憶**：控制 agent 知道什麼、保留什麼
- **權限與護欄**：約束行為並降低風險
- **可觀測性與監督**：支持監控、評估和人工介入

## Spec-Driven Development（SDD）

**Spec-Driven Development（SDD）** 是 agentic programming 中的一種方法。**規格（specification）** 是**首要工件**：先定義需求、行為、接口、約束和驗收標準，再據此實現。

- **從規格開始**：定義目標、工作流、工具、輸入與輸出、護欄和成功標準。
- **把意圖變成結構**：定義角色、規則、權限、記憶和失敗處理。
- **按規格實現**：生成代碼、提示詞、工具封裝、測試和編排。
- **從規格推導測試**：定義驗收標準、評估用例和邊界情況。
- **先在規格層迭代**：先更新規格，再改實現。
- **說清多 agent 協作**：讓規劃、編碼、審查和測試對齊同一份 source of truth。
- **減少漂移和歧義**：把約束寫清楚。
- **提高自動化**：更容易生成代碼、測試、文檔和校驗。

## 用 SDD 落實 Harness Engineering 原則

在 **Spec-Driven Development（SDD）** 中，**規格**定義行為、約束和驗收標準。它是實現和評估的 **source of truth**。在 **Harness Engineering** 原則下，它通過相互關聯的層落地：

- **Rules**：約束執行。
- **Skills**：提供可複用能力。
- **Agents**：依據規格執行任務。
- **Workflows**：協調動作與交接。
- **Knowledge**：用相關上下文為執行提供依據。

這些層把**規格**變成**可靠執行**。

## 將極限編程實踐與 SDD 結合

在 **SDD** 中，可以把 **eXtreme Programming（XP）** 實踐放進 **harness**，讓人和 AI agents 遵循同一套工程標準，包括：

- **ATDD**：實現之前，根據規格定義驗收測試。
- **TDD**：先寫測試，再實現到測試通過。
- **結對編程（Pair Programming）**：開發中的人與 agent，或 agent 與 agent 協作。
- **CI/CD**：持續驗證、集成並交付變更。
- **測試自動化（Test Automation）**：自動運行單元、集成和端到端測試。
- **重構（Refactoring）**：在不改變已規定行為的前提下改進代碼結構。

## 將 Scrum 與 SDD 結合

**Scrum** 規定交付節奏。**SDD** 把規格作為 source of truth。

- **Product Backlog**：需求和驗收標準。
- **Sprint Backlog**：本 Sprint 要做成的事，以及由誰完成。
- **Increment**：滿足規格和 Definition of Done 的結果。
- **事件**：Planning、Daily Scrum、Review 和 Retrospective 保留。人和 agents 都參加。
- **Definition of Done**：一條規則，在條目完成前執行。
- **增量交付**：完成一個 Sprint 條目後，再開始下一個。
- **規格先行**：行為變更從規格開始。Sprint 負責實現。

### 在這種方法中，人如何與 AI agents 協作

**人**定義並治理 **harness**；**AI agents** 在其中運行。人不僅規定**做什麼**，也規定 agents **可以怎樣工作**。

- **人定義 harness**：規則、技能、工作流、agent 角色和知識邊界。
- **人定義規格**：目標、約束、業務規則和驗收標準。
- **AI 協助寫清並執行**：在 harness 內細化規格、實現、測試和迭代。
- **人驗證並監督**：審查輸出、消除歧義、批准敏感操作，並更新 source of truth。
- **AI 提供反饋**：把結果與規格對照，並指出差距或失敗。

## 將其他敏捷實踐與 SDD 結合

**SDD** 把**規格**當作共享的 source of truth。多種敏捷方法已經以示例、測試和小步驗證為中心，因此可以放進同一套 harness，而不另起一套流程。

- **行為驅動開發（BDD）**：用場景（常用 Gherkin）表達從規格得出的行為。產品、工程和 agents 在改代碼之前共用一套說法。
- **驗收測試驅動開發（ATDD）**：先就規格上的驗收測試達成一致，再實現到這些測試通過。與 **atdd-expert** 技能，以及上文 XP 中的 ATDD 一致。
- **精益思維**：保持批次小，減少交接浪費，並經常按規格檢查結果。與本指南中的短 Sprint 和增量交付一致。
- **看板（Kanban）**：在 backlog 和 Sprint 板上看見工作，限制在製品，並且只在該項規格已足夠可建造時拉取下一項。
- **持續交付**：規格、測試和 Definition of Done 都通過時再集成和部署。Harness 中的 CI/CD 自動做這項檢查。

[返回頂部](#index)

# **第二部分** SDD 下的 Scrum 缺口

在 **Harness Engineering** 原則下實施 **SDD** 時，會出現改變 **Scrum 定義** 的缺口。

## 需要加入 Scrum 實施的 SDD 概念

Harness 各層和 SDD 工件被加入經典 Scrum。權威清單在**第三部分**的 **ADD - 新增的內容**。

- **Rules** 約束關閉、增量交付、WIP 狀態，以及可讀的 Markdown。
- **Skills** 覆蓋 backlog、Sprint、規格、審計和構建類工作。
- **Agents**：scrum-master（本服務中為 **ethan**）。
- **Workflows**：在某項工作需要明確交接順序之前，保持佔位。
- **Knowledge**：ADR 和知識目錄的路徑來自 `artifacts-map.json`。
- **Artifacts**：核心、框架、工程工件，以及 pack 文件（細節在第三部分）。

[返回頂部](#index)

## Scrum in SDD 中需要調整的 Scrum 概念

### Scrum 團隊與 Scrum 職責

- **團隊**可以小得多：常常是一名 **Product Owner** 和幾名**全棧工程師**，其中一人兼任 **Scrum Master**。
- **Scrum 角色**可以同時包括**人和 AI agents**。
- 傳統 **Scrum Master** 的職責可以在很大程度上交給 **AI agents**。
- **新增的 Scrum Master 職責**：在 **Rules、Skills、Workflows、Agents 和 Knowledge** 上貫徹 **Harness Engineering** 原則。

#### Developers

- 每個 Sprint 創建**可用 Increment** 的**人和 AI agents**。
- 圍繞 **Sprint Goal** 實時調整計劃。
- 人類成員仍然承擔**職業責任**。
- 人類成員**訓練並管理 AI agents**。

#### Product Owner

- 即使工作委託給 **AI agents**，仍然**由其負責**。
- **一個人**，可由 AI agents 協助，**不是委員會**。

#### Scrum Master

- **傳統 Scrum Master 職責**可以分散到各項 **Scrum 職責**中。
- **AI agents** 可以支持**輔導、清除障礙、Scrum 事件、定義 Product Goal、管理 Product Backlog，以及推廣 Scrum**。
- 新增職責包括：**貫徹 Harness Engineering 原則、管理知識，並持續改進 Scrum in SDD**。

### Scrum 事件

#### Sprint

- **Sprint** 可以不再是**固定時長**。
- 它可能只持續**幾個小時**，固定節奏的意義隨之變小。

#### Sprint Planning

- **Sprint Planning** 可以只花**幾分鐘**：AI agents 更新 **Sprint Backlog**，人審查並確認。

#### Daily Scrum

- 經典的 **Daily Scrum** 可能仍然需要。
- 人與 agents 之間更頻繁的**檢查和調整**可以在**實時**中持續發生。
- 在 **sdd-dod.mdc** 下，關閉任務或 SBI 時走回顧門禁，並在這次關閉適用時更新 **status.md**。

#### Sprint Review

#### Sprint Retrospective

- **回顧（Retrospective）** 有三種形式。後兩種由 **sdd-retrospective** 技能記成 ADR 或 Knowledge。
1. **Sprint 結束時**：經典的人與人回顧。
2. **按需**：由人發起的人與 agent 回顧。
3. **按規則**：在工作被標為完成之前，由 agent 與 agent 觸發的回顧。記錄寫明觸發該規則的事件，例如 `feature-01 done`。

- **回顧**有**四種觸發**：
1. **Sprint 結束時**。
2. **按需**。
3. 在把**任務或 SBI** 標為完成之前。
4. 在關閉 **Sprint** 之前。

- **回顧**是一項 **skill**。

### Scrum 工件

#### Product Backlog

- **Product Backlog** 是一份 **Markdown 文件**：**product-backlog.md**。
- 不再必須**估算規模**，因為 **PBI 和 SBI** 可以切成**數小時內**做完的工作。

#### Sprint Backlog

- **Sprint Backlog** 是一份 **Markdown 文件**：**sprint-backlog.md**。
- 它由 **Developers** 創建，也服務於 **Developers**，其中既有**人**也有 **agents**。

#### 承諾：Definition of Done

- **Definition of Done** 是一條 **rule**：**sdd-dod.mdc**。
- 它不僅適用於 **Increment**，也適用於**所有任務**。

[返回頂部](#index)

# **第三部分** Scrum in SDD 指南

## 概述

本指南通過說明哪些保留、哪些新增、哪些變化，來定義 Scrum in SDD。

**適用對象**

本指南同時面向人和 AI agents。

- **人**治理、批准，並繼續承擔責任。
- **AI agents** 在既定約束內執行。
- 雙方使用同一套規則、工件和術語。

**如何閱讀本指南**

- **Keep**：仍然有效的經典 Scrum 概念。
- **Add**：在 Harness Engineering 原則下實施 SDD 所需的新概念。
- **Modify**：在 Scrum in SDD 中發生變化的經典 Scrum 概念。

**術語**

- **Scrum in SDD**：在 Harness Engineering 原則下，為 SDD 調整後的 Scrum。
- **規格（Spec）**：行為、約束和驗收標準的 source of truth。
- **Harness**：治理 agent 執行的運行時系統。
- **Rule**：對執行的約束。
- **Skill**：可複用能力。
- **Agent**：執行工作的人或 AI。
- **Workflow**：規定好的動作與交接順序。
- **Knowledge**：執行中保留並使用的項目上下文。
- **Artifact**：用於規劃、執行或檢查工作的持久項目文檔。
- **PBI**、**SBI**、**Feature**、**Task**、**OGT**、**MVP**：實踐中的術語（名稱在客戶端根目錄的 `sdd-scrum-practices.md` 中）。
- **Increment**：符合 Definition of Done 的可用產出。

[返回頂部](#index)

## **KEEP** - 保持不變的內容

### Scrum 理論

- 經驗主義仍然是基礎。
- 透明、檢查和調整仍然適用。
- 精益思維仍然適用。

### Scrum 價值觀

- 承諾
- 專注
- 開放
- 尊重
- 勇氣

### 核心職責

- **Product Owner** 仍然對產品價值負責。
- **Developers** 仍然對創建可用產出負責。
- **Scrum Master** 仍然對 Scrum 是否有效負責。

### 核心工件

- **Product Backlog** 仍然是候選工作的來源。
- **Sprint Backlog** 仍然是當前 Sprint 工作的來源。
- **Increment** 仍然是已交付價值的單位。

[返回頂部](#index)

## **ADD** - 新增的內容

### Harness 各層

- **Rules**：約束執行。
- **Skills**：提供可複用能力。
- **Agents**：執行工作。
- **Workflows**：協調動作與交接。
- **Knowledge**：用上下文為執行提供依據。

### Rules

- **sdd-dod.mdc**：Definition of Done；關閉時寫入流程文件。
- **sdd-incremental-delivery.mdc**：增量交付策略。
- **sdd-realtime-status.mdc**：WIP 時的流程同步；工作未 Done 時先起草、確認、再寫入。
- **friendly-language.mdc**：讓使用者和後續 agent 能讀的對話與 Markdown。

### Skills

- **atdd-expert**
- **sdd-update-project**
- **sdd-refine-backlog**
- **sdd-plan-sprint**
- **sdd-retrospective**
- **sdd-close-sprint**
- **sdd-audit-artifacts**
- **sdd-review-status**
- **sdd-update-specs**
- **sdd-spec-to-build**
- **sdd-create-skill**

### 核心工件（SDD）

這些是 SDD 的核心工件。它們不是 KEEP 下的 Scrum 核心工件（Product Backlog、Sprint Backlog 和 Increment）。

- **pack-scrum-in-sdd.md**：名稱與含義。留在客戶端根目錄。
- **sdd-scrum-practices.md**：做什麼、怎麼做、何時做。留在客戶端根目錄。
- **artifacts-map.json**：本項目工件放在哪裡。位於工作區根目錄。

### 框架工件

- **product-backlog.md**：Product Backlog。
- **sprint-backlog.md**：Sprint Backlog。
- **status.md**：項目快照；在 DoD 關閉時，以及 WIP 檢查點（`sdd-realtime-status.mdc`）時更新。
- **changes-log.md**：變更歷史。

### 工程工件

- **architecture.md**：架構規格。
- **{stem}-stories.md**：用戶故事和驗收標準。
- **{stem}-design.md**：設計規格。
- **{stem}-tests.md**：測試規格。
- **release.md**：本地啟動與上線順序。
- **test-strategy.md**：產品級測試策略。
- **.secrets**：dotenv 形式的登記（`NAME=` 留空）；用 `#` 註釋說明值放在哪裡。Git 中不放機密值。
- **issues-log.md**：缺陷記錄。它也是審計會打開的五份流程文件之一。

### Pack 文件

這些不是項目工件。它們不屬於上面任何一組。

- **constants.json**：客戶端根目錄上的 pack 查找表，存放路徑名、技能鍵和規則鍵。
- **.sdd-installed.json**：客戶端根目錄上的安裝賬本。安裝程序寫入它。`pack_complete: true` 表示 pack 複製已完成。

### Knowledge

- **ADR**：架構決策記錄（Architecture Decision Record）。
- **knowledge/**：執行過程中學到的項目知識。
- 當地圖包含 `adr` 或 `knowledge` 時，這些鍵是對應目錄樹的根路徑。

[返回頂部](#index)

## **MODIFY**：發生變化的內容

### Scrum 團隊與 Scrum 職責

- 團隊可以更小。
- Scrum 角色可以包括人和 AI agents。
- Scrum Master 還要貫徹 Harness Engineering 原則。
- 人類成員訓練、監督並治理 AI agents。

#### Developers

- Developers 可以是人、AI，或兩者。
- 他們可以圍繞 Sprint Goal 實時調整計劃。
- 人類成員仍然承擔職業責任。

#### Product Owner

- Product Owner 仍然是一個人，不是委員會。
- 工作可以委託給 AI agents，責任不能委託。

#### Scrum Master

- 一部分經典 Scrum Master 職責可以由 AI agents 執行。
- 該角色還擴展到規則設計、技能設計、harness 品質和知識管理。

### Scrum 事件

#### Sprint

- Sprint 可以短很多。
- 在很短的執行週期裡，固定節奏可以不那麼重要。
- Sprint 仍然劃定規劃、檢查和交付的邊界。

#### Sprint Planning

- Sprint Planning 可以是幾分鐘，而不是幾小時。
- AI agents 可以先準備 backlog 更新，再交人審查。

#### Daily Scrum

- 更頻繁的實時檢查可以補充每日 Scrum 事件。
- **sdd-realtime-status** 這類規則在 WIP 檢查點觸發狀態更新。

#### Sprint Review

- Sprint Review 仍然是檢查結果並決定下一步的事件。
- AI 生成的輸出可以在事件之前或事件之中接受審查。

#### Sprint Retrospective

- 回顧可以發生在 Sprint 結束時、按需、按規則，或在關閉 Sprint 之前。
- 回顧既是事件，也是一項技能。

### Scrum 工件

#### Product Backlog

- Product Backlog 可以維護為一份 Markdown 工件。
- 當工作切得很小時，規模估算可以改為可選。

#### Sprint Backlog

- Sprint Backlog 可以維護為一份 Markdown 工件。
- 人和 AI agents 可以持續更新它。
- **未排入 Sprint 的 PBI（Unplanned PBIs）** 列出沒有 Sprint 指派的產品待辦項。該節位於 `sprint-backlog.md` 最後一張 Sprint 表之後。寫法見 `sdd-scrum-practices.md`。

#### Increment

- Increment 仍然是符合 Definition of Done 的可用產出。
- 短週期內可以產出多個小 Increment。

#### 承諾：Definition of Done

- Definition of Done 實現為一條規則。
- 它可以同時適用於任務和 Increment。

[返回頂部](#index)

## Scrum in SDD 的最小配置

- 一名 **Product Owner**
- 一名兼職 **Scrum Master**
- 一名或多名人類 **Developers**
- 一份共享**規格**
- 一套 **sdd framework**，包括所需的 **rules**、**skills** 和其他邊界
- 一個提供 AI agents 來執行工作的 **AI agent 工具**
- 已寫明的人的批准邊界
- 已寫明的 agent 執行邊界

## 運行原則

- 先有規格，再做實現。
- 先有規則，再給自主性。
- 責任留在人這裡。
- AI agents 在約束內執行。
- 工件始終是共享的 source of truth。
- 檢查持續發生。
- 回顧推動改進。
- 規則要寫得讓人和 AI agents 都能遵循。

[返回頂部](#index)

# 附錄：2020 版《Scrum 指南》簡要摘要

**作者：** Ken Schwaber 與 Jeff Sutherland

**副標題：** Scrum 權威指南：遊戲規則

**日期：** 2020 年 11 月

© 2020 Ken Schwaber and Jeff Sutherland

> 這個 HTML/Markdown 版本直接移植自 2020 年 11 月的 PDF（`2020-Scrum-Guide-US.pdf`），僅供審閱。

## 《Scrum 指南》的目的

《Scrum 指南》定義 Scrum，其中每個要素都有其目的。只實施其中一部分，可能讓 Scrum 失效。

Scrum 適用於軟體之外的複雜工作。“Developers”指從事這類工作的所有人，因此任何能從 Scrum 獲得價值的人都包括在內。

人們可以在 Scrum 中使用模式、流程和見解，但本指南不寫這些內容，因為它們不在 Scrum 的定義裡。

[返回頂部](#index)

## Scrum 的定義

Scrum 是一種輕量級框架，幫助個人、團隊和組織通過適應性方案，為複雜問題創造價值。

簡而言之，Scrum 要求 Scrum Master 促成這樣一種環境：

1. Product Owner 把複雜問題的工作整理並排序進 Product Backlog。
2. Scrum Team 在一個 Sprint 中把選定的工作變成有價值的 Increment。
3. Scrum Team 和利益相關方檢查結果，併為下一個 Sprint 做出調整。
4. 重複。

Scrum 是一個簡單、並且有意保持不完整的框架，建立在使用者的集體智慧之上。它不是一套方法論。只要原則得到遵守，使用者可以加入自己的最佳實踐。

[返回頂部](#index)

## Scrum 理論

Scrum 建立在經驗主義和精益思維之上。它重視經驗、觀察、專注和減少浪費。

Scrum 用迭代、增量的方式提高可預測性並降低風險。團隊帶來或發展完成工作所需的技能。

Scrum 把四個正式的檢查與調整事件放在一個承載事件裡，這個事件就是 Sprint。這些事件有效，是因為它們落實了經驗主義的三根支柱：透明、檢查和調整。

### 透明

工作和過程必須對所有人可見。在 Scrum 中，關鍵決策依賴對三項正式工件當前狀態的判斷。透明不足會導致決策變差、價值降低、風險升高。

透明使檢查成為可能。沒有透明，檢查會誤導並造成浪費。

### 檢查

必須經常檢查 Scrum 工件以及朝目標推進的進展，以避免浪費。Scrum 通過五個事件提供這種節奏。

### 調整

如果產出不可接受，團隊必須儘快調整，以減少浪費。

調整需要被授權的、自我管理的團隊。Scrum Team 應在學到新情況後儘快調整。

[返回頂部](#index)

## Scrum 價值觀

承諾、專注、開放、尊重和勇氣

這些價值觀指導 Scrum Team 的工作、行為和決策。當它們被踐行時，會建立信任，並讓透明、檢查和調整真正發生。

[返回頂部](#index)

## Scrum Team

- Scrum Team 是 Scrum 的基本單元：一名 Scrum Master、一名 Product Owner，以及 Developers。
- 沒有子團隊：跨職能。
- 沒有層級：自我管理。
- 一次聚焦一個目標：Product Goal。
- 通常少於 10 人，以保持敏捷。
- 對大型產品，多個 Scrum Team 可以共享同一個 Product Goal、Product Backlog 和 Product Owner。
- 團隊擁有完整的產品價值流。
- 團隊對每個 Sprint 產出有價值、可用的 Increment 負責。

### Developers

Scrum Team 中每個 Sprint 創建可用 Increment 的人。

他們負責：

- 創建 Sprint Backlog
- 遵守 Definition of Done
- 每天圍繞 Sprint Goal 調整計劃
- 以專業身份相互負責

### Product Owner

對最大化產品價值負責。

負責：

- 定義 Product Goal
- 說清 Product Backlog 條目
- 排序 Product Backlog
- 讓 Product Backlog 保持透明、可被理解

即使工作被委託，責任仍在。一個人，不是委員會。

### Scrum Master

對建立 Scrum 並提高團隊效能負責。
是 Scrum Team、Product Owner 和組織的服務型領導者。
負責：

- 輔導 Scrum Team
- 清除障礙
- 確保 Scrum 事件有效
- 支持定義 Product Goal 和管理 Product Backlog
- 推動組織採用 Scrum

[返回頂部](#index)

## Scrum 事件

Sprint 包含全部 Scrum 事件。它們帶來檢查、調整和規律。

理想情況下，所有事件在同一時間和同一地點舉行。

### Sprint

Sprint 是固定長度的週期，最長一個月，把想法變成價值。

每個 Sprint 包含達成 Product Goal 所需的全部工作。

在 Sprint 期間：

- 不得危及 Sprint Goal
- 品質不得下降
- 隨著瞭解增多，可以澄清範圍

更短的 Sprint 提高學習速度並降低風險。

只有 Product Owner 可以取消一個 Sprint。

### Sprint Planning

Sprint Planning 開啟 Sprint，並創建 Sprint Backlog。

它定義 Sprint Goal（為什麼），選擇 Product Backlog 條目（做什麼），並計劃如何交付。

一個月的 Sprint，時間盒最長八小時。

### Daily Scrum

Daily Scrum 幫助 Developers 檢查朝 Sprint Goal 的進展並調整計劃。
它是 Sprint 每個工作日舉行的 15 分鐘事件。
Developers 可以選擇任何形式，只要聚焦進展並得出可執行的計劃。

### Sprint Review

Sprint Review 檢查 Sprint 的結果，並識別接下來要做的調整。

Scrum Team 和利益相關方回顧做了什麼、變了什麼，以及下一步做什麼。

一個月的 Sprint，時間盒最長四小時。

### Sprint Retrospective

Sprint Retrospective 規劃如何提高品質和效能。

Scrum Team 反思剛結束的 Sprint，並找出改進。

一個月的 Sprint，時間盒最長三小時。

[返回頂部](#index)

## Scrum 工件

Scrum 工件代表工作或價值。它們提供透明，併為調整提供共同基礎。

每個工件帶有一項承諾：

- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

### Product Backlog

Product Backlog 是一份有序、持續演化的清單，列出改進產品所需的內容。它是 Scrum Team 唯一的工作來源。

細化到能在一個 Sprint 內完成的條目，就可以進入 Sprint Planning。細化把條目拆成更小、更清楚、更精確的工作。

Developers 負責估算規模。Product Owner 可以幫助他們理解取捨。

#### 承諾：Product Goal

Product Goal 描述產品未來的狀態，給 Scrum Team 一個規劃所朝向的目標。

它是長期目標。團隊必須先完成它或放棄它，才能接下一個。

### Sprint Backlog

Sprint Backlog 包括 Sprint Goal、選定的 Product Backlog 條目，以及交付 Increment 的計劃。

它由 Developers 創建，也服務於 Developers。隨著瞭解增多，它在整個 Sprint 中更新。

#### 承諾：Sprint Goal

Sprint Goal 是這個 Sprint 的唯一目標。

它提供焦點，同時保留彈性。

### Increment

Increment 是朝 Product Goal 前進的一步可用成果，並且符合 Definition of Done。

一個 Sprint 中可以創建並交付多個 Increment。

#### 承諾：Definition of Done

Definition of Done 定義 Increment 所需的品質。

只有達到它的工作才成為 Increment。

它讓“完成”有共同的理解。

[返回頂部](#index)

## 結語

Scrum 免費，並由本指南定義。它不可拆用：只用其中一部分就不是 Scrum。Scrum 可以作為其他技術、方法論和實踐的容器。

### 人們

很多人對 Scrum 作出了貢獻。最早的一批包括 Jeff Sutherland、Jeff McKenna、John Scumniotales、Ken Schwaber、Mike Smith 和 Chris Martin。

### 《Scrum 指南》歷史

Ken Schwaber 和 Jeff Sutherland 於 1995 年首次公開介紹 Scrum。《Scrum 指南》記錄了他們在三十多年中發展和打磨的 Scrum。

[返回頂部](#index)
