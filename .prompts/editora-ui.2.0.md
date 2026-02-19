# 🚀 **MASTER PROMPT — Universal UI Framework for Editora**

## 🎯 Objective

Design and implement a **super lightweight, framework-agnostic UI framework** that:

* works as native Web Components
* integrates with React, Vue, Angular, Svelte via adapters
* supports SSR and SPA environments
* is tree-shakable and modular
* provides full design system features
* matches modern UI library capabilities
* integrates deeply with editora editor ecosystem
* ensures accessibility and performance
* handles real-world edge cases

The system must be production-grade, scalable, and extensible.

---

# 🧠 Core Philosophy

### Design Principles

1. **Framework Neutral**

   * No dependency on React/Vue/etc.
   * Core uses native browser APIs.

2. **Minimal Runtime**

   * Target < 20kb gzipped core.
   * Avoid virtual DOM.

3. **Composable Architecture**

   * Components built from primitives.
   * Behavior separated from styling.

4. **Accessibility First**

   * ARIA compliant.
   * Keyboard navigation by default.

5. **Tree-shakable**

   * Import only what is used.

6. **Editor-first UX**

   * Optimized for embedding in editing tools.

---

# 🏗 SYSTEM ARCHITECTURE

---

## 1. Core Runtime Engine

Implement a lightweight UI engine that provides:

### Component System

* Custom Elements
* lifecycle hooks
* attribute/prop syncing
* event handling
* slot management
* Shadow DOM support
* light DOM mode option

### Reactive State Engine

Implement minimal signals:

```
createSignal()
computed()
effect()
watch()
```

Requirements:

* synchronous updates
* batch updates
* minimal memory usage
* no virtual DOM diffing

---

### Styling Engine

* CSS variables based
* design tokens
* scoped styles
* theme switching
* style isolation
* global theme override support

Must support:

```
dark mode
dynamic theme switch
per component theme override
```

---

### Overlay Manager

Global system for:

* modal stacking
* z-index resolution
* focus management
* portal rendering
* scroll locking

Must handle:

* nested dialogs
* multiple popovers
* race conditions

---

### Positioning Engine

Floating UI logic:

* tooltip placement
* dropdown alignment
* viewport collision detection
* auto reposition
* scroll parent detection
* anchor tracking

---

### Accessibility Engine

Automatic:

* ARIA attributes
* focus trap
* keyboard navigation
* screen reader announcements
* role validation

---

## 2. Design System Engine

---

### Design Tokens

Support:

```
colors
spacing
radius
typography
shadows
motion
z-index scale
breakpoints
```

Requirements:

* CSS variable export
* runtime update
* theme inheritance
* fallback values

---

### Theming System

Must support:

* global theme provider
* nested themes
* light/dark modes
* custom themes
* dynamic switching
* theme persistence

---

### Layout System

Provide primitives:

* stack
* flex
* grid
* container
* responsive utilities
* container queries
* spacing utilities

---

## 3. UI Primitives Library

Each component must be:

* accessible
* composable
* themeable
* headless-capable
* SSR-safe
* keyboard navigable

---

### Core Components

Implement:

* Button
* Input
* TextArea
* Checkbox
* Radio
* Switch
* Select
* Slider
* Dialog
* Modal
* Popover
* Tooltip
* Dropdown
* Tabs
* Accordion
* Menu
* Toast
* Avatar
* Badge
* Progress
* Table
* Form system
* Checkbox — accessible checkbox

* Radio Group — grouped radio buttons

* Switch — toggle switch

* Slider — range slider input

* Select — dropdown select

* Toggle — single toggle button

* Toggle Group — multiple toggles

* Label — form label helper

* Form — form validation primitives

* Dialog — modal popup

* Alert Dialog — confirmation modal

* Popover — floating popup

* Tooltip — hover tooltip

* Hover Card — preview card on hover

* Context Menu — right-click menu

* Dropdown Menu — dropdown action menu

* Tabs — tabbed interface

* Navigation Menu — site navigation menu

* Menubar — desktop-style menu

* Toolbar — action toolbar

* Pagination — (via composition, not standalone)


* Accordion — collapsible sections

* Collapsible — hide/show content

