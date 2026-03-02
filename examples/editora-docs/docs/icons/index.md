---
title: "@editora/icons"
description: Framework-neutral icon package for Editora ecosystem surfaces.
keywords: [icons, svg, ui]
---

# @editora/icons

Framework-neutral icon package for Editora ecosystem surfaces.

## Installation

```bash
npm i @editora/icons
```

## Quick Start

```ts
import { renderIconSvg } from "@editora/icons";

const svg = renderIconSvg("check", { variant: "outline", size: 16, color: "currentColor" });
```

## Usage

Use registry APIs to query/extend icons and render APIs to generate SVG/data URIs for UI surfaces.

## Examples

- Resolve icon metadata and aliases
- Register app-specific icon sets
- Render SVG strings for framework-agnostic UI

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `iconDefinitions`, `iconNameList` | Data exports | Full icon catalog metadata |
| `getIcon`, `hasIcon`, `listIcons`, `listIconAliases`, `resolveIcon` | Registry functions | Read/query icon metadata and aliases |
| `registerIcon`, `registerIcons` | Registry functions | Register single or bulk custom icons |
| `renderIconSvg`, `iconToDataUri` | Rendering functions | Produce SVG strings and data URIs |
| `registerWithEditoraUI(registerFn)` | Integration helper | Bridges icon catalog into `@editora/ui-core` registries |
| `IconDefinition`, `IconGlyph`, `IconRenderOptions`, `IconVariant`, `ResolvedIcon` | Type exports | Authoring and rendering type contracts |

## Best Practices

- Prefer `currentColor` for theme-aware icons.
- Keep custom icon names stable to avoid breaking consumers.
- Register custom icons at app startup, not per render.

## Accessibility

Icon-only actions must always include an accessible text label via surrounding control attributes.

## Performance Notes

Use named imports and avoid dynamic registry mutation during high-frequency UI updates.
