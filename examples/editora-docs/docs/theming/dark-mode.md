---
title: Dark Mode
description: Implement and validate dark mode across editor and UI surfaces.
keywords: [dark mode, contrast, theme, accessibility]
---

# Dark Mode

Implement and validate dark mode across editor and UI surfaces.

## Enable Dark Theme

### Web Component

```html
<editora-editor theme="dark"></editora-editor>
```

### React / App Shell

```tsx
<div className="editora-theme-dark">
  <EditoraEditor />
</div>
```

## Required CSS Imports

```ts
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
```

## What to Verify

- Toolbar icon contrast and stroke weight
- Placeholder readability in empty content
- Dialog and sidebar colors inside editor container boundaries
- Focus rings on keyboard navigation
- Table borders/cells and code block readability

## Multi-Instance Behavior

When two editors use different themes on one page, each editor must render dialogs and side panels inside its own themed container.

Expected behavior:

- Editor A (`light`) opens light picker/panel.
- Editor B (`dark`) opens dark picker/panel.
- Closing one panel must not auto-open same panel in another instance.

## Dark Mode QA Checklist

- Text color picker, background color picker
- Spell-check sidebar and suggestions menu
- Comments sidebar and thread items
- Floating toolbar and inline menus
- Table controls and inserted table visuals
- Code sample and source editor dialogs
