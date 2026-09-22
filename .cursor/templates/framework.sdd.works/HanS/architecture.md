# 架构 — [产品名]

> **用途**：记录技术栈与少量决议。产品行为以 [`product-backlog.md`](./product-backlog.md) 为准。可选 / JIT（非必需过程制品）。
> **示例**：Pokymon Card Collection。
> **实践**：[`sdd-scrum-practices.md`](./sdd-scrum-practices.md)（做什么、怎么做、何时做）。
> **框架**：[`sdd-scrum-guide.md`](./sdd-scrum-guide.md)（名称与含义）。

## 1. 产品形状

| 面 | 作用 | 谁使用 |
| --- | --- | --- |
| Web 应用 | 登记卡、搜索、活页夹、记录交换 | 收藏者 |

不做支付、公开市场、已授权品牌内容。见 [范围门禁](./product-backlog.md#pb-5)。

## 2. 栈与一条决议

| 类别 | 选择 | 说明 |
| --- | --- | --- |
| 应用 | Next.js · TypeScript | 示例栈，可替换 |
| 数据 | Postgres | 卡、活页夹、交换各一张表 |

**决议：一张卡一行，活页夹只是归类。**

- 卡的主键业务键是（收藏者、系列、卡号）。数量是该行上的字段。
- 活页夹不复制卡。一张卡通过关联放入一个活页夹；移出活页夹不删除卡行。
- 不采用「每个活页夹一份卡列表副本」。副本会在交换时改两处数量。

本地启动见 [`deployment.md`](./deployment.md) §1。
