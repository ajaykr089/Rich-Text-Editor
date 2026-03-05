---
title: Brand Assets
description: Reusable Editora logos for docs, demos, and product surfaces.
---

# Brand Assets

## Primary logos

### Blocks Logo (Light)

![Editora Blocks Logo](/img/brand/editora_logo_blocks.svg)

Recommended use: light backgrounds, docs headers, cards.

### Blocks Logo (Dark)

![Editora Blocks Logo Dark](/img/brand/editora_logo_blocks_dark.svg)

Recommended use: dark surfaces and hero sections.

### Cursor Logo (Light)

![Editora Cursor Logo](/img/brand/editora_logo_cursor.svg)

Recommended use: compact marks and favicon-aligned branding.

### Cursor Logo (Dark)

![Editora Cursor Logo Dark](/img/brand/editora_logo_cursor_dark.svg)

Recommended use: dark UI contexts.

### Cursor Logo (Animated)

![Editora Cursor Logo Animated](/img/brand/editora_logo_cursor_animated.svg)

Recommended use: landing pages and branded loading states.

## Usage guidance

- Prefer SVG logos for crisp rendering
- Use dark variants on dark backgrounds only
- Keep clear space around logos
- Avoid recoloring logo internals unless defining official variants

## API Surface

- Static SVG asset set under `/img/brand/*`
- Theme-specific logo variants (light/dark)

## Config Matrix

| Asset | Recommended Context |
| --- | --- |
| `editora_logo_blocks.svg` | Light docs/marketing surfaces |
| `editora_logo_blocks_dark.svg` | Dark hero/surface contexts |
| `editora_logo_cursor.svg` | Compact icon/mark contexts |
| `editora_logo_cursor_dark.svg` | Compact mark on dark surfaces |
| `editora_logo_cursor_animated.svg` | Animated branding contexts |

## Validation Checklist

- Logo asset renders at all target sizes
- Contrast remains sufficient on chosen background
- Correct light/dark variant is used per context
- No stretched/distorted aspect ratios in UI layouts
