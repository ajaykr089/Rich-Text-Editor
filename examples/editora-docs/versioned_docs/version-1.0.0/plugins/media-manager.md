---
title: Media Manager Plugin
description: Image and video insertion plugin with API-backed upload/library configuration.
---

# Media Manager Plugin

`MediaManagerPlugin` powers image/video insertion and media-library workflows.

## Install and import

```ts
import {
  MediaManagerPlugin,
  setMediaManagerConfig,
  getMediaManagerConfig,
} from "@editora/plugins";
// or subpath: "@editora/plugins/media-manager"
```

## Usage

```ts
setMediaManagerConfig({
  apiUrl: "https://api.example.com",
  apiEndpoints: {
    upload: "/media/upload",
    library: "/media/library",
    delete: "/media/library",
  },
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "video/mp4"],
});

const plugins = [MediaManagerPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert image | `insertImage` | `Mod-Shift-i` | `Image` |
| Insert video | `insertVideo` | None | `Video` |

## Config Options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `apiUrl` | `string` | Empty/local | Base API URL |
| `apiEndpoints.upload` | `string` | Plugin default | Upload endpoint |
| `apiEndpoints.library` | `string` | Plugin default | Media list endpoint |
| `apiEndpoints.delete` | `string` | Plugin default | Delete endpoint |
| `maxFileSize` | `number` | `10MB` | Per-file limit |
| `allowedTypes` | `string[]` | Common image/video MIME types | Upload type guard |
| `headers` | `Record<string,string>` | `{}` | Auth/custom headers |

## Behavior

- Resolves active editor context before opening dialog
- Supports API-backed upload/list/delete workflows
- Inserts selected media into current editor selection flow

## Validation checklist

- Upload and insert for allowed types
- Correct instance targeting in multi-editor pages
- Dialog/picker styles consistent in light/dark themes
