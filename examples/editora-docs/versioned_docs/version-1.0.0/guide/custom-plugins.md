# Custom Plugins

Custom plugins let you add commands, toolbar actions, dialogs, and content behavior.

## Plugin anatomy

A plugin usually contains:

- Unique `name`
- `commands` map
- `toolbar` item declarations
- Optional `keymap`
- Optional initialization logic

## Minimal plugin template

```ts
export function MyPlugin() {
  return {
    name: "myPlugin",
    toolbar: [
      { label: "My Action", command: "myCommand", type: "button", icon: "✨" },
    ],
    commands: {
      myCommand: (_args, context) => {
        const el = context?.contentElement;
        if (!el) return false;
        document.execCommand("insertText", false, "My value");
        return true;
      },
    },
    keymap: {
      "Mod-Shift-M": "myCommand",
    },
  };
}
```

## Plugin types

- Mark/formatting plugins
- Block/structure plugins
- Command-only utility plugins
- Dialog-driven plugins

## Integration checklist

1. Register commands before toolbar binding
2. Preserve and restore selection around dialogs
3. Scope all overlays to the active editor instance
4. Emit input/update events after DOM mutation
5. Verify undo/redo compatibility with structural changes

## Packaging checklist

- Export from package root
- Provide TS types
- Include build artifacts (ESM/CJS as required)
- Document commands and keyboard shortcuts

## Common pitfalls

- Global query selectors causing cross-instance bugs
- Selection loss on toolbar click
- Missing cleanup for event listeners/dialog nodes
- Theme-incompatible plugin UI surfaces

## API Surface

- `name`: plugin identity
- `commands`: executable command map
- `toolbar`: UI action declarations
- `keymap`: keyboard bindings
- `init`/lifecycle hooks for setup and listeners

## Config Matrix

| Field | Required | Purpose |
| --- | --- | --- |
| `name` | Yes | Plugin identity and diagnostics |
| `commands` | Yes | Runtime action handlers |
| `toolbar` | No | Toolbar integration |
| `keymap` | No | Keyboard command mapping |
| `init` | No | Startup/setup behavior |

## Validation Checklist

- Commands run only in intended editor context
- Selection-sensitive actions preserve caret/range
- Plugin DOM mutations are undo/redo safe
- Event listeners are cleaned up on teardown paths
