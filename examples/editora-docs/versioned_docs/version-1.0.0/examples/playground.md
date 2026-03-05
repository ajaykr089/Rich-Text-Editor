---
title: Playground
description: Practical workflow for validating editor behavior during development and release hardening.
---

# Playground

Use the playground as the primary manual QA and integration verification flow.

## Suggested sequence

1. Core editing behavior
2. Toolbar command behavior
3. Plugin dialog/sidebar behavior
4. Multi-instance isolation
5. Theme parity
6. Undo/redo after structural edits

## Core editing checks

- Typing, selection, copy/paste
- Enter/backspace at line boundaries
- Placeholder visibility and empty-state behavior
- Focus/blur transitions

## Toolbar and command checks

- Formatting commands toggle correctly
- List/checklist conversions remain stable
- Alignment/indent/direction commands apply expected DOM updates
- History commands restore content predictably

## Plugin interaction checks

- Link/color/math/special-character dialogs
- Spell-check and comments side panels
- Media and table contextual workflows
- Preview/print flows

## Multi-instance checks

- Sidebars mount to the correct editor host
- Closing one instance panel does not open/toggle another
- Command execution stays scoped to active editor

## Theme checks

- Light and dark mode icon contrast
- Dialog readability and hover/focus states
- Table/code block readability in dark mode

## Release gate checklist

- No critical console errors under normal interaction
- No cross-instance command leakage
- No flickering overlays or unstable panel positioning
- No regressions in readonly behavior

## API Surface

- Manual QA coverage over command/event/lifecycle surfaces
- Runtime configuration toggling under realistic interaction patterns

## Config Matrix

| Validation Area | Key Config/Surface |
| --- | --- |
| Editor behavior | Core commands + history |
| UI behavior | Toolbar, dialogs, sidebars |
| Operational behavior | Autosave/security/performance/accessibility |

## Validation Checklist

- Repeatability across browsers/devices
- Stability in long sessions and large documents
- Correct behavior with multiple visible editors
- Theme consistency for all plugin UI surfaces
