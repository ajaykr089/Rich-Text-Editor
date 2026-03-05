---
title: Document Manager Plugin
description: Word import/export and PDF export with configurable API endpoints and fallback behavior.
keywords: [editora, plugins, document-manager]
---

# Document Manager Plugin

Word import/export and PDF export with configurable API endpoints and fallback behavior.

## Installation and Import

```ts
import {
  DocumentManagerPlugin,
  setDocumentManagerConfig,
  getDocumentManagerConfig,
} from "@editora/plugins";
// or subpath: "@editora/plugins/document-manager"
```

## Usage

```ts
setDocumentManagerConfig({
  apiUrl: "https://api.example.com",
  apiEndpoints: { exportWord: "/documents/export-word" },
  useClientSideFallback: true,
});

const plugins = [DocumentManagerPlugin()];
```

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Import Word document | `importWord` | None | `Import Word` |
| Export as Word | `exportWord` | None | `Export Word` |
| Export as PDF | `exportPdf` | None | `Export PDF` |

## Config Options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `apiUrl` | `string` | Empty/local | Base API URL |
| `apiEndpoints.exportWord` | `string` | Plugin default | Word export endpoint |
| `headers` | `Record<string,string>` | `{}` | Optional auth/custom headers |
| `useClientSideFallback` | `boolean` | `true` | Fallback when API unavailable |

## Behavior

- Resolves active editor before import/export
- Dispatches editor input updates after import
- Supports API export and fallback flow

## Validation Checklist

- Import updates correct editor instance
- Export works with and without API availability
- PDF output preserves core formatting
