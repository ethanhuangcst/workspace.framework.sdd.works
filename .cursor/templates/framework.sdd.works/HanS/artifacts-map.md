# 制品索引 — [产品名]

> **用途**：列出过程文档与可选领域文档，避免第二份目录。
> **示例**：Pokymon Card Collection。没有的领域目录不要提前建文件。
> **体例**：见 [`sdd-scrum-practices.md`](./sdd-scrum-practices.md)。

## 过程文档

| 制品 | 路径 | 作用 |
| --- | --- | --- |
| 体例 | [`sdd-scrum-practices.md`](./sdd-scrum-practices.md) | 如何写 RID、Sprint、Backlog、变更日志 |
| 产品待办 | [`product-backlog.md`](./product-backlog.md) | 需求与验收 |
| 迭代计划 | [`sprint_plan.md`](./sprint_plan.md) | 当前排期与执行状态 |
| 变更日志 | [`change-log.md`](./change-log.md) | 结论级变更 |
| 架构 | [`architecture.md`](./architecture.md) | 栈与决议 |
| 部署 | [`deployment.md`](./deployment.md) | 本地启动与上线步骤 |

## 可选领域文档

产品有对应界面时再添加，不要在模板包里预建空目录。

| 制品 | 何时添加 |
| --- | --- |
| `adr/` | 有需要单独保留的架构决议时 |
| 应用故事与设计 | 有面向用户的界面时 |
| 测试说明 | 有可重复的验证矩阵、且不适合只写在 Backlog 验收条件里时 |
