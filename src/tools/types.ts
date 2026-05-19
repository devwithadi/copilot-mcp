import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface McpTool {
  definition: Tool;
  handler: (args: any) => Promise<CallToolResult>;
}
