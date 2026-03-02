---
title: Versioning And Releases
description: Versioned documentation strategy for Editora packages and ecosystem releases.
keywords: [versioning, releases, docs]
---

# Versioning And Releases

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
