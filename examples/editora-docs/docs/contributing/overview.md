---
title: Contributing Overview
description: Contribution standards for Editora documentation.
keywords: [contributing, docs, standards]
---

# Contributing Overview

Contribution standards for Editora documentation.

## Workflow

1. Create branch from main
2. Implement docs changes with required templates
3. Run local build and link checks
4. Submit PR with screenshots for UI changes

## Branch and commit conventions

- Branch names: `docs/<topic>`, `feat/docs-<topic>`, `fix/docs-<topic>`
- Commit prefixes: `docs:`, `feat:`, `fix:`, `chore:`
- Keep one primary concern per PR

## Required checks

- Build passes
- No broken links
- Frontmatter present on new pages
- Dark/light readability validated

## PR template minimum

- Summary of changed pages
- Why the change was needed
- Before/after screenshots for visual edits
- Validation notes (`npm run build`, manual navigation checks)
