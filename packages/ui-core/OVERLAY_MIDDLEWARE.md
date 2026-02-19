# Overlay middleware, arrow animation & flip/shift policies

This document explains the portal middleware and the options available in `computePosition` / `showPortalFor` and the headless `useFloating` helper.

## Features

- Arrow support: place a small `.arrow` element inside your floating panel; the portal will position it automatically.
- Shift policy: nudge the floating element along the cross-axis to keep the anchor visible.
- Flip policy: automatic flip when primary placement would be offscreen (top <-> bottom).
- Virtual anchors: position overlays at client coordinates (useful for context menus / cursor-based popovers).
- Arrow offset animation: arrow `left/top` changes are animated via CSS.

## API (quick)

- computePosition(anchor|virtual, content, { placement?, offset?, flip?, shift? })
- showPortalFor(anchor|virtual, content, { placement?, offset?, flip?, shift? })
- useFloating(...) (React) — headless helpers: `getReferenceProps`, `getFloatingProps`, `openPopup`, `closePopup`, keyboard helpers

## Examples

Headless React (keyboard + ARIA):

```tsx
const { referenceRef, floatingRef, getReferenceProps, getFloatingProps } = useFloating({ placement: 'bottom' });
return (
  <>
    <button {...getReferenceProps()} ref={referenceRef}>Open</button>
    <div {...getFloatingProps()} ref={floatingRef} role="menu">
      <div role="menuitem">One</div>
      <div role="menuitem">Two</div>
    </div>
  </>
)
```

Virtual anchor (context menu at cursor):

```ts
const ctx = document.createElement('ui-context-menu');
ctx.querySelector('[slot="content"]').innerHTML = '<div>Option</div>';
document.body.appendChild(ctx);
ctx.openAt(mouseX, mouseY); // uses virtual anchor
```

## Styling tips

- Add `.arrow` inside your floating markup; portal places it automatically and animates its offset.
- Use `--ui-motion-base` and `--ui-motion-easing` tokens to customize animation speed/easing.

## Migration notes

- `showPortalFor` accepts virtual anchors (object with `getBoundingClientRect`) — no DOM element required.
- `computePosition` now returns `x`/`y` offsets useful for arrow placement.
