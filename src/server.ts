import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools, getToolDefinitions } from "./tools/index.js";

export function createServer() {
  const server = new Server(
    {
      name: "copilot-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getToolDefinitions(),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    
    const tool = tools[name];
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    return await tool.handler(args);
  });

  return server;
}
