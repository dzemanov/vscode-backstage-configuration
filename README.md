# Backstage Configuration — VSCode IntelliSense Extension

VSCode extension that provides IntelliSense for Backstage `app-config.yaml` files.

Works in both **VSCode** and **Cursor**.

## Features

- **Auto-completion**: Get intelligent suggestions for Backstage configuration keys
- **Validation**: Validate `app-config*.yaml` against the Backstage configuration schema (based on installed plugins/packages) and surface any YAML syntax errors
- **Hover support**: Hovering over a configuration key shows its description when provided by the Backstage schema
- **Workspace-aware schema**: The schema is generated per `app-config*.yaml` directory, so switching workspaces uses the appropriate schema for that workspace
- **Manual regeneration**: Regenerate schema on demand when you install new plugins

## How It Works

This extension:

1. Detects when you open an `app-config*.yaml` file
2. Runs `yarn backstage-cli config:schema --format=json --merge` in the **directory containing** that file
3. Provides the generated JSON schema to the [YAML Language Server](https://github.com/redhat-developer/yaml-language-server) through the [VS Code YAML extension](https://github.com/redhat-developer/vscode-yaml/)

The schema is cached per **`app-config*.yaml` directory** until you explicitly regenerate it using the `Backstage: Regenerate Config Schema` command.

## Requirements

- VSCode 1.80.0 or higher
- [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) by Red Hat
- A Backstage repository where `backstage-cli` is installed

## Installation

## From Marketplace

In VSCode, open the Extensions view (Ctrl+Shift+X / Cmd+Shift+X), search for `Backstage Configuration`, and select **Install**.

Alternatively, install directly from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=dzemanov.vscode-backstage-configuration).

### From VSIX

1. Download or [build](#building) the `.vsix` file
2. In VSCode, open the Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
3. Go to Extensions view
4. Run `Extensions: Install from VSIX...`
5. Select the `vscode-backstage-configuration-x.x.x.vsix` file

### Development

```bash
git clone https://github.com/dzemanov/vscode-backstage-configuration.git
cd vscode-backstage-configuration
npm install
```

Then press `F5` in VSCode to launch the extension in debug mode.
When testing, make sure to open your Backstage project in the Extension Development Host window.

## Usage

1. Open a Backstage project in VSCode
2. Open any `app-config*.yaml` file
3. Start typing - IntelliSense will suggest available configuration options

## Commands

- `Backstage: Regenerate Config Schema` - Refreshes the configuration schema used for IntelliSense for the currently opened `app-config*.yaml` (or, if none is open, the last active `app-config*.yaml` directory).

## Building

```bash
npm install
npm run compile
npm run package
npx @vscode/vsce package
```

This will create a `.vsix` file that can be installed in VSCode.

## License

MIT
