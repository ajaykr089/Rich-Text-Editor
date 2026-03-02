---
title: Preview Plugin
description: Modal preview flow for rendered editor content.
---

# Preview Plugin

`PreviewPlugin` opens a modal preview for active editor content.

## Install and import

```ts
import { PreviewPlugin } from "@editora/plugins";
// or: import { PreviewPlugin } from "@editora/plugins/preview";
```

## Usage

```ts
const plugins = [PreviewPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Toggle/open preview modal | `togglePreview` | None | `Preview` |

## Config Options

This plugin does not expose plugin-level config options.

## Behavior

- Displays rendered editor content in overlay/modal
- Supports overlay-click and Escape-close patterns
- Keeps underlying editor content unchanged

## Validation checklist

- Preview reflects latest content state
- Close actions are stable
- Modal styling remains theme-compatible
