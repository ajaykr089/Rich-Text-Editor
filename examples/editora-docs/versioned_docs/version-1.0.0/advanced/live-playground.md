---
title: Live Playground Blocks
description: Enable and use live React code blocks in Docusaurus pages.
keywords: [live code, playground, mdx]
---

# Live Playground Blocks

Use MDX live blocks for interactive examples.

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

<details>
<summary>Collapsible setup notes</summary>

- Keep live examples focused.
- Avoid heavy dependencies in live snippets.
- Prefer deterministic snippets for docs stability.

</details>
