# 產品概覽 — [product name]

> 類型：Framework (process) artifact，產品：[product name]
> as_of: [YYYY-MM-DD]
> [Definition](../sdd-scrum-practices.md#product-backlogmd)

---

<a id="index"></a>

## 目錄

- [產品概覽](#product-overview)
- [Definition of Done](#definition-of-done)
- [需求](#requirements)
  - [[component name]](#component)
- [Product Backlog](#product-backlog)
- [變更記錄](#change-record)

---

<a id="product-overview"></a>

# 產品概覽

- [用一句話說明產品為主用戶做什麼。]
- [可選第二行：階段、約束或範圍。]

[返回目錄](#index)

---

<a id="definition-of-done"></a>

# Definition of Done

本節是在 `sdd-dod.mdc` 標準完成定義之上的**額外**產品檢查。只有標準項與本節每一項都通過，才能把 PBI 或 SBI 標為 **Done**。[`sprint-backlog.md`](./sprint-backlog.md) 透過連結指向本節，不在 sprint 檔案裡重複這份清單。

- [額外 PBI 檢查項，並寫明如何驗收。]

[返回目錄](#index)

---

<a id="requirements"></a>

# 需求

每條需求包含 PBI 編號、一個交付物名詞、以及產品負責人或用戶能直接執行的要點。表格使用相同編號與相同名詞。需求列設定一個 `#pb-N` 錨點；表格裡的 PBI 編號連結到同一列的 `#pb-N`。其他流程檔案透過 `./product-backlog.md#L{line}` 指向該需求列。要點寫法見 `../sdd-scrum-practices.md` 中 **product-backlog.md** 小節的 Requirements 與 General writing principles。

將 `[component name]` 換成你的元件名。每個元件一個 `##` 標題，並在目錄中連結。

<a id="component"></a>

## [component name]

- <a id="pb-1"></a>[[PBI code]](#pb-1) [noun]
  - [一條產品負責人或用戶能據此行動的要點。]
  - [可選第二條要點。]

[返回目錄](#index)

---

<a id="product-backlog"></a>

# Product Backlog

| # | Component | PBI Code | Description | Size | Related | Sprint | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [component] | [[PBI code]](#pb-1) | [noun] | Implementable | - [[相關 spec 或 PBI]]([path]#pb-N) | — | ToDo |

[返回目錄](#index)

---

<a id="change-record"></a>

# 變更記錄

| Date | Change |
| --- | --- |
| [YYYY-MM-DD] | [複製種子後的首條記錄，或本次 backlog 變更原因。] |

[返回目錄](#index)
