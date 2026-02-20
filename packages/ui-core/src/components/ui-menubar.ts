import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    position: relative;
    --ui-menubar-gap: 6px;
    --ui-menubar-padding: 6px;
    --ui-menubar-radius: 14px;
    --ui-menubar-bg: rgba(248, 250, 252, 0.86);
    --ui-menubar-border: 1px solid rgba(15, 23, 42, 0.1);
    --ui-menubar-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    --ui-menubar-item-radius: 10px;
    --ui-menubar-item-padding: 8px 12px;
    --ui-menubar-item-color: #334155;
    --ui-menubar-item-active-bg: rgba(37, 99, 235, 0.14);
    --ui-menubar-item-active-color: #1d4ed8;
    --ui-menubar-panel-bg: rgba(255, 255, 255, 0.96);
    --ui-menubar-panel-border: 1px solid rgba(15, 23, 42, 0.1);
    --ui-menubar-panel-radius: 12px;
    --ui-menubar-panel-shadow: 0 20px 46px rgba(15, 23, 42, 0.14);
  }

  .bar {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-menubar-gap);
    padding: var(--ui-menubar-padding);
    border-radius: var(--ui-menubar-radius);
    background: var(--ui-menubar-bg);
    border: var(--ui-menubar-border);
    box-shadow: var(--ui-menubar-shadow);
    backdrop-filter: saturate(1.1) blur(9px);
  }

  ::slotted([slot="item"]) {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--ui-menubar-item-color);
    border-radius: var(--ui-menubar-item-radius);
    padding: var(--ui-menubar-item-padding);
    line-height: 1.35;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    outline: none;
    transition: background-color 120ms ease, color 120ms ease;
  }

  ::slotted([slot="item"]:hover),
  ::slotted([slot="item"]:focus-visible) {
    background: rgba(15, 23, 42, 0.08);
  }

  ::slotted([slot="item"][data-active="true"]) {
    background: var(--ui-menubar-item-active-bg);
    color: var(--ui-menubar-item-active-color);
  }

  .panel-wrap {
    position: absolute;
    left: 0;
    top: calc(100% + 8px);
    min-width: 240px;
    z-index: 40;
  }

  ::slotted([slot="content"]) {
    display: none;
    background: var(--ui-menubar-panel-bg);
    border: var(--ui-menubar-panel-border);
    border-radius: var(--ui-menubar-panel-radius);
    box-shadow: var(--ui-menubar-panel-shadow);
    padding: 8px;
  }

  :host([open]) ::slotted([slot="content"][data-open="true"]) {
    display: block;
  }

  :host(:not([open])) .panel-wrap {
    display: none;
  }

  :host([headless]) .bar,
  :host([headless]) .panel-wrap {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([slot="item"]) {
      transition: none !important;
    }
  }
