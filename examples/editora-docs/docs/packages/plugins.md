---
title: "@editora/plugins"
description: Plugin catalog strategy and integration patterns for @editora/plugins.
keywords: [editora, plugins, commands, toolbar, integration]
---

# @editora/plugins

Comprehensive plugin distribution package for Editora.

## Installation

```bash
npm i @editora/plugins @editora/core
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `HeadingPlugin`, `BoldPlugin`, `ItalicPlugin`, `UnderlinePlugin`, `StrikethroughPlugin` | Plugin factories | Core formatting plugins |
| `ListPlugin`, `ChecklistPlugin` | Plugin factories | List and checklist behaviors |
| `HistoryPlugin` | Plugin factory | Undo/redo stack integration |
| `LinkPlugin`, `TablePlugin`, `AnchorPlugin`, `EmbedIframePlugin` | Plugin factories | Insertion/structure plugins |
| `BlockquotePlugin`, `CodePlugin`, `CodeSamplePlugin` | Plugin factories | Quote/code tooling |
| `ClearFormattingPlugin` | Plugin factory | Formatting reset behavior |
| `FontSizePlugin`, `FontFamilyPlugin`, `LineHeightPlugin` | Plugin factories | Typography controls |
| `TextAlignmentPlugin`, `IndentPlugin`, `DirectionPlugin`, `CapitalizationPlugin` | Plugin factories | Layout + writing direction controls |
| `TextColorPlugin`, `BackgroundColorPlugin` | Plugin factories | Color tooling |
| `MathPlugin`, `SpecialCharactersPlugin`, `EmojisPlugin` | Plugin factories | Character/math insertion |
| `PreviewPlugin`, `PrintPlugin`, `FullscreenPlugin` | Plugin factories | Viewing/output helpers |
| `PageBreakPlugin`, `FootnotePlugin`, `MergeTagPlugin`, `TemplatePlugin` | Plugin factories | Document authoring helpers |
| `CommentsPlugin`, `SpellCheckPlugin`, `A11yCheckerPlugin` | Plugin factories | Collaboration + quality plugins |
| `MediaManagerPlugin`, `DocumentManagerPlugin` | Plugin factories | Manager-backed plugins |
| `setMediaManagerConfig/getMediaManagerConfig` | Functions | Media manager runtime config |
| `setDocumentManagerConfig/getDocumentManagerConfig` | Functions | Document manager runtime config |
| `setGlobalApiConfig/getGlobalApiConfig/getGlobalApiHeaders/buildApiUrl` | Functions | Shared API config layer |
| `ApiConfig`, `MediaManagerConfig`, `DocumentManagerConfig` | Type exports | Config contracts |
| `@editora/plugins/lite` | Entry export | Lightweight subset for smaller bundles |
| `@editora/plugins/<plugin-name>` | Subpath exports | Per-plugin imports for tree-shaking/lazy loading |

## Usage Example

```ts
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  HistoryPlugin,
  TablePlugin,
  SpellCheckPlugin,
} from "@editora/plugins";

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  HistoryPlugin(),
  TablePlugin(),
  SpellCheckPlugin(),
];
```

## Best Practices

- Keep toolbar commands aligned with loaded plugin set.
- Validate structural plugins with undo/redo.
- Lazy-load heavy, dialog-based plugins in app routes where needed.

## Accessibility

Ensure all plugin dialogs and sidebars are keyboard accessible and announce state changes clearly.

## Performance Notes

Prefer subpath imports and `@editora/plugins/lite` when you need a smaller default bundle.
