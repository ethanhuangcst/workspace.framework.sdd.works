# 測試策略 — [product name]

> **Purpose**：產品級品質基線：在 common-test-strategy 上的擴展、測試金字塔、工具、環境與 CI 策略，以及命名的關鍵用戶路徑。Optional / JIT（非必填流程工件）。
> **Practices**：[`sdd-scrum-practices.md`](../sdd-scrum-practices.md)（做什麼、怎麼做、何時做）。
> **Framework**：[`pack-scrum-in-sdd.md`](../pack-scrum-in-sdd.md)（名稱與含義）。

本檔案只寫**產品級**測試策略：整體驗證什麼、各層與 CI 如何分工。**詳細測試計畫、場景列表與逐條映射**（stories、檔案、Gherkin、分層斷言）放在 `{workspace}/artifacts-map.json` 所指的模組 **`{stem}-tests.md`** 中。不要在此重複用例；連結模組 spec，本檔案保持策略深度。

| 文件 | 作用 |
| --- | --- |
| **common-test-strategy**（agent rule） | 基線金字塔、TDD、品質 checklist |
| [`test-strategy.md`](./test-strategy.md) | 產品級門禁、工具、CI 與 acceptance closure |
| [`{module}/{stem}-tests.md`](./[module]/[stem]-tests.md) | 模組測試計畫與用例（路徑按 map 替換） |
| [`architecture.md`](./architecture.md) | 服務、邊界、部署形態 |
| [`release.md`](./release.md) | 部署後 smoke 路徑 |

與 [`architecture.md`](./architecture.md) 對齊。`{stem}-stories.md` 中的 acceptance criteria 驅動 `{stem}-tests.md` 中的用例；本檔案不重複 AC。

## 1. 基線

| 項 | 本產品 |
| --- | --- |
| Extends **common-test-strategy** | **Yes** |
| Weakens pyramid or quality checklist | **No** |
| Conflict resolution | 採用**更嚴格**的解釋 |
| Coverage (when measurable) | 變更關鍵路徑 **100%**；整體 **≥ 80%**，除非 §2 某列更嚴 |

專案 rules 與每個 `{stem}-tests.md` 必須 **comply with** 基線。可加嚴，不得減少層級或降低 checklist。

## 2. 產品特定差異

只列出相對 **common-test-strategy** 的差異。團隊達成一致前，列內保留方括號占位。

| 領域 | 本專案 |
| --- | --- |
| Services under test | [範例：單一 web 應用] 或 [範例：web、agent、RAG 分包] |
| Unit / integration / E2E tools | [範例：Vitest、Testing Library、Playwright] |
| CI default | Fixture-only；每個 PR 不強制付費或 live vendor key |
| Acceptance closure | [範例：MVP 批次或 go-live checklist] 可在 demo 路徑要求 live 依賴 |
| Critical journeys | [命名 1–3 條路徑；細節在 `{stem}-tests.md`] |
| Latency budgets (optional) | [範例：fixture 下 agent 任務 P95 ≤ N s] |
| i18n assertions | 優先 `role`、`data-testid` 或 message key；不以單一語言文案為契約 |

## 3. 測試目標

寫出**產品**必須證明的結果。模組 `{stem}-tests.md` 拆成具體用例。

1. **[範例：正確性]** [領域事實與上游或 DB 一致；依賴失敗時不偽造成功。]
2. **[範例：租戶或鑑權]** [跨租戶或跨使用者資料不洩漏；吊销憑證 fail closed。]
3. **[範例：Agent 或 LLM 邊界]** [結構化輸出通過 schema 校驗；失敗使用穩定 code 或 message key。]
4. **[範例：RAG 或檢索]** [命中可追溯；空結果或降級路徑明確，不靜默編造。]
5. **[範例：可部署性]** [健康與 smoke 路徑與 [`release.md`](./release.md) 一致。]

架構無 agent、RAG 或多租戶面時，可增刪目標。

## 4. CI 預設與 acceptance closure

將**日常 CI** 與當前 MVP 或發布切片的 **acceptance** 分開。

| 活動 | Stub / fixture / mock | Demo 路徑上的真實依賴 |
| --- | --- | --- |
| PR / default CI | 為確定性與成本 **Allowed** | Not required |
| Acceptance closure for the slice | **Must not** 假裝已接 live 的整合 | Demo 用到的每個依賴 **Required** |

規則：

1. 本表適用時，**CI 全綠本身不能關閉 acceptance**。
2. 真實整合存在後的**執行時降級**允許；**從未接線**不允許。
3. Closure 檢查放在 opt-in job、手工腳本或 checklist；除非團隊提升 live job，預設 PR job 保持 fixture-first。

## 5. 金字塔與工具

