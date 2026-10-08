#!/usr/bin/env node
/**
 * Normalize scrum-in-sdd.en.md part order (I–IV), regenerate Index (h1 and h2 only).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TARGETS = [
  join(ROOT, "pack.framework.sdd.works/content/scrum-in-sdd/scrum-in-sdd.en.md"),
  join(ROOT, "src/content/scrum-in-sdd/scrum-in-sdd.en.md"),
  join(ROOT, "pack.framework.sdd.works/templates/EN/scrum-in-sdd.md"),
];

const PART_SIGNATURES = [
  { key: "I", match: (title) => /Agentic Programming/i.test(title) },
  { key: "II", match: (title) => /Gap in Classic/i.test(title) },
  { key: "III", match: (title) => /Scrum in SDD Guide/i.test(title) },
  { key: "IV", match: (title) => /2020 Scrum Guide Summary/i.test(title) },
];

function githubHeadingSlug(plain) {
  return (
    plain
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-") || "section"
  );
}

function stripBold(text) {
  return text.replace(/\*+/g, "").trim();
}

function parseHeading(line) {
  const m = line.match(/^(#{1,6})\s+(.*)$/);
  if (!m) return null;
  return { level: m[1].length, text: stripBold(m[2]) };
}

function splitPartChunks(bodyLines) {
  const chunks = [];
  let current = null;
  for (const line of bodyLines) {
    const m = line.match(/^# \*\*Part (I|II|III|IV)\*\* (.*)$/);
    if (m) {
      if (current) chunks.push(current);
      current = { title: m[2], lines: [line] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) chunks.push(current);
  return chunks;
}

function orderAndLabelParts(chunks) {
  const remaining = [...chunks];
  const ordered = [];
  for (const sig of PART_SIGNATURES) {
    const idx = remaining.findIndex((c) => sig.match(c.title));
    if (idx < 0) {
      throw new Error(`Missing part block for Part ${sig.key}`);
    }
    const [chunk] = remaining.splice(idx, 1);
    chunk.lines[0] = `# **Part ${sig.key}** ${chunk.title}`;
    ordered.push(...chunk.lines);
  }
  if (remaining.length > 0) {
    throw new Error(
      `Unmatched part blocks: ${remaining.map((c) => c.title).join("; ")}`,
    );
  }
  return ordered;
}

const OVERVIEW_REPLACEMENT = `## Purpose

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
`;

function transformPartIV(text) {
  return text.replace(
    /## Overview\n\*\*Purpose\*\*\n([\s\S]*?)\n\n## Terminology/,
    `${OVERVIEW_REPLACEMENT}\n\n## Terminology`,
  );
}

function fixPartCrossReferences(text) {
  return text
    .replace(
      /\*\*Part IV\*\* under \*\*ADD - what is added\*\*/g,
      "**Part III** under **ADD - what is added**",
    )
    .replace(/detail in Part IV/g, "detail in Part III");
}

function collectHeadings(lines) {
  const counts = new Map();
  const headings = [];
  for (const line of lines) {
    const h = parseHeading(line);
    if (!h) continue;
    if (h.text === "Index") continue;
    const base = githubHeadingSlug(h.text);
    const used = counts.get(base) ?? 0;
    counts.set(base, used + 1);
    const id = used === 0 ? base : `${base}-${used}`;
    headings.push({ ...h, id });
  }
  return headings;
}

function buildIndexTree(headings) {
  const lines = ["## Index", ""];
  const stack = [];
  for (const h of headings) {
    if (h.level > 2) continue;
    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop();
    }
    const indent = "  ".repeat(stack.length);
    lines.push(`${indent}- [${h.text}](#${h.id})`);
    stack.push(h);
  }
  lines.push("");
  return lines;
}

function buildPreamble() {
  return [
    "# Scrum in SDD",
    "",
    "> Type: Core artifact of framework.sdd.works",
    "> as_of: 2026-10-08",
    "> [Definition](./sdd-scrum-practices.md#terminology-in-practice)",
    "",
    "**Author:** Ethan Huang",
    "",
    "© 2026 Ethan Huang",
    "",
    "This document defines how Scrum is adopted in Spec-Driven Development, with Agentic Programming under Harness Engineering principles.",
    "",
    "The Scrum Guide defines Scrum. This document does not replace it.",
    "",
    "Read **Part I** through **Part III** for SDD and the Scrum in SDD definition. **Part IV** is the 2020 Scrum Guide summary at the end as reference.",
    "",
    "- **Part I** names Agentic Programming, Harness Engineering, and Spec-Driven Development.",
    "- **Part II** states what classic Scrum does not cover in that setting.",
    "- **Part III** is the definition: what stays, what is added, and what changes.",
    "- **Part IV** summarizes the 2020 Scrum Guide. That summary is the baseline.",
    "",
  ];
}

function rebuild(md) {
  const lines = md.split("\n");
  const firstPart = lines.findIndex((l) => /^# \*\*Part (I|II|III|IV)\*\* /.test(l));
  if (firstPart < 0) throw new Error("No part headings found");
  const bodyLines = lines.slice(firstPart);
  const chunks = splitPartChunks(bodyLines);
  let orderedLines = orderAndLabelParts(chunks);
  let bodyText = transformPartIV(orderedLines.join("\n"));
  bodyText = fixPartCrossReferences(bodyText);
  orderedLines = bodyText.split("\n");
  const headings = collectHeadings(orderedLines);
  const indexLines = buildIndexTree(headings);
  return [...buildPreamble(), ...indexLines, ...orderedLines].join("\n");
}

function validateIndex(md) {
  const counts = new Map();
  const ids = new Set();
  for (const line of md.split("\n")) {
    const h = parseHeading(line);
    if (!h || h.text === "Index") continue;
    const base = githubHeadingSlug(h.text);
    const used = counts.get(base) ?? 0;
    counts.set(base, used + 1);
    ids.add(used === 0 ? base : `${base}-${used}`);
  }
  const missing = [];
  const indexLink = /\[([^\]]+)\]\(#([^)]+)\)/g;
  let inIndex = false;
  for (const line of md.split("\n")) {
    if (line.startsWith("## Index")) inIndex = true;
    else if (inIndex && line.startsWith("# **Part")) inIndex = false;
    if (!inIndex) continue;
    let m;
    while ((m = indexLink.exec(line))) {
      if (!ids.has(m[2])) missing.push(m[2]);
    }
  }
  if (missing.length) {
    throw new Error(`Index fragments without headings: ${missing.join(", ")}`);
  }
}

const source = TARGETS[0];
const out = rebuild(readFileSync(source, "utf8"));
validateIndex(out);
const normalized = out.endsWith("\n") ? out : `${out}\n`;
for (const path of TARGETS) {
  writeFileSync(path, normalized);
  console.log("Wrote", path);
}
