---
title: v1 to v2 Migration
description: Migration planning template for major Editora upgrades.
keywords: [migration, breaking changes, upgrade]
---

# v1 to v2 Migration

Migration planning template for major Editora upgrades.

## Migration checklist

- Audit changed package versions
- Map renamed/removed APIs
- Validate plugin compatibility matrix
- Update theming token names
- Run regression suite for multi-instance behavior

## Recommended migration order

1. Upgrade `@editora/core` and fix runtime API changes.
2. Upgrade wrappers (`@editora/react`, web component usage).
3. Upgrade plugins and revalidate toolbar command IDs.
4. Upgrade themes/icons and verify visual parity.
5. Run regression QA for selection, history, sidebars, and dialogs.

## High-risk areas

- Selection-sensitive commands after toolbar/dialog interactions
- Cross-instance mounting for spell-check and comments sidebars
- Dark mode parity for plugin dialogs and table/code surfaces
