---
title: Image Plugin
description: Image insertion is provided through the Media Manager plugin command set.
---

# Image Plugin

Image and video insertion is provided through `MediaManagerPlugin`.

## Install and import

```ts
import { MediaManagerPlugin } from "@editora/plugins";
// or: import { MediaManagerPlugin } from "@editora/plugins/media-manager";

const plugins = [MediaManagerPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert image | `insertImage` | `Mod-Shift-i` | `Image` |
| Insert video | `insertVideo` | None | `Video` |

## Config Options

Image/media configuration is defined via `setMediaManagerConfig(...)` on `MediaManagerPlugin`.

## Behavior

- Opens media dialog in active editor context
- Inserts media at current caret/selection position
- Supports multi-instance scoped insertion flows

## Validation checklist

- Dialog opens for correct editor instance
- Inserted media appears at intended location
- Dark theme icon/dialog contrast remains readable
