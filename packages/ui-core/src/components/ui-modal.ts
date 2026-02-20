import { ElementBase } from '../ElementBase';
import { FocusManager } from '../focusManager';
import OverlayManager from '../overlayManager';

const style = `
  :host { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; }
  :host([open]) { display: flex; }
  .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
  .dialog {
    position: relative;
    background: var(--ui-background, white);
    color: var(--ui-foreground, black);
    border-radius: var(--ui-radius, 8px);
    padding: 16px;
    z-index: 1001;
    min-width: 280px;
    max-width: 90%;
    box-shadow: 0 6px 24px rgba(0,0,0,0.2);
  }
`;

export class UIModal extends ElementBase {
  private _trap: any = null;
  private _onHostClick: (e: Event) => void;

  static get observedAttributes() { return ['open']; }

  constructor() {
    super();
    this._onHostClick = this._handleHostClick.bind(this);
  }


  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
    this._onKeyDown = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onHostClick);
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._trap && this._trap.release) this._trap.release();
    try { OverlayManager.unregister(this as unknown as HTMLElement); OverlayManager.releaseLock(); } catch (e) {}
    super.disconnectedCallback();
  }

  private _handleHostClick(e: Event) {
    const t = e.target as HTMLElement;
    if (t && t.classList.contains('overlay')) this.close();
  }

  open() {
    this.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
    this._trap = FocusManager.trap(this as unknown as HTMLElement);
    try { OverlayManager.register(this as unknown as HTMLElement); OverlayManager.acquireLock(); } catch (e) {}
  }

  close() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
    if (this._trap && this._trap.release) this._trap.release();
    try {
      OverlayManager.unregister(this as unknown as HTMLElement);
      OverlayManager.releaseLock();
    } catch (e) {}
  }

  _onKeyDown(e: KeyboardEvent) {
    if (!this.hasAttribute('open')) return;
    if (e.key === 'Escape') {
      this.close();
    }
  }

  protected render() {
    const isOpen = this.hasAttribute('open');
    const headless = this.hasAttribute('headless');
    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      <div class="overlay" tabindex="-1" aria-hidden="${!isOpen}"></div>
      <div class="dialog" role="dialog" aria-modal="true" aria-label="Modal dialog">
        <slot></slot>
      </div>
    `);
    if (isOpen) {
      // ensure focus trap when open
      this._trap = FocusManager.trap(this as unknown as HTMLElement);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-modal')) {
  customElements.define('ui-modal', UIModal);
}
