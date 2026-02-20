import { ElementBase } from '../ElementBase';
import { showPortalFor } from '../portal';

const style = `
  .tooltip {
    padding: 6px 8px;
    font-size: 12px;
    background: rgba(0,0,0,0.85);
    color: white;
    border-radius: 4px;
    white-space: nowrap;
    transition: opacity var(--ui-motion-short, 120ms) var(--ui-motion-easing, ease), transform var(--ui-motion-short, 120ms) var(--ui-motion-easing, ease);
    opacity: 0;
    transform: translateY(4px);
    position: relative;
  }
  .tooltip.show { opacity: 1; transform: translateY(0); }

  /* arrow (positioned by portal.showPortalFor when present) */
  .arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(0,0,0,0.85);
    transform: rotate(45deg);
    left: 50%;
    top: -4px;
    margin-left: -4px;
    transition: left var(--ui-motion-short, 120ms) var(--ui-motion-easing, ease), top var(--ui-motion-short, 120ms) var(--ui-motion-easing, ease);
    will-change: left, top;
  }

  @media (prefers-reduced-motion: reduce) {
    .tooltip { transition: none !important; transform: none !important; }
  }
`;

export class UITooltip extends ElementBase {
  static get observedAttributes() { return ['text','placement']; }

  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;
  private _currentId: string | null = null;

  private _onMouseEnter: () => void;
  private _onFocus: () => void;
  private _onMouseLeave: () => void;
  private _onBlur: () => void;

  constructor() {
    super();
    this._onMouseEnter = () => this.show();
    this._onFocus = () => this.show();
    this._onMouseLeave = () => this.hide();
    this._onBlur = () => this.hide();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('focus', this._onFocus, true);
    this.addEventListener('mouseleave', this._onMouseLeave);
    this.addEventListener('blur', this._onBlur, true);
  }

  disconnectedCallback() {
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('focus', this._onFocus, true);
    this.removeEventListener('mouseleave', this._onMouseLeave);
    this.removeEventListener('blur', this._onBlur, true);
    this.hide();
    super.disconnectedCallback();
  }

  show() {
    const text = this.getAttribute('text') || '';
    const headless = this.hasAttribute('headless');
    const placementAttr = (this.getAttribute('placement') as any) || 'top';

    if (!this._portalEl) {
      this._portalEl = document.createElement('div');
      if (!headless) {
        const s = document.createElement('style');
        s.textContent = style;
        this._portalEl.appendChild(s);
      }

      const content = document.createElement('div');
      const id = `ui-tooltip-${Math.random().toString(36).slice(2,9)}`;
      this._currentId = id;
      content.id = id;
      content.className = 'tooltip show';
      content.setAttribute('role', 'tooltip');
      content.textContent = text;

      // arrow element (portal.showPortalFor will position it)
      const arrow = document.createElement('div');
      arrow.className = 'arrow';
      content.appendChild(arrow);

      this._portalEl.appendChild(content);
    } else {
      // update text/id if already mounted
      const content = this._portalEl.querySelector('.tooltip') as HTMLElement | null;
      if (content) {
        content.textContent = text;
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        content.appendChild(arrow);
        // ensure id persists
        if (!content.id) {
          const id = `ui-tooltip-${Math.random().toString(36).slice(2,9)}`;
          content.id = id;
          this._currentId = id;
        }
      }
    }

    // set aria-describedby on the anchor for screen readers
    try {
      if (this._currentId && (this as any).setAttribute) {
        (this as any).setAttribute('aria-describedby', this._currentId);
      }
    } catch (e) {}

    const anchor = this as unknown as HTMLElement;
    if (this._cleanup) this._cleanup();
    this._cleanup = showPortalFor(anchor, this._portalEl, { placement: placementAttr, shift: true, offset: 6, flip: true });
  }

  hide() {
    if (this._cleanup) this._cleanup();
    this._cleanup = undefined;
    // remove aria-describedby when hidden
    try { if ((this as any).removeAttribute) (this as any).removeAttribute('aria-describedby'); } catch (e) {}
    this._portalEl = null;
    this._currentId = null;
  }

  protected render() {
    // render only slot since tooltip renders to portal
    this.setContent('<slot></slot>');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tooltip')) {
  customElements.define('ui-tooltip', UITooltip);
}
