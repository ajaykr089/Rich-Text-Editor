---
title: "Vanilla HTML Examples"
description: Vanilla HTML and web component examples for framework-free Editora integration.
keywords: [editora, documentation, vanilla]
---

# Vanilla HTML Examples

Vanilla HTML and web component examples for framework-free Editora integration.

## When to choose this path

- You want no framework dependency
- You need embeddable editor widgets
- You want simple CDN-based adoption
- You need quick QA harness pages

## Core bundle vs full bundle

### Core bundle

- Smaller payload
- Good for basic formatting and editing

### Full bundle

- Broader plugin and toolbar coverage
- Better for advanced authoring workflows

## Quick start (CDN)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />

<editora-editor
  plugins="bold italic underline history"
  toolbar-items="bold italic underline | undo redo"
  height="320"
></editora-editor>
```

## Runtime config example

```html
<editora-editor id="editor" theme="dark"></editora-editor>
<script>
  const editor = document.getElementById("editor");
  editor.setConfig({
    autosave: { enabled: true, intervalMs: 5000, storageKey: "doc-1" },
    security: { sanitizeOnPaste: true, sanitizeOnInput: true },
    performance: { debounceInputMs: 100, viewportOnlyScan: true },
    accessibility: { enableARIA: true, keyboardNavigation: true, checker: false },
  });
</script>
```

## Validation checklist

- Toolbar commands operate on focused editor
- Theme styles apply to dialogs and sidebars
- Placeholder/content behavior is correct on empty/non-empty states
- Readonly mode blocks mutations

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `<editora-editor>` | Custom element API | Main integration surface for framework-free usage |
| `plugins`, `toolbar-items`, `theme`, `height`, `statusbar` | Attribute config | Initial declarative setup |
| `autosave`, `security`, `performance`, `accessibility` | Attribute/object config | Operational controls at startup |
| `setConfig(config)` | Runtime method | Applies configuration changes after mount |
| `change`/focus/blur/selection events | Event API | Host integration points for sync and telemetry |

## Config Matrix

| Config Path | Purpose |
| --- | --- |
| Attributes | Initial setup (plugins, toolbar, theme) |
| `setConfig(...)` | Runtime updates (autosave/security/performance/accessibility) |
| CSS imports | Theme and visual behavior |

## Validation Checklist

- Initial attribute config renders expected UI/features
- Runtime updates apply without remount issues
- Multi-instance pages keep config/state isolated
- Browser support matches target deployment matrix
