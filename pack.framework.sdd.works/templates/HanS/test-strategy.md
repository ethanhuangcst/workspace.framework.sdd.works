# 测试策略 — [product name]

> **Purpose**：产品级质量基线：在 common-test-strategy 上的扩展、测试金字塔、工具、环境与 CI 策略，以及命名的关键用户路径。Optional / JIT（非必填流程工件）。
> **Practices**：[`sdd-scrum-practices.md`](../sdd-scrum-practices.md)（做什么、怎么做、何时做）。
> **Framework**：[`pack-scrum-in-sdd.md`](../pack-scrum-in-sdd.md)（名称与含义）。

本文件只写**产品级**测试策略：整体验证什么、各层与 CI 如何分工。**详细测试计划、场景列表与逐条映射**（stories、文件、Gherkin、分层断言）放在 `{workspace}/artifacts-map.json` 所指的模块 **`{stem}-tests.md`** 中。不要在此重复用例；链接模块 spec，本文件保持策略深度。

| 文档 | 作用 |
| --- | --- |
| **common-test-strategy**（agent rule） | 基线金字塔、TDD、质量 checklist |
| [`test-strategy.md`](./test-strategy.md) | 产品级门禁、工具、CI 与 acceptance closure |
| [`{module}/{stem}-tests.md`](./[module]/[stem]-tests.md) | 模块测试计划与用例（路径按 map 替换） |
| [`architecture.md`](./architecture.md) | 服务、边界、部署形态 |
| [`release.md`](./release.md) | 部署后 smoke 路径 |

与 [`architecture.md`](./architecture.md) 对齐。`{stem}-stories.md` 中的 acceptance criteria 驱动 `{stem}-tests.md` 中的用例；本文件不重复 AC。

## 1. 基线

| 项 | 本产品 |
| --- | --- |
| Extends **common-test-strategy** | **Yes** |
| Weakens pyramid or quality checklist | **No** |
| Conflict resolution | 采用**更严格**的解释 |
| Coverage (when measurable) | 变更关键路径 **100%**；整体 **≥ 80%**，除非 §2 某行更严 |

项目 rules 与每个 `{stem}-tests.md` 必须 **comply with** 基线。可加严，不得减少层级或降低 checklist。

## 2. 产品特定差异

只列出相对 **common-test-strategy** 的差异。团队达成一致前，行内保留方括号占位。

| 领域 | 本项目 |
| --- | --- |
| Services under test | [示例：单一 web 应用] 或 [示例：web、agent、RAG 分包] |
| Unit / integration / E2E tools | [示例：Vitest、Testing Library、Playwright] |
| CI default | Fixture-only；每个 PR 不强制付费或 live vendor key |
| Acceptance closure | [示例：MVP 批次或 go-live checklist] 可在 demo 路径要求 live 依赖 |
| Critical journeys | [命名 1–3 条路径；细节在 `{stem}-tests.md`] |
| Latency budgets (optional) | [示例：fixture 下 agent 任务 P95 ≤ N s] |
| i18n assertions | 优先 `role`、`data-testid` 或 message key；不以单一语言文案为契约 |

## 3. 测试目标

写出**产品**必须证明的结果。模块 `{stem}-tests.md` 拆成具体用例。

1. **[示例：正确性]** [领域事实与上游或 DB 一致；依赖失败时不伪造成功。]
2. **[示例：租户或鉴权]** [跨租户或跨用户数据不泄漏；吊销凭证 fail closed。]
3. **[示例：Agent 或 LLM 边界]** [结构化输出通过 schema 校验；失败使用稳定 code 或 message key。]
4. **[示例：RAG 或检索]** [命中可追溯；空结果或降级路径明确，不静默编造。]
5. **[示例：可部署性]** [健康与 smoke 路径与 [`release.md`](./release.md) 一致。]

架构无 agent、RAG 或多租户面时，可增删目标。

## 4. CI 默认与 acceptance closure

将**日常 CI** 与当前 MVP 或发布切片的 **acceptance** 分开。

| 活动 | Stub / fixture / mock | Demo 路径上的真实依赖 |
| --- | --- | --- |
| PR / default CI | 为确定性与成本 **Allowed** | Not required |
| Acceptance closure for the slice | **Must not** 假装已接 live 的集成 | Demo 用到的每个依赖 **Required** |

规则：

1. 本表适用时，**CI 全绿本身不能关闭 acceptance**。
2. 真实集成存在后的**运行时降级**允许；**从未接线**不允许。
3. Closure 检查放在 opt-in job、手工脚本或 checklist；除非团队提升 live job，默认 PR job 保持 fixture-first。

## 5. 金字塔与工具

