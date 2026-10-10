# 如何调用 Agent Skills（SDD 框架包）

框架包在完整 MCP 安装时自带 `skills/` 目录。每个技能是一个含 `SKILL.md` 的文件夹。规则在 `rules/` 下，扩展名为 `.mdc`。各 IDE 从自己的路径加载技能和规则。本文说明技能放哪、如何在对话里挂上技能、以及模型何时会按技能执行。

**本仓库已实测（2026-10-08）：** Cursor（桌面版对话与 Agent）。

**仅依据厂商文档（同日）：** Claude Code 的 `.claude/skills/`。

**通用说明**

- 技能是给宿主模型用的说明。宿主决定何时读 `SKILL.md`（附件、@ 提及或工具发现）。
- 包安装会把技能复制到你工具使用的客户端目录（Cursor 常见为 `~/.cursor/skills/` 或 `<项目>/.cursor/skills/`）。
- Lite HTTP 安装只带一部分构建辅助技能以及 `friendly-language.mdc`（见「功能」内容页）。
- 在对话里使用的技能 **名称** 应对应文件夹名（例如 `sdd-retrospective`，不是展示标题）。

## Cursor

| 项目 | 说明 |
| --- | --- |
| 技能目录 | `~/.cursor/skills/<name>/SKILL.md` 或 `<项目>/.cursor/skills/<name>/SKILL.md`。同名时项目技能可覆盖用户技能。 |
| 规则 | `~/.cursor/rules/*.mdc` 或 `<项目>/.cursor/rules/*.mdc`。常驻规则无需挂技能也会生效。 |
| 对话中挂载 | 用 **@** 选技能，或在界面列出技能时用 `/` 选择。Agent 模式下也可从技能选择器附加。 |
| Agent 行为 | 附加后，模型应在该轮开始时读取 `SKILL.md`，并按其中流程执行（能力、限制与确认门）。 |
| 包内技能 | SDD 流程类技能（`sdd-dod`、`sdd-plan-sprint`、`sdd-retrospective` 等）在包的 `skills/` 树中。先同步或 MCP 安装，再指望选择器里出现。 |
| 再次调用 | 同一会话在去掉附件或新开对话前会保留上下文。换技能时在下一轮附加新技能即可。 |

## Claude Code

| 项目 | 说明 |
| --- | --- |
| 技能目录 | `~/.claude/skills/<name>/SKILL.md` 或 `<项目>/.claude/skills/<name>/SKILL.md`。 |
| 启动 | 按 Claude Code 文档用斜杠或技能命令调用。 |
| 再次调用 | 同一会话有效，直到换技能或开新会话。 |

## 何时用技能、何时普通对话

| 场景 | 建议 |
| --- | --- |
| 在过程文件上关闭 SBI、冲刺或 RID | **sdd-retrospective** 或 `sdd-dod.mdc` 点名的流程技能 |
| 写代码前的工程就绪 | **sdd-spec-to-build** |
| 跨 UI 与 API 的一个 Web 功能 | **fullstack-engineer**（随任务附加） |
| 仅要 AI 或 RAG 架构建议 | **ai-architect** 或 **rag-expert**（咨询；除非你要求，否则不写基础设施） |
| 快速改措辞 | **improve-prompt**（返回可粘贴文本；不替你执行任务） |

## 包内索引

`templates/framework.sdd.works/constants.json` 列出客户端根目录上应有的技能键。安装后若缺键，在依赖选择器之前请重新 MCP 安装或从包 tarball 复制对应技能文件夹。
