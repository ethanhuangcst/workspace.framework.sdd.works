<!-- This artifact tracks the current status of the sdd-scrum process -->
---
title: The latest status of [product name]
type: tracking-spec
tags:
  - sdd
  - scrum
  - docs
related_spec: sprint-backlog.md
related:
  - product-backlog.md
  - changes-log.md
  - artifacts-map.md
  - sprint-backlog.md
---



# The latest status of [product name]

## Project progress

| Milestone | Status |
| --- | --- |
| Project kickoff | |
| Initial product backlog refined | |

| Sprint | Status | Note |
| --- | --- | --- |
| Sprint {from} - {to} | Done | |
| Sprint {sprint number} | WIP | |
| Sprint {from} - {to} | ToDo | |

## where we are now:
<!-- This artifact tracks the current status of the sdd-scrum process 
Sprint number
SBI number
-->
- Which sprint are we working on now: Sprint {sprint number} (WIP). {one sentence}
- What SBI are we working on now: {SBI code} {SBI name}


## what could be the next:
<!-- Next items follow the current sprint, the current SBI, and the sprint item order. -->
- {SBI code} {SBI name}
- {SBI code} {SBI name}

## Current OGT(On-going Tasks)
<!-- 
To keep tracking the temporary on-going tasks. (OGT, On-Going-Tasks)
OGT is different from the Sprint Backlog Items (SBIs) in sprint-backlog.md. They are the samller tasks created when AI agents are executing the SBI.
Example: The AI agent and the user are working on Sprint 2, SBI # 2: Build UI mockups
1. In Plan mode, AI Agent decided to complete UI/UX design with the following steps:
```
1. Use [skill:frontend-design] to refactor the portal.css tokens to a monochrome scheme based on the reference draft (zero border radius / ink-black primary button / remove brand colors), rewrite web-design §13, and record the requirement change in §0.
2. Use [skill:frontend-design] Collect feedback from the user, and re-design the UI accordingly
3. Use [subagent:code-explorer] to identify all reference points, then ...
4. Task 4
5. Task 5
```
2. And now AI Agent is working on task #1, and he user provided feedbacks: 
- change logo
- copy css from reference design
- update UI mockups
- verify and confirm with me
3. Each of the avove items will be treated as a OGT. And this section will be used to keep tracking them, in this format:

OGT for Sprint #2, SBI #2, Build UI mockups:
| # | On-going Task | Status |
| --- | --- | --- |
| 1 | change logo | Done |
| 2 | copy css from reference design | Done |
| 3 | update UI mockups, adding more updates based on further inputs from the user | On-going |
| 4 | verify and confirm with me, use provided new inputs | On-going |

-->
OGT for Sprint {sprint number}, SBI {SBI number}, {SBI name}:

| # | Task Name | Affected SBIs | Created | Status |
| --- | --- | --- | --- | --- |
| 1 | task name | - {SBI code} {SBI name}. - {SBI code} {SBI name} | {sprint number} | ToDo |

## Last 15 closed OGTs

| # | Task Name | Affected SBIs | Created | Closed |
| --- | --- | --- | --- | --- |
| | | | | |

Last updated: {timestamp} {agent name}
