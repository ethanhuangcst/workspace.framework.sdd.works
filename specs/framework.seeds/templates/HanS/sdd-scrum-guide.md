---
title: 2020 版《Scrum 指南》（审阅稿）
type: framework-guide
status: review
as_of: 2026-09-22
source_pdf: 2020-Scrum-Guide-US.pdf
source_note: >
  本文件为 2020 年 11 月版《Scrum 指南》的完整转换稿，仅供本地审阅。
  官方文本 © 2020 Ken Schwaber 和 Jeff Sutherland，采用
  Creative Commons Attribution Share-Alike 4.0 许可协议
  （https://creativecommons.org/licenses/by-sa/4.0/）。
  HTML 移植版： https://scrumguides.org/scrum-guide.html（PDF 的直接移植版）。
  处于审阅阶段时，本文件不包含此前的 sdd-scrum 草稿内容。
related:
  - sdd-scrum-practices.md
  - product-backlog.md
  - artifacts-map.md
---

# **第一部分** 2020 版《Scrum 指南》摘要

**作者：** Ken Schwaber 和 Jeff Sutherland

**副标题：** Scrum 权威指南：游戏规则

**日期：** 2020 年 11 月

© 2020 Ken Schwaber 和 Jeff Sutherland


> 这个 HTML/Markdown 版本直接移植自 2020 年 11 月的 PDF（`2020-Scrum-Guide-US.pdf`），仅供审阅使用。

## 《Scrum 指南》的目的

《Scrum 指南》定义了 Scrum，其中每个要素都有其目的。只实施其中一部分，可能会让 Scrum 失效。

Scrum 适用于软件之外的复杂工作。“Developers”指的是从事这类工作的所有人，因此，任何能从 Scrum 中获得价值的人都包括在内。

人们可以在 Scrum 中使用各种模式、流程和实践经验，但本指南不涉及这些内容，因为它们不属于 Scrum 的定义范围。

## Scrum 的定义

Scrum 是一种轻量级框架，帮助个人、团队和组织通过适应性解决方案，为复杂问题创造价值。

简而言之，Scrum 要求 Scrum Master 营造这样一种环境：

1. Product Owner 将复杂问题相关的工作整理并排序到 Product Backlog 中。
2. Scrum Team 在一个 Sprint 中把选定的工作转化为有价值的 Increment。
3. Scrum Team 和利益相关方检测结果，并为下一个 Sprint 做出调整。
4. 重复以上过程。

Scrum 是一个简单且有意保持不完整的框架，建立在使用者的集体智慧之上。它不是一种方法论，而是允许使用者在不违背其原则的前提下加入最佳实践。

## Scrum 理论

Scrum 建立在经验主义和精益思维之上。它重视经验、观察、专注和减少浪费。

Scrum 采用迭代、增量式的方法来提高可预测性并降低风险。团队需要具备或发展完成工作所需的技能。

Scrum 通过 Sprint 这一承载性事件，结合四个正式事件来实现检测与调整。这些事件之所以有效，是因为它们落实了 Scrum 经验主义的三大支柱：透明、检测和调整。

### 透明

工作和过程必须对所有人可见。在 Scrum 中，关键决策依赖于对三项正式工件当前状态的认知。透明度不足会导致决策变差、价值降低、风险升高。

透明使检测成为可能。没有透明，检测就会产生误导并造成浪费。

### 检测

必须定期检测 Scrum 工件以及朝目标推进的进展，以避免浪费。Scrum 通过五个事件提供这种节奏。

### 调整

如果产出不可接受，团队必须迅速调整，以减少浪费。

调整需要团队具备授权和自我管理能力。Scrum Team 应在学到新信息后尽快做出调整。

## Scrum 价值观

承诺、专注、开放、尊重和勇气

这些价值观指导 Scrum Team 的工作、行为和决策。当这些价值观真正被践行时，就会建立信任，并让透明、检测和调整真正发挥作用。

## Scrum Team

