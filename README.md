# 🤖 GitHub Copilot MCP Server

Welcome to the Model Context Protocol (MCP) server for the **GitHub Copilot Agentic CLI**. 

What does this actually mean? It means you can expose Copilot's shiny new autonomous capabilities as tools to *other* AI agents. That's right—we're making AI agents talk to AI agents. It's subagents all the way down. 🐢🐢🐢

Use this to delegate complex coding tasks, review code, or just ask questions to Copilot while your main agent (like Claude, Cursor, or Codex) sits back, sips a digital margarita, and manages the big picture.

## 🧠 Why is this cool? (Use Cases)

Ever wanted to tell an AI to tell *another* AI what to do? 

- **The Ultimate Subagent Workflow**: Configure this MCP server in your main AI agent (like Claude Desktop or Cursor). Then, when you ask your main agent to build a feature, it can say, "Hey Copilot, you go write the CSS for this," while the main agent handles the backend logic.
- **Save the Big Brain Tokens**: Got a simple refactor, docstring generation, or boilerplate task? Delegate it to Copilot!
- **Leverage the Free Tier**: You can totally use the **Copilot Free Tier** to handle the grunt work! Let Copilot churn out basic file scaffolding as a subagent while you use your premium Claude tokens for the heavy architectural lifting. It's free real estate! 🏠
- **Parallel Processing**: Your main agent can fire off a background `copilot_delegate_task`, continue working on something else, and check the results when Copilot finishes. 

## 🛠️ Prerequisites

- **Node.js** (v18+, you know the drill)
- The modern [GitHub Copilot CLI](https://docs.github.com/copilot/how-tos/copilot-cli) (`copilot` binary) installed and authenticated on your machine.

## 🧰 Tools Provided

Here's the arsenal you get out of the box:

### `copilot_delegate_task`
Delegates an autonomous task to the Copilot CLI. It runs in the background and returns the result once it's done. 
Copilot runs with full permissions (`--yolo`) and without asking for user confirmation (`--no-ask-user`), allowing it to just get the job done autonomously. 
**Parameters:**
- `prompt` (string, required): The detailed task instruction or prompt. Tell it what to do!
- `cwd` (string, optional): Absolute path to the working directory. Defaults to wherever you are right now.
- `model` (string, optional): The AI model to use (e.g., `gpt-4o`, `claude-3.5-sonnet`).

### `copilot_ask`
Ask Copilot a question or request an explanation *without* giving it permission to touch your files. Perfect for code explanation, debugging, or architectural brainstorming.
**Parameters:**
- `prompt` (string, required): The burning question you have.
- `cwd` (string, optional): Absolute path to the working directory for context.
- `model` (string, optional): The AI model to use.

### `copilot_resume_session`
Resume a previous Copilot session or task using its session ID. Because sometimes one prompt just isn't enough to get it right.
**Parameters:**
- `prompt` (string, required): The follow-up instructions.
- `sessionId` (string, optional): The UUID of the session to resume. If omitted, it just grabs the most recent one.
- `cwd` (string, optional): Absolute path to the working directory.
- `model` (string, optional): The AI model to use.

### `copilot_review_code`
Unleash Copilot to relentlessly judge your code. It will autonomously analyze a file or directory and return a detailed report without changing anything.
**Parameters:**
- `target` (string, required): The file or directory path to review (e.g., `src/index.ts` or `.`).
- `focusArea` (string, optional): Specific thing to nitpick (e.g., 'security', 'performance', 'readability', 'bugs').
- `cwd` (string, optional): Absolute path to the working directory.

### `copilot_list_models`
Need to know what brains are available? This returns a list of commonly supported AI models by the GitHub Copilot CLI.

## 🏗️ Architecture & Project Structure

The project has been built to be scalable, readable, and highly maintainable:

- `src/index.ts`: The main entry point linking the MCP transport layer.
- `src/server.ts`: Configures the MCP server instance and registers our glorious tools.
- `src/tools/*`: Each tool is isolated in its own file (e.g., `ask.ts`, `delegateTask.ts`) to ensure single-responsibility.
- `src/utils/exec.ts`: A centralized abstraction for reliably wrangling the `copilot` CLI process.

## 🏃‍♂️ Running Locally

To test or run locally without installing globally:

```bash
npm install
npm run build
node build/index.js
```

## 🔌 Running via npx (for Cursor, Claude Desktop, etc.)

You can effortlessly plug this server into any standard MCP client using `npx`. Just add this to your MCP config:

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

*Pro-tip: If you are hacking on this locally, use the local path instead:*
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

Enjoy delegating your delegations! 🎉
