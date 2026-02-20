/**
 * UIAccordion Web Component
 *
 * Theming: You can style the accordion from outside the shadow DOM using these CSS variables:
 *
 * --ui-accordion-border: Border for each item (default: 1px solid var(--ui-color-muted, #e5e7eb))
 * --ui-accordion-radius: Border radius for the accordion (default: var(--ui-radius, 8px))
 * --ui-accordion-header-bg: Header background color (default: var(--ui-color-surface, #f9fafb))
 * --ui-accordion-header-color: Header text color (default: var(--ui-color-text, #222))
 * --ui-accordion-header-active-bg: Header background when open/active (default: var(--ui-color-primary, #2563eb10))
 * --ui-accordion-header-active-color: Header text color when open/active (default: var(--ui-color-primary, #2563eb))
 * --ui-accordion-panel-bg: Panel background color (default: var(--ui-color-background, #fff))
 * --ui-accordion-panel-color: Panel text color (default: var(--ui-color-text, #222))
 * --ui-accordion-transition: Transition for open/close (default: max-height 0.22s, opacity 0.18s)
 * --ui-accordion-chevron: (not used, chevron is inline SVG)
 * --ui-font-family: Font family (default: inherit)
 * --ui-font-size-md: Font size (default: 16px)
 * --ui-space-md: Vertical padding (default: 12px)
 * --ui-space-lg: Horizontal padding (default: 20px)
 * --ui-space-sm: Gap between header and chevron (default: 8px)
 * --ui-color-muted: Muted color (default: #e5e7eb)
 * --ui-color-surface: Surface color (default: #f9fafb)
 * --ui-color-primary: Primary color (default: #2563eb)
 * --ui-color-background: Background color (default: #fff)
 * --ui-color-text: Text color (default: #222)
 * --ui-motion-base: Base transition duration (default: 0.22s)
 * --ui-motion-short: Short transition duration (default: 0.18s)
 * --ui-motion-easing: Easing function (default: cubic-bezier(.4,0,.2,1))
 *
 * Usage:
 *   ui-accordion { --ui-accordion-header-bg: #f0f0f0; }
 *   or globally: :root { --ui-accordion-header-bg: #f0f0f0; }
 *
 * No need to import any CSS file. All theming is via variables.
 */