目標比例與基線一致：約 **70% / 20% / 10%**（unit 或 component、integration 或 contract、E2E）。多於一個服務時按**可部署單元**估算。

| 層級 | [範例：Web] | [範例：Agent / MCP] | [範例：RAG / worker] |
| --- | --- | --- | --- |
| Unit / component | [Vitest + Testing Library] | [Vitest 或 pytest] | [與 agent 列相同] |
| Integration / contract | [Test DB；CI 中 stub sibling HTTP] | [Schema 測試；CI 中 stub LLM] | [Fixture index；CI 中可選 stub embedder] |
| E2E | [Playwright，真實瀏覽器] | [HTTP 旅程或經 web BFF 覆蓋] | [API smoke 或經 agent 旅程間接覆蓋] |

**Commands**（寫在應用倉庫）：[範例：`npm test`、`npm run test:e2e`、`make test`。]

**E2E 與動態 Web 應用**

- 使用**真實瀏覽器**（Playwright 或專案等價物）。
- assert 或 click 前等待**渲染完成**（`networkidle` 或穩定 selector）。
- 優先 **role**、accessible name、**data-testid** 或 message key，少用純版面 CSS。
- 靜態 HTML 可用 `file://` 做 smoke；動態應用用 **`make dev`**、**`make up`** 或專案 Playwright `webServer` 設定。
- 臨時檢查可在倉庫文件 **`with_server`** 輔助下執行；提交到 CI 的套件須與專案語言一致。

用例列表與檔案路徑屬於 `{stem}-tests.md`，不屬於本節。

## 6. 環境與資料

| 環境 | 用途 |
| --- | --- |
| Local | **`make up`** 或 **`make dev`**；維運持有的 env 檔案可選 real key |
| CI | 隔離測試庫或 schema；適用時使用 fixture vendor 模式 |
| Online (optional) | Live LLM、地圖或郵件 sandbox；僅 nightly 或發布前 |

**資料規則**

- 單測隔離：交易、truncate、唯一前綴或可丟棄 schema。
- 自動化不用生產資料；金鑰只在 CI secret store 或 gitignore 的 env 檔案。
- 此處可寫所需 env 變數**名稱**；spec 與 git 中**永不寫值**。

## 7. 外部依賴（CI 與 closure）

產品呼叫 LLM、地圖、郵件或其他付費 API 時，在產品級寫明策略。各工具的 stub 規則與斷言留在 `{stem}-tests.md`。

| 依賴 | 預設 CI | 切片使用時的 acceptance closure |
| --- | --- | --- |
| [範例：LLM chat / embed] | Stub 或 fake client | Real provider 或獲批 sandbox |
| [範例：Primary database] | 測試實例或 schema | 同引擎；專用 test 或 staging 庫名 |
| [範例：Vector store] | 測試 collection 或容器 | RAG 在範圍內時 closure 用真實服務 |
| [範例：Agent → RAG HTTP] | CI 允許 stub | Closure 路徑上服務間 real HTTP |

**Optional opt-in quality（非預設 PR）**

- Model 或 vision **eval** 套件、smoke 腳本與延遲探測放在倉庫，按需執行。
- 閾值與資料集寫在 `{stem}-tests.md` 或連結的 knowledge 筆記；本檔案僅說明 eval **不**替代 fixture CI，除非被提升。

## 8. 相對基線的更嚴規則

條目保持簡短；細節展開在模組測試 spec。

1. [範例：每個 agent 任務 JSON 對成功與失敗形態有 contract 測試。]
2. [範例：瀏覽器 E2E 不直連 MCP 或內部服務連接埠；只測應用 origin。]
3. [範例：產品基於 i18n key 時，UI 測試不斷言僅英文文案。]
4. [範例：跨服務 CI 可 stub HTTP；切片 closure 在 demo 路徑用 real peer。]

## 9. 模組測試 spec

每個模組擁有 **`{stem}-tests.md`**：場景、自動化映射、fixture 與 opt-in eval 細節。測試在 PBI 或 SBI 範圍內時，product backlog 與 sprint backlog 連結這些檔案。

| 模組（來自 map） | 測試 spec |
| --- | --- |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [一行範圍，範例：web UI 與 BFF] |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [範例：agent tools 與 harness] |

UI 與 MCP 拆分很重時，團隊可在**兩者共享同一基線**的前提下增加第二個產品級檔案（例如 `mcp-test-strategy.md`）；否則保留一個 `test-strategy.md`，用例拆到各 `{stem}-tests.md`。

## 10. 金鑰與誠實性

- 不要在本檔案或 `{stem}-tests.md` 中嵌入 API key、密碼或生產 URL。
- 測試不能透過 mock 掉 acceptance 聲稱當前切片已 live 的行為來通過。
- 面向使用者的錯誤走 i18n key；自動化遵循 §5 的 selector 規則。
