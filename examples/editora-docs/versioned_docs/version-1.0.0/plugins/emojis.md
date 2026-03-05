---
title: Emojis Plugin
description: Category-based emoji picker with search and selection-preserving insertion.
---

# Emojis Plugin

`EmojisPlugin` provides a searchable emoji dialog and inserts emoji at saved selection/caret position.

## Install and import

```ts
import { EmojisPlugin } from "@editora/plugins";
// or: import { EmojisPlugin } from "@editora/plugins/emojis";
```

## Usage

```ts
const plugins = [EmojisPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open emoji picker | `openEmojiDialog` | `Mod-Shift-j` | `Insert Emoji` |
| Insert emoji | `insertEmoji` | None | Via dialog interaction |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Saves selection before opening dialog
- Supports category tabs and live search
- Inserts into active editor content context
- Respects dark/light theme context

## Validation checklist

- Emoji inserts at expected cursor location
- Search and categories update reliably
- Dialog opens for correct editor in multi-instance pages