import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-accordion-border: 1px solid var(--ui-color-muted, #e5e7eb);
    --ui-accordion-radius: var(--ui-radius, 8px);
    --ui-accordion-header-bg: var(--ui-color-surface, #f9fafb);
    --ui-accordion-header-color: var(--ui-color-text, #222);
    --ui-accordion-header-active-bg: var(--ui-color-primary, #2563eb10);
    --ui-accordion-header-active-color: var(--ui-color-primary, #2563eb);
    --ui-accordion-panel-bg: var(--ui-color-background, #fff);
    --ui-accordion-panel-color: var(--ui-color-text, #222);
    --ui-accordion-transition: max-height var(--ui-motion-base, 0.22s) var(--ui-motion-easing, cubic-bezier(.4,0,.2,1)), opacity var(--ui-motion-short, 0.18s);
    --ui-accordion-chevron: url('data:image/svg+xml;utf8,<svg width="16" height="16" fill="none" stroke="%232563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6"/></svg>');
    font-family: var(--ui-font-family, inherit);
  }
  .item {
    border-bottom: var(--ui-accordion-border);
    background: var(--ui-accordion-panel-bg);
    transition: box-shadow var(--ui-motion-short, 0.18s);
    overflow: visible;
    border-radius: 0;
    box-sizing: border-box;
    position: relative;
  }
  .item:first-child {
    border-top-left-radius: var(--ui-accordion-radius);
    border-top-right-radius: var(--ui-accordion-radius);
  }
  .item:last-child {
    border-bottom-left-radius: var(--ui-accordion-radius);
    border-bottom-right-radius: var(--ui-accordion-radius);
  }
  .item:not(:last-child) {
    margin-bottom: 0;
  }
  .header {
    cursor: pointer;
    padding: var(--ui-space-md, 12px) var(--ui-space-lg, 20px);
    font-weight: 500;
    background: var(--ui-accordion-header-bg);
    color: var(--ui-accordion-header-color);
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    outline: none;
    display: flex;
    align-items: center;
    gap: var(--ui-space-sm, 8px);
    border: none;
    width: 100%;
    font-size: var(--ui-font-size-md, 16px);
    position: relative;
    user-select: none;
    box-sizing: border-box;
    z-index: 1;
    overflow: hidden;
  }
  .header:focus-visible {
    box-shadow: 0 0 0 2px var(--ui-color-primary, #2563eb);
    z-index: 1;
  }
  .header:hover {
    background: var(--ui-accordion-header-active-bg);
    color: var(--ui-accordion-header-active-color);
  }
  .chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25em;
    width: 1.25em;
    height: 1.25em;
    margin-left: auto;
    transition: transform var(--ui-motion-base, 0.22s) var(--ui-motion-easing, cubic-bezier(.4,0,.2,1));
    vertical-align: middle;
    will-change: transform;
    pointer-events: none;
    z-index: 2;
  }
  .item[open] .chevron {
    transform: rotate(180deg);
  }
  .item[open] .header {
    background: var(--ui-accordion-header-active-bg);
    color: var(--ui-accordion-header-active-color);
  }
  .panel {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.22s cubic-bezier(.4,0,.2,1);
    padding: var(--ui-space-md, 12px) var(--ui-space-lg, 20px);
    background: var(--ui-accordion-panel-bg);
    color: var(--ui-accordion-panel-color);
    font-size: var(--ui-font-size-md, 16px);
    display: none;
  }
  .item[open] .panel {
    max-height: 400px;
    overflow: visible;
    transition: max-height 0.22s cubic-bezier(.4,0,.2,1);
    display: block;
  }
  :host([headless]) .item, :host([headless]) .header, :host([headless]) .panel { display: none; }
`;


export class UIAccordion extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless', 'multiple', 'items'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    // Only re-render if the attribute value actually changed
    if (oldValue !== newValue) {
      this.render();
    }
  }

  constructor() {
    super();
    this._onHeaderClick = this._onHeaderClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }


  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onHeaderClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.setAttribute('role', 'presentation');
    // Move .item children from light DOM to shadow DOM slot if present (for React compatibility)
    const slot = this.root.querySelector('slot');
    if (slot) {
      // Only move if slot is empty and there are .item children in the light DOM
      const shadowItems = (slot as HTMLSlotElement).assignedElements({ flatten: true });
      if (shadowItems.length === 0) {
        const lightItems = Array.from(this.children).filter((n) => n.classList && n.classList.contains('item'));
        lightItems.forEach((item) => {
          this.removeChild(item);
          this.appendChild(item); // triggers slotting
        });
      }
    }
    this._updateItems();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onHeaderClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get open() {
    // Returns array of open indexes (for multiple) or single index
    const val = this.getAttribute('open');
    if (this.multiple) {
      try { return val ? JSON.parse(val) : []; } catch { return []; }
    }
    return val ? Number(val) : -1;
  }
  set open(val: number | number[]) {
    const next = this.multiple ? JSON.stringify(val) : String(val);
    if (this.getAttribute('open') === next) return;
    this.setAttribute('open', next);
    this._updateItems();
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }
  set multiple(val: boolean) {
    if (val) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
    this._updateItems();
  }

  _onHeaderClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const header = target.closest('.header') as HTMLElement | null;
    if (!header) return;
    const items = this._getItems();
    const idx = items.findIndex(item => item.contains(header));
    if (idx === -1) return;
    let newOpen;
    if (this.multiple) {
      let arr = Array.isArray(this.open) ? [...this.open] : [];
      if (items[idx].hasAttribute('open')) {
        arr = arr.filter(i => i !== idx);
      } else {
        arr.push(idx);
      }
      newOpen = arr;
    } else {
      newOpen = items[idx].hasAttribute('open') ? -1 : idx;
    }
    this.open = newOpen;
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: newOpen }, bubbles: true }));
    this._updateItems();
  }

  _onKeyDown(e: KeyboardEvent) {
    const items = this._getItems();
    if (items.length === 0) return;
    const active = (this.root as unknown as { activeElement?: Element }).activeElement || document.activeElement;
    const idx = items.findIndex(item => item.contains(active as HTMLElement));
    let nextIdx = idx;
    if (e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % items.length;
    } else if (e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + items.length) % items.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (idx !== -1) {
        items[idx].querySelector('.header')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
      return;
    } else {
      return;
    }
    e.preventDefault();
    const header = items[nextIdx]?.querySelector('.header');
    (header as HTMLElement | undefined)?.focus();
  }

  _getItems() {
    // For data-driven mode, select .item elements directly from shadow root
    const items = Array.from(this.root.querySelectorAll('.item'));
    if (items.length > 0) return items;
    // For slotted mode, fallback to slot
    const slot = this.root.querySelector('slot');
    const nodes = slot ? (slot as HTMLSlotElement).assignedElements({ flatten: true }) : [];
    return nodes.filter(n => n.classList.contains('item'));
  }

  _updateItems() {
    const items = this._getItems();
    const open = this.open;
    items.forEach((item, idx) => {
      const header = item.querySelector('.header');
      const panel = item.querySelector('.panel');
      const isOpen = this.multiple ? (Array.isArray(open) && open.includes(idx)) : (open === idx);
      if (isOpen) item.setAttribute('open', '');
      else item.removeAttribute('open');
      // ARIA attributes
      if (header && panel) {
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        header.setAttribute('aria-controls', `panel-${idx}`);
        header.setAttribute('id', `header-${idx}`);
        panel.setAttribute('id', `panel-${idx}`);
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', `header-${idx}`);
      }
      // Add chevron if not present
      if (header && !header.querySelector('.chevron')) {
        const chevron = document.createElement('span');
        chevron.className = 'chevron';
        header.appendChild(chevron);
      }
    });
  }

  protected render() {
    // If 'items' attribute is present, render from data, else fallback to slot
    let items: Array<{ header: string; panel: string }> = [];
    const itemsAttr = this.getAttribute('items');
    if (itemsAttr) {
      try {
        items = JSON.parse(itemsAttr);
      } catch {}
    }
    if (items.length > 0) {
      // Render all content inside Shadow DOM with placeholder nodes
      this.setContent(`
        <style>${style}</style>
        ${items
          .map(
            (item, i) => `
              <div class="item" part="item">
                <div class="header" part="header" tabindex="0"></div>
                <div class="panel" part="panel"></div>
              </div>
            `
          )
          .join('')}
      `);
      // Inject HTML content for header/panel using innerHTML, then append chevron
      const itemEls = Array.from(this.root.querySelectorAll('.item'));
      itemEls.forEach((el, i) => {
        const header = el.querySelector('.header');
        const panel = el.querySelector('.panel');
        if (header) {
          header.innerHTML = items[i].header;
          // Remove any existing chevron to avoid duplicates
          const oldChevron = header.querySelector('.chevron');
          if (oldChevron) oldChevron.remove();
          // Always append chevron as last child (inline SVG)
          const chevron = document.createElement('span');
          chevron.className = 'chevron';
          chevron.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
          header.appendChild(chevron);
        }
        if (panel) panel.innerHTML = items[i].panel;
      });
      setTimeout(() => this._updateItems(), 0);
    } else {
      // Fallback: slot for legacy/manual usage
      this.setContent(`
        <style>${style}</style>
        <slot></slot>
      `);
      setTimeout(() => this._updateItems(), 0);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-accordion')) {
  customElements.define('ui-accordion', UIAccordion);
}
