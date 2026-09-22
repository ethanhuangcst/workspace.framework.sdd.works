---
title: SDD Scrum 实践
type: process-spec
status: active
as_of: 2026-09-22
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint_plan.md
related:
  - sdd-scrum-guide.md
  - product-backlog.md
  - change-log.md
  - artifacts-map.md
  - status.md
  - architecture.md
  - deployment.md
---

# SDD Scrum 实践

本文件是 AI agent 应用 sdd-scrum 时**做什么、怎么做、何时做**的唯一真源（Cursor、Claude Code、Codex、CodeBuddy 等）。名称与含义见 [`sdd-scrum-guide.md`](./sdd-scrum-guide.md)。

RID、Sprint Backlog 与 Product Backlog 的表格约定在 **Jobs** 之后的章节。产品事实、设计与测试判据仍归各自 spec。

示例产品见同目录其它模板（Pokymon Card Collection）。把 `[产品名]` 换成真实产品名后，按本文件维护各过程文档。本 locale 的 Sprint 文件名为 `sprint_plan.md`。

## Jobs（做什么、怎么做、何时做）

### 1. 上线 agent

- 上线 agent ethan。
- 从 framework.sdd.works 文件夹加载制品模板，或缺件时通过 `sdd_install_framework` / `sdd_update_framework`。
- 跑上线检查，告知用户 agent ethan 已就绪。
- 在 `status.md` 记录当前状态，并建议下一步。

### 2. 开始新项目

- 决定项目制品语言（EN、HanS、HanT）。
- 按子系统、架构、组件决定工作区目录结构。
- 指定 sdd-scrum 制品根目录（默认 `{workspace_folder}/specs`）及所需子目录。
- 把该结构写入 `artifacts-map.md`（必需的过程制品；本项目索引）。
- 按所选语言，把制品模板复制到 `artifacts-map.md` 命名的位置。
- 确保 agent ethan 可操作这些文件。
- 在 `status.md` 记录当前状态，告知用户项目已初始化，并建议下一步。

### 3. 更新项目设置

- 更新项目制品语言（EN、HanS、HanT）。
- 按子系统、架构、组件更新工作区目录结构。
- 更新 sdd-scrum 制品根目录（默认 `{workspace_folder}/specs`）及子目录。
- 更新 `artifacts-map.md`，使其仍为本项目索引。
- 按语言与 `artifacts-map.md` 重定位制品文件。
- 确保 agent ethan 可操作这些文件。
- 在 `status.md` 记录当前状态，告知用户项目已更新，并建议下一步。

### 4. 细化产品待办

*（待填）*

### 5. Sprint 计划

*（待填）*

### 6. 报告状态

*（待填）*

### 7. 回顾

*（待填）*

### 8. 开始新 Sprint

*（待填）*

## Templates

**何时**：上线（工作 1）时若工作副本缺失则复制或刷新种子；新项目（工作 2）；更新设置（工作 3）仅在重定位或补缺时 — 未经用户确认不得覆盖已填写的工作副本。

**从何处**：`.cursor/templates/framework.sdd.works/<locale>/`（locale EN、HanS 或 HanT），或 MCP `sdd_install_framework` / `sdd_update_framework` 到同一解压目标。再把所列文件复制到 `artifacts-map.md` 命名的制品根目录。

**它们不是什么**：种子不是活制品。编辑制品根目录下的工作副本。该拆分的名称与含义见 [`sdd-scrum-guide.md`](./sdd-scrum-guide.md)（种子 vs 工作副本）。

## 1. RID Registry

RID Registry 只登记 Risk（风险）、Impediment（阻碍）与 Dependency（依赖），不登记验证步骤或测试用例。

### 1.1 列定义

| 列 | 约定 |
|---|---|
| `#` | 沿用稳定编号，如 `R1`、`I1`、`D1`；编号不表达优先级 |
| `级别` | 影响等级，由登记表定义并保持单一口径 |
| `类型` | 只能为风险、阻碍或依赖 |
| `标题` | 一句话描述需要持续跟踪的事项 |
| `说明` | 描述事实、触发条件或形成原因，不重复解决方案 |
| `影响` | 描述未处理时的用户、数据或交付影响 |
| `解决方案（→ product-backlog）` | 以可点击的条目级锚点指向一个或多个真实存在的 Product Backlog 条目，条目名为主、编号为辅 |
| `关联文档` | 按实现链路同时链接对应 Sprint Backlog 执行条目，以及设计、测试或决议的单一真源 |
| `处理说明` | 1–3 句摘要，写当前进展、剩余边界和证据指针 |
| `状态` | 只能为 `Pending`、`Open`、`Implemented`、`Closed` |
| `更新日期` | 最近一次改变事实或状态的日期 |

