# @editora/core

Core runtime package for Editora.

## Responsibilities

- ContentEditable orchestration and command execution
- Plugin manager and command registration lifecycle
- Web component bootstrapping and custom element behavior
- Selection, mutation, and history integration points
- Runtime config updates (`setConfig`) in web component mode

## Runtime architecture

- Command bus for editor and plugin actions
- Plugin registration lifecycle (`init`, commands, keymaps, toolbar items)
- Event dispatch for content/selection/focus updates
- DOM transaction points for history-aware plugins

## Primary outputs

- Framework-agnostic editor runtime API
- Web component bundles (`webcomponent.js`, `webcomponent-core.js`)
- CSS bundles for editor/component rendering

## Typical usage

```ts
import { createEditor } from "@editora/core";

const editor = createEditor({
  element: document.getElementById("editor"),
  content: "<p>Hello Editora</p>",
});
```

## Web component config groups

- `toolbar`
- `autosave`
- `security`
- `performance`
- `accessibility`

```ts
await editorElement.setConfig({
  performance: { debounceInputMs: 120, viewportOnlyScan: true },
  accessibility: { enableARIA: true, keyboardNavigation: true, checker: false },
});
```

## Method families

- Content: get/set HTML
- Commands: execute command with optional args/context
- Focus: focus/blur
- Lifecycle: destroy/unmount

## Production guidance

- Always scope command dispatch to the active editor instance
- Keep plugin DOM mutations history-aware for undo/redo stability
- Validate selection-sensitive commands with toolbar + dialog interactions
- Verify multi-instance behavior under heavy plugin mixes

## Pairing

- Use with `@editora/plugins` for plugin suite
- Use with `@editora/themes` for built-in themes
- Use with `@editora/react` for React integration

## API Surface

- `createEditor(config)`
- Editor lifecycle methods (`mount`, `destroy`, etc.)
- Content methods (`getContent`, `setContent`)
- Command execution (`execCommand`)
- Focus methods (`focus`, `blur`)
- Web component runtime config updates (`setConfig`)

## Config Matrix

| Config Group | Scope | Purpose |
| --- | --- | --- |
| `toolbar` | Core/Web component | Toolbar items and behavior |
| `autosave` | Web component/Wrapper | Persistence interval and storage |
| `security` | Web component/Wrapper | Input/paste sanitization policies |
| `performance` | Web component/Wrapper | Debounce and scan optimizations |
| `accessibility` | Web component/Wrapper | ARIA, keyboard navigation, checker |

## Validation Checklist

- Command execution targets active editor only
- Selection-sensitive commands preserve expected cursor behavior
- Runtime config updates apply without remount regressions
- Multi-instance pages keep editor state isolated
