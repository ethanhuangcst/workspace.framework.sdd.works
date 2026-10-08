# Scrum in SDD

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-08
> **Author:** © 2026 Ethan Huang

---

本文说明在规格驱动开发（Spec-Driven Development）中如何采用 Scrum，并在 Harness Engineering 原则下开展 Agentic Programming。

《Scrum 指南》定义 Scrum。本文不取代它。

- **第一部分** 说明 Agentic Programming、Harness Engineering 和规格驱动开发。
- **第二部分** 说明经典 Scrum 在这一设定下没有覆盖的内容。
- **第三部分** 是定义：哪些保持不变，哪些新增，哪些改变。
- **附录**：2020 版《Scrum 指南》的简要摘要。该摘要是经典 Scrum 的基线。

## Index

- [第一部分 Agentic Programming、Harness Engineering，以及与敏捷实践对齐的规格驱动开发（SDD）](#第一部分-agentic-programmingharness-engineering以及与敏捷实践对齐的规格驱动开发sdd)
  - [Agentic Programming](#agentic-programming)
  - [Harness Engineering](#harness-engineering)
  - [Spec-Driven Development（SDD）](#spec-driven-developmentsdd)
  - [用 SDD 落实 Harness Engineering 原则](#用-sdd-落实-harness-engineering-原则)
  - [将极限编程实践与 SDD 结合](#将极限编程实践与-sdd-结合)
  - [将 Scrum 与 SDD 结合](#将-scrum-与-sdd-结合)
  - [将其他敏捷实践与 SDD 结合](#将其他敏捷实践与-sdd-结合)
- [第二部分 SDD 下的 Scrum 缺口](#第二部分-sdd-下的-scrum-缺口)
  - [需要加入 Scrum 实施的 SDD 概念](#需要加入-scrum-实施的-sdd-概念)
  - [Scrum in SDD 中需要调整的 Scrum 概念](#scrum-in-sdd-中需要调整的-scrum-概念)
- [第三部分 Scrum in SDD 指南](#第三部分-scrum-in-sdd-指南)
  - [概述](#概述)
  - [KEEP - 保持不变的内容](#keep---保持不变的内容)
  - [ADD - 新增的内容](#add---新增的内容)
  - [MODIFY：发生变化的内容](#modify发生变化的内容)
  - [Scrum in SDD 的最小配置](#scrum-in-sdd-的最小配置)
  - [运行原则](#运行原则)
- [附录：2020 版《Scrum 指南》简要摘要](#附录2020-版scrum-指南简要摘要)
  - [《Scrum 指南》的目的](#scrum-指南的目的)
  - [Scrum 的定义](#scrum-的定义)
  - [Scrum 理论](#scrum-理论-1)
  - [Scrum 价值观](#scrum-价值观-1)
  - [Scrum Team](#scrum-team)
  - [Scrum 事件](#scrum-事件-2)
  - [Scrum 工件](#scrum-工件-2)
  - [结语](#结语)

# **第一部分** Agentic Programming、Harness Engineering，以及与敏捷实践对齐的规格驱动开发（SDD）

在 **Agentic Programming** 和 **Spec-Driven Development** 之下，并遵循 **Harness Engineering** 原则，软件交付方式被从根本上重塑。

**与 Agentic Programming、SDD 和 Harness Engineering 的关系：** **Agentic Programming** 是在软件工作中使用 AI agents 的更大范式。**Harness Engineering** 是让它真正落地运行的基础设施。**SDD** 是这一范式中的方法：agents 以规格（specification）作为 **source of truth** 开展工作。

**它们与 Scrum、极限编程（Extreme Programming，XP）、行为驱动开发（Behavior-Driven Development，BDD）和验收测试驱动开发（Acceptance Test-Driven Development，ATDD）等敏捷实践自然对齐。**

## Agentic Programming

**Agentic Programming** 是一种软件开发方式。在这种方式中，**AI agents** 不再只是被动的代码助手，而是工程流程中的**主动协作者**：它们参与**规划、编码、测试、调试、审查**，有时还参与软件运行。其自主性受**人定义的目标、约束和监督**所限定。

## Harness Engineering

**Harness Engineering** 是设计**运行时框架**的学科，让 AI agents 在真实环境中**可靠、安全、有效**地运行。它包括**工具集成、执行编排、上下文与记忆管理、权限与护栏、可观测性，以及人工监督**。

- **工具集成**：把 agents 连接到文件、API 和系统
- **执行编排**：管理规划、行动、检查和重试
- **上下文与记忆**：控制 agent 知道什么、保留什么
- **权限与护栏**：约束行为并降低风险
- **可观测性与监督**：支持监控、评估和人工介入

## Spec-Driven Development（SDD）

**Spec-Driven Development（SDD）** 是 agentic programming 中的一种方法。**规格（specification）** 是**首要工件**：先定义需求、行为、接口、约束和验收标准，再据此实现。

- **从规格开始**：定义目标、工作流、工具、输入与输出、护栏和成功标准。
- **把意图变成结构**：定义角色、规则、权限、记忆和失败处理。
- **按规格实现**：生成代码、提示词、工具封装、测试和编排。
- **从规格推导测试**：定义验收标准、评估用例和边界情况。
- **先在规格层迭代**：先更新规格，再改实现。
- **说清多 agent 协作**：让规划、编码、审查和测试对齐同一份 source of truth。
- **减少漂移和歧义**：把约束写清楚。
- **提高自动化**：更容易生成代码、测试、文档和校验。

## 用 SDD 落实 Harness Engineering 原则

在 **Spec-Driven Development（SDD）** 中，**规格**定义行为、约束和验收标准。它是实现和评估的 **source of truth**。在 **Harness Engineering** 原则下，它通过相互关联的层落地：

- **Rules**：约束执行。
- **Skills**：提供可复用能力。
- **Agents**：依据规格执行任务。
- **Workflows**：协调动作与交接。
- **Knowledge**：用相关上下文为执行提供依据。

这些层把**规格**变成**可靠执行**。

## 将极限编程实践与 SDD 结合

在 **SDD** 中，可以把 **eXtreme Programming（XP）** 实践放进 **harness**，让人和 AI agents 遵循同一套工程标准，包括：

- **ATDD**：实现之前，根据规格定义验收测试。
- **TDD**：先写测试，再实现到测试通过。
- **结对编程（Pair Programming）**：开发中的人与 agent，或 agent 与 agent 协作。
- **CI/CD**：持续验证、集成并交付变更。
- **测试自动化（Test Automation）**：自动运行单元、集成和端到端测试。
- **重构（Refactoring）**：在不改变已规定行为的前提下改进代码结构。

## 将 Scrum 与 SDD 结合

**Scrum** 规定交付节奏。**SDD** 把规格作为 source of truth。

- **Product Backlog**：需求和验收标准。
- **Sprint Backlog**：本 Sprint 要做成的事，以及由谁完成。
- **Increment**：满足规格和 Definition of Done 的结果。
- **事件**：Planning、Daily Scrum、Review 和 Retrospective 保留。人和 agents 都参加。
- **Definition of Done**：一条规则，在条目完成前执行。
- **增量交付**：完成一个 Sprint 条目后，再开始下一个。
- **规格先行**：行为变更从规格开始。Sprint 负责实现。

### 在这种方法中，人如何与 AI agents 协作

**人**定义并治理 **harness**；**AI agents** 在其中运行。人不仅规定**做什么**，也规定 agents **可以怎样工作**。

- **人定义 harness**：规则、技能、工作流、agent 角色和知识边界。
- **人定义规格**：目标、约束、业务规则和验收标准。
- **AI 协助写清并执行**：在 harness 内细化规格、实现、测试和迭代。
- **人验证并监督**：审查输出、消除歧义、批准敏感操作，并更新 source of truth。
- **AI 提供反馈**：把结果与规格对照，并指出差距或失败。

## 将其他敏捷实践与 SDD 结合

**SDD** 把**规格**当作共享的 source of truth。多种敏捷方法已经以示例、测试和小步验证为中心，因此可以放进同一套 harness，而不另起一套流程。

- **行为驱动开发（BDD）**：用场景（常用 Gherkin）表达从规格得出的行为。产品、工程和 agents 在改代码之前共用一套说法。
- **验收测试驱动开发（ATDD）**：先就规格上的验收测试达成一致，再实现到这些测试通过。与 **atdd-expert** 技能，以及上文 XP 中的 ATDD 一致。
- **精益思维**：保持批次小，减少交接浪费，并经常按规格检查结果。与本指南中的短 Sprint 和增量交付一致。
- **看板（Kanban）**：在 backlog 和 Sprint 板上看见工作，限制在制品，并且只在该项规格已足够可建造时拉取下一项。
- **持续交付**：规格、测试和 Definition of Done 都通过时再集成和部署。Harness 中的 CI/CD 自动做这项检查。

[返回顶部](#index)

# **第二部分** SDD 下的 Scrum 缺口

在 **Harness Engineering** 原则下实施 **SDD** 时，会出现改变 **Scrum 定义** 的缺口。

## 需要加入 Scrum 实施的 SDD 概念

Harness 各层和 SDD 工件被加入经典 Scrum。权威清单在**第三部分**的 **ADD - 新增的内容**。

- **Rules** 约束关闭、增量交付、WIP 状态，以及可读的 Markdown。
- **Skills** 覆盖 backlog、Sprint、规格、审计和构建类工作。
- **Agents**：scrum-master（本服务中为 **ethan**）。
- **Workflows**：在某项工作需要明确交接顺序之前，保持占位。
- **Knowledge**：ADR 和知识目录的路径来自 `artifacts-map.json`。
- **Artifacts**：核心、框架、工程工件，以及 pack 文件（细节在第三部分）。

[返回顶部](#index)

## Scrum in SDD 中需要调整的 Scrum 概念

### Scrum 团队与 Scrum 职责

- **团队**可以小得多：常常是一名 **Product Owner** 和几名**全栈工程师**，其中一人兼任 **Scrum Master**。
- **Scrum 角色**可以同时包括**人和 AI agents**。
- 传统 **Scrum Master** 的职责可以在很大程度上交给 **AI agents**。
- **新增的 Scrum Master 职责**：在 **Rules、Skills、Workflows、Agents 和 Knowledge** 上贯彻 **Harness Engineering** 原则。

#### Developers

- 每个 Sprint 创建**可用 Increment** 的**人和 AI agents**。
- 围绕 **Sprint Goal** 实时调整计划。
- 人类成员仍然承担**职业责任**。
- 人类成员**训练并管理 AI agents**。

#### Product Owner

- 即使工作委托给 **AI agents**，仍然**由其负责**。
- **一个人**，可由 AI agents 协助，**不是委员会**。

#### Scrum Master

- **传统 Scrum Master 职责**可以分散到各项 **Scrum 职责**中。
- **AI agents** 可以支持**辅导、清除障碍、Scrum 事件、定义 Product Goal、管理 Product Backlog，以及推广 Scrum**。
- 新增职责包括：**贯彻 Harness Engineering 原则、管理知识，并持续改进 Scrum in SDD**。

### Scrum 事件

#### Sprint

- **Sprint** 可以不再是**固定时长**。
- 它可能只持续**几个小时**，固定节奏的意义随之变小。

#### Sprint Planning

- **Sprint Planning** 可以只花**几分钟**：AI agents 更新 **Sprint Backlog**，人审查并确认。

#### Daily Scrum

- 经典的 **Daily Scrum** 可能仍然需要。
- 人与 agents 之间更频繁的**检查和调整**可以在**实时**中持续发生。
- 在 **sdd-dod.mdc** 下，关闭任务或 SBI 时走回顾门禁，并在这次关闭适用时更新 **status.md**。

#### Sprint Review

#### Sprint Retrospective

- **回顾（Retrospective）** 有三种形式。后两种由 **sdd-retrospective** 技能记成 ADR 或 Knowledge。
1. **Sprint 结束时**：经典的人与人回顾。
2. **按需**：由人发起的人与 agent 回顾。
3. **按规则**：在工作被标为完成之前，由 agent 与 agent 触发的回顾。记录写明触发该规则的事件，例如 `feature-01 done`。

- **回顾**有**四种触发**：
1. **Sprint 结束时**。
2. **按需**。
3. 在把**任务或 SBI** 标为完成之前。
4. 在关闭 **Sprint** 之前。

- **回顾**是一项 **skill**。

### Scrum 工件

#### Product Backlog

- **Product Backlog** 是一份 **Markdown 文件**：**product-backlog.md**。
- 不再必须**估算规模**，因为 **PBI 和 SBI** 可以切成**数小时内**做完的工作。

#### Sprint Backlog

- **Sprint Backlog** 是一份 **Markdown 文件**：**sprint-backlog.md**。
- 它由 **Developers** 创建，也服务于 **Developers**，其中既有**人**也有 **agents**。

#### 承诺：Definition of Done

- **Definition of Done** 是一条 **rule**：**sdd-dod.mdc**。
- 它不仅适用于 **Increment**，也适用于**所有任务**。

[返回顶部](#index)

# **第三部分** Scrum in SDD 指南

## 概述

本指南通过说明哪些保留、哪些新增、哪些变化，来定义 Scrum in SDD。

**适用对象**

本指南同时面向人和 AI agents。

- **人**治理、批准，并继续承担责任。
- **AI agents** 在既定约束内执行。
- 双方使用同一套规则、工件和术语。

**如何阅读本指南**

- **Keep**：仍然有效的经典 Scrum 概念。
- **Add**：在 Harness Engineering 原则下实施 SDD 所需的新概念。
- **Modify**：在 Scrum in SDD 中发生变化的经典 Scrum 概念。

**术语**

- **Scrum in SDD**：在 Harness Engineering 原则下，为 SDD 调整后的 Scrum。
- **规格（Spec）**：行为、约束和验收标准的 source of truth。
- **Harness**：治理 agent 执行的运行时系统。
- **Rule**：对执行的约束。
- **Skill**：可复用能力。
- **Agent**：执行工作的人或 AI。
- **Workflow**：规定好的动作与交接顺序。
- **Knowledge**：执行中保留并使用的项目上下文。
- **Artifact**：用于规划、执行或检查工作的持久项目文档。
- **PBI**、**SBI**、**Feature**、**Task**、**OGT**、**MVP**：实践中的术语（名称在客户端根目录的 `sdd-scrum-practices.md` 中）。
- **Increment**：符合 Definition of Done 的可用产出。

[返回顶部](#index)

## **KEEP** - 保持不变的内容

### Scrum 理论

- 经验主义仍然是基础。
- 透明、检查和调整仍然适用。
- 精益思维仍然适用。

### Scrum 价值观

- 承诺
- 专注
- 开放
- 尊重
- 勇气

### 核心职责

- **Product Owner** 仍然对产品价值负责。
- **Developers** 仍然对创建可用产出负责。
- **Scrum Master** 仍然对 Scrum 是否有效负责。

### 核心工件

- **Product Backlog** 仍然是候选工作的来源。
- **Sprint Backlog** 仍然是当前 Sprint 工作的来源。
- **Increment** 仍然是已交付价值的单位。

[返回顶部](#index)

## **ADD** - 新增的内容

### Harness 各层

- **Rules**：约束执行。
- **Skills**：提供可复用能力。
- **Agents**：执行工作。
- **Workflows**：协调动作与交接。
- **Knowledge**：用上下文为执行提供依据。

### Rules

- **sdd-dod.mdc**：Definition of Done；关闭时写入流程文件。
- **sdd-incremental-delivery.mdc**：增量交付策略。
- **sdd-realtime-status.mdc**：WIP 时的流程同步；工作未 Done 时先起草、确认、再写入。
- **friendly-language.mdc**：让使用者和后续 agent 能读的对话与 Markdown。

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

这些是 SDD 的核心工件。它们不是 KEEP 下的 Scrum 核心工件（Product Backlog、Sprint Backlog 和 Increment）。

- **pack-scrum-in-sdd.md**：名称与含义。留在客户端根目录。
- **sdd-scrum-practices.md**：做什么、怎么做、何时做。留在客户端根目录。
- **artifacts-map.json**：本项目工件放在哪里。位于工作区根目录。

### 框架工件

- **product-backlog.md**：Product Backlog。
- **sprint-backlog.md**：Sprint Backlog。
- **status.md**：项目快照；在 DoD 关闭时，以及 WIP 检查点（`sdd-realtime-status.mdc`）时更新。
- **changes-log.md**：变更历史。

### 工程工件

- **architecture.md**：架构规格。
- **{stem}-stories.md**：用户故事和验收标准。
- **{stem}-design.md**：设计规格。
- **{stem}-tests.md**：测试规格。
- **release.md**：本地启动与上线顺序。
- **test-strategy.md**：产品级测试策略。
- **.secrets**：dotenv 形式的登记（`NAME=` 留空）；用 `#` 注释说明值放在哪里。Git 中不放机密值。
- **issues-log.md**：缺陷记录。它也是审计会打开的五份流程文件之一。

### Pack 文件

这些不是项目工件。它们不属于上面任何一组。

- **constants.json**：客户端根目录上的 pack 查找表，存放路径名、技能键和规则键。
- **.sdd-installed.json**：客户端根目录上的安装账本。安装程序写入它。`pack_complete: true` 表示 pack 复制已完成。

### Knowledge

- **ADR**：架构决策记录（Architecture Decision Record）。
- **knowledge/**：执行过程中学到的项目知识。
- 当地图包含 `adr` 或 `knowledge` 时，这些键是对应目录树的根路径。

[返回顶部](#index)

## **MODIFY**：发生变化的内容

### Scrum 团队与 Scrum 职责

- 团队可以更小。
- Scrum 角色可以包括人和 AI agents。
- Scrum Master 还要贯彻 Harness Engineering 原则。
- 人类成员训练、监督并治理 AI agents。

#### Developers

- Developers 可以是人、AI，或两者。
- 他们可以围绕 Sprint Goal 实时调整计划。
- 人类成员仍然承担职业责任。

#### Product Owner

- Product Owner 仍然是一个人，不是委员会。
- 工作可以委托给 AI agents，责任不能委托。

#### Scrum Master

- 一部分经典 Scrum Master 职责可以由 AI agents 执行。
- 该角色还扩展到规则设计、技能设计、harness 质量和知识管理。

### Scrum 事件

#### Sprint

- Sprint 可以短很多。
- 在很短的执行周期里，固定节奏可以不那么重要。
- Sprint 仍然划定规划、检查和交付的边界。

#### Sprint Planning

- Sprint Planning 可以是几分钟，而不是几小时。
- AI agents 可以先准备 backlog 更新，再交人审查。

#### Daily Scrum

- 更频繁的实时检查可以补充每日 Scrum 事件。
- **sdd-realtime-status** 这类规则在 WIP 检查点触发状态更新。

#### Sprint Review

- Sprint Review 仍然是检查结果并决定下一步的事件。
- AI 生成的输出可以在事件之前或事件之中接受审查。

#### Sprint Retrospective

- 回顾可以发生在 Sprint 结束时、按需、按规则，或在关闭 Sprint 之前。
- 回顾既是事件，也是一项技能。

### Scrum 工件

#### Product Backlog

- Product Backlog 可以维护为一份 Markdown 工件。
- 当工作切得很小时，规模估算可以改为可选。

#### Sprint Backlog

- Sprint Backlog 可以维护为一份 Markdown 工件。
- 人和 AI agents 可以持续更新它。
- **未排入 Sprint 的 PBI（Unplanned PBIs）** 列出没有 Sprint 指派的产品待办项。该节位于 `sprint-backlog.md` 最后一张 Sprint 表之后。写法见 `sdd-scrum-practices.md`。

#### Increment

- Increment 仍然是符合 Definition of Done 的可用产出。
- 短周期内可以产出多个小 Increment。

#### 承诺：Definition of Done

- Definition of Done 实现为一条规则。
- 它可以同时适用于任务和 Increment。

[返回顶部](#index)

## Scrum in SDD 的最小配置

- 一名 **Product Owner**
- 一名兼职 **Scrum Master**
- 一名或多名人类 **Developers**
- 一份共享**规格**
- 一套 **sdd framework**，包括所需的 **rules**、**skills** 和其他边界
- 一个提供 AI agents 来执行工作的 **AI agent 工具**
- 已写明的人的批准边界
- 已写明的 agent 执行边界

## 运行原则

- 先有规格，再做实现。
- 先有规则，再给自主性。
- 责任留在人这里。
- AI agents 在约束内执行。
- 工件始终是共享的 source of truth。
- 检查持续发生。
- 回顾推动改进。
- 规则要写得让人和 AI agents 都能遵循。

[返回顶部](#index)

# 附录：2020 版《Scrum 指南》简要摘要

**作者：** Ken Schwaber 与 Jeff Sutherland

**副标题：** Scrum 权威指南：游戏规则

**日期：** 2020 年 11 月

© 2020 Ken Schwaber and Jeff Sutherland

> 这个 HTML/Markdown 版本直接移植自 2020 年 11 月的 PDF（`2020-Scrum-Guide-US.pdf`），仅供审阅。

## 《Scrum 指南》的目的

《Scrum 指南》定义 Scrum，其中每个要素都有其目的。只实施其中一部分，可能让 Scrum 失效。

Scrum 适用于软件之外的复杂工作。“Developers”指从事这类工作的所有人，因此任何能从 Scrum 获得价值的人都包括在内。

人们可以在 Scrum 中使用模式、流程和见解，但本指南不写这些内容，因为它们不在 Scrum 的定义里。

[返回顶部](#index)

## Scrum 的定义

Scrum 是一种轻量级框架，帮助个人、团队和组织通过适应性方案，为复杂问题创造价值。

简而言之，Scrum 要求 Scrum Master 促成这样一种环境：

1. Product Owner 把复杂问题的工作整理并排序进 Product Backlog。
2. Scrum Team 在一个 Sprint 中把选定的工作变成有价值的 Increment。
3. Scrum Team 和利益相关方检查结果，并为下一个 Sprint 做出调整。
4. 重复。

Scrum 是一个简单、并且有意保持不完整的框架，建立在使用者的集体智慧之上。它不是一套方法论。只要原则得到遵守，使用者可以加入自己的最佳实践。

[返回顶部](#index)

## Scrum 理论

Scrum 建立在经验主义和精益思维之上。它重视经验、观察、专注和减少浪费。

Scrum 用迭代、增量的方式提高可预测性并降低风险。团队带来或发展完成工作所需的技能。

Scrum 把四个正式的检查与调整事件放在一个承载事件里，这个事件就是 Sprint。这些事件有效，是因为它们落实了经验主义的三根支柱：透明、检查和调整。

### 透明

工作和过程必须对所有人可见。在 Scrum 中，关键决策依赖对三项正式工件当前状态的判断。透明不足会导致决策变差、价值降低、风险升高。

透明使检查成为可能。没有透明，检查会误导并造成浪费。

### 检查

必须经常检查 Scrum 工件以及朝目标推进的进展，以避免浪费。Scrum 通过五个事件提供这种节奏。

### 调整

如果产出不可接受，团队必须尽快调整，以减少浪费。

调整需要被授权的、自我管理的团队。Scrum Team 应在学到新情况后尽快调整。

[返回顶部](#index)

## Scrum 价值观

承诺、专注、开放、尊重和勇气

这些价值观指导 Scrum Team 的工作、行为和决策。当它们被践行时，会建立信任，并让透明、检查和调整真正发生。

[返回顶部](#index)

## Scrum Team

- Scrum Team 是 Scrum 的基本单元：一名 Scrum Master、一名 Product Owner，以及 Developers。
- 没有子团队：跨职能。
- 没有层级：自我管理。
- 一次聚焦一个目标：Product Goal。
- 通常少于 10 人，以保持敏捷。
- 对大型产品，多个 Scrum Team 可以共享同一个 Product Goal、Product Backlog 和 Product Owner。
- 团队拥有完整的产品价值流。
- 团队对每个 Sprint 产出有价值、可用的 Increment 负责。

### Developers

Scrum Team 中每个 Sprint 创建可用 Increment 的人。

他们负责：

- 创建 Sprint Backlog
- 遵守 Definition of Done
- 每天围绕 Sprint Goal 调整计划
- 以专业身份相互负责

### Product Owner

对最大化产品价值负责。

负责：

- 定义 Product Goal
- 说清 Product Backlog 条目
- 排序 Product Backlog
- 让 Product Backlog 保持透明、可被理解

即使工作被委托，责任仍在。一个人，不是委员会。

### Scrum Master

对建立 Scrum 并提高团队效能负责。
是 Scrum Team、Product Owner 和组织的服务型领导者。
负责：

- 辅导 Scrum Team
- 清除障碍
- 确保 Scrum 事件有效
- 支持定义 Product Goal 和管理 Product Backlog
- 推动组织采用 Scrum

[返回顶部](#index)

## Scrum 事件

Sprint 包含全部 Scrum 事件。它们带来检查、调整和规律。

理想情况下，所有事件在同一时间和同一地点举行。

### Sprint

Sprint 是固定长度的周期，最长一个月，把想法变成价值。

每个 Sprint 包含达成 Product Goal 所需的全部工作。

在 Sprint 期间：

- 不得危及 Sprint Goal
- 质量不得下降
- 随着了解增多，可以澄清范围

更短的 Sprint 提高学习速度并降低风险。

只有 Product Owner 可以取消一个 Sprint。

### Sprint Planning

Sprint Planning 开启 Sprint，并创建 Sprint Backlog。

它定义 Sprint Goal（为什么），选择 Product Backlog 条目（做什么），并计划如何交付。

一个月的 Sprint，时间盒最长八小时。

### Daily Scrum

Daily Scrum 帮助 Developers 检查朝 Sprint Goal 的进展并调整计划。
它是 Sprint 每个工作日举行的 15 分钟事件。
Developers 可以选择任何形式，只要聚焦进展并得出可执行的计划。

### Sprint Review

Sprint Review 检查 Sprint 的结果，并识别接下来要做的调整。

Scrum Team 和利益相关方回顾做了什么、变了什么，以及下一步做什么。

一个月的 Sprint，时间盒最长四小时。

### Sprint Retrospective

Sprint Retrospective 规划如何提高质量和效能。

Scrum Team 反思刚结束的 Sprint，并找出改进。

一个月的 Sprint，时间盒最长三小时。

[返回顶部](#index)

## Scrum 工件

Scrum 工件代表工作或价值。它们提供透明，并为调整提供共同基础。

每个工件带有一项承诺：

- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

### Product Backlog

Product Backlog 是一份有序、持续演化的清单，列出改进产品所需的内容。它是 Scrum Team 唯一的工作来源。

细化到能在一个 Sprint 内完成的条目，就可以进入 Sprint Planning。细化把条目拆成更小、更清楚、更精确的工作。

Developers 负责估算规模。Product Owner 可以帮助他们理解取舍。

#### 承诺：Product Goal

Product Goal 描述产品未来的状态，给 Scrum Team 一个规划所朝向的目标。

它是长期目标。团队必须先完成它或放弃它，才能接下一个。

### Sprint Backlog

Sprint Backlog 包括 Sprint Goal、选定的 Product Backlog 条目，以及交付 Increment 的计划。

它由 Developers 创建，也服务于 Developers。随着了解增多，它在整个 Sprint 中更新。

#### 承诺：Sprint Goal

Sprint Goal 是这个 Sprint 的唯一目标。

它提供焦点，同时保留弹性。

### Increment

Increment 是朝 Product Goal 前进的一步可用成果，并且符合 Definition of Done。

一个 Sprint 中可以创建并交付多个 Increment。

#### 承诺：Definition of Done

Definition of Done 定义 Increment 所需的质量。

只有达到它的工作才成为 Increment。

它让“完成”有共同的理解。

[返回顶部](#index)

## 结语

Scrum 免费，并由本指南定义。它不可拆用：只用其中一部分就不是 Scrum。Scrum 可以作为其他技术、方法论和实践的容器。

### 人们

很多人对 Scrum 作出了贡献。最早的一批包括 Jeff Sutherland、Jeff McKenna、John Scumniotales、Ken Schwaber、Mike Smith 和 Chris Martin。

### 《Scrum 指南》历史

Ken Schwaber 和 Jeff Sutherland 于 1995 年首次公开介绍 Scrum。《Scrum 指南》记录了他们在三十多年中发展和打磨的 Scrum。

[返回顶部](#index)
