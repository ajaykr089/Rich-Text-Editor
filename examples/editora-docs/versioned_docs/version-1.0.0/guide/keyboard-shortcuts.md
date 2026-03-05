# Keyboard Shortcuts

Shortcut availability depends on active plugins and host-level shortcut conflicts.

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

- Plugin keymaps map shortcuts to commands
- Runtime command dispatcher executes mapped actions

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Plugin keymap | per-plugin `keymap` | Adds/remaps shortcuts |
| App-level handling | host app key listeners | Prevent/allow global conflicts |

## Validation Checklist

- Shortcuts trigger expected commands in focused editor
- Browser/system shortcut collisions are handled explicitly
- Multi-instance pages apply shortcuts to active editor only
