---
title: Template Plugin
description: Reusable template insertion with search, categories, and sanitization.
---

# Template Plugin

`TemplatePlugin` inserts predefined/custom templates with sanitization and category/search workflows.

## Install and import

```ts
import {
  TemplatePlugin,
  addCustomTemplate,
  getAllTemplates,
  getTemplateCategories,
  getTemplatesByCategory,
  searchTemplates,
  sanitizeTemplate,
  validateTemplate,
} from "@editora/plugins";
// or subpath: "@editora/plugins/template"
```

## Usage

```ts
const plugins = [TemplatePlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open template dialog | `insertTemplate` | None | `Template` |

## Config Options

This plugin does not expose plugin-level runtime config. Template data can be extended through helper APIs.

## Template helper APIs

- `getAllTemplates()`
- `getTemplatesByCategory(category)`
- `getTemplateCategories()`
- `searchTemplates(query)`
- `addCustomTemplate(template)`
- `validateTemplate(template)`
- `sanitizeTemplate(html)`

## Behavior

- Supports category and search filtering
- Supports insert/replace style content flows
- Applies sanitization before insertion

## Security notes

- Sanitization is DOMPurify-based
- Script-like content is stripped
- Keep sanitize flow enabled for untrusted template sources

## Validation checklist

- Custom template add/search/category flows are stable
- Inserted template remains editable
- Undo/redo captures template insertion correctly
