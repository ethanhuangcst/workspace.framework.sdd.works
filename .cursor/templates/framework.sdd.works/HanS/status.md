<!-- 本制品跟踪 sdd-scrum 过程的当前状态 -->
---
title: sdd-scrum 执行的当前状态
type: tracking-spec
status: active
as_of: 2026-09-22
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint_plan.md
related:
  - product-backlog.md
  - change-log.md
  - artifacts-map.md
  - sprint_plan.md
  - sdd-scrum-guide.md
  - sdd-scrum-practices.md
---



# sdd-scrum 过程的当前状态
## 我们现在在哪：
<!-- 本制品跟踪 sdd-scrum 过程的当前状态
Sprint 编号
SBI 编号
-->
- 当前在做哪个 Sprint：Sprint {sprint number}
- 当前在做哪条 SBI：SBI {SBI number}


## 下一步可能是：
<!-- 基于当前状态，下一步可做的事 -->
- 建议下一步 #1
- 建议下一步 #2

## 当前进行中任务
<!-- 
跟踪临时进行中任务（OGT, On-Going-Tasks）。
OGT 不同于 sprint_plan.md 中的 Sprint Backlog Items（SBI）。它们是 AI agent 执行某条 SBI 时产生的较小任务。
示例：AI agent 与用户在做 Sprint 2、SBI #2：Build UI mockups
1. Plan 模式下，AI Agent 决定用以下步骤完成 UI/UX 设计：
```
1. 使用 [skill:frontend-design] 按参考稿重构 portal.css tokens……
2. 使用 [skill:frontend-design] 收集用户反馈并据此重设计
3. 使用 [subagent:code-explorer] 找出所有引用点，然后……
4. 任务 4
5. 任务 5
```
2. 现在 AI Agent 在做任务 #1，用户反馈：
- 改 logo
- 从参考设计复制 css
- 更新 UI mockups
- 与我核实确认
3. 以上每一项都当作一条 OGT。本节用下表跟踪：

OGT for Sprint #2, SBI #2, Build UI mockups:
| # | On-going Task | Status |
| --- | --- | --- |
| 1 | change logo | Done |
| 2 | copy css from reference design | Done |
| 3 | update UI mockups, adding more updates based on further inputs from the user | On-going |
| 4 | verify and confirm with me, use provided new inputs | On-going |

-->
OGT for Sprint #{current sprint}, SBI #{current SBI}, {SBI name}:
| # | On-going Task | Status |
| --- | --- | --- |
| 1 | task name | status (ToDO, WIP, Done) |