### 1.2 状态语义

| 状态 | 语义 |
|---|---|
| `Pending` | 已登记，处置尚未开始 |
| `Open` | 处置正在进行，或仅部分依赖已落地 |
| `Implemented` | 处置已实现，但仍有生产验收或其它已登记条目待闭环 |
| `Closed` | 对应解决方案的全部验收条件满足，且无其它未完成项 |

状态列只写枚举值。日期、完成范围、剩余工作与验证证据写入「处理说明」，详细过程引用 [`change-log.md`](./change-log.md) 或所属设计、测试文档。

### 1.3 解决方案、验证与覆盖

- RID 的解决方案必须落入 [`product-backlog.md`](./product-backlog.md)，不得再以表内另一类编号代替执行条目；链接必须定位到具体条目锚点，不能只指向文件顶部。
- Product Backlog 条目的「验收条件」就是该解决方案的验证方法；RID 表不另设「验证方法」列。
- 每条 RID 必须形成 `RID → Product Backlog 解决方案 → Sprint Backlog 执行条目 → design/test/ADR 依据` 的可点击追踪链。RID 的「解决方案」列链接 Product Backlog 条目；「关联文档」列链接对应 Sprint 条目及设计、测试或决议章节。
- Product Backlog 的 `Sprint` 列仍只保存排期投影；需要精确追踪时，由 `关联` 列链接 Sprint Backlog 的稳定条目锚点，不在 Product Backlog 复制执行状态。
- 稳定判据名（如 `V1`）可被引用，但不作为 RID 行。完整判据写在对应设计或测试 spec，并在 Product Backlog 条目的「验收条件」中给出可执行摘要。
- 单一真源不等于单向无回链：各文档不复制他处状态与正文，但可通过稳定锚点建立双向导航。RID 的处理状态只留在 RID Registry，Sprint 的执行状态只留在 Sprint Backlog。
- RID 节必须维护「RID → Backlog 条目 → 验收条件及设计/测试落点 → Sprint 落点」覆盖对照表。每个单元格都必须有值且使用可解析链接，确保解决方案、验证和排期 100% 覆盖。

## 2. Sprint plan

[`sprint_plan.md`](./sprint_plan.md) 中每个 Sprint 的 ToDo 表是本 Sprint 执行清单与状态的唯一真源。

### 2.1 列定义

表列固定为：`#`、`事项`、`类别`、`模块`、`验收条件`、`关联文档`、`说明`、`状态`。

- 「验收条件」必须在条目实施时可验证，不得依赖尚未产出的其它条目；跨条目产物应移到其实际产出条目。
- 「关联文档」指向对应 Product Backlog 条目、需求、设计、测试、决议或过程证据，不复制其正文；被 RID 采用为执行落点时，条目必须提供稳定锚点供 RID 与 Product Backlog 回链。
- 「说明」只写结论级摘要、剩余边界与证据指针，不堆放命令输出、逐步操作记录或长篇调查过程。
- 未开始且无额外信息的条目，说明写 `—`；不要在说明列重复写「未开始」。

### 2.2 状态语义

| 状态 | 语义 |
|---|---|
| `ToDo` | 尚未开始 |
| `WIP` | 已开始但验收条件未满足 |
| `Implemented` | 已实现或本地验证完成，仍待生产验收或其它已登记条目闭环 |
| `Done` | 本条目的全部验收条件已经满足 |

状态列只写枚举值。将既有长状态文字迁移到说明列前，必须先确认细节已由 `change-log.md`、测试规格或知识文档承载；没有落点的细节先补过程记录，再压缩为摘要。

### 2.3 编号、引用与回顾

- `#N` 只表示所在 Sprint 内的条目编号；跨文档引用优先写条目名，编号只作辅助定位。
- 每个 Sprint 必须保留 `Retrospective`，至少记录「做得好」「待改进」「学到」。每次 story / task 完成后的 retrospective 必须写入实际交付该工作的 Sprint 回顾章节；ADR 与 `specs/knowledge/` 仅在有持久决策或可复用知识时追加，并从 Sprint 回顾链接过去。即使没有 ADR 或知识文档，Sprint 回顾仍必须更新。
- 变更排期时，同批更新 Product Backlog 的 `Sprint` 投影；变更实现状态时，按两张表各自职责回写，不用一张表代替另一张表。

