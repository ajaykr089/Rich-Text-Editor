---
title: About Editora
description: Mission, architecture, package ecosystem, and engineering principles.
---

# About Editora

Editora is a modular ecosystem for building authoring experiences in web applications.

![Editora Logo](/img/brand/editora_logo_blocks.svg)

## Mission

- Provide framework-agnostic editing primitives
- Keep capabilities modular through plugins and focused packages
- Support production UX requirements: multi-instance safety, theme parity, stable command execution

## Why teams adopt Editora

- Lean architecture with composable packages
- No hard lock-in to one frontend framework
- Clear extension path for custom commands and plugins
- Built for real-world workflows (tables, media, comments, spell-check, import/export)

## Ecosystem at a glance

- `@editora/core`: runtime and command orchestration
- `@editora/react`: React wrapper
- `@editora/plugins`: plugin factories
- `@editora/themes`: theme tokens and theme packs
- `@editora/icons`, `@editora/react-icons`: icon system
- `@editora/ui-core`, `@editora/ui-react`: UI primitives and bindings
- Focused packages such as `@editora/light-code-editor`, `@editora/toast`

## Engineering principles

- Predictable command behavior over implicit side effects
- Selection-preserving interactions for toolbar/dialog actions
- Per-instance UI scoping (dialogs, sidebars, floating tools)
- Theme consistency for all editor surfaces and plugin UI

## Technology stack

- TypeScript
- ES modules
- ContentEditable runtime model
- Vite-based build pipeline

## License and contribution

- MIT license
- Contributions are welcome for runtime, plugins, docs, and performance work

## API Surface

- Core runtime package APIs
- Framework wrapper APIs
- Plugin command and toolbar APIs
- Theme and icon APIs
- UI primitive/provider APIs

## Config Matrix

| Layer | Config Type | Typical Scope |
| --- | --- | --- |
| Core runtime | editor config | Per editor instance |
| Plugins | command/keymap/toolbar config | Per plugin/per editor |
| Themes | CSS token overrides | App scope or editor scope |
| Wrapper (React/Web component) | props/attributes/runtime config | Per component instance |

## Validation Checklist

- Package boundaries are clear for your app architecture
- Required dependencies are installed for selected integration path
- Runtime and UI behavior remain consistent across multiple editors
- Theme and plugin UI parity is preserved in dark/light modes
