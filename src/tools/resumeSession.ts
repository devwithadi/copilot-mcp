import { McpTool } from "./types.js";
import { runCopilot } from "../utils/exec.js";

export const resumeSessionTool: McpTool = {
  definition: {
    name: "copilot_resume_session",
    description:
      "Resume a previous Copilot session or task using its session ID. This allows you to continue a conversation or iteration on a task that was previously executed.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The UUID of the session to resume. If omitted, it resumes the most recent session.",
        },
        prompt: {
          type: "string",
          description: "The follow-up prompt or instructions to give to the resumed session.",
        },
        cwd: {
          type: "string",
          description: "The absolute path to the working directory.",
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
    const { sessionId, prompt, cwd, model } = args as { sessionId?: string; prompt: string; cwd?: string; model?: string };

    const resumeArg = sessionId ? `--resume=${sessionId}` : "--resume";
    const copilotArgs = ["-p", prompt, resumeArg, "--yolo", "--no-ask-user"];
    
    if (model) {
      copilotArgs.push("--model", model);
    }

    console.error(`Resuming Copilot session...`);
    const result = await runCopilot(copilotArgs, { cwd });

    if (result.success) {
      return {
        content: [
          {
            type: "text",
            text: `Session resumed successfully.\n\nOutput:\n${result.stdout}\n${result.stderr ? `\nErrors/Warnings:\n${result.stderr}` : ""}`,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: `Failed to resume session.\n\nExit Code: ${result.exitCode}\n\nError Message:\n${result.message}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
          },
        ],
        isError: true,
      };
    }
  },
};
