# Plugin Overview

Editora plugins are modular and can be combined based on product needs.

## Main plugin groups

### Formatting and structure

- Bold, italic, underline, strikethrough
- Heading, lists, checklist
- Indent, direction, alignment
- Font and color controls

### Content insertion

- Link and anchor
- Image/media
- Table
- Math
- Code sample
- Special characters and emojis

### Workflow and output

- History
- Preview
- Print
- Fullscreen
- Document manager

### Collaboration and quality

- Comments
- Spell check
- Accessibility checker

## Engineering guidelines

- Preserve selection before command execution.
- Keep dialogs and sidebars scoped to active editor instances.
- Ensure undo/redo snapshots include structural DOM mutations.
- Validate plugin UI in both light and dark themes.
