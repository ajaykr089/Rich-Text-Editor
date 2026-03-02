---
title: Deployment (Vercel)
description: Production deployment strategy for Editora docs on Vercel.
keywords: [vercel, deployment, docs]
---

# Deployment (Vercel)

## Build settings

- Build command: `npm run build`
- Output directory: `build`

## Environment variables

- `DOCSEARCH_APP_ID`
- `DOCSEARCH_API_KEY`
- `DOCSEARCH_INDEX_NAME`

## Release flow

1. Validate build in CI
2. Deploy preview per PR
3. Promote to production on merge
4. Verify sitemap and metadata post-deploy
