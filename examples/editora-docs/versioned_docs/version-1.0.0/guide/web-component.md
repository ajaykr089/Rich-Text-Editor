# Web Component Integration

`@editora/core` ships a native custom element (`<editora-editor>`) for framework-agnostic usage.

## When to use it

- You need one editor API across multiple frameworks.
- You want integration without a framework wrapper.
- You need multiple independent editor instances on the same page.

## Core attributes

- `plugins`: space-separated plugin ids to load.
- `toolbar-items`: command layout string with `|` separators.
- `theme`: visual mode (`light`, `dark`, custom token scope).
- `statusbar`: enable/disable status bar.
- `placeholder`: empty-editor hint text.
- `height`: fixed or controlled editor height.

## Event and lifecycle model

- Initialize via attributes and optional initial content.
- Listen for content changes from editor events/callback hooks.
- Destroy cleanly by removing the element; plugin listeners should detach with the instance.

## Multi-instance behavior

- Keep each editor id unique.
- Scope sidebars/dialog containers to the active editor host.
- Ensure command execution targets only the focused instance.

## API Surface

- Custom element API: attributes + methods + events.
- Runtime configuration update support via element props/attributes.
- Plugin command wiring resolved per editor instance.

## Config Matrix

| Concern | Config Surface | Recommended Default |
| --- | --- | --- |
| Theme | `theme` + token CSS scope | `light` (switchable) |
| Toolbar density | `toolbar-items` | grouped by workflow |
| Status metrics | `statusbar` | enabled |
| Placeholder UX | `placeholder` | explicit per context |
| Instance isolation | host scoping + unique id | required |

## Validation Checklist

- Multiple visible editors do not leak commands or panel state.
- Dialog positions resolve against the correct editor container.
- Readonly and editable modes behave consistently.
- Theme styles apply to content, toolbar, dialogs, and side panels.
