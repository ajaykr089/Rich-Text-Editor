---
title: Live Playground Blocks
description: Enable and use live React code blocks in Docusaurus pages.
keywords: [live code, playground, mdx, react]
---

# Live Playground Blocks

Enable and use live React code blocks in Docusaurus pages.

## Enable Theme

Add `@docusaurus/theme-live-codeblock` in `docusaurus.config.*` themes array.

## Live Example

```tsx live
function CounterDemo() {
  const [count, setCount] = React.useState(0);
  return (
    <button className="button button--primary" onClick={() => setCount((v) => v + 1)}>
      Clicked {count} times
    </button>
  );
}
```

## Usage Rules

- Keep snippets deterministic and small.
- Avoid side effects that persist beyond component lifecycle.
- Do not load heavy external dependencies in live blocks.

## Collapsible Implementations

Use `<details>` for long code:

~~~mdx
<details>
  <summary>Expand full implementation</summary>

```tsx
// long example
```

</details>
~~~

## Copy Button

Code copy buttons are built-in in Docusaurus code blocks and work automatically.

## Playground for Editora

For larger interactive demos, keep full playground pages in `docs/examples/*` and use live blocks only for focused API examples.
