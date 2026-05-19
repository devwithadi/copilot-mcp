import { McpTool } from "./types.js";
import { runCopilot } from "../utils/exec.js";
import * as path from "path";

export const reviewCodeTool: McpTool = {
  definition: {
    name: "copilot_review_code",
    description:
      "Instructs Copilot to review a specific file or set of files, looking for bugs, anti-patterns, or architectural issues. It will autonomously analyze the code and return a detailed report. Does not modify the code.",
    inputSchema: {
      type: "object",
      properties: {
        target: {
          type: "string",
          description: "The file or directory path to review. e.g., 'src/index.ts' or '.'",
        },
        focusArea: {
          type: "string",
          description: "Specific aspect to focus on (e.g., 'security', 'performance', 'readability', 'bugs').",
        },
        cwd: {
          type: "string",
          description: "The absolute path to the working directory.",
        },
        model: {
          type: "string",
          description: "The AI model to use (e.g., gpt-4o).",
        },
        effort: {
          type: "string",
          description: "Reasoning effort level. Choices: low, medium, high, xhigh.",
          enum: ["low", "medium", "high", "xhigh"],
        },
        agent: {
          type: "string",
          description: "Specify a custom agent to use.",
        },
      },
      required: ["target"],
    },
  },
  handler: async (args: any) => {
    const { target, focusArea, cwd, model, effort, agent } = args as { target: string; focusArea?: string; cwd?: string; model?: string; effort?: string; agent?: string };

    const reviewPrompt = `Please perform a thorough code review of ${target}.${
      focusArea ? ` Pay special attention to ${focusArea}.` : ""
    } Do not modify any files. Just provide a detailed report with specific lines, identified issues, and suggested improvements. Output the final markdown report.`;

    const copilotArgs = ["-p", reviewPrompt, "--no-ask-user"];
    if (model) {
      copilotArgs.push("--model", model);
    }
    if (effort) {
      copilotArgs.push("--effort", effort);
    }
    if (agent) {
      copilotArgs.push("--agent", agent);
    }

    console.error(`Reviewing code: ${target}...`);
    const result = await runCopilot(copilotArgs, { cwd });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `Review Complete.\n\n${result.stdout}\n${result.stderr ? `\nWarnings:\n${result.stderr}` : ""}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Review failed.\n\nError:\n${result.message}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
          },
        ],
        isError: true,
      };
    }
  },
};
