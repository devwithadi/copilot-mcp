import { McpTool } from "./types.js";
import { runCopilot } from "../utils/exec.js";

export const initTool: McpTool = {
  definition: {
    name: "copilot_init",
    description: "Initializes Copilot instructions for a repository by generating an AGENTS.md or similar configuration.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "The absolute path to the working directory where Copilot should be initialized. Defaults to the current directory.",
        },
      },
      required: [],
    },
  },
  handler: async (args: any) => {
    const { cwd } = args as { cwd?: string };

    console.error(`Initializing Copilot instructions...`);
    // copilot init is typically interactive or just creates the files. Let's run it.
    const result = await runCopilot(["init"], { cwd });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `Initialization successful.\n\nOutput:\n${result.stdout}\n${result.stderr ? `\nWarnings:\n${result.stderr}` : ""}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Initialization failed.\n\nError:\n${result.message}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
          },
        ],
        isError: true,
      };
    }
  },
};
