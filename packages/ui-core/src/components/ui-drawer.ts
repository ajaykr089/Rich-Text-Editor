import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';
import OverlayManager from '../overlayManager';

const style = `
  :host {
    position: fixed;
    inset: 0;
    display: block;
    pointer-events: none;
    z-index: 1000;
    --ui-drawer-overlay: rgba(15, 23, 42, 0.48);
    --ui-drawer-bg: #ffffff;
    --ui-drawer-color: #0f172a;
    --ui-drawer-border: #e2e8f0;
    --ui-drawer-shadow: 0 20px 45px rgba(2, 6, 23, 0.26);
    --ui-drawer-width: min(360px, 88vw);
    --ui-drawer-height: min(420px, 70vh);
    --ui-drawer-radius: 14px;
    --ui-drawer-transition: 0.22s cubic-bezier(.4, 0, .2, 1);
  }
  :host([open]) {
    pointer-events: auto;
  }
  .overlay {
    position: absolute;
    inset: 0;
    background: var(--ui-drawer-overlay);
    opacity: 0;
    transition: opacity var(--ui-drawer-transition);
  }
  :host([open]) .overlay {
    opacity: 1;
  }
  .panel {
    position: absolute;
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100%;
    background: var(--ui-drawer-bg);
    color: var(--ui-drawer-color);
    box-shadow: var(--ui-drawer-shadow);
    transition: transform var(--ui-drawer-transition);
    outline: none;
  }

  .panel.side-left {
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--ui-drawer-width);
    border-right: 1px solid var(--ui-drawer-border);
    transform: translateX(-102%);
  }
  :host([open]) .panel.side-left {
    transform: translateX(0);
  }

  .panel.side-right {
    top: 0;
    right: 0;
    bottom: 0;
    width: var(--ui-drawer-width);
    border-left: 1px solid var(--ui-drawer-border);
    transform: translateX(102%);
  }
  :host([open]) .panel.side-right {
    transform: translateX(0);
  }

  .panel.side-top {
    left: 0;
    right: 0;
    top: 0;
    height: var(--ui-drawer-height);
    border-bottom: 1px solid var(--ui-drawer-border);
    border-radius: 0 0 var(--ui-drawer-radius) var(--ui-drawer-radius);
    transform: translateY(-102%);
  }
  :host([open]) .panel.side-top {
    transform: translateY(0);
  }

  .panel.side-bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--ui-drawer-height);
    border-top: 1px solid var(--ui-drawer-border);
    border-radius: var(--ui-drawer-radius) var(--ui-drawer-radius) 0 0;
    transform: translateY(102%);
  }
  :host([open]) .panel.side-bottom {
    transform: translateY(0);
  }

  .header,
  .footer {
    padding: 12px 14px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .header {
    justify-content: space-between;
    border-bottom: 1px solid var(--ui-drawer-border);
  }
  .footer {
    border-top: 1px solid var(--ui-drawer-border);
  }
  .body {
    min-height: 0;
    overflow: auto;
    padding: 12px 14px;
    box-sizing: border-box;
  }
  .close-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--ui-drawer-border);
    background: #ffffff;
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
  .close-btn:hover {
    background: #f8fafc;
  }
  .close-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.28);
  }
  .close-btn[hidden] {
    display: none;
  }

  :host([headless]) .overlay,
  :host([headless]) .panel {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay,
    .panel {
      transition: none !important;
    }
  }
`;

type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

function normalizeSide(side: string | null): DrawerSide {
  if (side === 'right' || side === 'top' || side === 'bottom') return side;
  return 'left';
}

export class UIDrawer extends ElementBase {
  static get observedAttributes() {
    return ['open', 'side', 'dismissible', 'headless'];
  }

  private _trap: { release: () => void } | null;
  private _isOpen: boolean;

  constructor() {
    super();
    this._trap = null;
    this._isOpen = false;
    this._onRootClick = this._onRootClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    document.addEventListener('keydown', this._onKeyDown);
    this._syncOpenState();
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    document.removeEventListener('keydown', this._onKeyDown);
    this._releaseOpenResources();
    super.disconnectedCallback();
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }

  toggle() {
    if (this.hasAttribute('open')) this.close();
    else this.open();
  }

  get dismissible() {
    return this.hasAttribute('dismissible');
  }

  set dismissible(value: boolean) {
    if (value === this.dismissible) return;
    if (value) this.setAttribute('dismissible', '');
    else this.removeAttribute('dismissible');
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target) return;

    if (target.closest('.close-btn')) {
      this.close();
      return;
    }

    const isOverlay = !!target.closest('.overlay');
    if (isOverlay && this.dismissible) {
      this.close();
    }
  }

  private _onKeyDown(event: KeyboardEvent) {
    if (!this._isOpen) return;
    if (event.key === 'Escape' && this.dismissible) {
      event.preventDefault();
      this.close();
    }
  }

  private _releaseOpenResources() {
    if (this._trap) {
      try {
        this._trap.release();
      } catch {}
      this._trap = null;
    }

    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch {}
  }

  private _syncOpenState() {
    const nowOpen = this.hasAttribute('open');

    if (nowOpen === this._isOpen) {
      if (nowOpen) {
        const panel = this.root.querySelector('.panel') as HTMLElement | null;
        if (panel) panel.focus();
      }
      return;
    }

    this._isOpen = nowOpen;

    if (nowOpen) {
      const panel = this.root.querySelector('.panel') as HTMLElement | null;
      this._trap = FocusManager.trap(panel || (this as unknown as HTMLElement));
      try {
        OverlayManager.register(this as unknown as HTMLElement);
        OverlayManager.acquireLock();
      } catch {}

      this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('change', { detail: { open: true }, bubbles: true }));

      setTimeout(() => {
        const activePanel = this.root.querySelector('.panel') as HTMLElement | null;
        if (activePanel) activePanel.focus();
      }, 0);
      return;
    }

    this._releaseOpenResources();
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { open: false }, bubbles: true }));
  }

  protected render() {
    const side = normalizeSide(this.getAttribute('side'));
    const dismissible = this.dismissible;

    this.setContent(`
      <style>${style}</style>
      <div class="overlay" aria-hidden="${this._isOpen ? 'false' : 'true'}"></div>
      <aside class="panel side-${side}" role="dialog" aria-modal="true" tabindex="-1">
        <div class="header">
          <slot name="header"></slot>
          <button
            type="button"
            class="close-btn"
            aria-label="Close drawer"
            ${dismissible ? '' : 'hidden'}
          >×</button>
        </div>
        <div class="body"><slot></slot></div>
        <div class="footer"><slot name="footer"></slot></div>
      </aside>
    `);

    this._syncOpenState();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-drawer')) {
  customElements.define('ui-drawer', UIDrawer);
}
