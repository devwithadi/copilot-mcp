import { delegateTaskTool } from "./delegateTask.js";
import { askTool } from "./ask.js";
import { resumeSessionTool } from "./resumeSession.js";
import { reviewCodeTool } from "./reviewCode.js";
import { listModelsTool } from "./listModels.js";
import { initTool } from "./init.js";
import { McpTool } from "./types.js";

export const tools: Record<string, McpTool> = {
  copilot_delegate_task: delegateTaskTool,
  copilot_ask: askTool,
  copilot_resume_session: resumeSessionTool,
  copilot_review_code: reviewCodeTool,
  copilot_list_models: listModelsTool,
  copilot_init: initTool,
};

export const getToolDefinitions = () => Object.values(tools).map((t) => t.definition);