- Scrum Team 是 Scrum 的核心单元：由一名 Scrum Master、一名 Product Owner 和 Developers 组成。
- 团队没有子团队：它是跨职能的。
- 团队没有层级：它是自我管理的。
- 团队一次只聚焦一个目标：Product Goal。
- 团队人数通常少于 10 人，以保持敏捷。
- 对于大型产品，多个 Scrum Team 可以共享同一个 Product Goal、Product Backlog 和 Product Owner。
- 团队对完整的产品价值流负责。
- 团队对每个 Sprint 产出有价值、可用的 Increment 负责。

### Developers

Scrum Team 中每个 Sprint 负责创建可用 Increment 的人。

他们负责：
- 创建 Sprint Backlog
- 遵守 Definition of Done
- 围绕 Sprint Goal 每天调整计划
- 以专业方式彼此负责

### Product Owner

负责最大化产品价值。

职责包括：
- 定义 Product Goal
- 澄清 Product Backlog 条目
- 排序 Product Backlog
- 确保 Product Backlog 透明且易于理解

即使将工作委托出去，责任仍由其承担。它是一个人，而不是一个委员会。

### Scrum Master

负责建立 Scrum，并提升团队效能。
是 Scrum Team、Product Owner 以及组织的服务型领导者。
职责包括：
- 指导 Scrum Team
- 清除障碍
- 确保 Scrum 各项事件有效开展
- 支持 Product Goal 的定义和 Product Backlog 的管理
- 推动 Scrum 在组织中的采用

## Scrum 事件

Sprint 包含所有 Scrum 事件。它们实现检测、调整和工作的节奏性。

理想情况下，所有事件都应在同一时间、同一地点进行。

### Sprint

Sprint 是固定时长的周期，最长不超过一个月，用于把想法转化为价值。

每个 Sprint 都包含实现 Product Goal 所需的全部工作。

在 Sprint 期间：
- 不得危及 Sprint Goal
- 质量不得下降
- 随着认知加深，可以澄清范围

更短的 Sprint 有助于提升学习速度并降低风险。

只有 Product Owner 可以取消一个 Sprint。

### Sprint Planning

Sprint Planning 是 Sprint 的起点，用于创建 Sprint Backlog。

它定义 Sprint Goal（为什么），选择 Product Backlog 条目（做什么），并规划如何交付。

对于一个为期一个月的 Sprint，时间盒最长为八小时。

### Daily Scrum

Daily Scrum 帮助 Developers 检测朝 Sprint Goal 推进的进展，并调整计划。
它是 Sprint 中每个工作日举行的一次 15 分钟事件。
Developers 可以采用任何形式，只要它聚焦于进展，并产出可执行的计划。

### Sprint Review

Sprint Review 用于检测 Sprint 的产出，并识别后续需要做出的调整。

Scrum Team 与利益相关方一起回顾已完成的工作、发生的变化，以及下一步要做什么。

对于一个为期一个月的 Sprint，时间盒最长为四小时。

### Sprint Retrospective

Sprint Retrospective 用于规划提升质量和效能的方法。

Scrum Team 回顾刚结束的 Sprint，并找出改进点。

对于一个为期一个月的 Sprint，时间盒最长为三小时。

## Scrum 工件

Scrum 工件代表工作或价值。它们提供透明性，并为调整提供共同基础。

每个工件都对应一个承诺：
- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

### Product Backlog

Product Backlog 是一份经过排序、持续演化的清单，列出改进产品所需的内容。它是 Scrum Team 唯一的工作来源。

经过充分细化、能够在一个 Sprint 内完成的 Backlog 条目，就可以进入 Sprint Planning。细化是把条目拆分成更小、更清晰、更准确的工作。

Developers 负责估算规模。Product Owner 可以帮助他们理解其中的权衡。

#### 承诺：Product Goal

Product Goal 描述产品未来要达到的状态，为 Scrum Team 提供规划方向。

它是长期目标。团队必须先完成它或放弃它，才能开始下一个目标。

### Sprint Backlog

Sprint Backlog 包含 Sprint Goal、选定的 Product Backlog 条目，以及交付 Increment 的计划。

它由 Developers 创建，也服务于 Developers。随着认知加深，它会在整个 Sprint 期间持续更新。

#### 承诺：Sprint Goal

