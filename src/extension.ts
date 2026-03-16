import * as vscode from "vscode";
import * as path from "path";
import { registerRegenerateSchemaCommand } from "./commands/regenerateSchemaCommand";
import { BackstageCliSchemaProvider } from "./services/BackstageCliSchemaProvider";
import { ConfigStore } from "./services/ConfigStore";
import { SchemaService } from "./services/SchemaService";
import { isBackstageAppConfig } from "./utils/fileUtils";
import { registerSchemaContributor } from "./yaml/registerSchemaContributor";

const YAML_EXTENSION_ID = "redhat.vscode-yaml";

export async function activate(context: vscode.ExtensionContext) {
  console.log("Backstage Config IntelliSense is now active");

  const store = new ConfigStore();
  const schemaProvider = new BackstageCliSchemaProvider();
  const schemaService = new SchemaService(store, schemaProvider);

  registerRegenerateSchemaCommand(context, { schemaService });

  const maybeTriggerSchemaGenerationForDocument = (
    doc: vscode.TextDocument,
  ) => {
    if (!isBackstageAppConfig(doc.uri.fsPath)) return;
    const cwd = path.dirname(doc.uri.fsPath);
    schemaService.setLastActiveCwd(cwd);

    // Warm cache on open/activate; actual schema request will await as needed.
    void schemaService.getSchemaForCwd(cwd);
  };

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      maybeTriggerSchemaGenerationForDocument(doc);
    }),
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor) return;
      maybeTriggerSchemaGenerationForDocument(editor.document);
    }),
  );

  const activeDoc = vscode.window.activeTextEditor?.document;
  if (activeDoc) {
    maybeTriggerSchemaGenerationForDocument(activeDoc);
  }

  const yamlExtension = vscode.extensions.getExtension(YAML_EXTENSION_ID);
  if (!yamlExtension) {
    vscode.window.showWarningMessage(
      "Backstage Config IntelliSense: redhat.vscode-yaml is not installed/enabled. YAML IntelliSense won't be available.",
    );
    return;
  }

  const yamlApi: any = await yamlExtension.activate();
  if (typeof yamlApi?.registerContributor !== "function") {
    vscode.window.showWarningMessage(
      "Backstage Config IntelliSense: YAML extension API not available. Schema contributor could not be registered.",
    );
    return;
  }

  registerSchemaContributor({ yamlApi, schemaService });
}

export function deactivate() {}
