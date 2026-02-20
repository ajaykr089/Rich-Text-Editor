import { ElementBase } from '../ElementBase';

const style = `
  :host {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1165;
    pointer-events: none;
    display: none;
  }

  :host([open]) {
    display: block;
  }

  .popup {
    pointer-events: auto;
    transform: translate3d(-50%, -100%, 0) scale(0.98);
    opacity: 0;
    transition: opacity 130ms ease, transform 130ms ease;
  }

  :host([open]) .popup {
    transform: translate3d(-50%, -100%, 0) scale(1);
    opacity: 1;
  }

  :host([headless]) .popup {
    display: none !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .popup {
      transition: none !important;
    }
  }
`;

export class UISelectionPopup extends ElementBase {
  static get observedAttributes() {
    return ['open', 'anchor-id', 'headless'];
  }

  private _anchor: HTMLElement | null = null;
  private _raf: number | null = null;
  private _onWindowChangeBound = this._onWindowChange.bind(this);
  private _onDocumentPointerDownBound = this._onDocumentPointerDown.bind(this);

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('scroll', this._onWindowChangeBound, true);
    window.addEventListener('resize', this._onWindowChangeBound);
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    this._syncAnchorFromAttribute();
    this._schedulePosition();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._onWindowChangeBound, true);
    window.removeEventListener('resize', this._onWindowChangeBound);
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    if (this._raf != null) {
      cancelAnimationFrame(this._raf);
      this._raf = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'anchor-id') this._syncAnchorFromAttribute();
    if (name === 'open' && oldValue !== newValue) {
      this.dispatchEvent(new CustomEvent(newValue != null ? 'open' : 'close', { bubbles: true }));
    }
    this._schedulePosition();
  }

  openFor(anchorId: string) {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;
    this._anchor = anchor;
    this.setAttribute('anchor-id', anchorId);
    this.setAttribute('open', '');
    this._schedulePosition();
  }

  close() {
    this.removeAttribute('open');
  }

  private _syncAnchorFromAttribute() {
    const anchorId = this.getAttribute('anchor-id');
    if (!anchorId) {
      this._anchor = null;
      return;
    }
    this._anchor = document.getElementById(anchorId);
  }

  private _schedulePosition() {
    if (this._raf != null) cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this._raf = null;
      this._position();
    });
  }

  private _position() {
    if (!this.hasAttribute('open')) return;
    if (!this._anchor) return;

    const anchorRect = this._anchor.getBoundingClientRect();
    const popup = this.root.querySelector('.popup') as HTMLElement | null;
    if (!popup) return;

    const popupRect = popup.getBoundingClientRect();
    const gap = 8;
    let x = anchorRect.left + anchorRect.width / 2;
    let y = anchorRect.top - gap;

    if (y - popupRect.height < 8) {
      y = anchorRect.bottom + gap + popupRect.height;
      popup.style.transform = 'translate3d(-50%, 0, 0) scale(0.98)';
      if (this.hasAttribute('open')) popup.style.transform = 'translate3d(-50%, 0, 0) scale(1)';
    } else {
      popup.style.transform = '';
    }

    const minX = 12 + popupRect.width / 2;
    const maxX = window.innerWidth - 12 - popupRect.width / 2;
    x = Math.max(minX, Math.min(x, maxX));

    this.style.left = `${Math.round(x)}px`;
    this.style.top = `${Math.round(y)}px`;
  }

  private _onWindowChange() {
    if (!this.hasAttribute('open')) return;
    this._schedulePosition();
  }

  private _onDocumentPointerDown(event: PointerEvent) {
    if (!this.hasAttribute('open')) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    if (this._anchor && path.includes(this._anchor)) return;
    this.close();
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="popup" part="popup" role="dialog" aria-label="Selection popup">
        <slot name="content"></slot>
        <slot></slot>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-selection-popup')) {
  customElements.define('ui-selection-popup', UISelectionPopup);
}
