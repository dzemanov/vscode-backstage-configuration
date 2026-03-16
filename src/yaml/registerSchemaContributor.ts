import * as path from "path";
import * as vscode from "vscode";
import { SchemaService } from "../services/SchemaService";
import {
  getFsPathFromResource,
  isBackstageAppConfig,
} from "../utils/fileUtils";

const SCHEMA_CONTRIBUTOR_ID = "vscode-backstage-configuration";
const SCHEMA_URI_BASE = `${SCHEMA_CONTRIBUTOR_ID}://schema/backstage-app-config`;

export function registerSchemaContributor(deps: {
  yamlApi: any;
  schemaService: SchemaService;
}) {
  const schemaUriForCwd = (cwd: string) => {
    return `${SCHEMA_URI_BASE}?cwd=${encodeURIComponent(cwd)}`;
  };

  const onRequestSchemaURI = (resource: string): string | undefined => {
    if (!isBackstageAppConfig(resource)) return undefined;
    const resourcePath = getFsPathFromResource(resource);
    const cwd = path.dirname(resourcePath);
    deps.schemaService.setLastActiveCwd(cwd);
    return schemaUriForCwd(cwd);
  };

  const onRequestSchemaContent = async (
    schemaUri: string,
  ): Promise<string | undefined> => {
    const parsed = vscode.Uri.parse(schemaUri);
    if (parsed.scheme !== SCHEMA_CONTRIBUTOR_ID) return undefined;

    const params = new URLSearchParams(parsed.query);
    const cwdParam = params.get("cwd");
    const cwd = cwdParam
      ? decodeURIComponent(cwdParam)
      : deps.schemaService.getLastActiveCwd();
    if (!cwd) return minimalJsonSchema();

    try {
      return await deps.schemaService.getSchemaForCwd(cwd);
    } catch (err) {
      console.error("Failed to generate Backstage configuration schema:", err);
      vscode.window.showErrorMessage(
        `Backstage configuration schema generation failed in ${cwd}. Run 'yarn backstage-cli config:schema --format=json --merge' there to see details.`,
      );
      return minimalJsonSchema();
    }
  };

  deps.yamlApi.registerContributor(
    SCHEMA_CONTRIBUTOR_ID,
    onRequestSchemaURI,
    onRequestSchemaContent,
  );
}

function minimalJsonSchema(): string {
  return JSON.stringify(
    {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {},
      definitions: {},
    },
    null,
    2,
  );
}