Sprint Goal 是这个 Sprint 的唯一目标。

它提供专注，同时保留灵活性。

### Increment

Increment 是朝 Product Goal 前进的一步可用成果，并且符合 Definition of Done。

一个 Sprint 中可以创建并交付多个 Increment。

#### 承诺：Definition of Done

Definition of Done 定义了 Increment 所需达到的质量标准。

只有符合该标准的工作，才算 Increment。

它让团队对“完成”的工作形成共同理解。

## 结语

Scrum 是免费的，并由本指南定义。它是不可变的：只使用 Scrum 的一部分，就不算 Scrum。Scrum 可以作为其他技术、方法和实践的容器发挥作用。

### 致谢

很多人对 Scrum 作出了贡献。最早的一批贡献者包括 Jeff Sutherland、Jeff McKenna、John Scumniotales、Ken Schwaber、Mike Smith 和 Chris Martin。

### 《Scrum 指南》历史

Ken Schwaber 和 Jeff Sutherland 于 1995 年首次公开介绍 Scrum。《Scrum 指南》记录了他们在 30 多年中不断发展和完善的 Scrum。

# **第二部分** Agentic Programming、Harness Engineering 与 Spec-Driven Development（SDD）

在 **Agentic Programming** 和 **Spec-Driven Development** 的基础上，并遵循 **Harness Engineering** 原则，软件交付方式被从根本上重塑。

**与 Agentic Programming、SDD 和 Harness Engineering 的关系：** **Agentic Programming** 是在软件工作中使用 AI agents 的更大范式；**Harness Engineering** 是让它真正落地运行的基础设施；**SDD** 则是这一范式中的方法论路径，在这种路径中，agents 以 specification 作为 **source of truth** 开展工作。

## Agentic Programming

**Agentic Programming** 是一种软件开发方式。在这种方式中，**AI agents** 不再只是被动的代码助手，而是工程流程中的**主动协作者**：它们会参与 **规划、编码、测试、调试、审查**，有时还会参与软件运行；其自主性受到**由人定义的目标、约束和监督**所限定。

## Harness Engineering

**Harness Engineering** 是一门设计**运行时框架**的实践学科，用来让 AI agents 能够在真实环境中**可靠、安全、高效**地运行。它包括**工具集成、执行编排、上下文与记忆管理、权限与护栏、可观测性以及人工监督**。

- **工具集成**：将 agents 连接到文件、API 和系统
- **执行编排**：管理规划、行动、检测和重试
- **上下文与记忆**：控制 agent 知道什么、保留什么
- **权限与护栏**：约束行为并降低风险
- **可观测性与监督**：支持监控、评估和人工介入

## Spec-Driven Development（SDD）

**Spec-Driven Development（SDD）** 是 agentic programming 中的一种方法。在这种方法里，**specification** 是**首要工件**：先定义需求、行为、接口、约束和验收标准，再据此实现。

- **从 spec 开始**：定义目标、工作流、工具、输入/输出、护栏和成功标准。
- **把意图变成结构**：定义角色、规则、权限、记忆和失败处理。
- **按 spec 实现**：生成代码、提示词、工具封装、测试和编排。
- **从 spec 推导测试**：定义验收标准、评估用例和边界情况。
- **优先在 spec 层迭代**：先更新 spec，再修补实现。
- **澄清多 agent 协作**：让 planner、coder、reviewer 和 tester 共享同一个 source of truth。
- **减少漂移和歧义**：把约束明确写出来。
- **提升自动化**：更容易生成代码、测试、文档和校验。

## Harness Engineering 原则下的 SDD

### 用 SDD 落实 Harness Engineering 原则

在 **Spec-Driven Development（SDD）** 中，**specification** 定义行为、约束和验收标准。它既是实现的 **source of truth**，也是评估的 **source of truth**；在 **Harness Engineering** 原则下，它通过多个相互关联的层被操作化：

- **Rules**：约束执行。  
- **Skills**：提供可复用能力。  
- **Agents**：依据 spec 执行任务。  
- **Workflows**：协调动作与交接。  
- **Knowledge**：用相关上下文为执行提供依据。  

