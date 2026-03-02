# @editora/icons

Framework-agnostic icon registry and rendering utilities.

## Install

```bash
npm install @editora/icons
```

## Core exports

- Registry: `iconDefinitions`, `iconNameList`, `getIcon`, `hasIcon`, `listIcons`
- Mutation: `registerIcon`, `registerIcons`
- Rendering: `resolveIcon`, `renderIconSvg`, `iconToDataUri`
- Integration: `registerWithEditoraUI`

## Render options

- `variant` (`outline`, `solid`, `duotone`)
- `size`
- `color`
- `strokeWidth`

## Quick start

```ts
import { renderIconSvg } from "@editora/icons";

const svg = renderIconSvg("check", {
  variant: "outline",
  size: 16,
  color: "currentColor",
  strokeWidth: 1.5,
});
```

## API Surface

- Query: `getIcon`, `hasIcon`, `listIcons`
- Register: `registerIcon`, `registerIcons`
- Render: `renderIconSvg`, `resolveIcon`, `iconToDataUri`

## Config Matrix

| Option | Type | Purpose |
| --- | --- | --- |
| `variant` | `"outline" \| "solid" \| "duotone"` | Visual style |
| `size` | `number` | Icon dimensions |
| `color` | `string` | Foreground color |
| `strokeWidth` | `number` | Stroke thickness |

## Validation Checklist

- Icon lookup APIs return deterministic results
- Variant fallback behavior is consistent
- Render output is stable across supported browsers
- Consumers provide accessibility labels for icon-only controls
