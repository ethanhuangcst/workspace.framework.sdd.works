import { randomUUID } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { assertRequestAuthorized, getConfiguredMcpAuthToken } from "./auth";
import { createSddMcpServer } from "./create-server";

const PORT = Number(process.env.MCP_HTTP_PORT ?? "3041");
const PATH = process.env.MCP_HTTP_PATH?.trim() || "/mcp";
const HOST = process.env.MCP_HTTP_HOST?.trim() || "127.0.0.1";

type TransportMap = Record<string, StreamableHTTPServerTransport>;

async function main() {
  const token = getConfiguredMcpAuthToken();
  if (!token) {
    console.warn(
      "MCP_AUTH_TOKEN unset — HTTP MCP is open (ADR-050 local mode). Do not expose this port publicly.",
    );
  }

  const app = createMcpExpressApp({ host: HOST });
  const transports: TransportMap = {};

  app.use(PATH, (req, res, next) => {
    if (!assertRequestAuthorized(req)) {
      res.status(401).json({
        jsonrpc: "2.0",
        error: {
          code: -32001,
          message: "unauthorized",
          data: { error: { key: "unauthorized", code: "unauthorized" } },
        },
        id: null,
      });
      return;
    }
    next();
  });

  app.post(PATH, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    try {
      let transport: StreamableHTTPServerTransport;
      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (id) => {
            transports[id] = transport;
          },
        });
        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid && transports[sid]) delete transports[sid];
        };
        const server = createSddMcpServer({
          channel: "http",
          authorized: true,
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        return;
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No valid session ID provided",
          },
          id: null,
        });
        return;
      }
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP HTTP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.get(PATH, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  });

  app.delete(PATH, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  });

  app.listen(PORT, HOST, () => {
    console.log(
      `MCP Streamable HTTP listening on http://${HOST}:${PORT}${PATH}`,
    );
  });
}

main().catch((error) => {
  console.error("MCP HTTP failed:", error);
  process.exit(1);
});
