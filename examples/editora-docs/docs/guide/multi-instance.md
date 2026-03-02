---
title: "Multi-Instance Patterns"
description: Multi-instance isolation patterns for commands, dialogs, sidebars, and selection state.
keywords: [editora, documentation, multi]
---

# Multi-Instance Patterns

Multi-instance isolation patterns for commands, dialogs, sidebars, and selection state.

## Instance isolation rules

- Each editor must own its toolbar, dialogs, sidebars, and statusbar updates.
- Selection state must be captured/restored per instance.
- Commands must execute against active instance only.

## UI surface scoping

- Mount comments/spellcheck sidebars to the local editor container.
- Position inline dialogs relative to the clicked toolbar control in the same instance.
- Prevent close/open handlers from toggling sibling editor overlays.

## Common failure patterns to avoid

- Global `document.querySelector(...)` resolving first/last matching editor.
- Shared singleton state for selection, panel visibility, or toolbar context.
- Cross-instance event handlers not filtered by editor root.

## Recommended architecture

1. Keep an editor-local runtime context object.
2. Register listeners through the instance lifecycle.
3. Remove listeners and mounted overlays on destroy.
4. Use editor root references for all DOM queries.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| Instance-scoped command registry | Runtime API | Ensures commands execute only on focused editor |
| Editor root/container references | Mount API | Ensures dialogs/sidebars attach to the correct editor host |
| Selection capture/restore per instance | Editing API | Prevents cross-instance range corruption |
| Lifecycle hooks (`onInit`, `onDestroy`) | Integration API | Registers and tears down listeners/panels safely |

## Config Matrix

| Concern | Configuration/Pattern | Outcome |
| --- | --- | --- |
| Panel mounting | local host container refs | no cross-instance leakage |
| Command routing | active-editor context | correct target execution |
| Theme scope | per-editor class/attribute | mixed-theme support |
| Teardown | lifecycle cleanup hooks | no dangling listeners |

## Validation Checklist

- Opening/closing a panel in editor A never toggles editor B.
- Selection-based commands apply only to the active editor.
- Statusbar counters update only for the editor being edited.
- Destroying one instance leaves other instances fully operational.
