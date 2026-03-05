---
title: Spell Check Plugin
description: Inline misspelling highlights, context-menu suggestions, and per-editor review sidebar.
---

# Spell Check Plugin

`SpellCheckPlugin` provides inline highlights, suggestion menus, and a review side panel.

## Install and import

```ts
import { SpellCheckPlugin } from "@editora/plugins";
// or: import { SpellCheckPlugin } from "@editora/plugins/spell-check";
```

## Usage

```ts
const plugins = [SpellCheckPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Toggle spell-check workflow | `toggleSpellCheck` | `F7` | `Spell Check` |

## Config Options

This plugin does not expose plugin-level config options. It maintains runtime dictionaries and ignored words internally.

## Behavior

- Highlights misspelled words inline
- Provides right-click suggestion menu
- Renders side panel with issue stats and actions
- Supports replace/ignore/add-to-dictionary actions
- Uses debounced mutation observation for incremental re-checks

## Multi-instance notes

- Toggle switches active instance when a different editor is targeted
- Sidebar mounts to active editor host container
- Menus and actions are scoped per active editor

## Validation checklist

- Sidebar opens on correct editor host
- Suggestion list is scrollable for long issue sets
- Suggestion open/close state remains stable
- Close action does not unintentionally toggle another editor
