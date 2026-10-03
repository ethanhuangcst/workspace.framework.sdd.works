v0.0.1

# Scrum in SDD

本文件定義 Scrum in SDD: 結合 Scrum 和規格驅動開發（Spec-Driven Development, SDD），在 Harness Engineering 原則下使用 Agentic Programming。

《Scrum 指南》定義 Scrum。本文件不取代它。

- **第一部分** 概述 2020 版《Scrum 指南》。該概述是基線。
- **第二部分** 說明 Agentic Programming、Harness Engineering 和規格驅動開發。
- **第三部分** 說明經典 Scrum 在這個設定下沒有涵蓋的內容。
- **第四部分** 是定義：哪些保持不變，哪些新增，哪些改變。


# **第一部分** 2020 版《Scrum 指南》摘要

**作者：** Ken Schwaber 和 Jeff Sutherland

**副標題：** Scrum 權威指南：遊戲規則

**日期：** 2020 年 11 月

© 2020 Ken Schwaber 和 Jeff Sutherland


> 這個 HTML/Markdown 版本直接移植自 2020 年 11 月的 PDF（`2020-Scrum-Guide-US.pdf`），僅供審閱使用。

## 《Scrum 指南》的目的

《Scrum 指南》定義了 Scrum，其中每個要素都有其目的。只實施其中一部分，可能會讓 Scrum 失效。

Scrum 適用於軟體之外的複雜工作。“Developers”指的是從事這類工作的所有人，因此，任何能從 Scrum 中獲得價值的人都包括在內。

人們可以在 Scrum 中使用各種模式、流程和實踐經驗，但本指南不涉及這些內容，因為它們不屬於 Scrum 的定義範圍。

## Scrum 的定義

Scrum 是一種輕量級框架，幫助個人、團隊和組織透過適應性解決方案，為複雜問題創造價值。

簡而言之，Scrum 要求 Scrum Master 營造這樣一種環境：

1. Product Owner 將複雜問題相關的工作整理並排序到 Product Backlog 中。
2. Scrum Team 在一個 Sprint 中把選定的工作轉化為有價值的 Increment。
3. Scrum Team 和利益相關方檢測結果，併為下一個 Sprint 做出調整。
4. 重複以上過程。

Scrum 是一個簡單且有意保持不完整的框架，建立在使用者的集體智慧之上。它不是一種方法論，而是允許使用者在不違背其原則的前提下加入最佳實踐。

## Scrum 理論

Scrum 建立在經驗主義和精益思維之上。它重視經驗、觀察、專注和減少浪費。

Scrum 採用迭代、增量式的方法來提高可預測性並降低風險。團隊需要具備或發展完成工作所需的技能。

Scrum 透過 Sprint 這一承載性事件，結合四個正式事件來實現檢測與調整。這些事件之所以有效，是因為它們落實了 Scrum 經驗主義的三大支柱：透明、檢測和調整。

### 透明

工作和過程必須對所有人可見。在 Scrum 中，關鍵決策依賴於對三項正式工件當前狀態的認知。透明度不足會導致決策變差、價值降低、風險升高。

透明使檢測成為可能。沒有透明，檢測就會產生誤導並造成浪費。

### 檢測

必須定期檢測 Scrum 工件以及朝目標推進的進展，以避免浪費。Scrum 透過五個事件提供這種節奏。

### 調整

如果產出不可接受，團隊必須迅速調整，以減少浪費。

調整需要團隊具備授權和自我管理能力。Scrum Team 應在學到新資訊後儘快做出調整。

## Scrum 價值觀

承諾、專注、開放、尊重和勇氣

這些價值觀指導 Scrum Team 的工作、行為和決策。當這些價值觀真正被踐行時，就會建立信任，並讓透明、檢測和調整真正發揮作用。

## Scrum Team

