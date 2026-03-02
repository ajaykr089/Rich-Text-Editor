---
title: "@editora/react"
description: React wrapper for Editora editor lifecycle and integrations.
keywords: [react, wrapper, editor]
---

# @editora/react

## Installation

```bash
npm i @editora/react @editora/core @editora/plugins @editora/themes
```

## Quick Start

```tsx
import { EditoraEditor } from "@editora/react";

export function App() {
  return <EditoraEditor placeholder="Compose..." />;
}
```

## Usage

Supports controlled/uncontrolled content flows, lifecycle callbacks, toolbar configuration, and theme scoping.

## Examples

- Controlled state editor
- Floating toolbar enablement
- Multi-instance page with independent side panels

## API Reference

`EditoraEditor` props include content, callbacks, toolbar, statusbar, theme scope, and runtime configuration blocks.

## Best Practices

- Keep props stable for high-frequency renders.
- Scope theme classes per editor root.
- Validate plugin interactions in multi-instance pages.

## Accessibility

Ensure keyboard navigation, focus management, and ARIA semantics are enabled.

## Performance Notes

Prefer debounced input handlers and avoid expensive parent re-renders on every change event.
