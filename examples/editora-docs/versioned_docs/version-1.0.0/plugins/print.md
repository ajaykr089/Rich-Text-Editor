---
title: Print Plugin
description: Print-oriented rendering with iframe-based print flow.
---

# Print Plugin

`PrintPlugin` renders editor content for printing through an offscreen iframe flow.

## Install and import

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

## Validation checklist

- Print output includes expected formatting
- Table/code/media print legibly
- Command works across supported browsers
