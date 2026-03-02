---
title: Comments Plugin
description: Contextual commenting with per-editor sidebar mounting and selection-aware comment anchors.
---

# Comments Plugin

`CommentsPlugin` provides inline comment anchoring with a sidebar-based review workflow.

## Install and import

```ts
import { CommentsPlugin } from "@editora/plugins";
// or: import { CommentsPlugin } from "@editora/plugins/comments";
```

## Usage

```ts
const plugins = [CommentsPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Create comment | `addComment` | None | `Add Comment` |
| Toggle comments panel | `toggleComments` | None | `Show / Hide Comments` |

## Config Options

This plugin does not expose plugin-level config options. Panel behavior follows active editor host layout and theme context.

## Behavior

- `addComment` opens panel and focuses comment input
- Supports comments on selected text and general comments
- `toggleComments` opens/closes panel without mutating content
- Maintains selection context for comment anchoring

## Multi-instance notes

- Panel mounts to active editor host
- Comment anchors and highlights stay instance-scoped

## Validation checklist

- Panel opens in correct editor instance
- Add-comment flow does not shake/reflow unrelated editors
- Show/hide flow remains stable
- Dark theme panel contrast is readable
