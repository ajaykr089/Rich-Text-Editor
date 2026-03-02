# @editora/plugin-bold

Bold formatting plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/plugin-bold
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { BoldPlugin } from "@editora/plugin-bold";
// or: import { BoldPlugin } from "@editora/plugins";

const plugins = [BoldPlugin()];
```

## Command and Shortcut

- Command: `toggleBold`
- Shortcut: `Mod-b`

## Notes

- Applies/removes `<strong>` style behavior via editor command pipeline.
