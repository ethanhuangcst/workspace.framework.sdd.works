# 产品概述 — [产品名]

> **用途**：记录 [产品名] 的产品需求 —— 要什么、边界在哪、验收是什么。
> **示例**：本文件用 **Pokymon Card Collection** 填好。复制后把产品名、条目和验收换成真实产品。
> **状态**：v1.0 · as_of 2026-09-21
> **关联**：[`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`sprint_plan.md`](./sprint_plan.md) · [`artifacts-map.md`](./artifacts-map.md)
> **体例**：列定义、状态语义见 [`sdd-scrum-practices.md`](./sdd-scrum-practices.md)。
> **排期**：文末 Backlog 表的 `Sprint` 列是 [`sprint_plan.md`](./sprint_plan.md) 排期的投影。排期变更以该文件为准。

Pokymon Card Collection 是收藏者用来登记卡牌、放入活页夹、按系列与稀有度搜索、并记下交换的应用。卡牌为虚构「Pokymon」，不声称任何已授权品牌。

---------
## 需求边界

### 「本产品做」的口径

- 收藏者可以登记一张卡（名称、系列、稀有度、数量）。
- 收藏者可以把卡放进命名的活页夹。
- 收藏者可以按系列或稀有度搜索自己的收藏。
- 收藏者可以记下一次交换（交出哪张、换入哪张、日期）。

验收条件：上述四件事在后续评审中保持为产品范围；任何扩大须在本节登记为「例外 + 日期」 → [Backlog「登记卡牌」](#pb-1) · [Backlog「活页夹」](#pb-3) · [Backlog「搜索」](#pb-2) · [Backlog「记录交换」](#pb-4)

### 明确不做（out of scope）

- **支付与定价** —— 不卖卡、不标价。
- **公开交易市场** —— 交换只记在本人账上，不匹配陌生人。
- **已授权品牌内容** —— 不使用真实 Pokémon 名称、图或商标。

验收条件：上述条目在后续评审中保持不变 → [Backlog「范围门禁」](#pb-5)

---------
# 需求

> 本节写「要什么」。可执行细节、验收条件与状态见文末 Product Backlog。
> 每条需求必须在文末有对应条目。回溯引用以条目名为主、编号为辅。

---------
## [本地] 本地启动

- 在本机用默认配置启动应用，作为对照基线。 → [Backlog「本地启动」](#pb-6)

---------
## [收藏] 登记、搜索、活页夹、交换

- **登记卡牌**：同一张卡（系列 + 卡号）只保留一条记录，数量可增加。 → [Backlog「登记卡牌」](#pb-1)
- **搜索**：按系列或稀有度过滤，只返回当前收藏者的卡。 → [Backlog「搜索」](#pb-2)
- **活页夹**：一张卡可放入一个活页夹；未放入的卡仍在总目录中。 → [Backlog「活页夹」](#pb-3)
- **交换**：记下交出与换入；库存数量随之增减。 → [Backlog「记录交换」](#pb-4)

---------
# Product Backlog

| # | 分类 | 父项 | 标题 | 描述 | 验收条件 | 关联 | Sprint | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="pb-1"></a>1 | [收藏] | — | 登记卡牌 | 收藏者登记名称、系列、卡号、稀有度与数量。系列 + 卡号唯一。 | 同一系列与卡号第二次登记时数量增加，不产生第二条记录。空名称被拒绝。 | [Sprint 1「登记卡牌」](./sprint_plan.md#s1-catalog) · [`architecture.md`](./architecture.md) §2 | Sprint 1 | Done |
| <a id="pb-2"></a>2 | [收藏] | 登记卡牌 | 按系列与稀有度搜索 | 只搜索当前收藏者的卡。 | 选择一个系列后列表只含该系列；选择稀有度后只含该稀有度；无匹配时显示空状态。 | [Sprint 2「搜索」](./sprint_plan.md#s2-search) | Sprint 2 | WIP |
| <a id="pb-3"></a>3 | [收藏] | 登记卡牌 | 活页夹 | 收藏者创建活页夹并把卡放入其中。 | 卡放入活页夹后仍出现在总目录；从活页夹移出后总目录数量不变。 | [Sprint 2「活页夹」](./sprint_plan.md#s2-binder) · [`architecture.md`](./architecture.md) §2 | Sprint 2 | ToDo |
| <a id="pb-4"></a>4 | [收藏] | 登记卡牌 | 记录交换 | 记下交出的卡、换入的卡与日期。 | 交出后该卡数量减 1；换入后对应卡数量加 1；数量为 0 时不能再交出。 | [Sprint 2「记录交换」](./sprint_plan.md#s2-trade) | Sprint 2 | ToDo |
| <a id="pb-5"></a>5 | [范围] | — | 范围门禁 | 不做支付、公开市场、已授权品牌内容。 | 界面与 API 无价格、无陌生人匹配、无真实品牌名或商标图。 | [`architecture.md`](./architecture.md) §1 | Sprint 1 | Done |
| <a id="pb-6"></a>6 | [本地] | — | 本地启动 | 本机默认配置可启动。 | `make up` 后打开应用可看到空收藏，并完成一次登记。 | [Sprint 1「本地启动」](./sprint_plan.md#s1-local) · [`deployment.md`](./deployment.md) §1 | Sprint 1 | Done |

---------

## 变更记录

| 日期 | 变更 |
| --- | --- |
| 2026-09-21 | 模板落地：用 Pokymon Card Collection 填 6 条 Backlog，作为可复制示例。 |
