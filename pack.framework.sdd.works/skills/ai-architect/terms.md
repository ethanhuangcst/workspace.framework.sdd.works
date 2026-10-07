# AI architecture terms

Load this file when a proposal names a style, a control, or a product. Check the current provider or standards page before treating a product name, a quota, or a price as current. This file does not pin a version.

## Styles

- **Wrap:** the application calls a model API. Prompts and checks stay in the application. Use this when the model API and the prompt meet the constraint.
- **Retrieval:** the application fetches private or current text and puts it in the prompt. Retrieval design stays on `rag-expert`.
- **Workflow:** fixed steps call a model only where judgment or language is required. Use this when the path and the audit trail are known in advance.
- **Agent:** the model chooses the next step and calls tools. Use this when the path cannot be fixed in advance. A tool with a side effect needs an approval rule.
- **Fine-tune:** model weights change for a domain. Use this only when prompts, examples, retrieval, and workflow cannot meet the constraint.

## Controls

- **Gateway:** one entry point for authentication, rate limits, routing, fallback, and an audit log. Add it when more than one application or more than one provider needs those controls.
- **Evaluation gate:** a fixed set of cases runs before a prompt, a model, a retrieval change, or a tool change ships. A judge model needs a human-labeled set so its scores can be checked.
- **Rollback:** a canary, a shadow run, or a blue-green switch returns traffic to the last known good version.
- **Untrusted context:** retrieved text, tool output, and external content are data, not instructions, until a check accepts them.
- **Residency and audit:** where data is stored and which calls are recorded. Name them when the constraint is regulated data or more than one tenant.

## What this file does not decide

Product choice comes from the project and the constraints. Do not default to a named model host, a vector database, a GPU serving stack, or an orchestration platform from this list.