- Scrum Team 是 Scrum 的核心單元：由一名 Scrum Master、一名 Product Owner 和 Developers 組成。
- 團隊沒有子團隊：它是跨職能的。
- 團隊沒有層級：它是自我管理的。
- 團隊一次只聚焦一個目標：Product Goal。
- 團隊人數通常少於 10 人，以保持敏捷。
- 對於大型產品，多個 Scrum Team 可以共享同一個 Product Goal、Product Backlog 和 Product Owner。
- 團隊對完整的產品價值流負責。
- 團隊對每個 Sprint 產出有價值、可用的 Increment 負責。

### Developers

Scrum Team 中每個 Sprint 負責建立可用 Increment 的人。

他們負責：
- 建立 Sprint Backlog
- 遵守 Definition of Done
- 圍繞 Sprint Goal 每天調整計劃
- 以專業方式彼此負責

### Product Owner

負責最大化產品價值。

職責包括：
- 定義 Product Goal
- 澄清 Product Backlog 條目
- 排序 Product Backlog
- 確保 Product Backlog 透明且易於理解

即使將工作委託出去，責任仍由其承擔。它是一個人，而不是一個委員會。

### Scrum Master

負責建立 Scrum，並提升團隊效能。
是 Scrum Team、Product Owner 以及組織的服務型領導者。
職責包括：
- 指導 Scrum Team
- 清除障礙
- 確保 Scrum 各項事件有效開展
- 支援 Product Goal 的定義和 Product Backlog 的管理
- 推動 Scrum 在組織中的採用

## Scrum 事件

Sprint 包含所有 Scrum 事件。它們實現檢測、調整和工作的節奏性。

理想情況下，所有事件都應在同一時間、同一地點進行。

### Sprint

Sprint 是固定時長的週期，最長不超過一個月，用於把想法轉化為價值。

每個 Sprint 都包含實現 Product Goal 所需的全部工作。

在 Sprint 期間：
- 不得危及 Sprint Goal
- 質量不得下降
- 隨著認知加深，可以澄清範圍

更短的 Sprint 有助於提升學習速度並降低風險。

只有 Product Owner 可以取消一個 Sprint。

### Sprint Planning

Sprint Planning 是 Sprint 的起點，用於建立 Sprint Backlog。

它定義 Sprint Goal（為什麼），選擇 Product Backlog 條目（做什麼），並規劃如何交付。

對於一個為期一個月的 Sprint，時間盒最長為八小時。

### Daily Scrum

Daily Scrum 幫助 Developers 檢測朝 Sprint Goal 推進的進展，並調整計劃。
它是 Sprint 中每個工作日舉行的一次 15 分鐘事件。
Developers 可以採用任何形式，只要它聚焦於進展，併產出可執行的計劃。

### Sprint Review

Sprint Review 用於檢測 Sprint 的產出，並識別後續需要做出的調整。

Scrum Team 與利益相關方一起回顧已完成的工作、發生的變化，以及下一步要做什麼。

對於一個為期一個月的 Sprint，時間盒最長為四小時。

### Sprint Retrospective

Sprint Retrospective 用於規劃提升質量和效能的方法。

Scrum Team 回顧剛結束的 Sprint，並找出改進點。

對於一個為期一個月的 Sprint，時間盒最長為三小時。

## Scrum 工件

Scrum 工件代表工作或價值。它們提供透明性，併為調整提供共同基礎。

每個工件都對應一個承諾：
- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

### Product Backlog

Product Backlog 是一份經過排序、持續演化的清單，列出改進產品所需的內容。它是 Scrum Team 唯一的工作來源。

經過充分細化、能夠在一個 Sprint 內完成的 Backlog 條目，就可以進入 Sprint Planning。細化是把條目拆分成更小、更清晰、更準確的工作。

Developers 負責估算規模。Product Owner 可以幫助他們理解其中的權衡。

#### 承諾：Product Goal

Product Goal 描述產品未來要達到的狀態，為 Scrum Team 提供規劃方向。

它是長期目標。團隊必須先完成它或放棄它，才能開始下一個目標。

### Sprint Backlog

