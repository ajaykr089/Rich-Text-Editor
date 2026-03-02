---
title: "Features"
description: End-to-end feature map for editing, workflows, collaboration, and platform integrations.
keywords: [editora, documentation, features]
---

# Features

End-to-end feature map for editing, workflows, collaboration, and platform integrations.

## Core editing

- Rich text formatting: bold, italic, underline, strikethrough
- Block semantics: headings, paragraph, blockquote, code block
- List systems: bullet, ordered, checklist

## Typography and styling

- Font family and font size
- Text color and background color
- Line height
- Clear formatting

## Layout and structure

- Alignment and text direction
- Indent and outdent
- Page break
- Table authoring and editing

## Rich content and insertion

- Links and anchors
- Image and video insertion
- Math formulas
- Code samples
- Special characters and emojis
- Templates and merge tags

## Workflow and output

- Undo/redo history
- Preview mode
- Print support
- Fullscreen mode
- Document import/export (plugin-driven)

## Collaboration and quality

- Comments
- Spell-check
- Accessibility checker

## Developer-focused capabilities

- Plugin architecture with command registration
- Runtime config updates
- Multi-instance editor support
- Floating toolbar and statusbar options
- Security/performance/accessibility config blocks

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| Runtime command map (`execCommand`) | Core API | Executes formatting, structure, workflow, and insertion commands |
| Plugin command registrations | Plugin API | Adds feature-specific command handlers and keymaps |
| Toolbar command bindings | UI API | Connects toolbar controls to plugin/runtime commands |
| Runtime config blocks | Operational API | `autosave`, `security`, `performance`, `accessibility` controls |
| Wrapper/component props | Integration API | React/web component surfaces for enabling feature groups |

## Config Matrix

| Feature Area | Primary Packages |
| --- | --- |
| Core editing runtime | `@editora/core` |
| Framework wrapper | `@editora/react` |
| Plugin features | `@editora/plugins` |
| Theming | `@editora/themes` |

## Validation Checklist

- Feature combinations work without command conflicts
- Multi-instance behavior is isolated
- Theme parity exists across toolbar/content/dialog surfaces
- Undo/redo remains stable for structural operations
