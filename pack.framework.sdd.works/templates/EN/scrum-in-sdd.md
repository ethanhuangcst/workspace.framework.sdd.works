# Scrum in SDD

> Type: Core artifact of framework.sdd.works
> as_of: 2026-10-08
> [Definition](./sdd-scrum-practices.md#terminology-in-practice)

**Author:** Ethan Huang

© 2026 Ethan Huang

This document defines how Scrum is adopted in Spec-Driven Development, with Agentic Programming under Harness Engineering principles.

The Scrum Guide defines Scrum. This document does not replace it.

Read **Part I** through **Part III** for SDD and the Scrum in SDD definition. **Part IV** is the 2020 Scrum Guide summary at the end as reference.

- **Part I** names Agentic Programming, Harness Engineering, and Spec-Driven Development.
- **Part II** states what classic Scrum does not cover in that setting.
- **Part III** is the definition: what stays, what is added, and what changes.
- **Part IV** summarizes the 2020 Scrum Guide. That summary is the baseline.

## Index

- [Part I Agentic Programming, Harness Engineering, and Spec-Driven Development (SDD) aligned with Agile practices](#part-i-agentic-programming-harness-engineering-and-spec-driven-development-sdd-aligned-with-agile-practices)
  - [Agentic Programming](#agentic-programming)
  - [Harness Engineering](#harness-engineering)
  - [Spec-Driven Development (SDD)](#spec-driven-development-sdd)
  - [Implementing Harness Engineering Principles with SDD](#implementing-harness-engineering-principles-with-sdd)
  - [Integrating eXtreme Programming practices with SDD](#integrating-extreme-programming-practices-with-sdd)
  - [Integrating Scrum with SDD](#integrating-scrum-with-sdd)
- [Part II The Gap in Classic Scrum When Implementing Agentic Programming with SDD](#part-ii-the-gap-in-classic-scrum-when-implementing-agentic-programming-with-sdd)
  - [SDD concepts that need to be added into scrum implementation](#sdd-concepts-that-need-to-be-added-into-scrum-implementation)
  - [Scrum concepts that need to be modified in Scrum in SDD](#scrum-concepts-that-need-to-be-modified-in-scrum-in-sdd)
- [Part III Scrum in SDD Guide](#part-iii-scrum-in-sdd-guide)
  - [Purpose](#purpose)
  - [Audience](#audience)
  - [How to read this guide](#how-to-read-this-guide)
  - [Terminology](#terminology)
  - [KEEP - what remains unchanged](#keep---what-remains-unchanged)
  - [ADD - what is added](#add---what-is-added)
  - [MODIFY: What changes](#modify-what-changes)
  - [Minimum Scrum in SDD setup](#minimum-scrum-in-sdd-setup)
  - [Operating principles](#operating-principles)
- [Part IV The 2020 Scrum Guide Summary](#part-iv-the-2020-scrum-guide-summary)
  - [Purpose of the Scrum Guide](#purpose-of-the-scrum-guide)
  - [Scrum Definition](#scrum-definition)
  - [Scrum Theory](#scrum-theory-1)
  - [Scrum Values](#scrum-values-1)
  - [Scrum Team](#scrum-team)
  - [Scrum Events](#scrum-events-2)
  - [Scrum Artifacts](#scrum-artifacts-2)
  - [End Note](#end-note)

# **Part I** Agentic Programming, Harness Engineering, and Spec-Driven Development (SDD) aligned with Agile practices

With **Agentic Programming** and **Spec-Driven Development**, under **Harness Engineering principles**, software delivery is fundamentally reshaped.

**Relationship to Agentic Programming, SDD and Harness Engineering:** **Agentic Programming** is the broader paradigm of using AI agents in software work. **Harness Engineering** is the infrastructure that makes it operational. **SDD** is the methodological approach within that paradigm, in which agents work from specifications as the **source of truth**.

**They naturally align with Agile practices such as Scrum, Extreme Programming (XP), Behavior-Driven Development (BDD), and Acceptance Test-Driven Development (ATDD).**

## Agentic Programming

**Agentic Programming** is a software development approach in which **AI agents** act not merely as passive code assistants, but as **active collaborators** in the engineering workflow: **planning, coding, testing, debugging, reviewing**, and sometimes operating software, with autonomy bounded by **human-defined goals, constraints, and oversight**.

## Harness Engineering

**Harness Engineering** is the discipline of designing the **runtime framework** that enables AI agents to operate **reliably, safely, and effectively** in real-world environments. It includes **tool integration, execution orchestration, context and memory management, permissions and guardrails, observability, and human oversight**.

- **Tool integration**: connects agents to files, APIs, and systems
- **Execution orchestration**: manages planning, action, checking, and retries
- **Context and memory**: controls what the agent knows and retains
- **Permissions and guardrails**: constrain actions and reduce risk
- **Observability and oversight**: support monitoring, evaluation, and human intervention


## Spec-Driven Development (SDD)

**Spec-Driven Development (SDD)** is an approach within agentic programming in which the **specification** is the **primary artifact**: requirements, behaviors, interfaces, constraints, and acceptance criteria are defined first, and implementation follows from the spec.

- **Start with the spec**: define goals, workflows, tools, inputs/outputs, guardrails, and success criteria.
- **Turn intent into structure**: define roles, rules, permissions, memory, and failure handling.
- **Implement from the spec**: generate code, prompts, tool wrappers, tests, and orchestration.
- **Derive tests from the spec**: define acceptance criteria, eval cases, and edge cases.
- **Iterate at the spec layer first**: update the spec before patching implementation.
- **Clarify multi-agent work**: align planner, coder, reviewer, and tester on one source of truth.
- **Reduce drift and ambiguity**: make constraints explicit.
- **Improve automation**: generate code, tests, docs, and validation more easily.

## Implementing Harness Engineering Principles with SDD

In **Spec-Driven Development (SDD)**, the **specification** defines behavior, constraints, and acceptance criteria. It is the **source of truth** for both implementation and evaluation, and under **Harness Engineering principles**, it is operationalized through several connected layers:

- **Rules**: constrain execution.  
- **Skills**: provide reusable capabilities.  
- **Agents**: execute tasks against the spec.  
- **Workflows**: coordinate actions and handoffs.  
- **Knowledge**: ground execution in relevant context.  

Together, these layers turn **specifications** into **reliable execution**.

## Integrating eXtreme Programming practices with SDD

In **SDD**, **eXtreme Programming (XP)** practices can be embedded in the **harness** so humans and AI agents follow consistent engineering standards, including:

- **ATDD**: define acceptance tests from the spec before implementation.
- **TDD**: write tests first, then implement to pass them.
- **Pair Programming**: human-agent or agent-agent collaboration during development.
- **CI/CD**: continuously validate, integrate, and deliver changes.
- **Test Automation**: automatically run unit, integration, and end-to-end tests.
- **Refactoring**: improve code structure without changing specified behavior.

## Integrating Scrum with SDD

**Scrum** sets the delivery rhythm. **SDD** keeps the spec as the source of truth.

- **Product Backlog**: requirements and acceptance criteria.
- **Sprint Backlog**: what this sprint will make true, and who does it.
- **Increment**: the result that meets the spec and the Definition of Done.
- **Events**: Planning, Daily Scrum, Review, and Retrospective stay. Humans and agents both take part.
- **Definition of Done**: a rule, applied before the item is done.
- **Incremental delivery**: finish one sprint item before starting the next.
- **Spec first**: a behavior change starts in the spec. The sprint implements it.

### How humans collaborate with AI agents in this approach

**Humans** define and govern the **harness**; **AI agents** operate within it. Humans specify not only **what** should be built, but also **how** agents may work.

- **Humans define the harness**: rules, skills, workflows, agent roles, and knowledge boundaries.
- **Humans define the spec**: goals, constraints, business rules, and acceptance criteria.
- **AI helps formalize and execute**: refine specs, implement, test, and iterate within the harness.
- **Humans validate and supervise**: review outputs, resolve ambiguity, approve sensitive actions, and update the source of truth.
- **AI provides feedback**: compare outcomes against the spec and surface gaps or failures.

[Back to top](#index)

# **Part II** The Gap in Classic Scrum When Implementing Agentic Programming with SDD

When implementing **SDD** under **Harness Engineering principles**, gaps emerge that change the **Scrum definition**.

## SDD concepts that need to be added into scrum implementation

Harness layers and SDD artifacts are added to classic Scrum. The authoritative lists are in **Part III** under **ADD - what is added**.

- **Rules** constrain close, incremental delivery, WIP status, and readable Markdown.
- **Skills** cover backlog, sprint, spec, audit, and build jobs.
- **Agents**: scrum-master (**ethan** in this service).
- **Workflows**: placeholder until a job needs a defined handoff sequence.
- **Knowledge**: ADR and knowledge trees at paths from `artifacts-map.json`.
- **Artifacts**: core, framework, engineering, and pack files (detail in Part III).

[Back to top](#index)

## Scrum concepts that need to be modified in Scrum in SDD

### Scrum Team and Scrum Accountabilities
- **Teams** can be much smaller: often one **Product Owner** and a few **full-stack engineers**, with one also serving as **Scrum Master**.
- **Scrum roles** can include both **humans and AI agents**.
- Traditional **Scrum Master** responsibilities can be largely delegated to **AI agents**.
- **Additional Scrum Master responsibilities**: uphold **Harness Engineering principles** across **Rules, Skills, Workflows, Agents, and Knowledge**.

#### Developers
- **Humans and AI agents** who create a **usable Increment** each Sprint.
- Adapt plans in real time toward the **Sprint Goal**.
- Human members remain **professionally accountable**.
- Human members **train and manage AI agents**.

#### Product Owner

- Remains **accountable** even when work is delegated to **AI agents**.
- **One person**, assisted by AI agents, **not a committee**.

#### Scrum Master
- **Traditional Scrum Master responsibilities** can be distributed across **Scrum accountabilities**.
- **AI agents** can support **coaching, impediment removal, Scrum events, Product Goal definition, Product Backlog management, and Scrum adoption**.
- Additional responsibilities include **upholding Harness Engineering principles, managing knowledge, and continuously improving Scrum in SDD**.

### Scrum Events

#### The Sprint
- **Sprints** may no longer be **fixed-length**.
- They may last only a **few hours**, making fixed cadence less meaningful.

#### Sprint Planning
- **Sprint Planning** can take only a **few minutes**: AI agents update the **Sprint Backlog**, and humans review and confirm it.

#### Daily Scrum
- The classic **Daily Scrum** might still be needed.
- But more frequent **Inspection and adaptation** between human and agents can happen continuously in **real time**.
- With **sdd-dod.mdc**, closing a task or SBI runs the retrospective gate and updates **status.md** when the close applies.

#### Sprint Review

#### Sprint Retrospective
- **Retrospective** has three forms; the latter two are captured as ADR or Knowledge by the **sdd-retrospective** skill.
1. **Sprint-end**: the classic human-human retrospective.
2. **On demand**: a human-agent retrospective initiated by a human.
3. **By rule**: an agent-agent retrospective triggered before work is marked done. The record names the incident that fired the rule, such as `feature-01 done`.

- **Retrospectives** have **four triggers**:
1. **Sprint-end**.
2. **On demand**.
3. Before marking a **task or SBI** as done.
4. Before closing a **Sprint**.

- **Retrospective** is a **skill**.

### Scrum Artifacts

#### Product Backlog
- The **Product Backlog** is a **Markdown file**: **product-backlog.md**.
- **Sizing** is no longer required, because **PBIs and SBIs** can be sliced into work that finishes within **hours**.

#### Sprint Backlog
- The **Sprint Backlog** is a **Markdown file**: **sprint-backlog.md**.
- It is created by and for **Developers**, both **humans and agents**.

#### Commitment: Definition of Done
- The **Definition of Done** is a **rule**: **sdd-dod.mdc**.
- It applies not only to **Increments**, but also to **all tasks**.

[Back to top](#index)

# **Part III** Scrum in SDD Guide

## Purpose

This guide defines Scrum in SDD by stating what stays, what is added, and what changes.

## Audience

This guide is for both humans and AI agents.

- **Humans** govern, approve, and remain accountable.
- **AI agents** execute within defined constraints.
- Both use the same rules, artifacts, and terminology.

## How to read this guide

- **Keep**: classic Scrum concepts that remain valid.
- **Add**: new concepts required by SDD under Harness Engineering principles.
- **Modify**: classic Scrum concepts that change in Scrum in SDD.


## Terminology

- **Scrum in SDD**: Scrum adapted for SDD under Harness Engineering principles.
- **Spec**: the source of truth for behavior, constraints, and acceptance criteria.
- **Harness**: the runtime system that governs agent execution.
- **Rule**: a constraint on execution.
- **Skill**: a reusable capability.
- **Agent**: a human or AI actor that performs work.
- **Workflow**: a defined sequence of actions and handoffs.
- **Knowledge**: retained project context used in execution.
- **Artifact**: a persistent project document used to plan, execute, or inspect work.
- **PBI**, **SBI**, **Feature**, **Task**, **OGT**, **MVP**: [Terminology in practice](./sdd-scrum-practices.md#terminology-in-practice).
- **Increment**: usable output that meets the Definition of Done.

[Back to top](#index)

## **KEEP** - what remains unchanged

### Scrum theory
- Empiricism remains the foundation.
- Transparency, inspection, and adaptation still apply.
- Lean thinking still applies.

### Scrum values
- Commitment
- Focus
- Openness
- Respect
- Courage

### Core accountabilities
- The **Product Owner** remains accountable for product value.
- **Developers** remain accountable for creating usable output.
- The **Scrum Master** remains accountable for Scrum effectiveness.

### Core artifacts
- The **Product Backlog** remains the source of candidate work.
- The **Sprint Backlog** remains the source of current Sprint work.
- The **Increment** remains the unit of delivered value.

[Back to top](#index)

## **ADD** - what is added

### Harness layers
- **Rules**: constrain execution.
- **Skills**: provide reusable capabilities.
- **Agents**: execute work.
- **Workflows**: coordinate actions and handoffs.
- **Knowledge**: ground execution in context.

### Rules
- **sdd-dod.mdc**: Definition of Done; process writes on close.
- **sdd-incremental-delivery.mdc**: incremental delivery policy.
- **sdd-realtime-status.mdc**: WIP process sync; draft, confirm, write while work is not Done.
- **friendly-language.mdc**: readable chat and Markdown for the user and for later agents.

### Skills
- **atdd-expert**
- **sdd-update-project**
- **sdd-refine-backlog**
- **sdd-plan-sprint**
- **sdd-retrospective**
- **sdd-close-sprint**
- **sdd-audit-artifacts**
- **sdd-review-status**
- **sdd-update-specs**
- **sdd-spec-to-build**
- **sdd-create-skill**

### Core Artifacts
These are the SDD core artifacts. They are not the Scrum core artifacts under KEEP (Product Backlog, Sprint Backlog, and Increment).
- **scrum-in-sdd.md**: names and meaning. Stays on the client root.
- **sdd-scrum-practices.md**: what, how, and when. Stays on the client root.
- **artifacts-map.json**: where this project's artifacts live. Sits at the workspace root.

### Framework Artifacts
- **product-backlog.md**: Product Backlog.
- **sprint-backlog.md**: Sprint Backlog.
- **status.md**: project snapshot; updated on DoD close and on WIP checkpoints (`sdd-realtime-status.mdc`).
- **changes-log.md**: change history.

### Engineering Artifacts
- **architecture.md**: architecture spec.
- **{stem}-stories.md**: user stories and acceptance criteria.
- **{stem}-design.md**: design spec.
- **{stem}-tests.md**: test spec.
- **release.md**: local startup and go-live order.
- **test-strategy.md**: product-level test strategy.
- **.secrets**: dotenv-shaped registry (`NAME=` empty); `#` comments for where values live. No secret values in git.
- **issues-log.md**: defect record. It is also one of the five process files the audit opens.

### Pack files
These are not project artifacts. They are not in any group above.
- **constants.json**: pack lookup for path names, skill keys, and rule keys, on the client root.
- **.sdd-installed.json**: install ledger on the client root. The installer writes it. `pack_complete: true` means the pack copy finished.

### Knowledge
- **ADR**: Architecture Decision Record.
- **knowledge/**: project knowledge learned during execution.
- When the map includes `adr` or `knowledge`, those keys name the directory roots for those trees.

[Back to top](#index)

## **MODIFY**: What changes

### Scrum Team and Scrum Accountabilities
- Teams may be smaller.
- Scrum roles may include humans and AI agents.
- The Scrum Master also upholds Harness Engineering principles.
- Human members train, supervise, and govern AI agents.

#### Developers
- Developers may be human, AI, or both.
- They may adapt plans in real time toward the Sprint Goal.
- Human members remain professionally accountable.

#### Product Owner
- The Product Owner remains one person, not a committee.
- Work may be delegated to AI agents, but accountability may not.

#### Scrum Master
- Some classic Scrum Master duties may be executed by AI agents.
- The role expands to include rule design, skill design, harness quality, and knowledge management.

### Scrum Events

#### The Sprint
- Sprints may be much shorter.
- Fixed cadence may matter less in very short execution cycles.
- The Sprint still bounds planning, inspection, and delivery.

#### Sprint Planning
- Sprint Planning may take minutes, not hours.
- AI agents may prepare backlog updates for human review.

#### Daily Scrum
- More frequent real-time inspection may supplement the daily Scrum event.
- Rules like **sdd-realtime-status** trigger status updates during WIP checkpoints.

#### Sprint Review
- Sprint Review remains the event for inspecting outcomes and deciding next steps.
- AI-generated outputs may be reviewed before or during the event.

#### Sprint Retrospective
- Retrospectives may occur at Sprint-end, on demand, by rule, or before Sprint close.
- Retrospective is both an event and a skill.

### Scrum Artifacts

#### Product Backlog
- The Product Backlog may be maintained as a Markdown artifact.
- Sizing may become optional when work is sliced very small.

#### Sprint Backlog
- The Sprint Backlog may be maintained as a Markdown artifact.
- It may be updated continuously by humans and AI agents.
- **Unplanned PBIs** lists product backlog items with no sprint assignment. That section sits after the last sprint table in `sprint-backlog.md`. See `sdd-scrum-practices.md`.

#### Increment
- An Increment remains usable output that meets the Definition of Done.
- Multiple small Increments may be produced within short cycles.

#### Commitment: Definition of Done
- The Definition of Done is implemented as a rule.
- It may apply to tasks as well as Increments.

[Back to top](#index)

## Minimum Scrum in SDD setup

- One **Product Owner**
- One part-time **Scrum Master**
- One or more human **Developers**
- One shared **spec**
- One **sdd framework** including **rules**, **skills**, and other boundaries needed
- One **AI agent tool** providing AI agents to perform work
- Defined human approval boundaries
- Defined agent execution boundaries

## Operating principles
- Spec before implementation.
- Rules before autonomy.
- Humans keep accountability.
- AI agents execute within constraints.
- Artifacts remain the shared source of truth.
- Inspection happens continuously.
- Retrospective drives improvement.
- Write rules so both humans and AI agents can follow them.

[Back to top](#index)

# **Part IV** The 2020 Scrum Guide Summary

**Authors:** Ken Schwaber & Jeff Sutherland

**Subtitle:** The Definitive Guide to Scrum: The Rules of the Game

**Date:** November 2020

© 2020 Ken Schwaber and Jeff Sutherland


> This HTML/Markdown version is a direct port of the November 2020 PDF (`2020-Scrum-Guide-US.pdf`) and is provided for review only.

## Purpose of the Scrum Guide

The Scrum Guide defines Scrum, and every element serves a purpose. Partial implementation can make Scrum ineffective.

Scrum applies to complex work beyond software. “Developers” refers to anyone doing that work, so anyone who gains value from Scrum is included.

People may apply patterns, processes, and insights within Scrum, but this Guide does not cover them because they are not defined in Scrum.

[Back to top](#index)

## Scrum Definition

Scrum is a lightweight framework that helps people, teams, and organizations create value through adaptive solutions to complex problems.

In short, Scrum requires a Scrum Master to foster an environment where:

1. A Product Owner orders work for a complex problem into a Product Backlog.
2. The Scrum Team turns selected work into a valuable Increment during a Sprint.
3. The Scrum Team and stakeholders inspect the results and adjust for the next Sprint.
4. Repeat.

Scrum is a simple, intentionally incomplete framework built on the collective intelligence of its users. Unlike a methodology, it allows users to add best practices as long as its principles are upheld.

[Back to top](#index)

## Scrum Theory

Scrum is based on empiricism and lean thinking. It values experience, observation, focus, and waste reduction.

Scrum uses an iterative, incremental approach to improve predictability and reduce risk. Teams bring or develop the skills needed.

Scrum combines four formal events for inspection and adaptation within a containing event, the Sprint. These events work because they implement the empirical Scrum pillars of transparency, inspection, and adaptation.

### Transparency

Work and process must be visible to everyone. In Scrum, key decisions rely on the perceived state of its three formal artifacts. Low transparency leads to poorer decisions, lower value, and higher risk.

Transparency enables inspection. Without transparency, inspection is misleading and wasteful.

### Inspection

Scrum artifacts and progress toward goals must be inspected regularly to avoid waste. Scrum provides a cadence through its five events.

### Adaptation

If output is unacceptable, the team must adjust quickly to reduce waste.

Adaptation requires empowered, self-managing teams. Scrum Teams should adapt as soon as they learn.

[Back to top](#index)

## Scrum Values

Commitment, Focus, Openness, Respect, and Courage

These values guide the Scrum Team’s work, behavior, and decisions. When they are lived out, they build trust and bring transparency, inspection, and adaptation to life.

[Back to top](#index)

## Scrum Team

- The Scrum Team is the core unit of Scrum: one Scrum Master, one Product Owner, and Developers.
- It has no sub-teams: cross-functional.
- It has no hierarchies: self-managing.
- It focuses on one objective at a time: the Product Goal.
- It is typically fewer than 10 people to stay agile.
- For large products, multiple Scrum Teams may share the same Product Goal, Product Backlog, and Product Owner.
- It owns the full product value stream.
- The team is accountable for creating a valuable, usable Increment every Sprint.

### Developers

The people in the Scrum Team who create a usable Increment each Sprint.

They are accountable for:
- Creating the Sprint Backlog
- Upholding the Definition of Done
- Adapting their plan daily toward the Sprint Goal
- Holding each other accountable as professionals

### Product Owner

Accountable for maximizing product value.

Responsible for:
- Defining the Product Goal
- Clarifying Product Backlog items
- Ordering the Product Backlog
- Keeping the Product Backlog transparent and understood

Remains accountable even when work is delegated. One person, not a committee.

### Scrum Master

Accountable for establishing Scrum and improving team effectiveness.
A servant leader to the Scrum Team, the Product Owner, and the organization.
Responsible for:
- Coaching the Scrum Team
- Removing impediments
- Ensuring effective Scrum events
- Supporting Product Goal definition and Product Backlog management
- Enabling Scrum adoption across the organization

[Back to top](#index)

## Scrum Events

The Sprint contains all Scrum events. They enable inspection, adaptation, and regularity.

All events should ideally happen at the same time and place.

### The Sprint

Sprints are fixed-length cycles of one month or less that turn ideas into value.

Each Sprint includes all work needed to achieve the Product Goal.

During the Sprint:
- The Sprint Goal must not be endangered
- Quality must not decrease
- Scope may be clarified as more is learned

Shorter Sprints improve learning and reduce risk.

Only the Product Owner can cancel a Sprint.

### Sprint Planning

Sprint Planning starts the Sprint and creates the Sprint Backlog.

It defines the Sprint Goal (why), selects Product Backlog items (what), and plans how to deliver them.

Timeboxed to up to eight hours for a one-month Sprint.

### Daily Scrum

The Daily Scrum helps Developers inspect progress toward the Sprint Goal and adapt their plan.
It is a 15-minute event held every working day of the Sprint.
Developers choose any format, as long as it focuses on progress and produces an actionable plan.

### Sprint Review

The Sprint Review inspects the Sprint outcome and identifies future adaptations.

The Scrum Team and stakeholders review what was done, what changed, and what to do next.

Timeboxed to up to four hours for a one-month Sprint.

### Sprint Retrospective

The Sprint Retrospective plans ways to improve quality and effectiveness.

The Scrum Team reflects on the last Sprint and identifies improvements.

Timeboxed to up to three hours for a one-month Sprint.

[Back to top](#index)

## Scrum Artifacts

Scrum artifacts represent work or value. They provide transparency and a shared basis for adaptation.

Each artifact includes a commitment:
- Product Backlog → Product Goal
- Sprint Backlog → Sprint Goal
- Increment → Definition of Done

### Product Backlog

The Product Backlog is an ordered, evolving list of what is needed to improve the product. It is the single source of work for the Scrum Team.

Backlog items refined enough to be completed within one Sprint are ready for Sprint Planning. Refinement breaks items into smaller, clearer, and more precise work.

Developers are responsible for sizing. The Product Owner may help them understand trade-offs.

#### Commitment: Product Goal

The Product Goal describes the future state of the product and gives the Scrum Team a target to plan toward.

It is the long-term objective. The team must fulfill or abandon it before taking on the next one.

### Sprint Backlog

The Sprint Backlog includes the Sprint Goal, selected Product Backlog items, and the plan to deliver the Increment.

It is created by and for Developers. It is updated throughout the Sprint as more is learned.

#### Commitment: Sprint Goal

The Sprint Goal is the Sprint’s single objective.

It provides focus and flexibility.

### Increment

An Increment is a usable step toward the Product Goal that meets the Definition of Done.

Multiple Increments may be created and delivered within a Sprint.

#### Commitment: Definition of Done

The Definition of Done defines the quality required for an Increment.

Only work that meets it becomes an Increment.

It creates a shared understanding of completed work.

[Back to top](#index)

## End Note

Scrum is free and defined in this Guide. It is immutable: using only parts of Scrum is not Scrum. Scrum works as a container for other techniques, methodologies, and practices.

### People

Many people contributed to Scrum. Among the earliest were Jeff Sutherland, Jeff McKenna, John Scumniotales, Ken Schwaber, Mike Smith, and Chris Martin.

### Scrum Guide History

Ken Schwaber and Jeff Sutherland first presented Scrum publicly in 1995. The Scrum Guide documents Scrum as developed and refined by them over more than 30 years.

[Back to top](#index)
