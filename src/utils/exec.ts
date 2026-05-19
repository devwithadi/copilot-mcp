import { execa, Options } from "execa";

export async function runCopilot(args: string[], options: Options = {}) {
  const cwd = options.cwd?.toString() || process.cwd();
  
  // Provide environment variables and disable ANSI colors for machine readability
  const env = {
    ...process.env,
    FORCE_COLOR: "0",
    ...(options.env || {}),
  };

  try {
    const { stdout, stderr } = await execa("copilot", args, {
      ...options,
      cwd,
      env,
    });

    return {
      success: true,
      stdout,
      stderr,
    };
  } catch (error: any) {
    return {
      success: false,
      exitCode: error.exitCode,
      message: error.message,
      stdout: error.stdout,
      stderr: error.stderr,
    };
  }
}
