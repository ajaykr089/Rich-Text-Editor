# @editora/ui-core

Framework-agnostic UI layer with custom elements, dialog managers, and theming helpers.

## Install and bootstrap

```bash
npm install @editora/ui-core
```

```ts
import "@editora/ui-core";
```

## Core utilities

- State helpers: `createSignal`, `computed`, `effect`
- Theme helpers: `applyTheme`, `defaultTokens`
- Overlay/focus utilities
- Toast and notification primitives

## Dialog managers (Promise API)

- `createDialogManager`
- `createAlertDialogManager`

```ts
const dialogs = createDialogManager();
const ok = await dialogs.confirm({ title: "Delete record" });
```

## Component groups

- Primitives and form controls
- Layout and navigation components
- Data display components
- Overlays and interaction components

## Integration pattern

- Initialize UI core once near app startup
- Keep dialog managers in app-level scope
- Apply theme tokens before mounting complex UIs

## API Surface

- State primitives
- Theme/token helpers
- Dialog manager factories
- Core UI component registrations

## Config Matrix

| Area | Config/Entry | Purpose |
| --- | --- | --- |
| Theme | `applyTheme`, token overrides | App-wide visual configuration |
| Dialogs | manager options at invocation | Confirm/alert prompt behavior |
| Components | registration/import scope | UI component availability |

## Validation Checklist

- Dialog promises resolve correctly for all action paths
- Theme tokens apply consistently across components
- Overlay/focus handling remains predictable under nested dialogs
