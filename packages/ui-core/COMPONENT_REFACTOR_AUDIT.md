# UI Core Component Refactor Audit

Scope: `packages/ui-core/src/components` (41 components)

This checklist follows `.prompts/refactor.md` and `.prompts/editora-ui.2.0.md`.

## Refactor Criteria

1. Structure: clear controller vs renderer responsibility, no mixed render systems.
2. Lifecycle safety: no duplicate listeners on reconnect; all global listeners cleaned up.
3. Developer API: predictable attributes, methods, and emitted events.
4. Accessibility: role/aria correctness, keyboard behavior, and focus safety.
5. Integration safety: React/Vue wrappers should not depend on shadow internals.
6. Type ergonomics: component class exported from `src/index.ts`.

## Status Legend

- `done-baseline`: baseline safety/API pass completed.
- `in-review`: currently being audited/refactored.
- `queued`: not started yet.

## Component-by-Component Status

- `ui-context-menu.ts`: `done-baseline` (headless slot model, imperative API, style bridge, submenu positioning).
- `ui-dropdown.ts`: `done-baseline` (listener lifecycle hardened).
- `ui-popover.ts`: `done-baseline` (listener lifecycle hardened).
- `ui-menu.ts`: `done-baseline` (listener lifecycle hardened).
- `ui-modal.ts`: `done-baseline` (listener lifecycle hardened).
- `ui-tooltip.ts`: `done-baseline` (listener lifecycle cleanup, portal cleanup before re-show).
- `ui-alert-dialog.ts`: `done-baseline` (idempotent open/headless state transitions).
- `ui-hover-card.ts`: `done-baseline` (idempotent open/headless state transitions).
- `ui-portal.ts`: `done-baseline` (slotchange listener lifecycle safety).
- `ui-toast.ts`: `done-baseline` (removed inline handlers, escaped message rendering, typed timeout map).
- `ui-tabs.ts`: `done-baseline` (stable tab click handlers, removed redundant render path).
- `ui-accordion.ts`: `done-baseline` (removed double render path, safer header click targeting, idempotent state setters).
- `ui-collapsible.ts`: `done-baseline` (slot-based header/content structure, safer toggle event detection, idempotent state setters).
- `ui-toggle.ts`: `done-baseline` (idempotent setters, stable uncontrolled toggle behavior).
- `ui-toggle-group.ts`: `done-baseline` (host-level event handling, safer value mapping/sync, slotchange sync).
- `ui-checkbox.ts`: `done-baseline` (fixed keyboard toggle path, stable aria ids, safer click detection).
- `ui-radio-group.ts`: `done-baseline` (removed duplicate slot rendering, idempotent state setters, safer click/keyboard handling).
- `ui-switch.ts`: `done-baseline` (fixed keyboard toggle path, safer click detection, idempotent setters).
- `ui-select.ts`: `done-baseline` (idempotent setters, reduced render churn in event path).
- `ui-input.ts`: `done-baseline` (stable listener lifecycle across renders, disconnected cleanup, safer error rendering).
- `ui-slider.ts`: `done-baseline` (idempotent setters, avoids full re-render on input/change).
- `ui-button.ts`: `done-baseline` (reviewed; structure/lifecycle acceptable for baseline pass).
- `ui-label.ts`: `done-baseline` (idempotent setter, removed redundant manual render).
- `ui-avatar.ts`: `done-baseline` (removed inline image handlers, explicit listener cleanup, idempotent setter).
- `ui-icon.ts`: `done-baseline` (reviewed; standalone custom element behavior acceptable for baseline pass).
- `ui-progress.ts`: `done-baseline` (reviewed; baseline behavior/events acceptable).
- `ui-presence.ts`: `done-baseline` (reviewed; transition listener lifecycle handled).
- `ui-separator.ts`: `done-baseline` (reviewed; baseline structure acceptable).
- `ui-scroll-area.ts`: `done-baseline` (attribute-change guard + robust reach-end detection).
- `ui-toolbar.ts`: `done-baseline` (keyboard nav uses composed path for slotted focus targets).
- `ui-pagination.ts`: `done-baseline` (reviewed; baseline keyboard and event flow acceptable).
- `ui-form.ts`: `done-baseline` (reviewed; controller wrapper structure acceptable).
- `ui-box.ts`: `done-baseline` (reviewed; responsive style lifecycle/cleanup present).
- `ui-flex.ts`: `done-baseline` (reviewed; responsive style lifecycle/cleanup present).
- `ui-grid.ts`: `done-baseline` (reviewed; responsive style lifecycle/cleanup present).
- `ui-section.ts`: `done-baseline` (reviewed; baseline structure acceptable).
- `ui-container.ts`: `done-baseline` (fixed initial headless sync + guarded attribute updates).
- `ui-slot.ts`: `done-baseline` (slot listener lifecycle cleanup and initial state sync).
- `ui-direction-provider.ts`: `done-baseline` (implemented dir/headless attribute sync path, idempotent setter).
- `ui-aspect-ratio.ts`: `done-baseline` (idempotent setter + resize observer guard).
- `ui-visually-hidden.ts`: `done-baseline` (initial headless sync + guarded attribute updates).

## Execution Order

1. Overlay primitives: `tooltip`, `alert-dialog`, `hover-card`, `portal`, `toast`.
2. Composite interaction primitives: `tabs`, `accordion`, `collapsible`, `toggle`, `toggle-group`, `toolbar`.
3. Form/input primitives: `input`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `label`, `form`.
4. Layout/utility primitives: `box`, `flex`, `grid`, `section`, `container`, `separator`, `slot`, `direction-provider`, `aspect-ratio`, `visually-hidden`, `presence`, `progress`, `avatar`, `icon`, `pagination`, `scroll-area`.