这些层共同把 **specifications** 转化为**可靠执行**。

### 将极限编程实践与 SDD 集成

在 **SDD** 中，可以把 **eXtreme Programming（XP）** 的实践嵌入 **harness**，让人和 AI agents 遵循一致的工程标准，包括：

- **ATDD**：在实现之前，根据 spec 定义验收测试。
- **TDD**：先写测试，再实现并使其通过。
- **Pair Programming**：开发过程中进行人机或 agent-agent 协作。
- **CI/CD**：持续验证、集成并交付变更。
- **Test Automation**：自动运行单元测试、集成测试和端到端测试。
- **Refactoring**：在不改变已定义行为的前提下改进代码结构。

### 在这种方法中，人如何与 AI agents 协作

**Humans** 负责定义并治理 **harness**；**AI agents** 在其中运行。人不仅定义**要做什么**，也定义 agents **可以如何工作**。

- **Humans 定义 harness**：规则、技能、工作流、agent 角色和知识边界。
- **Humans 定义 spec**：目标、约束、业务规则和验收标准。
- **AI 协助形式化与执行**：在 harness 中细化 spec、实现、测试和迭代。
- **Humans 负责验证与监督**：审查输出、消除歧义、批准敏感操作，并更新 source of truth。
- **AI 提供反馈**：将结果与 spec 对照，并暴露差距或失败点。

# **第三部分** 用 SDD 实施 Agentic Programming 时，经典 Scrum 的缺口

当在 **Harness Engineering** 原则下实施 **SDD** 时，会出现一些缺口，从而改变 **Scrum definition**。

## 需要加入 Scrum 实施中的 SDD 概念

### Rules
- **dod.mdc**：Definition of Done
- **incremental-delivery.mdc**：增量交付
- **realtime-status.mdc**：实时跟踪状态，并在每项任务完成时更新 **status.md**

### Skills
- **sdd-atdd**
- **sdd-tdd**
- **sdd-new-project**
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
- **scrum-master**，在本服务中为：**ethan**

### Workflows
由于现阶段对 **workflows** 尚无实际需求，这个文件夹暂时只作为**占位**。

### Knowledge
- **ADR**：Architecture Decision Record，默认路径：**{workspace-folder}/specs/ADR**
- **knowledge**：项目中沉淀的知识，默认路径：**{workspace-folder}/specs/knowledge**

### Artifacts
- **Product Backlog**：**product-backlog.md**
- **Sprint Backlog**：**sprint-backlog.md**
- **实时状态**：**status.md**
- **变更管理**：**change-log.md**
- **工件路径定义与项目映射**：**artifacts-map.md**
- **Spec 模板**：**architecture.md; design.md; test.md; deployment.md**

## 在 sdd-scrum 中需要修改的 Scrum 概念

### Scrum Team
- **团队**可以小得多：通常是一名 **Product Owner** 加上几名 **full-stack engineers**，其中一人还兼任 **Scrum Master**。
- **Scrum 角色**可以同时包括 **人和 AI agents**。
- 传统的 **Scrum Master** 很大一部分职责部分委托给 **AI agents**。
- **新增的 Scrum Master 职责**：在 **Rules、Skills、Workflows、Agents 和 Knowledge** 各层中贯彻 **Harness Engineering 原则**。

#### Developers
- 在每个 Sprint 中创建**可用 Increment**的 **人和 AI agents**。
- 围绕 **Sprint Goal** 实时调整计划。
- 人类成员仍然承担**职业责任**。
- 人类成员负责**训练和管理 AI agents**。

#### Product Owner

- 即使工作委托给 **AI agents**，仍然**由其负责**。
- 仍然是**一个人**，可由 AI agents 协助，**不是委员会**。

#### Scrum Master
- **传统 Scrum Master 部分职责**可以分散到各项 **Scrum accountabilities** 中。
- **AI agents** 可以支持**辅导、清除障碍、Scrum 事件、Product Goal 定义、Product Backlog 管理以及 Scrum 推广**。
- 增加了新的职责，包括：**贯彻 Harness Engineering 原则、管理知识，并持续改进 sdd-scrum**。

### Scrum 事件

