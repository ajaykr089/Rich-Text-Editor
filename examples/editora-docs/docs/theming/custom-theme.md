---
title: Custom Theme
description: Create a custom Editora theme from scratch or extend existing themes safely.
keywords: [custom theme, tokens, branding, css]
---

# Custom Theme

Create a custom Editora theme from scratch or extend existing themes safely.

## Recommended Workflow

1. Start from `default.css` tokens.
2. Define your brand variables (surface, text, border, accent, focus).
3. Apply theme class to a local container (`.editora-theme-yourbrand`).
4. Validate all high-interaction plugin surfaces.
5. Freeze token names and document them for app teams.

## Minimal Theme Skeleton

```css
.editora-theme-acme {
  --rte-bg: #0f172a;
  --rte-surface: #1e293b;
  --rte-text: #e2e8f0;
  --rte-muted: #94a3b8;
  --rte-border: #334155;
  --rte-accent: #22c55e;
  --rte-focus: #38bdf8;
}

.editora-theme-acme .rte-toolbar-button {
  color: var(--rte-text);
  background: var(--rte-surface);
  border-color: var(--rte-border);
}

.editora-theme-acme .rte-content {
  color: var(--rte-text);
  background: var(--rte-bg);
}
```

## Apply at Runtime

```ts
import { applyTheme } from "@editora/themes";

applyTheme(
  {
    "--rte-accent": "#14b8a6",
    "--rte-focus": "#22d3ee",
  },
  document.querySelector(".editora-theme-acme") as HTMLElement
);
```

## Extension Strategy

- Prefer CSS variable overrides over deep selector overrides.
- Keep component-specific fixes minimal and documented.
- Avoid global selectors that can leak across editors.

## Validation Matrix

- Toolbar, statusbar, floating toolbar
- Dialogs and side panels
- Text/background highlight colors
- Table and code block readability
- Disabled + active + hover + focus states

## Packaging Guidance

If publishing custom theme assets:

- ship one scoped CSS file per theme,
- document required base imports,
- version theme files alongside editor major versions.