Sprint Backlog 包含 Sprint Goal、選定的 Product Backlog 條目，以及交付 Increment 的計劃。

它由 Developers 建立，也服務於 Developers。隨著認知加深，它會在整個 Sprint 期間持續更新。

#### 承諾：Sprint Goal

Sprint Goal 是這個 Sprint 的唯一目標。

它提供專注，同時保留靈活性。

### Increment

Increment 是朝 Product Goal 前進的一步可用成果，並且符合 Definition of Done。

一個 Sprint 中可以建立並交付多個 Increment。

#### 承諾：Definition of Done

Definition of Done 定義了 Increment 所需達到的質量標準。

只有符合該標準的工作，才算 Increment。

它讓團隊對“完成”的工作形成共同理解。

## 結語

Scrum 是免費的，並由本指南定義。它是不可變的：只使用 Scrum 的一部分，就不算 Scrum。Scrum 可以作為其他技術、方法和實踐的容器發揮作用。

### 致謝

很多人對 Scrum 作出了貢獻。最早的一批貢獻者包括 Jeff Sutherland、Jeff McKenna、John Scumniotales、Ken Schwaber、Mike Smith 和 Chris Martin。

### 《Scrum 指南》歷史

Ken Schwaber 和 Jeff Sutherland 於 1995 年首次公開介紹 Scrum。《Scrum 指南》記錄了他們在 30 多年中不斷發展和完善的 Scrum。

# **第二部分** Agentic Programming、Harness Engineering 與 Spec-Driven Development（SDD）

在 **Agentic Programming** 和 **Spec-Driven Development** 的基礎上，並遵循 **Harness Engineering** 原則，軟體交付方式被從根本上重塑。

**與 Agentic Programming、SDD 和 Harness Engineering 的關係：** **Agentic Programming** 是在軟體工作中使用 AI agents 的更大正規化；**Harness Engineering** 是讓它真正落地執行的基礎設施；**SDD** 則是這一正規化中的方法論路徑，在這種路徑中，agents 以 specification 作為 **source of truth** 開展工作。

## Agentic Programming

**Agentic Programming** 是一種軟體開發方式。在這種方式中，**AI agents** 不再只是被動的程式碼助手，而是工程流程中的**主動協作者**：它們會參與 **規劃、編碼、測試、除錯、審查**，有時還會參與軟體執行；其自主性受到**由人定義的目標、約束和監督**所限定。

## Harness Engineering

**Harness Engineering** 是一門設計**執行時框架**的實踐學科，用來讓 AI agents 能夠在真實環境中**可靠、安全、高效**地執行。它包括**工具整合、執行編排、上下文與記憶管理、許可權與護欄、可觀測性以及人工監督**。

- **工具整合**：將 agents 連線到檔案、API 和系統
- **執行編排**：管理規劃、行動、檢測和重試
- **上下文與記憶**：控制 agent 知道什麼、保留什麼
- **許可權與護欄**：約束行為並降低風險
- **可觀測性與監督**：支援監控、評估和人工介入

## Spec-Driven Development（SDD）

**Spec-Driven Development（SDD）** 是 agentic programming 中的一種方法。在這種方法裡，**specification** 是**首要工件**：先定義需求、行為、介面、約束和驗收標準，再據此實現。

- **從 spec 開始**：定義目標、工作流、工具、輸入/輸出、護欄和成功標準。
- **把意圖變成結構**：定義角色、規則、許可權、記憶和失敗處理。
- **按 spec 實現**：生成程式碼、提示詞、工具封裝、測試和編排。
- **從 spec 推導測試**：定義驗收標準、評估用例和邊界情況。
- **優先在 spec 層迭代**：先更新 spec，再修補實現。
- **澄清多 agent 協作**：讓 planner、coder、reviewer 和 tester 共享同一個 source of truth。
- **減少漂移和歧義**：把約束明確寫出來。
- **提升自動化**：更容易生成程式碼、測試、文件和校驗。

