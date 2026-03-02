---
title: Link Plugin
description: Link dialog and lifecycle commands with keyboard shortcut support.
---

# Link Plugin

`LinkPlugin` provides link creation/edit/removal flows.

## Install and import

```ts
import { LinkPlugin } from "@editora/plugins";
// or: import { LinkPlugin } from "@editora/plugins/link";
```

## Usage

```ts
const plugins = [LinkPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open link dialog | `openLinkDialog` | `Mod-k` | `Link` |
| Remove link | `removeLink` | None | Via dialog/command |
| Create link | `createLink` | None | Internal/dialog flow |

## Config Options

This plugin does not expose plugin-level config options.

## Mark/attribute model

- `href`
- `title`
- `target`
- `rel` (`noopener noreferrer` when target is external)

## Validation checklist

- Link creation on selected text
- Link edit/remove preserves surrounding formatting
- External links include safe `rel` handling
