---
title: Versioning And Releases
description: Versioned documentation strategy for Editora packages and ecosystem releases.
keywords: [versioning, releases, docs]
---

# Versioning And Releases

Versioned documentation strategy for Editora packages and ecosystem releases.

## Model

- `current` docs branch labeled as **Next**
- Snapshot docs for each stable release
- Maintain at least the latest three active release lines

## Commands

```bash
npm run version:cut 1.0.0
```

## Policy

Breaking releases must ship migration docs before publishing new package versions.

## Release checklist

- Align all internal `@editora/*` dependency ranges.
- Build and smoke-test docs before publish.
- Validate React peer ranges and package exports.
- Publish package notes with upgrade/migration references.

## Recommended tagging

- `vX.Y.Z` for monorepo release tags
- Package-level changelog sections for core/react/plugins/themes/icons/ui/toast