## Harness Engineering 原則下的 SDD

### 用 SDD 落實 Harness Engineering 原則

在 **Spec-Driven Development（SDD）** 中，**specification** 定義行為、約束和驗收標準。它既是實現的 **source of truth**，也是評估的 **source of truth**；在 **Harness Engineering** 原則下，它透過多個相互關聯的層被操作化：

- **Rules**：約束執行。  
- **Skills**：提供可複用能力。  
- **Agents**：依據 spec 執行任務。  
- **Workflows**：協調動作與交接。  
- **Knowledge**：用相關上下文為執行提供依據。  

這些層共同把 **specifications** 轉化為**可靠執行**。

### 將極限程式設計實踐與 SDD 整合

在 **SDD** 中，可以把 **eXtreme Programming（XP）** 的實踐嵌入 **harness**，讓人和 AI agents 遵循一致的工程標準，包括：

- **ATDD**：在實現之前，根據 spec 定義驗收測試。
- **TDD**：先寫測試，再實現並使其透過。
- **Pair Programming**：開發過程中進行人機或 agent-agent 協作。
- **CI/CD**：持續驗證、整合並交付變更。
- **Test Automation**：自動執行單元測試、整合測試和端到端測試。
- **Refactoring**：在不改變已定義行為的前提下改進程式碼結構。

### 將 Scrum 與 SDD 整合

**Scrum** 規定交付節奏。**SDD** 把 spec 作為 source of truth。

- **Product Backlog**：需求和驗收標準。
- **Sprint Backlog**：本 Sprint 要實現的內容，以及由誰完成。
- **Increment**：滿足 spec 和 Definition of Done 的結果。
- **Events**：Planning、Daily Scrum、Review 和 Retrospective 保留。人和 agents 都參與。
- **Definition of Done**：一條規則，在條目完成前執行。
- **Incremental delivery**：完成一個 Sprint 條目後，再開始下一個。
- **Spec first**：行為變更從 spec 開始。Sprint 負責實現。

### 在這種方法中，人如何與 AI agents 協作

**Humans** 負責定義並治理 **harness**；**AI agents** 在其中執行。人不僅定義**要做什麼**，也定義 agents **可以如何工作**。

- **Humans 定義 harness**：規則、技能、工作流、agent 角色和知識邊界。
- **Humans 定義 spec**：目標、約束、業務規則和驗收標準。
- **AI 協助形式化與執行**：在 harness 中細化 spec、實現、測試和迭代。
- **Humans 負責驗證與監督**：審查輸出、消除歧義、批准敏感操作，並更新 source of truth。
- **AI 提供反饋**：將結果與 spec 對照，並暴露差距或失敗點。

# **第三部分** 用 SDD 實施 Agentic Programming 時，經典 Scrum 的缺口

當在 **Harness Engineering** 原則下實施 **SDD** 時，會出現一些缺口，從而改變 **Scrum definition**。

## 需要加入 Scrum 實施中的 SDD 概念

### Rules
- **dod.mdc**：Definition of Done
- **incremental-delivery.mdc**：增量交付
- **realtime-status.mdc**：實時跟蹤狀態，並在每項任務完成時更新 **status.md**

### Skills
- **sdd-atdd**
- **sdd-tdd**
- **sdd-update-project**
- **sdd-refine-pb**
- **sdd-plan-sprint**
- **sdd-tracking**
- **sdd-retrospective**
- **sdd-close-sprint**
- **sdd-audit-artifacts**
- **sdd-update-specs**
- **sdd-design**
- **sdd-implement**

### Agents
- **scrum-master**，在本服務中為：**ethan**

### Workflows
由於現階段對 **workflows** 尚無實際需求，這個資料夾暫時只作為**佔位**。

### Knowledge
- **ADR**：Architecture Decision Record，預設路徑：**{workspace-folder}/specs/ADR**
- **knowledge**：專案中沉澱的知識，預設路徑：**{workspace-folder}/specs/knowledge**

