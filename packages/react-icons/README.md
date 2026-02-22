# @editora/react-icons

React icon components for `@editora/icons`.

## Features

- Radix-style icon usage (`<CheckIcon />`) with SVG output
- Shared theming via `IconProvider`
- `outline`, `solid`, `duotone` variant support
- `currentColor`-first for design-token theming
- Works with icon names (`<Icon name="chart-line" />`) and named exports

## Install

```bash
npm install @editora/react-icons @editora/icons
```

## Usage

```tsx
import { IconProvider, CheckIcon, ChartLineIcon, Icon } from '@editora/react-icons';

export function Example() {
  return (
    <IconProvider value={{ size: 18, color: 'var(--ui-fg)', variant: 'outline' }}>
      <CheckIcon ariaLabel="Saved" />
      <ChartLineIcon variant="duotone" secondaryColor="var(--ui-muted)" />
      <Icon name="command" title="Command Palette" />
    </IconProvider>
  );
}
```
