import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .panel {
    background: white;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 6px;
    padding: 8px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
    opacity: 0;
    transform: translateY(6px) scale(0.99);
    transition: opacity var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), transform var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease);
    position: relative;
  }
  .panel.show { opacity: 1; transform: translateY(0) scale(1); }

  /* arrow (positioned from portal.ts when present) */
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    box-shadow: -2px -2px 6px rgba(0,0,0,0.06);
    left: 50%;
    top: -6px;
    margin-left: -6px;
    transition: left var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), top var(--ui-motion-base, 200ms) var(--ui-motion-easing, ease), opacity 120ms ease;
    will-change: left, top;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel { transition: none !important; transform: none !important; }
  }
`;

export class UIPopover extends ElementBase {
  static get observedAttributes() { return ['open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); this.setup(); }

  setup() {
    this.addEventListener('click', (e) => {
      // support clicking any element inside a slotted trigger (use composedPath)
      const path = e.composedPath() as any[];
      const triggerEl = path.find(p => p && p.getAttribute && p.getAttribute('slot') === 'trigger') as HTMLElement | undefined;
      if (triggerEl) this.toggle();
    });
  }

  open() { this.setAttribute('open',''); this.dispatchEvent(new CustomEvent('open')); }
  close() { this.removeAttribute('open'); this.dispatchEvent(new CustomEvent('close')); }
  toggle() { this.hasAttribute('open') ? this.close() : this.open(); }

  protected render() {
    this.setContent(`<slot name="trigger"></slot>`);
    if (this.hasAttribute('open')) {
      const panel = document.createElement('div');
      // add `show` so CSS animation/visibility is applied when portal is mounted
      panel.className = 'panel show';

      // arrow element: positioned by portal.showPortalFor if present
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      panel.appendChild(arrow);

      const sl = this.querySelector('[slot="content"]');
      if (sl) panel.appendChild(sl.cloneNode(true));
      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const s = document.createElement('style'); s.textContent = style; this._portalEl.appendChild(s);
      this._portalEl.appendChild(panel);
      const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
      if (trigger) this._cleanup = showPortalFor(trigger, this._portalEl, { placement: 'bottom', shift: true });
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-popover')) {
  customElements.define('ui-popover', UIPopover);
}
