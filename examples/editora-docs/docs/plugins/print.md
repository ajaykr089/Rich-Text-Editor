---
title: Print Plugin
description: Print-oriented rendering with iframe-based print flow.
keywords: [editora, plugins, print]
---

# Print Plugin

Print-oriented rendering with iframe-based print flow.

## Installation and Import

```ts
import { PrintPlugin } from "@editora/plugins";
// or: import { PrintPlugin } from "@editora/plugins/print";
```

## Usage

```ts
const plugins = [PrintPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Print document | `print` | `Mod-p` | `Print` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Creates print document in hidden iframe
- Applies print-oriented styles
- Triggers browser print and cleans up frame

## Validation Checklist

- Print output includes expected formatting
- Table/code/media print legibly
- Command works across supported browsers
