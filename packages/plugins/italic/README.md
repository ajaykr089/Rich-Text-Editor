# @editora/plugin-italic

Italic formatting plugin for Editora rich text editor.

## Installation

```bash
npm install @editora/plugin-italic
```

Or bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { ItalicPlugin } from "@editora/plugin-italic";
// or: import { ItalicPlugin } from "@editora/plugins";

const plugins = [ItalicPlugin()];
```

## Command and Shortcut

- Command: `toggleItalic`
- Shortcut: `Mod-i`

## Notes

- Applies/removes italic formatting through editor command dispatch.
