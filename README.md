# GitHub Copilot MCP Server

A Model Context Protocol (MCP) server that exposes the GitHub Copilot Agentic CLI as tools. This allows you to delegate complex coding tasks, review code, or ask questions to Copilot autonomously.

## Prerequisites

- Node.js (v18+)
- The modern [GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli) (`copilot` binary) installed and authenticated.

## Tools Provided

### `copilot_delegate_task`
Delegates an autonomous task to GitHub Copilot CLI. It runs in the background and returns the result once completed. 
Use this to offload coding, refactoring, or exploratory tasks to Copilot. 
Copilot runs with full permissions (`--yolo`) and without asking for user confirmation (`--no-ask-user`), allowing it to operate entirely autonomously.

**Parameters:**
- `prompt` (string, required): The detailed task instruction or prompt to give to Copilot.
- `cwd` (string, optional): The absolute path to the working directory where Copilot should execute the task. Defaults to the current directory.
- `model` (string, optional): The AI model to use (e.g., `gpt-4o`, `claude-3.5-sonnet`).

### `copilot_ask`
Ask Copilot a question or request an explanation without allowing it to make file changes or execute commands. Good for code explanation, debugging help, or architectural suggestions.

**Parameters:**
- `prompt` (string, required): The question or request to ask Copilot.
- `cwd` (string, optional): The absolute path to the working directory for context.
- `model` (string, optional): The AI model to use.

### `copilot_resume_session`
Resume a previous Copilot session or task using its session ID. This allows you to continue a conversation or iteration on a task that was previously executed.

**Parameters:**
- `prompt` (string, required): The follow-up prompt or instructions to give to the resumed session.
- `sessionId` (string, optional): The UUID of the session to resume. If omitted, it resumes the most recent session.
- `cwd` (string, optional): The absolute path to the working directory.
- `model` (string, optional): The AI model to use.

### `copilot_review_code`
Instructs Copilot to review a specific file or set of files, looking for bugs, anti-patterns, or architectural issues. It will autonomously analyze the code and return a detailed report. Does not modify the code.

**Parameters:**
- `target` (string, required): The file or directory path to review. e.g., 'src/index.ts' or '.'.
- `focusArea` (string, optional): Specific aspect to focus on (e.g., 'security', 'performance', 'readability', 'bugs').
- `cwd` (string, optional): The absolute path to the working directory.

### `copilot_list_models`
Returns a list of commonly supported AI models by the GitHub Copilot CLI and custom providers.

## Architecture & Project Structure

The project has been architected for scalability and ease of extension:

- `src/index.ts`: Entry point linking the MCP transport layer.
- `src/server.ts`: Configures the MCP server instance and registers tools.
- `src/tools/*`: Each tool is isolated in its own file (e.g., `ask.ts`, `delegateTask.ts`) to ensure single-responsibility and maintainability.
- `src/utils/exec.ts`: A centralized abstraction for reliably interacting with the `copilot` CLI process.

## Running Locally

To test or run locally without installing globally:

```bash
npm install
npm run build
node build/index.js
```

## Running via npx (for Cursor, Claude Desktop, etc.)

You can directly run this server in any standard MCP client using `npx`:

```json
{
  "mcpServers": {
    "copilot-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@devwithadi/copilot-mcp@latest"
      ]
    }
  }
}
```

*Note: If you are running this locally, you can use the following configuration:
```json
{
  "mcpServers": {
    "copilot-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "/absolute/path/to/copilot_mcp"
      ]
    }
  }
}
```

## Setup Instructions

1. `npm install`
2. `npm run build`
3. Configure your MCP client to use the `node build/index.js` or `npx <path-to-folder>` command.
