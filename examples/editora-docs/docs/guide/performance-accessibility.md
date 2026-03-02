---
title: "Performance And Accessibility"
description: Performance and accessibility strategy for scalable editing experiences and inclusive UX.
keywords: [editora, documentation, performance]
---

# Performance And Accessibility

Performance and accessibility strategy for scalable editing experiences and inclusive UX.

## Performance focus areas

- Debounced input/change pipelines.
- Scoped DOM scanning (`viewport-only` when feasible).
- Multi-instance isolation to avoid cross-editor work.
- Lightweight plugin selection for bundle control.

## Accessibility focus areas

- ARIA roles and `aria-*` metadata on editable regions.
- Keyboard-first navigation for toolbar and dialogs.
- Command discoverability via labels/tooltips.
- Optional accessibility checker workflows.

## Practical tuning

1. Keep plugin lists minimal for each editor context.
2. Use debounced input for analytics/autosave pipelines.
3. Enable viewport-scoped scans for long documents.
4. Validate focus order across toolbar, content, dialogs, and sidebars.

## Multi-instance considerations

- Ensure status bar and selection tracking are editor-scoped.
- Keep spellcheck/comments sidebars mounted per instance.
- Avoid global listeners that mutate non-active editors.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `performance.debounceInputMs` | Runtime config | Reduces high-frequency change churn |
| `performance.viewportOnlyScan` | Runtime config | Limits expensive traversal work for large documents |
| `accessibility.enableARIA` | Runtime config | Enables semantic ARIA metadata |
| `accessibility.keyboardNavigation` | Runtime config | Enables keyboard-first interaction model |
| `accessibility.checker` | Runtime/plugin config | Enables accessibility auditing workflows |
| Plugin keyboard/focus contracts | Plugin API | Ensures dialogs/toolbars stay keyboard accessible |

## Config Matrix

| Dimension | Option | Impact |
| --- | --- | --- |
| Input throughput | `debounceInputMs` | lower CPU/churn |
| Large docs | `viewportOnlyScan` | reduced traversal cost |
| Assistive tech | `enableARIA` | improved semantics |
| Keyboard UX | `keyboardNavigation` | complete non-pointer workflow |
| Quality checks | `checker` | authoring-time a11y feedback |

## Validation Checklist

- Typing latency remains stable in long documents.
- Keyboard-only users can access all primary editing features.
- Focus trap/escape behavior is correct in modals and side panels.
- Performance and a11y settings behave consistently in React and web component modes.
