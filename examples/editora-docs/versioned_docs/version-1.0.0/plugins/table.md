---
title: Table Plugin
description: Insert and edit tables with contextual toolbar and structural operations.
---

# Table Plugin

`TablePlugin` adds table insertion plus contextual structural operations.

## Install and import

```ts
import { TablePlugin } from "@editora/plugins";
// or: import { TablePlugin } from "@editora/plugins/table";
```

## Usage

```ts
const plugins = [TablePlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert table | `insertTable` | None | `Insert Table` |
| Add row below | Internal table action | `Mod-Shift-r` | Table toolbar |
| Add column right | Internal table action | `Mod-Shift-c` | Table toolbar |
| Add row above | Internal table action | None | Table toolbar |
| Add column left | Internal table action | None | Table toolbar |
| Merge cells | Internal table action | None | Table toolbar |
| Delete row/column/table | Internal table action | None | Table toolbar |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Shows contextual `.table-toolbar` near active table selection
- Supports row/column insert/delete and merge operations
- Adds/removes event listeners and resize handles during lifecycle

## Validation checklist

- Insert table works in empty and populated content
- Structural operations preserve selection and undo safety
- Table toolbar visibility tracks active table context correctly
- Dark theme table borders and toolbar remain visible
