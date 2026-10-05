v.0.1.0

## What the framework does

- Provide a guide and practice book for SDD-Scrum: Spec-Driven Development with Scrum for agentic programming under Harness Engineering.
- Install framework artifacts that set boundaries for AI agents — rules, skills, and related assets — in your agent tools.
- On-board an AI agent coach: ethan.

## Features

### Agents

- ethan — The AI agent for the SDD-Scrum framework.

### Skills

- sdd-atdd — Acceptance Test Driven Development: User Story Mapping with User Stories and Acceptance Criteria.
- sdd-update-project — Start a project and update project settings in the agent tools under SDD-Scrum, including the specs folder path. Repair a missing or wrong artifacts map without overwriting process files that already have content.
- sdd-refine-backlog — Refine the Product Backlog: elaborate the initial requirement, create PBIs, and add User Stories and Acceptance Criteria.
- sdd-plan-sprint — Plan a sprint: assign PBIs across sprints, check coverage and traceability, and break PBIs into granular SBIs.
- sdd-tracking — Track and update real-time status, including temporary OGT (On-going Tasks).
- sdd-retrospective — Run a retrospective between a developer and the agents, or between agents.
- sdd-close-sprint — Close a sprint.
- sdd-audit-artifacts — Read the workspace index and the process files. Return whether the project is uninitialized, the index is broken, or the index is usable. Do not edit files.
- sdd-review-status — Read the five process files and propose the next-step options they support. Do not edit files.
- sdd-update-specs — Keep specs aligned with the implementation.
- sdd-spec-to-build — Spec then build one SBI: consolidate the requirement, finish the design, and implement that SBI to DoD and its acceptance criteria.

### Rules

- sdd-dod.mdc — Definition of Done; process writes on close.
- sdd-incremental-delivery.mdc — Finish one SBI before starting the next.
- sdd-realtime-status.mdc — WIP checkpoints; keeps process files aligned while work is not Done.
- friendly-language.mdc — Keep chat and Markdown readable for the user and for later agents.

## Artifacts

### Core artifacts

- scrum-in-sdd.md — Single source of truth for the SDD-Scrum framework.
- sdd-scrum-practices.md — Single source of truth for Harness Engineering and SDD practices when developers work with AI agents.
- artifacts-map.json — Where this project's artifacts live. Sits at the workspace root.

### Framework (process) artifacts

- product-backlog.md — Product Backlog.
- sprint-backlog.md — Sprint Backlog.
- status.md — Project snapshot; updated on DoD close or when the user asks.
- changes-log.md — Change history.

### Engineering artifacts

- architecture.md — Engineering artifact template.
- {stem}-stories.md — User stories and acceptance criteria.
- {stem}-design.md — Design spec.
- {stem}-tests.md — Test spec.
- release.md — Local startup and go-live order.
- test-strategy.md — Product-level test strategy.
- .secrets — Dotenv-shaped secret registry (empty `NAME=`; `#` says where values live). No values in git.
- issues-log.md — Defect record. One of the five process files the audit opens.
