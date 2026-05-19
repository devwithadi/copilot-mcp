import { McpTool } from "./types.js";
import { runCopilot } from "../utils/exec.js";

export const delegateTaskTool: McpTool = {
  definition: {
    name: "copilot_delegate_task",
    description:
      "Delegates an autonomous task to GitHub Copilot CLI. It runs in the background and returns the result once completed. Use this to offload coding, refactoring, or exploratory tasks to Copilot. Copilot will have full permission to read/write files and execute commands automatically.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The detailed task instruction or prompt to give to Copilot.",
        },
        cwd: {
          type: "string",
          description: "The absolute path to the working directory where Copilot should execute the task. Defaults to the current directory.",
        },
        model: {
          type: "string",
          description: "The AI model to use (e.g., gpt-4o, claude-3.5-sonnet). If not provided, uses Copilot's default.",
        },
      },
      required: ["prompt"],
    },
  },
  handler: async (args: any) => {
    const { prompt, cwd, model } = args as { prompt: string; cwd?: string; model?: string };

    const copilotArgs = ["-p", prompt, "--yolo", "--no-ask-user"];
    if (model) {
      copilotArgs.push("--model", model);
    }

    console.error(`Executing delegated task...`);
    const result = await runCopilot(copilotArgs, { cwd });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `Task completed successfully.\n\nOutput:\n${result.stdout}\n${result.stderr ? `\nErrors/Warnings:\n${result.stderr}` : ""}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Task failed.\n\nExit Code: ${result.exitCode}\n\nError Message:\n${result.message}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
          },
        ],
        isError: true,
      };
    }
  },
};
