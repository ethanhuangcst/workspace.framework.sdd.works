import { getVisitorPasteOrigin } from "@/mcp/public-origin";

export const MANUAL_MCP_SAMPLE_TEMPLATE = `{
  "mcpServers": {
    "framework.sdd.works": {
      "url": "{origin}/mcp"
    }
  }
}`;

export type ManualClient =
  | {
      id: string;
      label: string;
      type: "command";
      command: string;
    }
  | {
      id: string;
      label: string;
      type: "paste";
      path: string;
    };

export const MANUAL_CLIENTS: ManualClient[] = [
  {
    id: "claude",
    label: "Claude Code",
    type: "command",
    command:
      "claude mcp add --transport http --scope user framework.sdd.works {origin}/mcp",
  },
  {
    id: "codex",
    label: "Codex",
    type: "command",
    command: "codex mcp add framework.sdd.works --url {origin}/mcp",
  },
  {
    id: "cursor",
    label: "Cursor",
    type: "paste",
    path: "~/.cursor/mcp.json",
  },
  {
    id: "codebuddy-cn",
    label: "CodeBuddy CN / WorkBuddy CN",
    type: "paste",
    path: "~/.codebuddy/mcp.json",
  },
  {
    id: "trae-cn",
    label: "TRAE CN",
    type: "paste",
    path: "~/Library/Application Support/Trae CN/User/mcp.json",
  },
];

export function fillManualOrigin(template: string, origin: string): string {
  return template.replaceAll("{origin}", origin);
}

export function getManualMcpSample(): string {
  return fillManualOrigin(MANUAL_MCP_SAMPLE_TEMPLATE, getVisitorPasteOrigin());
}

export function getManualCommand(commandTemplate: string): string {
  return fillManualOrigin(commandTemplate, getVisitorPasteOrigin());
}

export type SetupManualPasteContent = {
  mcpSample: string;
  claudeCommand: string;
  codexCommand: string;
};

/** Resolve origin once on the server and pass into the client panel to avoid hydration drift. */
export function getSetupManualPasteContent(): SetupManualPasteContent {
  const origin = getVisitorPasteOrigin();
  const claude = MANUAL_CLIENTS.find((c) => c.id === "claude");
  const codex = MANUAL_CLIENTS.find((c) => c.id === "codex");
  if (claude?.type !== "command" || codex?.type !== "command") {
    throw new Error("setup-manual: expected command clients for claude and codex");
  }
  return {
    mcpSample: fillManualOrigin(MANUAL_MCP_SAMPLE_TEMPLATE, origin),
    claudeCommand: fillManualOrigin(claude.command, origin),
    codexCommand: fillManualOrigin(codex.command, origin),
  };
}
