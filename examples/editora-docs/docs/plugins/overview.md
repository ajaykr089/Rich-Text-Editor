---
title: "Plugin Overview"
description: Functional grouping and engineering guidelines for the Editora plugin ecosystem.
keywords: [editora, plugins, overview, architecture, integration]
---

# Plugin Overview

Functional grouping and engineering guidelines for the Editora plugin ecosystem.

## Main Plugin Groups

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

## Engineering Guidelines

- Preserve selection before command execution.
- Keep dialogs and sidebars scoped to active editor instances.
- Ensure undo/redo snapshots include structural DOM mutations.
- Validate plugin UI in both light and dark themes.