* Separator — divider line

* Aspect Ratio — maintain aspect ratio

* Scroll Area — custom scroll container



* Toast — notification messages// use exising @editor/toast

* Progress — progress bar

* Avatar — profile image + fallback


* Portal — render outside DOM tree

* Presence — animation lifecycle

* Slot — component composition helper

* Direction Provider — RTL/LTR support

* Visually Hidden — accessibility helper


* Dialog

* Dropdown Menu

* Tooltip

* Select

* Tabs

* Accordion

* Toast

* Popover

* Checkbox

* Switch

* Radio Group

* Navigation Menu

---

### Component Requirements

Every component must support:

* controlled/uncontrolled mode
* disabled states
* loading states
* async state handling
* event hooks
* accessibility roles
* nested usage
* composability
* headless mode

---

## 4. Headless Mode

Components must support:

```
<ui-select headless />
```

This exposes logic only.

Users can provide their own styles.

---

## 5. Animation System

* CSS based animations
* transition primitives
* motion tokens
* reduced motion support
* interruptible animations

---

## 6. Form Engine

Provide:

* validation system
* async validation
* error states
* form state tracking
* field registration
* accessibility validation hints

---

# 🔌 Framework Adapters

Create thin adapters:

```
@editora/ui-react
@editora/ui-vue
@editora/ui-angular
@editora/ui-svelte
```

Responsibilities:

* prop mapping
* event forwarding
* ref handling
* SSR compatibility
* hydration handling

Adapters must not duplicate logic.

---

# ✏️ Editora Integration Layer (Critical)

Create editor-specific UI system.

---

## Editor Components

* floating toolbar
* inline formatting panel
* context menu
* selection popover
* command palette
* plugin panels
* drag handles
* block controls
* annotation UI

---

## Editor Integration Requirements

Must support:

* selection tracking
* DOM mutation sync
* undo/redo safe UI
* editor focus management
* overlay positioning in editor
* collaborative editing compatibility

---

# 🔌 Plugin System

Provide extension API:

```
registerComponent()
registerTheme()
registerBehavior()
registerPlugin()
```

Allow:

* new UI components
* editor plugins
* theme packs
* behaviors

---

# 🌐 SSR + Hydration Support

Handle:

* server rendering
* hydration mismatch prevention
* lazy component upgrade
* progressive enhancement

---

# ⚡ Performance Requirements

* minimal re-renders
* batch DOM updates
* lazy component loading
* memory leak prevention
* idle rendering support

---

# 🧪 Edge Cases To Handle

This section is critical.

---

## Focus Management

Handle:

* nested dialogs
* keyboard traps
* portal focus restoration
* tab order preservation

---

## Overlay Edge Cases

* multiple open overlays
* scroll locking conflicts
* iframe environments
* shadow DOM boundaries

---

## Event Edge Cases

* event bubbling across shadow DOM
* pointer vs mouse events
* touch devices
* accessibility events

---

## Styling Edge Cases

* CSS conflicts
* global style overrides
* theme conflicts
* dynamic theme switching

---

## Layout Edge Cases

* container resizing
* viewport changes
* mobile keyboards
* zoom behavior

---

## State Edge Cases

* async race conditions
* stale state updates
* unmounted component updates

---

## Browser Support

* modern browsers
* graceful fallback behavior
* polyfill strategy

---

# 📦 Packaging Requirements

* ES modules
* tree-shakable exports
* sideEffects false
* per component imports
* minimal peer dependencies

Example:

```
import '@editora/ui/button'
```

---

# 📚 Documentation System

Generate documentation similar to modern UI libraries:

* interactive examples
* theme playground
* accessibility guide
* SSR guide
* performance guide
* editor integration guide

---

# 🧩 Developer Experience

Provide:

* TypeScript types
* autocomplete support
* prop validation
* dev warnings
* debugging utilities

---

# 🔒 Security Requirements

* sanitize user input
* prevent XSS in components
* safe HTML rendering
* secure event handling

---

# 🎯 Success Criteria

The framework must:

* work in any framework
* run without frameworks
* be extremely lightweight
* be accessible by default
* integrate deeply with editora
* scale to large applications
* be production ready
