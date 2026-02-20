import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    position: relative;
    --ui-menu-radius: 12px;
    --ui-menu-bg: rgba(255, 255, 255, 0.92);
    --ui-menu-shadow: 0 16px 44px rgba(16, 24, 40, 0.2);
    --ui-menu-padding: 6px;
    --ui-menu-min-width: 220px;
    --ui-menu-z: 100;
    --ui-menu-border: 1px solid rgba(17, 24, 39, 0.1);
  }
  .menu {
    position: fixed;
    background: var(--ui-menu-bg);
    border: var(--ui-menu-border);
    border-radius: var(--ui-menu-radius);
    box-shadow: var(--ui-menu-shadow);
    padding: var(--ui-menu-padding);
    min-width: var(--ui-menu-min-width);
    z-index: var(--ui-menu-z);
    display: none;
    outline: none;
    transition: opacity 0.18s, transform 0.18s;
    opacity: 0;
    pointer-events: none;
    backdrop-filter: saturate(1.2) blur(12px);
    transform: translateY(4px) scale(0.98);
  }
  :host([open]) .menu {
    display: block;
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
  }
  :host([headless]) .menu { display: none; }
`;

const lightDomMenuItemStyle = `
  ui-context-menu [slot="menu"] .menuitem {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 9px;
    cursor: default;
    user-select: none;
    white-space: nowrap;
    color: #0f172a;
    line-height: 1.35;
    outline: none;
    position: relative;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 130ms ease, color 130ms ease;
  }
  ui-context-menu [slot="menu"] .menuitem:hover,
  ui-context-menu [slot="menu"] .menuitem:focus,
  ui-context-menu [slot="menu"] .menuitem:focus-visible {
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.05));
  }
  ui-context-menu [slot="menu"] .menuitem[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }
  ui-context-menu [slot="menu"] .separator {
    height: 1px;
    margin: 6px 8px;
    background: rgba(0, 0, 0, 0.12);
  }
  ui-context-menu [slot="menu"] .icon {
    width: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }
  ui-context-menu [slot="menu"] .label {
    flex: 1 1 auto;
  }
  ui-context-menu [slot="menu"] .submenu {
    position: absolute;
    left: calc(100% + 8px);
    top: -6px;
    min-width: 210px;
    padding: 6px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(17, 24, 39, 0.1);
    box-shadow: 0 18px 44px rgba(16, 24, 40, 0.18);
    z-index: 1;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateX(-6px) scale(0.98);
    transition: opacity 140ms ease, transform 140ms ease, visibility 140ms ease;
    backdrop-filter: saturate(1.1) blur(10px);
  }
  ui-context-menu [slot="menu"] .menuitem[data-submenu-side="left"] > .submenu {
    left: auto;
    right: calc(100% + 8px);
    transform: translateX(6px) scale(0.98);
  }
  ui-context-menu [slot="menu"] .menuitem:hover > .submenu,
  ui-context-menu [slot="menu"] .menuitem:focus-within > .submenu {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(0) scale(1);
  }
  ui-context-menu [slot="menu"] .submenu-arrow {
    margin-left: auto;
    opacity: 0.6;
    font-size: 12px;
  }
