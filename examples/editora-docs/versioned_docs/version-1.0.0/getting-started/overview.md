---
title: Overview
description: Understand how Editora packages fit together in a scalable monorepo ecosystem.
keywords: [overview, architecture, packages]
---

# Overview

Editora separates runtime editing logic, framework adapters, UI layers, themes, and icons into focused packages.

## Package map

- **Runtime**: `@editora/core`
- **React adapter**: `@editora/react`
- **Feature layer**: `@editora/plugins`
- **Visual system**: `@editora/themes`
- **Icons**: `@editora/icons`, `@editora/react-icons`
- **UI layer**: `@editora/ui-core`, `@editora/ui-react`

## Recommended adoption order

1. Install core + chosen framework adapter.
2. Add only required plugins.
3. Apply theme and icon strategy.
4. Add UI packages for design-system integration.
