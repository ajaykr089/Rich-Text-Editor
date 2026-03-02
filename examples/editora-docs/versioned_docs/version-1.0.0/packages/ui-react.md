# @editora/ui-react

React wrappers and providers for `@editora/ui-core`.

## Install

```bash
npm install @editora/ui-react @editora/ui-core
```

## Common exports

- Components: `Button`, `Input`, `Form`, `DataTable`, and more
- Providers: `ThemeProvider`, `DialogProvider`, `AlertDialogProvider`
- Hooks: `useTheme`, `useDialog`, `useAlertDialog`, `useForm`

## Quick start

```tsx
import { ThemeProvider, Input, Button } from "@editora/ui-react";

export function App() {
  return (
    <ThemeProvider>
      <Input name="title" label="Title" />
      <Button variant="primary">Save</Button>
    </ThemeProvider>
  );
}
```

## Common patterns

- Form management with `useForm`
- Dialog workflows through providers
- Data table + filter + action workflows

## SSR and StrictMode notes

- Keep browser-only initialization inside effects
- Ensure providers are mounted once at app-shell level
- Avoid duplicate global listeners in StrictMode development re-renders

## API Surface

- Provider components (`ThemeProvider`, dialog providers)
- UI components and wrappers
- Hooks for theme/dialog/form/data workflows

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Provider props | theme/dialog defaults | Cross-tree behavior |
| Hook options | form/dialog/table settings | Feature-level customization |
| Component props | variant/size/state | Per-component behavior |

## Validation Checklist

- Provider order supports expected hook usage
- SSR hydration remains stable for wrapped components
- StrictMode double-render does not duplicate global side effects
