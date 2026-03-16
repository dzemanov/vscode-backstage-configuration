import { spawn } from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { normalizeJsonSchema } from "../utils/fileUtils";

export interface SchemaProvider {
  getJsonSchema(cwd: string): Promise<string>;
}

export class BackstageCliSchemaProvider implements SchemaProvider {
  constructor(
    private readonly options: {
      timeoutMs?: number;
    } = {},
  ) {}

  async getJsonSchema(cwd: string): Promise<string> {
    if (!fs.existsSync(cwd)) {
      throw new Error(`cwd does not exist: ${cwd}`);
    }

    const args = ["backstage-cli", "config:schema", "--format=json", "--merge"];

    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "backstage-config-schema-"),
    );
    const tmpFile = path.join(tmpDir, "schema.json");

    try {
      const cmd = `yarn ${args.join(" ")} > ${tmpFile}`;
      const child = spawn(cmd, {
        cwd,
        shell: true,
        stdio: ["ignore", "ignore", "pipe"],
        env: {
          ...process.env,
          FORCE_COLOR: "0",
          YARN_ENABLE_PROGRESS_BARS: "0",
        },
      });

      let stderr = "";
      const stderrLimit = 1024 * 1024; // 1MB
      child.stderr?.setEncoding("utf8");
      child.stderr?.on("data", (chunk) => {
        if (stderr.length >= stderrLimit) return;
        stderr += String(chunk);
        if (stderr.length > stderrLimit) stderr = stderr.slice(0, stderrLimit);
      });

      const timeoutMs = this.options.timeoutMs ?? 2 * 60 * 1000;
      const killTimer = setTimeout(() => child.kill(), timeoutMs);

      const { code, signal } = await new Promise<{
        code: number | null;
        signal: NodeJS.Signals | null;
      }>((resolve, reject) => {
        child.on("error", reject);
        child.on("close", (code, signal) => resolve({ code, signal }));
      });

      clearTimeout(killTimer);

      if (code !== 0) {
        throw new Error(
          [
            `Command failed: ${cmd}`,
            `cwd: ${cwd}`,
            `exit: ${code ?? "null"} signal: ${signal ?? "null"}`,
            stderr.trim() ? `stderr:\n${stderr.trim()}` : undefined,
          ]
            .filter(Boolean)
            .join("\n"),
        );
      }

      const out = fs.readFileSync(tmpFile, "utf8");
      try {
        return normalizeJsonSchema(out);
      } catch (error) {
        const reason =
          error instanceof Error
            ? `${error.name}: ${error.message}`
            : String(error);
        throw new Error(
          `Invalid Backstage configuration schema for '${cwd}'. Reason: ${reason}`,
          { cause: error },
        );
      }
    } finally {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {}
    }
  }
}
