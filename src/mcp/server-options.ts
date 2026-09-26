export type McpChannel = "stdio" | "http";

export type CreateSddMcpServerOptions = {
  channel: McpChannel;
  /** When false, sdd_get_key returns unauthorized. */
  authorized: boolean;
  clientInfo?: { name?: string };
  installHome?: string;
  skipLlm?: boolean;
};