`;

function ensureContextMenuLightDomStyle() {
  if (typeof document === 'undefined') return;
  const styleId = 'ui-context-menu-light-dom-style';
  if (document.getElementById(styleId)) return;
  const el = document.createElement('style');
  el.id = styleId;
  el.textContent = lightDomMenuItemStyle;
  document.head.appendChild(el);
}


export class UIContextMenu extends ElementBase {
  private _position: { x: number; y: number } = { x: 0, y: 0 };
  private _anchorEl: HTMLElement | null = null;
  private _positionRaf: number | null = null;
  private _submenuLayoutRaf: number | null = null;
  static get observedAttributes() {
    return ['open', 'headless'];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._position = { x: 0, y: 0 } as { x: number; y: number };
  }

  connectedCallback() {
    super.connectedCallback();
    ensureContextMenuLightDomStyle();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('click', this._onClick as EventListener);
    this.addEventListener('contextmenu', this._onContextMenu as EventListener);
    document.addEventListener('mousedown', this._onDocumentClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.removeEventListener('contextmenu', this._onContextMenu as EventListener);
    document.removeEventListener('mousedown', this._onDocumentClick as EventListener);
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
      this._positionRaf = null;
    }
    if (this._submenuLayoutRaf != null) {
      cancelAnimationFrame(this._submenuLayoutRaf);
      this._submenuLayoutRaf = null;
    }
    super.disconnectedCallback();
  }

  get open() {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    if (val === this.open) return;
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
    if (val) {
      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    } else {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    }
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  openAt(point: { x: number; y: number }) {
    this._anchorEl = null;
    this._position = point;
    this.open = true;
    this._scheduleMenuPosition();
  }

  openForAnchor(anchor: HTMLElement) {
    this._anchorEl = anchor;
    this.open = true;
    this._scheduleMenuPosition();
  }

  openForAnchorId(anchorId: string) {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    this.openForAnchor(anchor);
  }

  showForAnchorId(anchorId: string) {
    this.openForAnchorId(anchorId);
  }

  close() {
    this.open = false;
    this._anchorEl = null;
  }

  _onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    // Headless: keyboard navigation is up to the consumer
    if (e.key === 'Escape') {
      this.open = false;
      return;
    }
  }

  _onClick(e: MouseEvent) {
    if (!this.open) return;
    // Headless: click handling is up to the consumer
  }

  _onDocumentClick(e: MouseEvent) {
    if (!this.open) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
  }

  _onContextMenu(e: MouseEvent) {
    e.preventDefault();
    this.openAt({ x: e.clientX, y: e.clientY });
  }

  _scheduleMenuPosition() {
    if (this._positionRaf != null) {
      cancelAnimationFrame(this._positionRaf);
    }
    this._positionRaf = requestAnimationFrame(() => {
      this._positionRaf = null;
      this._setMenuPosition();
    });
  }

  _scheduleSubmenuLayout() {
    if (this._submenuLayoutRaf != null) {
      cancelAnimationFrame(this._submenuLayoutRaf);
    }
    this._submenuLayoutRaf = requestAnimationFrame(() => {
      this._submenuLayoutRaf = null;
      this._layoutSubmenus();
    });
  }

  _layoutSubmenus() {
    const menuRoot = this.querySelector('[slot="menu"]') as HTMLElement | null;
    if (!menuRoot) return;
    const viewportWidth = window.innerWidth;
    const gap = 8;
    const submenus = Array.from(menuRoot.querySelectorAll('.menuitem > .submenu')) as HTMLElement[];
    submenus.forEach((submenu) => {
      const item = submenu.parentElement as HTMLElement | null;
      if (!item) return;

      item.removeAttribute('data-submenu-side');

      const prevDisplay = submenu.style.display;
      const prevVisibility = submenu.style.visibility;
      const prevPointerEvents = submenu.style.pointerEvents;
      const prevOpacity = submenu.style.opacity;
      const prevTransform = submenu.style.transform;

      submenu.style.display = 'block';
      submenu.style.visibility = 'hidden';
      submenu.style.pointerEvents = 'none';
      submenu.style.opacity = '0';
      submenu.style.transform = 'none';

      const submenuRect = submenu.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      if (itemRect.right + 8 + submenuRect.width > viewportWidth - gap) {
        item.setAttribute('data-submenu-side', 'left');
      }

      submenu.style.display = prevDisplay;
      submenu.style.visibility = prevVisibility;
      submenu.style.pointerEvents = prevPointerEvents;
      submenu.style.opacity = prevOpacity;
      submenu.style.transform = prevTransform;
    });
  }

  _setMenuPosition() {
    const menu = this.root.querySelector('.menu') as HTMLElement;
    if (menu) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 8;

      let x = this._position.x;
      let y = this._position.y;

      if (this._anchorEl) {
        const anchorRect = this._anchorEl.getBoundingClientRect();
        x = anchorRect.left;
        y = anchorRect.bottom + 4;
      }

      const menuRect = menu.getBoundingClientRect();
      const menuWidth = menuRect.width || menu.offsetWidth || 160;
      const menuHeight = menuRect.height || menu.offsetHeight || 0;

      if (this._anchorEl) {
        const anchorRect = this._anchorEl.getBoundingClientRect();
        if (y + menuHeight > viewportHeight - gap) {
          y = Math.max(gap, anchorRect.top - menuHeight - 4);
        }
      }

      x = Math.max(gap, Math.min(x, viewportWidth - menuWidth - gap));
      y = Math.max(gap, Math.min(y, viewportHeight - menuHeight - gap));

      menu.style.left = `${Math.round(x)}px`;
      menu.style.top = `${Math.round(y)}px`;
    }
  }

  // Focus management and menu item helpers are now up to the consumer (renderer)

  protected render() {
    // Headless: only expose slot for menu, do not render menu items
    this.setContent(`
      <style>${style}</style>
      <div class="menu" part="menu" role="menu" tabindex="-1">
        <slot name="menu"></slot>
      </div>
      <slot></slot>
    `);
    if (this.open) {
      this._scheduleMenuPosition();
      this._scheduleSubmenuLayout();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-context-menu')) {
  customElements.define('ui-context-menu', UIContextMenu);
}
