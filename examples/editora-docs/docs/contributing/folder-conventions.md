---
title: Folder Naming Conventions
description: Naming and structure rules for scalable documentation growth.
keywords: [conventions, folder structure, docs]
---

# Folder Naming Conventions

Naming and structure rules for scalable documentation growth.

## Rules

- Use kebab-case for files and folders
- Keep package docs under package domain folders
- Use `index.md` for package landing pages
- Use suffixes consistently (`api-reference.md`, `best-practices.md`)

## Scalability guidance

Avoid deep nesting beyond three levels for navigability.

## Recommended domain layout

- `getting-started/`: onboarding path
- `editor/`: core, react, plugins, themes
- `ui-core/`, `ui-react/`, `icons/`, `react-icons/`, `toast/`: package hubs
- `guide/`: cross-cutting implementation guides
- `examples/`: runnable integration patterns
- `migration/`: release transition guides

## File naming patterns

- Use `index.md` for section landing pages.
- Use verb/noun names for guides (`security-autosave.md`, `multi-instance.md`).
- Keep filenames stable once published to avoid URL churn.
