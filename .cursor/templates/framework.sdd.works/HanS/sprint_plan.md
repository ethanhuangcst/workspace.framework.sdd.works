# sprint_plan — [产品名]

> **用途**：短周期执行清单 —— 做什么、卡在哪、验收是什么。
> **示例**：Pokymon Card Collection。复制后替换产品名与条目。
> **排期与状态的唯一真相源**：本文件。`product-backlog.md` 的 `Sprint` 列是本文件排期的投影。
> **关联**：[`architecture.md`](./architecture.md) · [`deployment.md`](./deployment.md) · [`artifacts-map.md`](./artifacts-map.md)
> **编号口径**：`#N` 指所在 Sprint 的条目编号。引用其它文档时优先写条目名。
> **体例**：见 [`sdd-scrum-practices.md`](./sdd-scrum-practices.md)。
> **as_of**：2026-09-21

---

## RID Registry（Risks / Impediments / Dependencies）

> 本节只登记风险、阻碍与依赖，不属于任何 Sprint。

| # | 级别 | 类型 | 标题 | 说明 | 影响 | 解决方案（→ product-backlog） | 关联文档 | 处理说明 | 状态 | 更新日期 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **R1** | **严重** | 风险 | 同一张卡被登记两次 | 若系列 + 卡号不唯一，搜索与库存会把一张卡当成两张。 | 数量与交换记录对不上。 | [登记卡牌](./product-backlog.md#pb-1) | [Sprint 1「登记卡牌」](#s1-catalog) · [`architecture.md`](./architecture.md) §2 | 唯一约束已在 Sprint 1 落地；生产数据复核留在上线时。 | Open | 2026-09-21 |
| **D1** | **阻塞** | 依赖 | 卡号唯一约束 | 数据库对（收藏者、系列、卡号）唯一。 | 没有约束时重复登记不会被拒绝。 | [登记卡牌](./product-backlog.md#pb-1) | [Sprint 1「登记卡牌」](#s1-catalog) · [`architecture.md`](./architecture.md) §2 | 本地已实现并有重复登记用例。 | Implemented | 2026-09-21 |

> **级别口径**：**致命** = 不报错且造成他人数据可见；**阻塞** = 不解决则不得上线；**严重** = 单点失效即库存错误；**中** = 影响可核对性。
> **类型口径**：风险 = 可能发生的失效；阻碍 = 已发生的阻塞；依赖 = 关闭风险所依赖的落地项。

### RID 覆盖对照

| RID | 解决方案（Backlog 条目） | 验收条件与设计/测试落点 | Sprint 落点 |
|---|---|---|---|
| R1 | [登记卡牌](./product-backlog.md#pb-1) | [登记卡牌验收条件](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1「登记卡牌」](#s1-catalog) |
| D1 | [登记卡牌](./product-backlog.md#pb-1) | [登记卡牌验收条件](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | [Sprint 1「登记卡牌」](#s1-catalog) |

---

## Sprint 1

Sprint Goal: 收藏者能在本机登记一张卡，且同一张卡不会出现两条记录。

**状态：已结束**（全部条目完成）

### ToDo

| # | 事项 | 类别 | 模块 | 验收条件 | 关联文档 | 说明 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s1-local"></a>1 | 本地启动 | 任务 | 运行 | `make up` 后应用可打开，空收藏可见。 | [本地启动](./product-backlog.md#pb-6) · [`deployment.md`](./deployment.md) §1 | 本地栈已可启动。 | Done |
| <a id="s1-catalog"></a>2 | 登记卡牌 | 任务 | 收藏 | 同一系列与卡号第二次登记时数量 +1，不新增行。 | [登记卡牌](./product-backlog.md#pb-1) · [`architecture.md`](./architecture.md) §2 | 唯一约束与重复登记用例已通过。 | Done |
| 3 | 范围门禁 | 任务 | 产品 | 无价格、无公开市场、无真实品牌名。 | [范围门禁](./product-backlog.md#pb-5) · [`architecture.md`](./architecture.md) §1 | 示例文案只用 Pokymon。 | Done |

### Retrospective

**做得好**

- 先定「一张卡一条记录」，再做搜索，避免后面改主键。

**待改进**

- 空状态文案应走文案目录，不要写死在页面里。

**学到**

- 唯一约束要写进验收条件，不能只写在数据库注释里。

---

## Sprint 2

Sprint Goal: 收藏者能按系列或稀有度找到自己的卡，并把卡放进活页夹、记下一次交换。

**状态：进行中**

### ToDo

| # | 事项 | 类别 | 模块 | 验收条件 | 关联文档 | 说明 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="s2-search"></a>1 | 按系列与稀有度搜索 | 任务 | 收藏 | 过滤后列表只含匹配项；无匹配时为空状态。 | [搜索](./product-backlog.md#pb-2) | 系列过滤已可演示；稀有度过滤未完成。 | WIP |
| <a id="s2-binder"></a>2 | 活页夹 | 任务 | 收藏 | 放入与移出不改变总目录中的数量。 | [活页夹](./product-backlog.md#pb-3) · [`architecture.md`](./architecture.md) §2 | — | ToDo |
| <a id="s2-trade"></a>3 | 记录交换 | 任务 | 收藏 | 交出减 1、换入加 1；数量为 0 不能再交出。 | [记录交换](./product-backlog.md#pb-4) | — | ToDo |

### Retrospective

**做得好**

- —

**待改进**

- —

**学到**

- —
