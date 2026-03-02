# Features

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

- Command execution via runtime/plugin command maps
- Toolbar command wiring per plugin
- Runtime config hooks (`autosave`, `security`, `performance`, `accessibility`)

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