### Artifacts
- **SDD 核心工件**：**scrum-in-sdd.md; sdd-scrum-practices.md; artifacts-map.json**
- **框架工件**：**product-backlog.md; sprint-backlog.md; status.md; changes-log.md**
- **工程工件**：**architecture.md; {stem}-stories.md; {stem}-design.md; {stem}-tests.md; deployment.md; .secrets; issues-log.md**
- **這三組之外的套件檔案**：**constants.json**（用戶端根目錄上的套件查找表）；**.sdd-installed.json**（用戶端根目錄上的安裝帳本）

## 在 Scrum in SDD 中需要修改的 Scrum 概念

### Scrum Team
- **團隊**可以小得多：通常是一名 **Product Owner** 加上幾名 **full-stack engineers**，其中一人還兼任 **Scrum Master**。
- **Scrum 角色**可以同時包括 **人和 AI agents**。
- 傳統的 **Scrum Master** 很大一部分職責部分委託給 **AI agents**。
- **新增的 Scrum Master 職責**：在 **Rules、Skills、Workflows、Agents 和 Knowledge** 各層中貫徹 **Harness Engineering 原則**。

#### Developers
- 在每個 Sprint 中建立**可用 Increment**的 **人和 AI agents**。
- 圍繞 **Sprint Goal** 實時調整計劃。
- 人類成員仍然承擔**職業責任**。
- 人類成員負責**訓練和管理 AI agents**。

#### Product Owner

- 即使工作委託給 **AI agents**，仍然**由其負責**。
- 仍然是**一個人**，可由 AI agents 協助，**不是委員會**。

#### Scrum Master
- **傳統 Scrum Master 部分職責**可以分散到各項 **Scrum accountabilities** 中。
- **AI agents** 可以支援**輔導、清除障礙、Scrum 事件、Product Goal 定義、Product Backlog 管理以及 Scrum 推廣**。
- 增加了新的職責，包括：**貫徹 Harness Engineering 原則、管理知識，並持續改進 Scrum in SDD**。

### Scrum 事件

#### Sprint
- **Sprint** 可能不再是**固定時長**。
- 它可能只持續**幾個小時**，使固定節奏的意義變小。

### Sprint Planning
- **Sprint Planning** 可能只需**幾分鐘**：AI agents 更新 **Sprint Backlog**，再由人稽核並確認。

#### Daily Scrum
- 經典的人和人之間的 Daily Scrum 依然有需要。
- 但是可以在**實時**過程中持續進行人和 Agent 之間的**檢測和調整**。
- 透過 **realtime-status rule**，每項任務一完成，就會觸發一次**小型 retrospective**，並更新 **status.md**。

#### Sprint Review

#### Sprint Retrospective
- **Retrospective** 有**三種形式**，由 **retrospective** 技能確保後兩種形式的過程資產形成 **ADR** 或 **Knowledge**.
1. **Sprint 結束時**：經典的人與人回顧。
2. **按需發起**：由人發起的人和 agents 的回顧。
3. **按規則觸發**：在工作被標記為完成前，由 agent-agent 觸發的回顧。記錄寫明觸發規則的事件，例如 `feature-01 done`。


- **Retrospective** 有**四種觸發條件**：
1. **Sprint 結束時**。
2. **按需發起**。
3. 在將**任務或 SBI** 標記為完成之前。
4. 在關閉 **Sprint** 之前。

- **Retrospective** 是一個 **skill**。

### Scrum 工件

#### Product Backlog
- **Product Backlog** 是一個 **Markdown 檔案**：**product-backlog.md**。
- 不再需要**估算規模**，因為 **PBI 和 SBI** 可以被切分成能在**數小時內**完成的工作。

#### Sprint Backlog
- **Sprint Backlog** 是一個 **Markdown 檔案**：**sprint-backlog.md**。
- 它由 **Developers** 建立，也服務於 **Developers**，其中既包括**人**也包括**agents**。

