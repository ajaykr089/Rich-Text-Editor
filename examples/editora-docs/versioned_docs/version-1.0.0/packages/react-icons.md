# @editora/react-icons

React icon package built on top of `@editora/icons`.

## Install

```bash
npm install @editora/react-icons @editora/icons
```

## Package API

- `Icon`
- `IconProvider`, `IconContext`, `useIconContext`
- Generated named icon components
- `getIconComponent`, `createIcon`

## Icon props

- `name`
- `size`
- `variant`
- `color`
- `title` / `ariaLabel`

## Usage patterns

### Named import

```tsx
import { CheckIcon } from "@editora/react-icons";
```

### Dynamic rendering

```tsx
import { Icon } from "@editora/react-icons";
<Icon name="check" />;
```

### Provider defaults

```tsx
<IconProvider value={{ size: 18, variant: "outline" }}>
  <Icon name="check" />
</IconProvider>
```

## API Surface

- Base renderer: `Icon`
- Context: `IconProvider`, `useIconContext`
- Factory helpers: `getIconComponent`, `createIcon`

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Component props | `name/size/variant/color` | Per-icon control |
| Provider value | defaults for `size/variant/color` | Cross-tree consistency |

## Validation Checklist

- `<Icon />` works with and without provider
- Named and dynamic renders are visually consistent
- Icon-only buttons expose `ariaLabel` or accessible title
- Theme changes preserve icon contrast
