import { McpTool } from "./types.js";

export const listModelsTool: McpTool = {
  definition: {
    name: "copilot_list_models",
    description: "Returns a list of commonly supported AI models by the GitHub Copilot CLI and custom providers.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  handler: async () => {
    return {
      content: [
        {
          type: "text",
          text: `GitHub Copilot CLI supports various models depending on your subscription and custom provider configurations.

Common Built-in Models:
- gpt-4o (Default)
- claude-3.5-sonnet
- o1
- o3-mini

Custom Model Providers (BYOK):
You can configure Copilot to use any OpenAI-compatible, Azure, or Anthropic endpoint via environment variables (COPILOT_PROVIDER_TYPE, COPILOT_PROVIDER_BASE_URL, COPILOT_MODEL, etc).

To use a specific model in other tools, pass its name to the 'model' parameter.`,
        },
      ],
    };
  },
};
