---
title: Math Plugin
description: Insert and edit formulas through a dialog-based math workflow.
---

# Math Plugin

`MathPlugin` inserts and edits math nodes with template-assisted formula authoring.

## Install and import

```ts
import { MathPlugin } from "@editora/plugins";
// or: import { MathPlugin } from "@editora/plugins/math";
```

## Usage

```ts
const plugins = [MathPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open math dialog / insert formula | `insertMath` | `Mod-Shift-m` | `Insert Math` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Supports inline and block math insertion
- Includes preset formula templates (fractions, integrals, matrices, etc.)
- Supports editing existing math nodes via dialog interaction

## Validation checklist

- Insert/edit flow preserves formula metadata
- Inline/block rendering stays stable
- Dark theme formula UI remains readable
