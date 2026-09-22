---
title: SDD Scrum 指南
type: framework-guide
status: stub
as_of: 2026-09-22
related:
  - sdd-scrum-practices.md
  - product-backlog.md
  - artifacts-map.md
  - status.md
---

# SDD Scrum 指南

本文件是 Spec-Driven Development（SDD）中精炼 Scrum 框架的**名称与含义**唯一真源：术语、制品与事件。

做什么、怎么做、何时做（含八项 agent 工作）见 [`sdd-scrum-practices.md`](./sdd-scrum-practices.md)。该文件**不**重新定义术语。

内容分三个 MVP 填写。空节不要当作已完成。

## 1. 术语

**OGT**（on-going task，进行中任务）：执行某条 SBI 时产生的较小任务。OGT 行只写在 [`status.md`](./status.md)，绝不写入 Sprint Backlog。

*（MVP 1 — 其余术语待写）*

## 2. 制品

**过程**（至少）：产品待办、迭代待办（Sprint Backlog）、制品索引。

**跟踪**（不是第二份 Sprint Backlog）：[`status.md`](./status.md)（当前 Sprint、当前 SBI、下一步、OGT 表）与 [`change-log.md`](./change-log.md)（结论级变更）。

**知识**（框架；回顾技能使用）：[`adr/`](./adr/) 记录持久决策，[`knowledge/`](./knowledge/) 记录非决策本身的可复用笔记。需要时再建这些目录；它们不是可选的产品附属物。

**可选 / JIT**：architecture、deployment，以及 `{component}-stories` / `{component}-design` / `{component}-test` 非必需。项目需要时再添加；教练稍后提供即时指导。本项目实例只列在 [`artifacts-map.md`](./artifacts-map.md)。

**种子 vs 工作副本**：`.cursor/templates/framework.sdd.works/<locale>/` 下的文件是种子。制品根目录（默认 `specs/`）下的过程、跟踪与知识文件是工作副本。不要把种子当作运行中的过程。何时复制或刷新见 [`sdd-scrum-practices.md`](./sdd-scrum-practices.md#templates)。

*（MVP 1 — 各一句话角色；MVP 3 — 维护规则）*

## 3. 事件

至少命名：`plan`、`track`、`retrospective`。

*（MVP 1 — 仅名称；MVP 2 — 定义与各事件调用的技能）*

## 4. 待决

*（MVP 1 — 列出开放问题。）*
