# Backstage Configuration — VSCode IntelliSense Extension

VSCode extension that provides IntelliSense for Backstage `app-config.yaml` files.

## Features

- **Auto-completion**: Get intelligent suggestions for Backstage configuration keys
- **YAML validation**: Detect whether configuration is valid and surface any errors
- **Hover support**: Hovering over a node shows description if provided by Backstage schema
- **Workspace-aware schema**: Schema is generated in the directory of the opened `app-config*.yaml` for all installed Backstage plugins
- **Manual regeneration**: Regenerate schema on demand when you switch workspaces or install plugins

## How It Works

This extension:

1. Detects when you open an `app-config*.yaml` file
2. Runs `yarn backstage-cli config:schema --format=json` in that file’s **parent directory**
3. Serves the generated JSON schema to [YAML language server](https://github.com/redhat-developer/yaml-language-server) via [VSCode's YAML Extension by Red Hat](https://github.com/redhat-developer/vscode-yaml/)

The schema is cached per directory until you explicitly regenerate it.

## Requirements

- VSCode 1.80.0 or higher
- [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) by Red Hat
- A Backstage repository where `backstage-cli` is installed

## Installation

### From VSIX

1. Download the `.vsix` file
2. Open VSCode
3. Go to Extensions view (Cmd+Shift+X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded file

### Development

1. Clone this repository
2. Run `npm install`
3. Press F5 to launch the extension in debug mode

## Usage

1. Open a Backstage project in VSCode
2. Open any `app-config*.yaml` file
3. Start typing - IntelliSense will suggest available configuration options

## Commands

- `Backstage: Regenerate Config Schema` - Clears the cache for the active `app-config*.yaml` and re-runs the Backstage CLI schema generation for that directory.

## Building

```bash
npm install
npm run compile
npm run package
```

This will create a `.vsix` file that can be installed in VSCode.

## License

MIT
