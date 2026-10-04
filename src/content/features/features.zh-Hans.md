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
- sdd-update-project — 在智能体工具中按 SDD-Scrum 启动项目并更新项目设置，包括规格文件夹路径。修复缺失或错误的产物索引。不覆盖已有内容的过程文件。
- sdd-refine-backlog — 梳理产品待办：细化初始需求，创建 PBI，并补充用户故事和验收标准。
- sdd-plan-sprint — 规划冲刺：把 PBI 分配到各冲刺，检查覆盖与可追溯性，并把 PBI 拆成细粒度 SBI。
- sdd-tracking — 跟踪并更新实时状态，包括临时 OGT（进行中任务）。
- sdd-retrospective — 在开发者与智能体之间，或智能体之间进行回顾。
- sdd-close-sprint — 关闭冲刺。
- sdd-audit-artifacts — 读取工作区索引和过程文件。返回项目未初始化、索引已损坏，或索引可用。不编辑文件。
- sdd-review-status — 读取五份过程文件，并给出这些文件支持的下一步选项。不编辑文件。
- sdd-update-specs — 使规格与实现保持一致。
- sdd-spec-to-build — 先规格后实现一个 SBI：汇总需求、完成设计，并按 DoD 与验收标准实现该 SBI。

### 规则

- dod.mdc — 整个产品的完成定义。
- incremental-delivery.mdc — 完成一个 SBI 后再开始下一个。
- realtime-status.mdc — 实时跟踪状态，并在每个 SBI 完成时更新 status.md。
- friendly-language.mdc — 让用户和后续 agent 可读的 chat 与 Markdown 文案。

## 产物

### sdd-scrum 框架

- scrum-in-sdd.md — SDD-Scrum 框架的唯一事实来源。
- sdd-scrum-practices.md — 开发者与 AI 智能体协作时，Harness Engineering 与 SDD 实践的唯一事实来源。
- artifacts-map.json — 产物路径定义与项目映射。

### sdd-scrum 流程

- product-backlog.md — 产品待办。
- sprint-backlog.md — 冲刺待办。
- status.md — 实时状态。
- changes-log.md — 变更管理。

### 工程产物

- architecture.md — 工程产物模板。
- design.md — 工程产物模板。
- test.md — 工程产物模板。
- deployment.md — 工程产物模板。
- issues-log.md — 问题记录与跟踪模板。
