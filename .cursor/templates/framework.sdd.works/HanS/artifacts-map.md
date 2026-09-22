# 制品索引 — [产品名]

> **用途**：必需的**过程制品** — 本项目活文档与目录的索引。不是框架定义（那是指南与实践）。跟踪是 `status.md` 与 `change-log.md`。知识是 `adr/` 与 `knowledge/`（回顾）。其它文档链接到此，不另建第二份目录。
> **示例**：Pokymon Card Collection。没有的领域目录不要提前建文件。
> **实践**：[`sdd-scrum-practices.md`](./sdd-scrum-practices.md)（做什么、怎么做、何时做：工作、模板、表格约定）。
> **框架**：[`sdd-scrum-guide.md`](./sdd-scrum-guide.md)（名称与含义）。

## 框架定义

| 制品 | 路径 | 作用 |
| --- | --- | --- |
| Scrum-in-SDD 指南 | [`sdd-scrum-guide.md`](./sdd-scrum-guide.md) | 名称与含义：术语、制品（过程 / 跟踪 / 知识 / 可选）、事件 |
| 实践 | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) | 做什么、怎么做、何时做：八项工作、模板、RID 与 Backlog 表格约定 |

## 过程

| 制品 | 路径 | 作用 |
| --- | --- | --- |
| 产品待办 | [`product-backlog.md`](./product-backlog.md) | 需求与验收 |
| 迭代待办 | [`sprint_plan.md`](./sprint_plan.md) | 当前排期与执行状态（SBI ToDo/WIP/Done） |
| 制品索引 | [`artifacts-map.md`](./artifacts-map.md) | 本文件 — 项目索引 |

## 跟踪

| 制品 | 路径 | 作用 |
| --- | --- | --- |
| 状态 | [`status.md`](./status.md) | 当前 Sprint、当前 SBI、下一步、OGT 表（不是第二份 Sprint Backlog） |
| 变更日志 | [`change-log.md`](./change-log.md) | 结论级变更 |

## 知识

| 树 | 路径 | 作用 |
| --- | --- | --- |
| ADR | [`adr/`](./adr/) | 持久架构 / 过程决策（回顾）。需要时再建。 |
| 知识 | [`knowledge/`](./knowledge/) | 非决策本身的可复用研究与运维笔记。需要时再建。 |

## 可选 / JIT

| 制品 | 路径 | 作用 |
| --- | --- | --- |
| 架构 | [`architecture.md`](./architecture.md) | 栈与决议 |
| 部署 | [`deployment.md`](./deployment.md) | 本地启动与上线步骤 |

## 可选产品面

产品有对应界面时再添加，不要在模板包里预建空目录。

| 制品 | 何时添加 |
| --- | --- |
| 应用故事与设计 | 有面向用户的界面时 |
| 测试说明 | 有可重复的验证矩阵、且不适合只写在 Backlog 验收条件里时 |
