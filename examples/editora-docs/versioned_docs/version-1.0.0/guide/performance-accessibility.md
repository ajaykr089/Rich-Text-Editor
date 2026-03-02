# Performance And Accessibility

Performance and accessibility are first-class runtime concerns in Editora, not post-processing steps.

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

- Runtime `performance` config (`debounceInputMs`, scan options).
- Runtime `accessibility` config (`enableARIA`, keyboard navigation, checker hooks).
- Plugin-level keyboard and focus handling contracts.

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
