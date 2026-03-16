import path from "path";
import * as vscode from "vscode";

export function isBackstageAppConfig(filePath: string): boolean {
  const lower = filePath.toLowerCase();
  return (
    path.basename(lower).startsWith("app-config") &&
    (lower.endsWith(".yaml") || lower.endsWith(".yml"))
  );
}

export function getFsPathFromResource(resource: string): string {
  try {
    const uri = vscode.Uri.parse(resource);
    if (uri.scheme === "file") return uri.fsPath;
  } catch {
    // ignore
  }
  return resource;
}

export function normalizeJsonSchema(rawSchema: string): string {
  const trimmed = rawSchema.trim();
  if (!trimmed) throw new Error("Invalid schema: empty");

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    throw new Error("Invalid schema: not a valid JSON object");
  }
}

export function getActiveAppConfigCwd(): string | undefined {
  const active = vscode.window.activeTextEditor?.document;
  if (!active) return undefined;
  if (!isBackstageAppConfig(active.uri.fsPath)) return undefined;
  return path.dirname(active.uri.fsPath);
}
