# 框架简介

Scrum in SDD：定义与 Scrum 对齐的规格驱动开发（SDD）方法。
SDD.works：可安装的框架包，在 Harness Engineering 治理下实施 Scrum in SDD。

---
## 智能体


| 名称  | 角色                                   |
| ----- | -------------------------------------- |
| ethan | 本地 Scrum in SDD 教练；不安装框架包 |


## 技能（Scrum 与流程）


| 名称                | 角色                                                         |
| ------------------- | ------------------------------------------------------------ |
| sdd-update-project  | 设置规格目录与模块映射；确认后写入 `artifacts-map.json`      |
| sdd-audit-artifacts | 只读审计：未初始化、索引损坏或可用                             |
| sdd-review-status   | 对照五份过程文件并给出下一步建议                               |
| sdd-refine-backlog  | 审查产品待办就绪度；用户选定后再写入                           |
| sdd-plan-sprint     | 将 PBI 分配到冲刺；同一技能覆盖冲刺开启与关闭                  |
| sdd-retrospective   | DoD 后、冲刺结束或按需进行回顾                                 |
| sdd-spec-to-build   | 单个 SBI 的工程就绪后再构建                                    |
| sdd-update-specs    | 使工程规格与实现保持一致                                       |
| atdd-expert         | 用户故事与 Gherkin 验收标准                                    |
| sdd-build-agent     | 确认后创建或修订智能体文件                                     |
| sdd-create-skill    | 确认后创建或修订技能文件                                       |
| sdd-create-rule     | 确认后创建或修订规则文件                                       |




## 技能（构建辅助）


| 名称               | 角色                           |
| ------------------ | ------------------------------ |
| testing-expert     | 测试策略、分层与执行           |
| fullstack-engineer | 按项目技术栈端到端交付 Web 功能 |
| frontend-developer | UI 组件、页面与客户端 wiring     |
| frontend-designer  | 新建或改版 UI 的视觉设计         |
| ai-architect       | AI 与 ML 系统设计              |
| rag-expert         | RAG 架构与建议                 |
| mcp-expert         | MCP 服务器设计与集成           |
| improve-prompt     | 改写草稿提示词供粘贴使用         |




## 规则


| 文件                         | 角色                           |
| ---------------------------- | ------------------------------ |
| sdd-dod.mdc                  | 完成定义（DoD）；待办关闭时写入 |
| sdd-incremental-delivery.mdc | 完成一个 SBI 后再开始下一个    |
| sdd-realtime-status.mdc      | 过程文件的 WIP 检查点          |
| friendly-language.mdc        | 清晰的对话与 Markdown 文案     |




## 产物



### 框架产物


| 文件                   | 角色                                   |
| ---------------------- | -------------------------------------- |
| pack-scrum-in-sdd.md   | Scrum in SDD 的名称与含义              |
| sdd-scrum-practices.md | 每项工作的内容、方式与时机             |
| artifacts-map.json     | 工作区根目录的索引                     |
| constants.json         | 技能键、规则键、说明页 URL             |




### 流程产物（五份文件）


| 文件               | 角色                     |
| ------------------ | ------------------------ |
| product-backlog.md | PBI 与产品完成定义       |
| sprint-backlog.md  | 冲刺目标、SBI 与 RID     |
| status.md          | 当前项与进行中的 OGT     |
| changes-log.md     | 已交付变更历史           |
| issues-log.md      | 缺陷记录                 |




### 工程产物（按模块）


| 模式                | 角色                           |
| ------------------- | ------------------------------ |
| `{stem}-stories.md` | 用户故事与验收标准             |
| `{stem}-design.md`  | 设计规格                       |
| `{stem}-tests.md`   | 测试规格                       |
| architecture.md     | 产品架构模板                   |
| release.md          | 本地启动与上线顺序             |
| test-strategy.md    | 产品测试策略                   |
| `.secrets`          | 仅密钥名称；值保存在 git 之外 |
