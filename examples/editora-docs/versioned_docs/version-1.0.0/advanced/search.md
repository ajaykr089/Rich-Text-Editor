---
title: Search Setup
description: Configure Algolia as primary search with local search fallback.
keywords: [search, algolia, local-search]
---

# Search Setup

## Primary: Algolia

Configure these environment variables:

- `DOCSEARCH_APP_ID`
- `DOCSEARCH_API_KEY`
- `DOCSEARCH_INDEX_NAME`

When these are available, Algolia search is used.

## Fallback: Local search

When Algolia env variables are not present, the local search plugin is enabled automatically.

## Why this strategy

- Reliable search in preview/staging environments
- Enterprise-ready hosted search in production