#### Sprint
- **Sprint** 可能不再是**固定时长**。
- 它可能只持续**几个小时**，使固定节奏的意义变小。

### Sprint Planning
- **Sprint Planning** 可能只需**几分钟**：AI agents 更新 **Sprint Backlog**，再由人审核并确认。

#### Daily Scrum
- 经典的人和人之间的 Daily Scrum 依然有需要。
- 但是可以在**实时**过程中持续进行人和 Agent 之间的**检测和调整**。
- 通过 **realtime-status rule**，每项任务一完成，就会触发一次**小型 retrospective**，并更新 **status.md**。

#### Sprint Review

#### Sprint Retrospective
- **Retrospective** 有**三种形式**，由 **retrospective** 技能确保后两种形式的过程资产形成 **ADR** 或 **Knowledge**.
1. **Sprint 结束时**：经典的人与人回顾。
2. **按需发起**：由人发起的人和 agents 的回顾。
3. **按规则触发**：在工作被标记为完成前，由 agent-agent 触发的回顾。


- **Retrospective** 有**四种触发条件**：
1. **Sprint 结束时**。
2. **按需发起**。
3. 在将**任务或 SBI** 标记为完成之前。
4. 在关闭 **Sprint** 之前。

- **Retrospective** 是一个 **skill**。

### Scrum 工件

#### Product Backlog
- **Product Backlog** 是一个 **Markdown 文件**：**product-backlog.md**。
- 不再需要**估算规模**，因为 **PBI 和 SBI** 可以被切分成能在**数小时内**完成的工作。

#### Sprint Backlog
- **Sprint Backlog** 是一个 **Markdown 文件**：**sprint-backlog.md**。
- 它由 **Developers** 创建，也服务于 **Developers**，其中既包括**人**也包括**agents**。

#### 承诺：Definition of Done
- **Definition of Done** 是一条 **rule**：**dod.mdc**。
- 它不仅适用于 **Increments**，也适用于**所有任务**。



**第四部分** sdd-scrum 指南
# **第四部分** sdd-scrum 指南

## 目的

本指南通过说明哪些内容保留、哪些新增、哪些变化，来定义 sdd-scrum。

## 适用对象

本指南同时面向人和 AI agents。

- **Humans** 负责治理、审批，并继续承担责任。
- **AI agents** 在既定约束内执行。
- 双方使用同一套规则、工件和术语。

## 如何阅读本指南

- **Keep**：仍然有效的经典 Scrum 概念。
- **Add**：在 Harness Engineering 原则下实施 SDD 所需的新概念。
- **Modify**：在 sdd-scrum 中发生变化的经典 Scrum 概念。

## 术语

- **sdd-scrum**：在 Harness Engineering 原则下，为 SDD 调整后的 Scrum。
- **Spec**：关于行为、约束和验收标准的 source of truth。
- **Harness**：治理 agent 执行的运行时系统。
- **Rule**：对执行的约束。
- **Skill**：可复用能力。
- **Agent**：执行工作的人工或 AI 行动者。
- **Workflow**：定义好的动作与交接序列。
- **Knowledge**：执行中使用并保留的项目上下文。
- **Artifact**：用于规划、执行或检测工作的持久化项目文档。
- **PBI**：Product Backlog Item。
- **SBI**：Sprint Backlog Item。
- **Increment**：符合 Definition of Done 的可用产出。
- **OGT**：进行中的任务：不同于 sprint-backlog.md 中的 Sprint Backlog Items（SBIs）。它们是在 AI agents 执行 SBI 时进一步拆分出的更小任务。很多这类任务由 agents 在 PLAN 模式下创建，并依赖 agents 自行管理；也可能由人临时创建。

## **KEEP**: 保持不变的内容

### Scrum 理论
- 经验主义仍然是基础。
- 透明、检测和调整仍然适用。
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
- **Scrum Master** 仍然对 Scrum 的有效性负责。

### 核心工件
- **Product Backlog** 仍然是候选工作的来源。
- **Sprint Backlog** 仍然是当前 Sprint 工作的来源。
- **Increment** 仍然是已交付价值的单位。

