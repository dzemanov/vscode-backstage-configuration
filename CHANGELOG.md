# Changelog

All notable changes to VSCode Backstage Configuration project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-03-19

### Changed

- Updated the extension `displayName` to **Backstage Configuration** (`vscode-backstage-configuration`).
- Updated documentation.
- Fixed typo in error message.

### Added

- IntelliSense (completion + validation) for Backstage `app-config*.yaml` via the Red Hat YAML extension.
- Workspace-aware schema generation.
- Command `Backstage: Regenerate Config Schema` to refresh the schema for the current workspace directory.
