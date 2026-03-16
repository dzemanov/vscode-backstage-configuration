import * as vscode from "vscode";
import { SchemaService } from "../services/SchemaService";
import { getActiveAppConfigCwd } from "../utils/fileUtils";

export function registerRegenerateSchemaCommand(
  context: vscode.ExtensionContext,
  deps: {
    schemaService: SchemaService;
  },
) {
  const regenerateCommand = vscode.commands.registerCommand(
    "vscode-backstage-configuration.regenerateSchema",
    async () => {
      const cwd =
        getActiveAppConfigCwd() ?? deps.schemaService.getLastActiveCwd();
      if (!cwd) {
        vscode.window.showWarningMessage(
          "Backstage configuration schema: open an app-config*.yaml first, then run Regenerate Schema.",
        );
        return;
      }

      deps.schemaService.invalidate(cwd);
      await deps.schemaService.getSchemaForCwd(cwd);
      vscode.window.showInformationMessage(
        `Backstage confiuration schema regenerated for ${cwd}. Reopen app-config*.yaml to refresh IntelliSense.`,
      );
    },
  );

  context.subscriptions.push(regenerateCommand);
}
