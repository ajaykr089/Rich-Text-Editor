---
title: "@editora/ui-core"
description: UI primitives and foundational components for Editora integrations.
keywords: [ui-core, components, primitives]
---

# @editora/ui-core

## Installation

```bash
npm i @editora/ui-core
```

## Quick Start

Use primitives for dialogs, overlays, menus, and layout shells.

## Usage

Compose UI primitives into editor and app-level components while preserving theme and accessibility contracts.

## Examples

- Dialog and panel composition
- Token-driven styling with theme layers
- Shared app/editor interaction patterns

## API Reference

Provides foundational components, utility hooks, and style/token integration points.

## Best Practices

- Keep primitive usage composable and predictable.
- Centralize design-token mapping.

## Accessibility

Focus traps, escape behavior, and semantic roles should be validated for every interactive primitive.

## Performance Notes

Minimize unnecessary portal re-renders and avoid global layout thrash in overlay-heavy screens.
