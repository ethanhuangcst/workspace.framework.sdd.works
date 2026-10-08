# 产品概览 — [product name]

> 类型：Framework (process) artifact，产品：[product name]
> as_of: [YYYY-MM-DD]
> [Definition](../sdd-scrum-practices.md#product-backlogmd)

---

<a id="index"></a>

## 目录

- [产品概览](#product-overview)
- [Definition of Done](#definition-of-done)
- [需求](#requirements)
  - [[component name]](#component)
- [Product Backlog](#product-backlog)
- [变更记录](#change-record)

---

<a id="product-overview"></a>

# 产品概览

- [用一句话说明产品为主用户做什么。]
- [可选第二行：阶段、约束或范围。]

[返回目录](#index)

---

<a id="definition-of-done"></a>

# Definition of Done

本节是在 `sdd-dod.mdc` 标准完成定义之上的**额外**产品检查。只有标准项与本节每一项都通过，才能把 PBI 或 SBI 标为 **Done**。[`sprint-backlog.md`](./sprint-backlog.md) 通过链接指向本节，不在 sprint 文件里重复这份清单。

- [额外 PBI 检查项，并写明如何验收。]

[返回目录](#index)

---

<a id="requirements"></a>

# 需求

每条需求包含 PBI 编号、一个交付物名词、以及产品负责人或用户能直接执行的要点。表格使用相同编号与相同名词。需求行设置一个 `#pb-N` 锚点；表格里的 PBI 编号链接到同一行的 `#pb-N`。其他流程文件通过 `./product-backlog.md#L{line}` 指向该需求行。要点写法见 `../sdd-scrum-practices.md` 中 **product-backlog.md** 小节的 Requirements 与 General writing principles。

将 `[component name]` 换成你的组件名。每个组件一个 `##` 标题，并在目录中链接。

<a id="component"></a>

## [component name]

- <a id="pb-1"></a>[[PBI code]](#pb-1) [noun]
  - [一条产品负责人或用户能据此行动的要点。]
  - [可选第二条要点。]

[返回目录](#index)

---

<a id="product-backlog"></a>

# Product Backlog

| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [component] | [[PBI code]](#pb-1) | [noun] | Implementable | - [[相关 spec 或 PBI]]([path]#pb-N) | — | ToDo |

[返回目录](#index)

---

<a id="change-record"></a>

# 变更记录

| Date | Change |
| --- | --- |
| [YYYY-MM-DD] | [复制种子后的首条记录，或本次 backlog 变更原因。] |

[返回目录](#index)
