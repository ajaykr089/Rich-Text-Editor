import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .menu { background: white; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; padding: 6px; box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
  .menu > * { display: block; padding: 8px 12px; font-size: 14px; cursor: pointer; border-radius: 4px; white-space: nowrap; }
  .menu > *:hover { background: rgba(0,0,0,0.03); }
  .menu > *[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
  .trigger { display: inline-block; }
`;

export class UIDropdown extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;
  private _onHostClick: (e: Event) => void;

  constructor() {
    super();
    this._onHostClick = this._handleHostClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onHostClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onHostClick);
    super.disconnectedCallback();
  }

  private _handleHostClick(e: Event) {
    // delegate: find first element with slot="trigger" (support clicks on nested elements)
    const path = e.composedPath() as any[];
    const triggerEl = path.find(p => p && p.getAttribute && p.getAttribute('slot') === 'trigger') as HTMLElement | undefined;
    if (triggerEl) this.toggle();
  }

  open() { this.setAttribute('open', ''); this.dispatchEvent(new CustomEvent('open')); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  protected render() {
    // render trigger only; content shows in portal
    this.setContent(`<style>${style}</style><slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      // show portal content
      const contentSlot = document.createElement('div');
      contentSlot.className = 'menu';
      contentSlot.setAttribute('role', 'menu');
      const sl = this.querySelector('[slot="content"]');
      if (sl) {
        // clone content into portal
        contentSlot.appendChild(sl.cloneNode(true));
      } else {
        const fallback = document.createElement('div');
        fallback.textContent = '';
        contentSlot.appendChild(fallback);
      }
      const triggerEl = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (triggerEl) {
        this._cleanup = showPortalFor(triggerEl, contentSlot, { placement: 'bottom', shift: true });
      }
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dropdown')) {
  customElements.define('ui-dropdown', UIDropdown);
}
