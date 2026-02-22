# @editora/icons

Framework-agnostic SVG icon system for Editora.

## Features

- SVG-first and tree-shake friendly
- Theming via `currentColor`
- Variants: `outline`, `solid`, `duotone`
- Runtime registry APIs (`getIcon`, `listIcons`, `registerIcon`)
- String rendering (`renderIconSvg`) and data URI export (`iconToDataUri`)
- Optional bridge to `@editora/ui-core` icon registry

## Quick Usage

```ts
import { renderIconSvg, listIcons } from '@editora/icons';

const svg = renderIconSvg('check', {
  variant: 'outline',
  size: 16,
  color: 'currentColor',
  strokeWidth: 1.5,
  decorative: true
});

console.log(listIcons().slice(0, 10));
```

## UI Core Bridge

```ts
import { registerWithEditoraUI } from '@editora/icons';
import { registerIcon } from './your-icon-registry';

registerWithEditoraUI(registerIcon);
```