#### 承諾：Definition of Done
- **Definition of Done** 是一條 **rule**：**dod.mdc**。
- 它不僅適用於 **Increments**，也適用於**所有任務**。



**第四部分** Scrum in SDD 指南
# **第四部分** Scrum in SDD 指南

## 目的

本指南透過說明哪些內容保留、哪些新增、哪些變化，來定義 Scrum in SDD。

## 適用物件

本指南同時面向人和 AI agents。

- **Humans** 負責治理、審批，並繼續承擔責任。
- **AI agents** 在既定約束內執行。
- 雙方使用同一套規則、工件和術語。

## 如何閱讀本指南

- **Keep**：仍然有效的經典 Scrum 概念。
- **Add**：在 Harness Engineering 原則下實施 SDD 所需的新概念。
- **Modify**：在 Scrum in SDD 中發生變化的經典 Scrum 概念。

## 術語

- **Scrum in SDD**：在 Harness Engineering 原則下，為 SDD 調整後的 Scrum。
- **Spec**：關於行為、約束和驗收標準的 source of truth。
- **Harness**：治理 agent 執行的執行時系統。
- **Rule**：對執行的約束。
- **Skill**：可複用能力。
- **Agent**：執行工作的人工或 AI 行動者。
- **Workflow**：定義好的動作與交接序列。
- **Knowledge**：執行中使用並保留的專案上下文。
- **Artifact**：用於規劃、執行或檢測工作的持久化專案文件。
- **PBI**：Product Backlog Item。
- **SBI**：Sprint Backlog Item。
- **Increment**：符合 Definition of Done 的可用產出。
- **OGT**：進行中的任務：不同於 sprint-backlog.md 中的 Sprint Backlog Items（SBIs）。它們是在 AI agents 執行 SBI 時進一步拆分出的更小任務。很多這類任務由 agents 在 PLAN 模式下建立，並依賴 agents 自行管理；也可能由人臨時建立。

## **KEEP**: 保持不變的內容

### Scrum 理論
- 經驗主義仍然是基礎。
- 透明、檢測和調整仍然適用。
- 精益思維仍然適用。

### Scrum 價值觀
- 承諾
- 專注
- 開放
- 尊重
- 勇氣

### 核心職責
- **Product Owner** 仍然對產品價值負責。
- **Developers** 仍然對建立可用產出負責。
- **Scrum Master** 仍然對 Scrum 的有效性負責。

### 核心工件
- **Product Backlog** 仍然是候選工作的來源。
- **Sprint Backlog** 仍然是當前 Sprint 工作的來源。
- **Increment** 仍然是已交付價值的單位。

## **ADD**: 新增的內容

### Harness 各層
- **Rules**：約束執行。
- **Skills**：提供可複用能力。
- **Agents**：執行工作。
- **Workflows**：協調動作與交接。
- **Knowledge**：用上下文為執行提供依據。

### Rules
- **dod.mdc**：Definition of Done。
- **incremental-delivery.mdc**：增量交付策略。
- **realtime-status.mdc**：實時狀態更新策略。

### Skills
- **sdd-atdd**
- **sdd-tdd**
- **sdd-update-project**
- **sdd-refine-pb**
- **sdd-plan-sprint**
- **sdd-tracking**
- **sdd-retrospective**
- **sdd-close-sprint**
- **sdd-audit-artifacts**
- **sdd-update-specs**
- **sdd-design**
- **sdd-implement**

### SDD 核心工件
這是 SDD 的核心工件。它們不是 KEEP 下的 Scrum 核心工件（Product Backlog、Sprint Backlog、Increment）。
- **scrum-in-sdd.md**：名稱與含義。留在用戶端根目錄。
- **sdd-scrum-practices.md**：做什麼、怎麼做、何時做。留在用戶端根目錄。
- **artifacts-map.json**：本專案工件所在位置。位於工作區根目錄。

### 框架工件
- **product-backlog.md**：Product Backlog。
- **sprint-backlog.md**：Sprint Backlog。
- **status.md**：實時狀態。
- **changes-log.md**：變更歷史。

