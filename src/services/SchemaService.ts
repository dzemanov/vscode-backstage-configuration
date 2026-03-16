import { SchemaProvider } from "./BackstageCliSchemaProvider";
import { ConfigStore, SchemaEntry } from "./ConfigStore";

export class SchemaService {
  constructor(
    private readonly store: ConfigStore,
    private readonly provider: SchemaProvider,
  ) {}

  getLastActiveCwd(): string | undefined {
    return this.store.getLastActiveCwd();
  }

  setLastActiveCwd(cwd: string): void {
    this.store.setLastActiveCwd(cwd);
  }

  invalidate(cwd: string): void {
    this.store.invalidateSchemaEntry(cwd);
  }

  async getSchemaForCwd(cwd: string): Promise<string> {
    const existing = this.store.getSchemaEntry(cwd);
    if (existing?.jsonSchema) return existing.jsonSchema;
    if (existing?.inFlight) return await existing.inFlight;

    const schemaEntry: SchemaEntry = existing ?? {};
    schemaEntry.inFlight = (async () => {
      schemaEntry.jsonSchema = await this.provider.getJsonSchema(cwd);
      schemaEntry.lastGeneratedAtMs = Date.now();
      return schemaEntry.jsonSchema;
    })();

    this.store.setSchemaEntry(cwd, schemaEntry);

    try {
      return await schemaEntry.inFlight;
    } finally {
      schemaEntry.inFlight = undefined;
    }
  }
}
