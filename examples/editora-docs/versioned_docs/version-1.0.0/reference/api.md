# API Reference

This page summarizes core runtime, web component, and React wrapper APIs.

## Core runtime

```ts
const editor = createEditor(options);
```

## Core options

- `element`: mount target
- `content`: initial HTML
- `plugins`: plugin factory array
- `toolbar`: toolbar config
- `shortcuts`: keyboard enablement
- `accessibility`: ARIA/keyboard/checker settings
- `performance`: debounce and scan settings

## Web component configuration

```html
<editora-editor
  theme="dark"
  toolbar-items="undo redo | bold italic underline"
  toolbar-floating="true"
  toolbar-sticky="true"
  autosave='{"enabled":true,"intervalMs":3000,"storageKey":"doc-1"}'
  security='{"sanitizeOnPaste":true,"sanitizeOnInput":true}'
  accessibility='{"enableARIA":true,"keyboardNavigation":true,"checker":false}'
  performance='{"debounceInputMs":120,"viewportOnlyScan":true}'
></editora-editor>
```

## Runtime config updates

```ts
const editor = document.querySelector("editora-editor");
await editor.setConfig({
  theme: "acme",
  toolbar: { items: "undo redo | bold italic", floating: true, sticky: true },
  autosave: { enabled: true, intervalMs: 5000, storageKey: "doc-2", provider: "localStorage" },
  security: { sanitizeOnPaste: true, sanitizeOnInput: true },
  accessibility: { enableARIA: true, keyboardNavigation: true, checker: true },
  performance: { debounceInputMs: 100, viewportOnlyScan: true },
});
```

## Common methods

- `getContent()`
- `setContent(html)`
- `execCommand(command, args?)`
- `undo()` / `redo()`
- `focus()` / `blur()`
- `destroy()`

## Events

- `change`
- `selectionChange`
- `focus`
- `blur`

## Command groups

- Formatting: `toggleBold`, `toggleItalic`, `toggleUnderline`, `toggleStrikethrough`
- Blocks: `setHeading`, `setParagraph`, `toggleBlockquote`, `insertCodeBlock`
- Lists: `toggleBulletList`, `toggleOrderedList`, `toggleChecklist`
- Alignment/layout: `setAlignLeft`, `setAlignCenter`, `setAlignRight`, `setAlignJustify`, `increaseIndent`, `decreaseIndent`
- Links/colors: `openLinkDialog`, `openTextColorPicker`, `openBackgroundColorPicker`
- History/workflow: `undo`, `redo`, `togglePreview`, `print`

## React wrapper props

- Identity: `id`, `className`
- Content: `value`, `defaultValue`, `onChange`
- Lifecycle: `onInit`, `onDestroy`
- Behavior: `plugins`, `toolbar`, `statusbar`, `floatingToolbar`
- Runtime controls: `autosave`, `security`, `performance`, `accessibility`

## API Surface

- Core creation/lifecycle APIs
- Command execution and event APIs
- Wrapper/component prop surfaces
- Web component declarative + runtime config APIs

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Core runtime | `createEditor(options)` | Base editor behavior |
| Web component | attributes + `setConfig(...)` | Declarative and runtime tuning |
| React wrapper | component props | Framework-level integration |
| Plugins | command/keymap/toolbar maps | Feature composition |

## Validation Checklist

- Methods return expected values and side effects
- Commands execute against active editor context
- Event order is stable (`focus`, `change`, `blur`)
- Runtime config updates are idempotent and instance-scoped
