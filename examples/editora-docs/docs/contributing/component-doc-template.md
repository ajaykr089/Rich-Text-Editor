---
title: Component Documentation Template
description: Standard template for documenting UI components in Editora docs.
keywords: [template, component docs, standards]
---

# Component Documentation Template

Standard template for documenting UI components in Editora docs.
1. Installation
2. Quick Start
3. Usage
4. Examples
5. API Reference
6. Best Practices
7. Accessibility
8. Performance Notes

## Example starter

```md
# ComponentName

## Installation

## Quick Start
## Usage
## Examples
## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `ComponentName` | React/Web component | Primary public component export |
| `ComponentNameProps` | Type export | Public prop contract (required/optional/defaults) |
| Events/callbacks | API surface | Emitted events and callback semantics |

## Best Practices
## Accessibility
## Performance Notes
```

## Required quality blocks

### Do and don't table

```md
## Do and Don't

| Do | Don't |
| --- | --- |
| Use semantic labels | Use icon-only actions without labels |
| Use stable prop contracts | Introduce breaking prop changes silently |
```

### Performance tips

```md
## Performance Notes

- Memoize expensive computed props in large lists.
- Prefer lazy loading for heavy optional examples.
- Keep rerender scope local to component state boundaries.
```
