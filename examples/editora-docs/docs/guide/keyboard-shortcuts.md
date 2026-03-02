---
title: "Keyboard Shortcuts"
description: Keyboard shortcut reference for core editing commands and productivity workflows.
keywords: [editora, documentation, keyboard]
---

# Keyboard Shortcuts

Keyboard shortcut reference for core editing commands and productivity workflows.

## Text formatting

- `Ctrl/Cmd + B`: Bold
- `Ctrl/Cmd + I`: Italic
- `Ctrl/Cmd + U`: Underline
- `Ctrl/Cmd + Shift + X`: Strikethrough

## Blocks and lists

- `Ctrl/Cmd + 0`: Paragraph
- `Ctrl/Cmd + 1..6`: Headings
- `Ctrl/Cmd + Shift + Q`: Blockquote
- `Ctrl/Cmd + Shift + C`: Code block
- `Ctrl/Cmd + Shift + 8`: Bullet list
- `Ctrl/Cmd + Shift + 7`: Ordered list

## Alignment and direction

- `Ctrl/Cmd + L`: Align left
- `Ctrl/Cmd + E`: Align center
- `Ctrl/Cmd + R`: Align right
- `Ctrl/Cmd + J`: Justify

## Editing and workflow

- `Ctrl/Cmd + K`: Link dialog
- `Ctrl/Cmd + Shift + V`: Paste as plain text
- `Tab`: Indent
- `Shift + Tab`: Outdent

## History

- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Ctrl/Cmd + Shift + Z`: Redo

## Plugin-specific examples

- `Mod-Shift-j`: Emoji dialog
- `Mod-Shift-m`: Math dialog
- `Mod-p`: Print
- `F7`: Spell-check toggle

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| Plugin `keymap` declarations | Config API | Maps keystrokes to plugin command identifiers |
| Runtime command dispatcher | Execution API | Executes mapped command in active editor instance |
| `useKeyboardShortcuts(options)` | React hook API | Wrapper-level keyboard shortcut registration/control |
| Toolbar command mapping | UI API | Maintains parity between shortcuts and visible actions |

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Plugin keymap | per-plugin `keymap` | Adds/remaps shortcuts |
| App-level handling | host app key listeners | Prevent/allow global conflicts |

## Validation Checklist

- Shortcuts trigger expected commands in focused editor
- Browser/system shortcut collisions are handled explicitly
- Multi-instance pages apply shortcuts to active editor only
