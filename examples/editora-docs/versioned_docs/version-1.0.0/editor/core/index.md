---
title: "@editora/core"
description: Core editing runtime and web component implementation.
keywords: [core, editor runtime, web component]
---

# @editora/core

## Installation

```bash
npm i @editora/core
```

## Quick Start

Import core runtime and initialize through web component or wrapper integrations.

## Usage

Use core as the command/runtime foundation with plugin registration.

## Examples

- Single editor integration
- Multi-instance integration
- Toolbar configuration overrides

## API Reference

Primary surfaces include editor initialization, command execution, selection handling, lifecycle hooks, and instance teardown.

## Best Practices

- Keep per-instance runtime context isolated.
- Avoid global selectors for toolbar/dialog mounting.
- Register only required plugin commands.

## Accessibility

Enable ARIA metadata and keyboard pathways for content and command surfaces.

## Performance Notes

Use debounced updates and viewport-only scans for long content surfaces.
