export type SchemaEntry = {
  jsonSchema?: string;
  inFlight?: Promise<string>;
  lastGeneratedAtMs?: number;
};

export class ConfigStore {
  private readonly schemaByCwd = new Map<string, SchemaEntry>();
  private lastActiveCwd: string | undefined;

  getLastActiveCwd(): string | undefined {
    return this.lastActiveCwd;
  }

  setLastActiveCwd(cwd: string): void {
    this.lastActiveCwd = cwd;
  }

  getSchemaEntry(cwd: string): SchemaEntry | undefined {
    return this.schemaByCwd.get(cwd);
  }

  setSchemaEntry(cwd: string, schema: SchemaEntry): void {
    this.schemaByCwd.set(cwd, schema);
  }

  invalidateSchemaEntry(cwd: string): void {
    this.schemaByCwd.delete(cwd);
  }
}