## 3. Product Backlog

[`product-backlog.md`](./product-backlog.md) 记录产品条目、描述、验收条件、关联、排期投影与产品层状态。

### 3.1 列与维护边界

表列固定为：`#`、`分类`、`父项`、`标题`、`描述`、`验收条件`、`关联`、`Sprint`、`状态`。

- `描述`、`验收条件`、`关联`与`状态`由 Product Backlog 自主维护。
- `Sprint` 是 `sprint_plan.md` 排期的投影，不能成为第二套排期真相源。
- `验收条件`必须可执行、可观察，并承载 RID 解决方案的验证方法。
- 被 RID 引用的 Product Backlog 条目必须提供稳定条目锚点；`关联`列必须链接具体 Sprint Backlog 执行条目及设计/测试依据，形成从产品方案到实施与验证的导航链。
- 回溯引用使用「条目名为主、编号为辅」；编号变化时不得让语义失真。

### 3.2 状态语义

Product Backlog 使用与 Sprint Backlog 相同的四态：

- `ToDo`：尚未开始。
- `WIP`：实施中，验收条件未满足。
- `Implemented`：已实现，仍待生产验收或其它已登记条目闭环。
- `Done`：条目的全部验收条件已经满足。

状态列只写枚举值。完成日期、剩余工作和验证证据放在 Sprint 条目的「说明」或 `change-log.md`，不塞入 Product Backlog 的状态单元格。

## 4. 单一真源边界

| 信息 | 唯一真源 | 其它文档如何引用 |
|---|---|---|
| RID 状态、影响与当前处理摘要 | `sprint_plan.md` 的 RID Registry | 只引用 RID 编号与标题 |
| 产品解决方案与验收条件 | `product-backlog.md` | RID 链接具体条目锚点；条目 `关联` 回链 Sprint 执行项与设计/测试依据 |
| Sprint 排期与执行状态 | `sprint_plan.md` 的 Sprint Backlog | Product Backlog 的 `Sprint` 列只作投影，`关联`列可链接具体执行项 |
| 详细设计与验证矩阵 | 对应设计、测试 spec | 过程表只写摘要与章节链接 |
| 过程证据与变更原因 | `change-log.md` | 跟踪制品；说明列写日期、结论和链接 |
| 当前 Sprint、SBI、下一步与 OGT 行 | `status.md` | 跟踪投影；不是第二份 Sprint Backlog |
| 表格体例与状态语义 | 本文件（Jobs 之后） | 各过程文档头部链接本文件 |
| 制品索引 | `artifacts-map.md` | 其它文档只链接路径，不另列第二份目录 |
| 持久决策 | `adr/` | 知识类；有 ADR 价值时再建（回顾） |
| 可复用研究 / 运维笔记 | `knowledge/` | 知识类；有知识价值时再建（回顾） |
| 架构决议（可选 / JIT） | `architecture.md` | 过程表只链接章节，不复述决议全文 |
| 部署与升级步骤（可选 / JIT） | `deployment.md` | 过程表只链接章节，不复述步骤全文 |

同一事实只在其归属文档完整叙述。改口径时按「权威文档 → 引用方 → 操作现场」核对，避免第二处口径静默过时。

## 5. Links

- [`sprint_plan.md`](./sprint_plan.md)：RID Registry 与 Sprint Backlog
- [`product-backlog.md`](./product-backlog.md)：产品条目与验收条件
- [`status.md`](./status.md)：当前 Sprint、SBI、下一步、OGT
- [`change-log.md`](./change-log.md)：跟踪 — 过程证据与变更记录
- [`artifacts-map.md`](./artifacts-map.md)：过程制品索引
- [`sdd-scrum-guide.md`](./sdd-scrum-guide.md)：名称与含义
- [`architecture.md`](./architecture.md)：可选 / JIT — 架构与决议
- [`deployment.md`](./deployment.md)：可选 / JIT — 部署与升级
- [`adr/`](./adr/)：知识 — 持久决策
- [`knowledge/`](./knowledge/)：知识 — 可复用笔记
