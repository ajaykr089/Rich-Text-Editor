---
title: Plugin Directory
description: Catalog of major Editora plugins and recommended integration stacks.
---

# Plugin Directory

## Plugin catalog

- `MediaManagerPlugin`: image/video insertion workflows
- `TablePlugin`: table creation and editing
- `CodeSamplePlugin`: code blocks with language labels
- `ChecklistPlugin`: interactive checklist items
- `TemplatePlugin`: reusable content templates
- `CommentsPlugin`: in-editor comments panel
- `LinkPlugin`: link dialog and actions
- `PrintPlugin`: print rendering workflow
- `PreviewPlugin`: modal preview mode
- `HistoryPlugin`: undo/redo and DOM transactions
- `SpellCheckPlugin`: spelling suggestions panel
- `EmojisPlugin`: emoji picker dialog
- `SpecialCharactersPlugin`: symbol picker
- `MathPlugin`: formula insertion
- `DocumentManagerPlugin`: import/export workflows

## Recommended stacks

### Blog editor

- `MediaManagerPlugin`
- `CodeSamplePlugin`
- `TemplatePlugin`
- `LinkPlugin`

### Technical documentation

- `CodeSamplePlugin`
- `TablePlugin`
- `MathPlugin`
- `SpecialCharactersPlugin`

### Collaborative workspace

- `CommentsPlugin`
- `HistoryPlugin`
- `DocumentManagerPlugin`
- `PreviewPlugin`

## Import patterns

```ts
import { CodeSamplePlugin, TablePlugin } from "@editora/plugins";
```

```ts
import { CodeSamplePlugin } from "@editora/plugins/code-sample";
import { TablePlugin } from "@editora/plugins/table";
```
