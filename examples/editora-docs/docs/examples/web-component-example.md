---
title: Web Component Example
description: Practical setup patterns for `<editora-editor>` with plugin loading, toolbar composition, theming, and multi-instance layout.
keywords: [editora, documentation]
---

# Web Component Example

Practical setup patterns for `<editora-editor>` with plugin loading, toolbar composition, theming, and multi-instance layout.

## Minimal setup

```html
<editora-editor
  id="editor-a"
  theme="light"
  plugins="bold italic underline link table history"
  toolbar-items="undo redo | bold italic underline | link table"
  placeholder="Start writing..."
  statusbar="true"
></editora-editor>
```

## Multi-instance setup

- Give every editor a unique `id`.
- Keep plugin sets and toolbar layouts context-specific.
- Use per-instance theme attributes/classes when mixing light and dark editors.

## Runtime checks

- Verify command routing stays local to focused editor.
- Verify sidebars/dialogs mount under the clicked editor container.
- Verify status bar metrics update only for active instance.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `<editora-editor plugins=\"...\">` | Attribute API | Declares plugin set for the instance |
| `toolbar-items=\"...\"` | Attribute API | Declares command layout and grouping |
| `theme`, `statusbar`, `placeholder`, `height` | Attribute API | Controls visual/UX behavior per instance |
| `setConfig({...})` | Runtime method | Updates toolbar/autosave/security/performance/accessibility without remount |
| `change` and focus/selection events | Event API | Sync content/state with host application logic |
| `execCommand(...)` (when exposed by runtime) | Command API | Executes instance-scoped commands from external controls |

## Config Matrix

| Use Case | Suggested Config |
| --- | --- |
| Minimal editor | small plugin set + compact toolbar |
| Document editor | full plugin set + statusbar + autosave |
| Multi-editor page | unique ids + scoped panels + mixed themes |

## Validation Checklist

- Initial content renders without cursor-jump regressions.
- Selection commands and dialogs remain stable after focus changes.
- Readonly mode preserves interactive restrictions correctly.
