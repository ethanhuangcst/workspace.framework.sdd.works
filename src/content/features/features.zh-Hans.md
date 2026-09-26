v.0.1.0

## sdd-scrum 框架做什么

- 提供 SDD-Scrum 的指南与实践手册：在 Harness Engineering 下，把规格驱动开发(SDD)与 Scrum 用于智能体编程。
- 在 Agent Tools 中安装框架产物，为 AI 智能体划定边界，包括规则(rules)、技能(skills)及相关资产(artifacts)。
- 接入 AI 教练智能体：ethan。

## 功能

### 智能体

- ethan — SDD-Scrum 框架的 AI 智能体。

### 技能

- sdd-atdd — 验收测试驱动开发：用用户故事和验收标准建立用户故事地图。
- sdd-tdd — 测试驱动开发，极限编程中的工程实践。
- sdd-new-project — 在智能体工具中按 SDD-Scrum 启动项目，包括规格文件夹路径等设置。
- sdd-update-project — 在智能体工具中更新项目设置。
- sdd-refine-pb — 梳理产品待办：细化初始需求，创建 PBI，并补充用户故事和验收标准。
- sdd-plan-sprint — 规划冲刺：把 PBI 分配到各冲刺，检查覆盖与可追溯性，并把 PBI 拆成细粒度 SBI。
- sdd-tracking — 跟踪并更新实时状态，包括临时 OGT（进行中任务）。
- sdd-retrospective — 在开发者与智能体之间，或智能体之间进行回顾。
- sdd-close-sprint — 关闭冲刺。
- sdd-audit-artifacts — 审计项目产物，更新产物映射，并按框架模板对齐产物。
- sdd-update-specs — 使规格与实现保持一致。
- sdd-design — 在实现 SBI 之前完成设计与规划：与开发者澄清未知项，完成设计，并做好实现准备。
- sdd-implement — 加载实现该 SBI 所需的技能，对照 DoD 及其验收标准。

### 规则

- dod.mdc — 整个产品的完成定义。
- incremental-delivery.mdc — 完成一个 SBI 后再开始下一个。
- realtime-status.mdc — 实时跟踪状态，并在每个 SBI 完成时更新 status.md。

## 产物

### sdd-scrum 框架

- sdd-scrum-guide.md — SDD-Scrum 框架的唯一事实来源。
- sdd-scrum-practices.md — 开发者与 AI 智能体协作时，Harness Engineering 与 SDD 实践的唯一事实来源。
- artifacts-map.md — 产物路径定义与项目映射。

### sdd-scrum 流程

- product-backlog.md — 产品待办。
- sprint-backlog.md — 冲刺待办。
- status.md — 实时状态。
- change-log.md — 变更管理。

### 工程产物

- architecture.md — 工程产物模板。
- design.md — 工程产物模板。
- test.md — 工程产物模板。
- deployment.md — 工程产物模板。
- issues-log.md — 问题记录与跟踪模板。
