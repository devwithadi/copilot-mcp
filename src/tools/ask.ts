import { McpTool } from "./types.js";
import { runCopilot } from "../utils/exec.js";

export const askTool: McpTool = {
  definition: {
    name: "copilot_ask",
    description:
      "Ask Copilot a question or request an explanation without allowing it to make file changes or execute commands. Good for code explanation, debugging help, or architectural suggestions.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The question or request to ask Copilot.",
        },
        cwd: {
          type: "string",
          description: "The absolute path to the working directory for context.",
        },
        model: {
          type: "string",
          description: "The AI model to use.",
        },
      },
      required: ["prompt"],
    },
  },
  handler: async (args: any) => {
    const { prompt, cwd, model } = args as { prompt: string; cwd?: string; model?: string };

    const copilotArgs = ["-p", prompt, "--no-ask-user"];
    if (model) {
      copilotArgs.push("--model", model);
    }

    console.error(`Asking Copilot...`);
    const result = await runCopilot(copilotArgs, { cwd });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `${result.stdout}\n${result.stderr ? `\nWarnings:\n${result.stderr}` : ""}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Failed to ask Copilot.\n\nError:\n${result.message}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
          },
        ],
        isError: true,
      };
    }
  },
};