## **ADD**: 新增的内容

### Harness 各层
- **Rules**：约束执行。
- **Skills**：提供可复用能力。
- **Agents**：执行工作。
- **Workflows**：协调动作与交接。
- **Knowledge**：用上下文为执行提供依据。

### Rules
- **dod.mdc**：Definition of Done。
- **incremental-delivery.mdc**：增量交付策略。
- **realtime-status.mdc**：实时状态更新策略。

### Skills
- **sdd-atdd**
- **sdd-tdd**
- **sdd-new-project**
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

### 框架工件
- **status.md**：实时状态。
- **change-log.md**：变更历史。
- **artifacts-map.md**：工件映射。
- **product-backlog.md**: Product Backlog
- **sprint-backlog.md**: Sprint Backlog

### 工程工件
- **architecture.md**：架构 spec。
- **{model_name}-stories**：用户故事和验收标准
- **{model_name}-design.md**：设计 spec。
- **{model_name}-test.md**：测试 spec。
- **deployment.md**：部署 spec。
- **.secrets**：用于存放机密信息的文件。

### Knowledge
- **ADR**：Architecture Decision Record。
- **knowledge/**：执行过程中沉淀的项目知识。

## **MODIFY**：发生变化的内容

### Scrum Team
- 团队可以更小。
- Scrum 角色可以包括人和 AI agents。
- Scrum Master 还需贯彻 Harness Engineering 原则。
- 人类成员负责训练、监督和治理 AI agents。

#### Developers
- Developers 可以是人、AI，或两者共同组成。
- 他们可以围绕 Sprint Goal 实时调整计划。
- 人类成员仍然承担职业责任。

#### Product Owner
- Product Owner 仍然是一个人，而不是委员会。
- 工作可以委托给 AI agents，但责任不能委托。

#### Scrum Master
- 一些经典的 Scrum Master 职责可以由 AI agents 执行。
- 该角色扩展为还要负责规则设计、技能设计、harness 质量和知识管理。

### Scrum 事件

#### Sprint
- Sprint 可能会短很多。
- 在非常短的执行周期里，固定节奏的重要性可能降低。
- Sprint 仍然界定规划、检测和交付的边界。

#### Sprint Planning
- Sprint Planning 可能只需几分钟，而不是几小时。
- AI agents 可以先准备 backlog 更新，再交由人审阅。

#### Daily Scrum
- 实时检测可以补充每日事件。
- 规则可以触发状态更新和小型回顾。

#### Sprint Review
- Sprint Review 仍然是检测结果并决定下一步的事件。
- AI 生成的输出可以在事件前或事件中接受审查。

#### Sprint Retrospective
- Retrospective 可以在 Sprint 结束时、按需、按规则，或在 Sprint 关闭前发生。
- Retrospective 同时是一项事件，也是一种 skill。

### Scrum 工件

#### Product Backlog
- Product Backlog 可以维护为一个 Markdown 工件。
- 当工作被切得很细时，估算规模可以变成可选项。

#### Sprint Backlog
- Sprint Backlog 可以维护为一个 Markdown 工件。
- 它可以由人和 AI agents 持续更新。

#### Increment
- Increment 仍然是符合 Definition of Done 的可用产出。
- 在短周期内，可以产出多个小 Increment。

#### 承诺：Definition of Done
- Definition of Done 作为一条 rule 来实现。
- 它既可以适用于任务，也可以适用于 Increment。

## sdd-scrum 的最小配置

- 一名 **Product Owner**
- 一名兼职 **Scrum Master**
- 一名或多名人类 **Developers**
- 一份共享的 **spec**
- 一套 **sdd framework**，包括 **rules**、**skills** 以及其他所需边界
- 一个提供 AI agents 执行工作的 **AI agent tool**
- 已定义的人类审批边界
- 已定义的 agent 执行边界

## 运行原则

- 先有 spec，再做实现。
- 先有规则，再给自主性。
- 责任由人承担。
- AI agents 在约束内执行。
- 工件始终是共享的 source of truth。
- 检测持续发生。
- 回顾推动改进。
- 规则要写得让人和 AI agents 都能遵循。
