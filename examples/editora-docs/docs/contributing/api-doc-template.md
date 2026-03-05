---
title: API Documentation Template
description: Standard template for package and component API reference pages.
keywords: [template, api docs, reference]
---

# API Documentation Template

Standard template for package and component API reference pages.

## Required sections

- Import
- Types/Props table
- Events/Callbacks
- Defaults
- Accessibility contract
- Performance contract
- Version notes (if behavior changed)
- Related pages and migration links (if applicable)

## Example props table

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `""` | Controlled value |

## Example methods table

| Method | Params | Returns | Description |
| --- | --- | --- | --- |
| `setConfig` | `config: Partial<EditorConfig>` | `Promise<void>` | Updates runtime config at instance level |
| `execCommand` | `name: string, args?: unknown` | `boolean` | Executes a registered command on active editor instance |
