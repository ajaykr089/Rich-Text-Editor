---
title: API Auto-Generation (Future)
description: Plan for TypeDoc-based API generation in Editora docs.
keywords: [typedoc, api generation, automation]
---

# API Auto-Generation (Future)

## Recommended path

1. Add `typedoc` + `docusaurus-plugin-typedoc`.
2. Generate docs from package `tsconfig` entry points.
3. Publish generated docs under `docs/api-generated/*`.
4. Link generated pages from manual package overviews.

## Governance

Manual pages own architecture guidance; generated pages own raw API signatures.