目标比例与基线一致：约 **70% / 20% / 10%**（unit 或 component、integration 或 contract、E2E）。多于一个服务时按**可部署单元**估算。

| 层级 | [示例：Web] | [示例：Agent / MCP] | [示例：RAG / worker] |
| --- | --- | --- | --- |
| Unit / component | [Vitest + Testing Library] | [Vitest 或 pytest] | [与 agent 列相同] |
| Integration / contract | [Test DB；CI 中 stub  sibling HTTP] | [Schema 测试；CI 中 stub LLM] | [Fixture index；CI 中可选 stub embedder] |
| E2E | [Playwright，真实浏览器] | [HTTP 旅程或经 web BFF 覆盖] | [API smoke 或经 agent 旅程间接覆盖] |

**Commands**（写在应用仓库）：[示例：`npm test`、`npm run test:e2e`、`make test`。]

**E2E 与动态 Web 应用**

- 使用**真实浏览器**（Playwright 或项目等价物）。
- assert 或 click 前等待**渲染完成**（`networkidle` 或稳定 selector）。
- 优先 **role**、accessible name、**data-testid** 或 message key，少用纯布局 CSS。
- 静态 HTML 可用 `file://` 做 smoke；动态应用用 **`make dev`**、**`make up`** 或项目 Playwright `webServer` 配置。
- 临时检查可在仓库文档 **`with_server`** 辅助下运行；提交到 CI 的套件须与项目语言一致。

用例列表与文件路径属于 `{stem}-tests.md`，不属于本节。

## 6. 环境与数据

| 环境 | 用途 |
| --- | --- |
| Local | **`make up`** 或 **`make dev`**；运维持有的 env 文件可选 real key |
| CI | 隔离测试库或 schema；适用时使用 fixture vendor 模式 |
| Online (optional) | Live LLM、地图或邮件 sandbox；仅 nightly 或发布前 |

**数据规则**

- 单测隔离：事务、truncate、唯一前缀或可丢弃 schema。
- 自动化不用生产数据；密钥只在 CI secret store 或 gitignore 的 env 文件。
- 此处可写所需 env 变量**名称**；spec 与 git 中**永不写值**。

## 7. 外部依赖（CI 与 closure）

产品调用 LLM、地图、邮件或其他付费 API 时，在产品级写明策略。各工具的 stub 规则与断言留在 `{stem}-tests.md`。

| 依赖 | 默认 CI | 切片使用时的 acceptance closure |
| --- | --- | --- |
| [示例：LLM chat / embed] | Stub 或 fake client | Real provider 或获批 sandbox |
| [示例：Primary database] | 测试实例或 schema | 同引擎；专用 test 或 staging 库名 |
| [示例：Vector store] | 测试 collection 或容器 | RAG 在范围内时 closure 用真实服务 |
| [示例：Agent → RAG HTTP] | CI 允许 stub | Closure 路径上服务间 real HTTP |

**Optional opt-in quality（非默认 PR）**

- Model 或 vision **eval** 套件、smoke 脚本与延迟探测放在仓库，按需运行。
- 阈值与数据集写在 `{stem}-tests.md` 或链接的 knowledge 笔记；本文件仅说明 eval **不**替代 fixture CI，除非被提升。

## 8. 相对基线的更严规则

条目保持简短；细节展开在模块测试 spec。

1. [示例：每个 agent 任务 JSON 对成功与失败形态有 contract 测试。]
2. [示例：浏览器 E2E 不直连 MCP 或内部服务端口；只测应用 origin。]
3. [示例：产品基于 i18n key 时，UI 测试不断言仅英文文案。]
4. [示例：跨服务 CI 可 stub HTTP；切片 closure 在 demo 路径用 real peer。]

## 9. 模块测试 spec

每个模块拥有 **`{stem}-tests.md`**：场景、自动化映射、fixture 与 opt-in eval 细节。测试在 PBI 或 SBI 范围内时，product backlog 与 sprint backlog 链接这些文件。

| 模块（来自 map） | 测试 spec |
| --- | --- |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [一行范围，示例：web UI 与 BFF] |
| [`[module]/[stem]-tests.md`](./[module]/[stem]-tests.md) | [示例：agent tools 与 harness] |

UI 与 MCP 拆分很重时，团队可在**两者共享同一基线**的前提下增加第二个产品级文件（例如 `mcp-test-strategy.md`）；否则保留一个 `test-strategy.md`，用例拆到各 `{stem}-tests.md`。

## 10. 密钥与诚实性

- 不要在本文件或 `{stem}-tests.md` 中嵌入 API key、密码或生产 URL。
- 测试不能通过 mock 掉 acceptance 声称当前切片已 live 的行为来通过。
- 面向用户的错误走 i18n key；自动化遵循 §5 的 selector 规则。
