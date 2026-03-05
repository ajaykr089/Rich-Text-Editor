# @editora/capitalization

Capitalization plugin for Editora rich text editor.

## What It Does

- Converts selected text to:
  - lowercase
  - UPPERCASE
  - Title Case
- Exposes toolbar menu for transformation selection.

## Installation

```bash
npm install @editora/capitalization
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CapitalizationPlugin } from "@editora/capitalization";
// or: import { CapitalizationPlugin } from "@editora/plugins";

const plugins = [CapitalizationPlugin()];
```

## Command

- `setCapitalization`

Supported values:
- `lowercase`
- `uppercase`
- `titlecase`

## Notes

- Best used on selected inline text ranges.
