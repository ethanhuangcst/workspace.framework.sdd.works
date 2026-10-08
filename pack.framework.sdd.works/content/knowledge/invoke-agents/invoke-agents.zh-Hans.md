# 各 IDE 如何启动自定义智能体（Ethan）

框架包自带 `agents/ethan.md`。各 IDE 从自己的目录读这类文件。本文说明文件放哪、怎么启动 Ethan、什么时候要再次唤起 Ethan（下一句谁回）。

**本仓库已实测（2026-09-30）：** Cursor、TRAE、TRAE CN。

**仅依据厂商文档（同日）：** Claude Code、CodeBuddy CN、Cline、Codex、Copilot CLI。

**通用说明**

- Onboard 在 Ethan 第一次进对话时跑（按提示读 ledger、做审计）。新开一个对话可能再跑一遍 Onboard。
- Codex 用 `*.toml` 定义智能体。Copilot CLI 用 `*.agent.md`。只放一份 `ethan.md` 在这两个工具里不会生效。

## 再次唤起 Ethan（三种情况）

| 模式 | 说明 |
| --- | --- |
| 同一对话 | 不换会话，在这条对话里继续聊。Ethan 一直回，直到你新开对话。 |
| 单次任务 | Ethan 干完一件事。主助手接下一句。下一件事要再唤起 Ethan。 |
| 独立会话 | Ethan 在另一条对话里跑。主对话通常还是主助手在回。 |

## Cursor

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.cursor/agents/ethan.md` 或 `<项目>/.cursor/agents/ethan.md`（项目里优先）。Frontmatter 的 `name` 就是斜杠命令 `/ethan`。`templates/` 下的文件不算智能体。 |
| 启动 Ethan | 输入 `/ethan`，一般放在对话开头。 |
| 再次唤起 Ethan | 同一对话。这条对话里的追问还是 Ethan。 |
| 新对话 | 直接打字不会进 Ethan。要再输 `/ethan`。Onboard 可能再跑一遍。 |

## TRAE

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.trae/agents/ethan.md` |
| 前置设置 | 设置 → Beta → 打开 Subagents。 |
| 启动 Ethan | 输入 `@`。内置助手会在你的描述匹配文件里的 `description` 时调用 Ethan。`/ethan` 不能用。 |
| 再次唤起 Ethan | 独立会话。文档没保证主对话会一直停在 Ethan 上。 |

## TRAE CN

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.trae-cn/agents/ethan.md` |
| 前置设置 | 设置 → Beta → Subagents → 启用 Subagents 目录。 |
| 启动 Ethan | `@` 或 @智能体。描述匹配 `description` 时由内置助手调用。`/ethan` 不能用。 |
| 再次唤起 Ethan | 独立会话。与 TRAE 相同。 |

## Claude Code

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.claude/agents/` 或 `.claude/agents/`（Markdown）。斜杠命令在 `commands/`，不在 `agents/`。 |
| 启动 Ethan（单次） | 正文里提到 Ethan，或 `@` 后选 Ethan。 |
| 再次唤起 Ethan（单次） | 单次任务。下一句是主 Claude。Ethan 看不到整段主对话。 |
| 启动 Ethan（整段会话） | 运行 `claude --agent ethan` |
| 再次唤起 Ethan（整段会话） | 同一对话。这个终端会话里普通输入都给 Ethan，直到退出或删掉智能体文件。 |
| 备注 | `/agents` 只是提醒你去看 agents 目录（v2.1.198）。 |

## CodeBuddy CN

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.codebuddy/agents/`（用户或项目级）。`/ethan` 这类斜杠命令在 `commands/`，不在 `agents/`。 |
| 启动 Ethan（自动委派） | 主助手在任务匹配 `description` 时委派给 Ethan。 |
| 再次唤起 Ethan（自动委派） | 单次任务。主助手占着对话，直到再次委派。 |
| 启动 Ethan（手动） | 在 Agent 框里选 Ethan。 |
| 再次唤起 Ethan（手动） | 同一对话。直到你换别的智能体。 |
| CLI 单次 | 提示词里点名 Ethan，或用 `--agents` JSON 跑一轮。 |
| CLI 整段 | `--agent ethan`。该会话后续输入都给 Ethan。 |

## Cline

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.cline/agents/` 或项目 `.cline/agents/`。`~/.cline/data/settings/agents/` 是插件另一套路径。 |
| 启动 Ethan | 主会话用预设 `name` 调 `start_subagent`。没有斜杠命令能在当前对话里切成 Ethan。 |
| 再次唤起 Ethan | 独立会话。追问要带 subagent 的 session id。新任务得重新调。 |

## Codex

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.codex/agents/*.toml` 或 `.codex/agents/*.toml`（含 `name`、`description`、`developer_instructions`）。不是 `ethan.md`。 |
| 启动 Ethan | 让 Codex 委派到 TOML 里的 `name`。 |
| 再次唤起 Ethan | 独立会话。每次委派都是新实例。`/agent` 只切换已有线程，不会新建智能体。 |
| 已知限制 | 有些会话按名字拉不起项目智能体（GitHub #15250、#26408）。 |

## Copilot CLI

| 项目 | 说明 |
| --- | --- |
| 智能体文件 | `~/.copilot/agents/*.agent.md` 或 `.github/agents/*.agent.md`（用户级覆盖仓库）。Id 为去掉 `.agent.md` 的文件名（如 `ethan.agent.md`）。 |
| 启动 Ethan（交互） | `/agent` 选配置，或在提示词里写 Ethan。 |
| 再次唤起 Ethan（交互） | 文档没写会一直保持该配置。要再 `/agent` 或在提示词里点名 Ethan。 |
| 单次命令 | `copilot --agent=ethan --prompt "..."` |