`;

function toBooleanAttribute(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function clampIndex(index: number, length: number): number {
  if (length <= 0) return -1;
  if (Number.isNaN(index)) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
}

export class UIMenubar extends ElementBase {
  static get observedAttributes() {
    return ['selected', 'open', 'headless', 'loop'];
  }

  private _items: HTMLElement[] = [];
  private _contents: HTMLElement[] = [];
  private _ignoreSelected = false;
  private _itemSlot: HTMLSlotElement | null = null;
  private _contentSlot: HTMLSlotElement | null = null;
  private _uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDocPointerDown = this._onDocPointerDown.bind(this);
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    document.addEventListener('pointerdown', this._onDocPointerDown as EventListener, true);
    this._attachSlotListeners();
    this._syncStructure();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    document.removeEventListener('pointerdown', this._onDocPointerDown as EventListener, true);
    this._detachSlotListeners();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'selected' && this._ignoreSelected) return;
    super.attributeChangedCallback(name, oldValue, newValue);
    this._attachSlotListeners();
    this._syncStructure();
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="bar" part="bar" role="menubar">
        <slot name="item"></slot>
      </div>
      <div class="panel-wrap" part="panel-wrap">
        <slot name="content"></slot>
      </div>
    `);
  }

  private _attachSlotListeners() {
    const itemSlot = this.root.querySelector('slot[name="item"]') as HTMLSlotElement | null;
    const contentSlot = this.root.querySelector('slot[name="content"]') as HTMLSlotElement | null;

    if (this._itemSlot && this._itemSlot !== itemSlot) {
      this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (this._contentSlot && this._contentSlot !== contentSlot) {
      this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (itemSlot && this._itemSlot !== itemSlot) {
      itemSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }
    if (contentSlot && this._contentSlot !== contentSlot) {
      contentSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
    }

    this._itemSlot = itemSlot;
    this._contentSlot = contentSlot;
  }

  private _detachSlotListeners() {
    if (this._itemSlot) this._itemSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    if (this._contentSlot) this._contentSlot.removeEventListener('slotchange', this._onSlotChange as EventListener);
    this._itemSlot = null;
    this._contentSlot = null;
  }

  private _onSlotChange() {
    this._syncStructure();
  }

  private _isOpen() {
    return this.hasAttribute('open');
  }

  private _setOpen(next: boolean) {
    const wasOpen = this._isOpen();
    if (next === wasOpen) return;
    if (next) this.setAttribute('open', '');
    else this.removeAttribute('open');

    if (next) {
      this.dispatchEvent(
        new CustomEvent('open', {
          detail: { selected: this._selectedIndex() },
          bubbles: true
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent('close', {
          detail: { previous: this._selectedIndex() },
          bubbles: true
        })
      );
    }
  }

  private _selectedIndex(): number {
    const raw = this.getAttribute('selected');
    if (raw == null || raw === '') return this._items.length > 0 ? 0 : -1;
    const index = Number(raw);
    if (Number.isNaN(index)) return this._items.length > 0 ? 0 : -1;
    if (index < 0) return -1;
    return clampIndex(index, this._items.length);
  }

  private _setSelected(index: number) {
    this._ignoreSelected = true;
    this.setAttribute('selected', String(index));
    this._ignoreSelected = false;
  }

  private _loopEnabled(): boolean {
    return toBooleanAttribute(this.getAttribute('loop'), true);
  }

  private _moveIndex(current: number, delta: number): number {
    if (this._items.length === 0) return -1;
    const loop = this._loopEnabled();
    let next = current + delta;
    if (next < 0) next = loop ? this._items.length - 1 : 0;
    if (next >= this._items.length) next = loop ? 0 : this._items.length - 1;
    return next;
  }

  private _syncStructure() {
    this._items = this._itemSlot ? (this._itemSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];
    this._contents = this._contentSlot ? (this._contentSlot.assignedElements({ flatten: true }) as HTMLElement[]) : [];

    const selected = this._selectedIndex();
    const isOpen = this._isOpen();

    this._items.forEach((item, index) => {
      const active = selected === index;
      const menuItemId = item.id || `ui-menubar-item-${this._uid}-${index}`;
      const menuId = this._contents[index]?.id || `ui-menubar-content-${this._uid}-${index}`;
      item.id = menuItemId;

      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', active ? '0' : '-1');
      item.setAttribute('aria-haspopup', 'menu');
      item.setAttribute('aria-expanded', active && isOpen ? 'true' : 'false');
      item.setAttribute('aria-controls', menuId);
      item.setAttribute('data-active', active ? 'true' : 'false');
    });

    this._contents.forEach((content, index) => {
      const active = selected === index && isOpen;
      const item = this._items[index];
      const menuId = content.id || `ui-menubar-content-${this._uid}-${index}`;
      content.id = menuId;
      content.setAttribute('role', 'menu');
      content.setAttribute('tabindex', '-1');
      if (item) content.setAttribute('aria-labelledby', item.id);
      else content.removeAttribute('aria-labelledby');
      if (active) content.setAttribute('data-open', 'true');
      else content.removeAttribute('data-open');
    });
  }

  private _selectIndex(index: number, reason: 'click' | 'keyboard' | 'programmatic') {
    const previous = this._selectedIndex();
    const next = clampIndex(index, this._items.length);
    if (next < 0) return;
    this._setSelected(next);
    this._setOpen(true);
    this._syncStructure();
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { selected: next, previous, open: true, reason },
        bubbles: true
      })
    );
  }

  private _focusItem(index: number) {
    const item = this._items[index];
    if (!item) return;
    this._items.forEach((entry, i) => entry.setAttribute('tabindex', i === index ? '0' : '-1'));
    try {
      item.focus();
    } catch {}
  }

  private _onClick(event: MouseEvent) {
    const path = event.composedPath();
    const index = this._items.findIndex((item) => path.includes(item));
    if (index < 0) return;

    const selected = this._selectedIndex();
    if (selected === index && this._isOpen()) {
      this._setOpen(false);
      this._syncStructure();
      return;
    }
    this._selectIndex(index, 'click');
  }

  private _onDocPointerDown(event: PointerEvent) {
    if (!this._isOpen()) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this._setOpen(false);
    this._syncStructure();
  }

  private _onKeyDown(event: KeyboardEvent) {
    const focusIndex = this._items.findIndex((item) => item === (event.target as Node) || item.contains(event.target as Node));
    if (focusIndex < 0) return;

    let handled = false;
    let next = focusIndex;

    if (event.key === 'ArrowRight') {
      next = this._moveIndex(focusIndex, 1);
      handled = true;
    } else if (event.key === 'ArrowLeft') {
      next = this._moveIndex(focusIndex, -1);
      handled = true;
    } else if (event.key === 'Home') {
      next = this._items.length > 0 ? 0 : -1;
      handled = true;
    } else if (event.key === 'End') {
      next = this._items.length > 0 ? this._items.length - 1 : -1;
      handled = true;
    } else if (event.key === 'Enter' || event.key === ' ') {
      this._selectIndex(focusIndex, 'keyboard');
      handled = true;
    } else if (event.key === 'ArrowDown') {
      this._selectIndex(focusIndex, 'keyboard');
      const panel = this._contents[focusIndex];
      if (panel) {
        setTimeout(() => {
          try {
            panel.focus();
          } catch {}
        }, 0);
      }
      handled = true;
    } else if (event.key === 'Escape') {
      if (this._isOpen()) {
        this._setOpen(false);
        this._syncStructure();
      }
      handled = true;
    }

    if (handled) {
      event.preventDefault();
      if (next >= 0 && next !== focusIndex) {
        this._focusItem(next);
        if (this._isOpen()) this._selectIndex(next, 'keyboard');
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-menubar')) {
  customElements.define('ui-menubar', UIMenubar);
}