### 工程工件
- **architecture.md**：架構 spec。
- **{stem}-stories.md**：使用者故事和驗收標準。
- **{stem}-design.md**：設計 spec。
- **{stem}-tests.md**：測試 spec。
- **deployment.md**：部署 spec。
- **.secrets**：機密名稱及其值的存放位置。不含機密值。
- **issues-log.md**：缺陷記錄。它也是稽核開啟的五個過程檔案之一。

### 套件檔案
這些不是專案工件。它們不屬於上面任何一組。
- **constants.json**：用戶端根目錄上的套件查找表，存放路徑名、技能鍵和規則鍵。
- **.sdd-installed.json**：用戶端根目錄上的安裝帳本。由安裝程式寫入。`pack_complete: true` 表示套件複製已完成。

### Knowledge
- **ADR**：Architecture Decision Record。
- **knowledge/**：執行過程中沉澱的專案知識。

## **MODIFY**：發生變化的內容

### Scrum Team
- 團隊可以更小。
- Scrum 角色可以包括人和 AI agents。
- Scrum Master 還需貫徹 Harness Engineering 原則。
- 人類成員負責訓練、監督和治理 AI agents。

#### Developers
- Developers 可以是人、AI，或兩者共同組成。
- 他們可以圍繞 Sprint Goal 實時調整計劃。
- 人類成員仍然承擔職業責任。

#### Product Owner
- Product Owner 仍然是一個人，而不是委員會。
- 工作可以委託給 AI agents，但責任不能委託。

#### Scrum Master
- 一些經典的 Scrum Master 職責可以由 AI agents 執行。
- 該角色擴充套件為還要負責規則設計、技能設計、harness 質量和知識管理。

### Scrum 事件

#### Sprint
- Sprint 可能會短很多。
- 在非常短的執行週期裡，固定節奏的重要性可能降低。
- Sprint 仍然界定規劃、檢測和交付的邊界。

#### Sprint Planning
- Sprint Planning 可能只需幾分鐘，而不是幾小時。
- AI agents 可以先準備 backlog 更新，再交由人審閱。

#### Daily Scrum
- 實時檢測可以補充每日事件。
- 規則可以觸發狀態更新和小型回顧。

#### Sprint Review
- Sprint Review 仍然是檢測結果並決定下一步的事件。
- AI 生成的輸出可以在事件前或事件中接受審查。

#### Sprint Retrospective
- Retrospective 可以在 Sprint 結束時、按需、按規則，或在 Sprint 關閉前發生。
- Retrospective 同時是一項事件，也是一種 skill。

### Scrum 工件

#### Product Backlog
- Product Backlog 可以維護為一個 Markdown 工件。
- 當工作被切得很細時，估算規模可以變成可選項。

#### Sprint Backlog
- Sprint Backlog 可以維護為一個 Markdown 工件。
- 它可以由人和 AI agents 持續更新。

#### Increment
- Increment 仍然是符合 Definition of Done 的可用產出。
- 在短週期內，可以產出多個小 Increment。

#### 承諾：Definition of Done
- Definition of Done 作為一條 rule 來實現。
- 它既可以適用於任務，也可以適用於 Increment。

## Scrum in SDD 的最小配置

- 一名 **Product Owner**
- 一名兼職 **Scrum Master**
- 一名或多名人類 **Developers**
- 一份共享的 **spec**
- 一套 **sdd framework**，包括 **rules**、**skills** 以及其他所需邊界
- 一個提供 AI agents 執行工作的 **AI agent tool**
- 已定義的人類審批邊界
- 已定義的 agent 執行邊界

## 執行原則

- 先有 spec，再做實現。
- 先有規則，再給自主性。
- 責任由人承擔。
- AI agents 在約束內執行。
- 工件始終是共享的 source of truth。
- 檢測持續發生。
- 回顧推動改進。
- 規則要寫得讓人和 AI agents 都能遵循。
