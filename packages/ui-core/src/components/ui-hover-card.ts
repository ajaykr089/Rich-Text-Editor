import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    position: relative;
    --ui-hover-card-radius: 8px;
    --ui-hover-card-bg: #fff;
    --ui-hover-card-shadow: 0 4px 24px rgba(0,0,0,0.12);
    --ui-hover-card-padding: 16px;
    --ui-hover-card-min-width: 200px;
    --ui-hover-card-z: 100;
  }
  .card {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--ui-hover-card-bg);
    border-radius: var(--ui-hover-card-radius);
    box-shadow: var(--ui-hover-card-shadow);
    padding: var(--ui-hover-card-padding);
    min-width: var(--ui-hover-card-min-width);
    z-index: var(--ui-hover-card-z);
    display: none;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s, transform 0.18s;
    transform: translateY(8px);
  }
  :host([open]) .card {
    display: block;
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
  :host([headless]) .card { display: none; }
`;


export class UIHoverCard extends ElementBase {
    private _openTimeout: ReturnType<typeof setTimeout> | null = null;
    private _closeTimeout: ReturnType<typeof setTimeout> | null = null;
  static get observedAttributes() {
    return ['open', 'headless', 'delay'];
  }

  constructor() {
    super();
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._openTimeout = null;
    this._closeTimeout = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('mouseenter', this._onMouseEnter);
    this.root.addEventListener('mouseleave', this._onMouseLeave);
    this.root.addEventListener('focusin', this._onFocus);
    this.root.addEventListener('focusout', this._onBlur);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    document.addEventListener('mousedown', this._onDocumentClick);
  }

  disconnectedCallback() {
    this.root.removeEventListener('mouseenter', this._onMouseEnter);
    this.root.removeEventListener('mouseleave', this._onMouseLeave);
    this.root.removeEventListener('focusin', this._onFocus);
    this.root.removeEventListener('focusout', this._onBlur);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    document.removeEventListener('mousedown', this._onDocumentClick);
    this._clearTimeouts();
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
      this.dispatchEvent(new CustomEvent('show', { bubbles: true }));
    } else {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
      this.dispatchEvent(new CustomEvent('hide', { bubbles: true }));
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

  get delay() {
    return Number(this.getAttribute('delay')) || 120;
  }
  set delay(val: number) {
    this.setAttribute('delay', String(val));
  }

  _onMouseEnter() {
    this._clearTimeouts();
    this._openTimeout = setTimeout(() => { this.open = true; }, this.delay);
  }

  _onMouseLeave() {
    this._clearTimeouts();
    this._closeTimeout = setTimeout(() => { this.open = false; }, this.delay);
  }

  _onFocus() {
    this._clearTimeouts();
    this.open = true;
  }

  _onBlur() {
    this._clearTimeouts();
    this._closeTimeout = setTimeout(() => { this.open = false; }, this.delay);
  }

  _onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      this.open = false;
    }
  }

  _onDocumentClick(e: MouseEvent) {
    if (!this.open) return;
    if (!this.contains(e.target as Node)) {
      this.open = false;
    }
  }

  _clearTimeouts() {
    if (this._openTimeout) clearTimeout(this._openTimeout);
    if (this._closeTimeout) clearTimeout(this._closeTimeout);
    this._openTimeout = null;
    this._closeTimeout = null;
  }

  protected render() {
    const open = this.open;
    const headless = this.headless;
    this.setContent(`
      <style>${style}</style>
      <slot></slot>
      <div class="card" role="dialog" aria-modal="false" tabindex="-1">
        <slot name="card"></slot>
      </div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-hover-card')) {
  customElements.define('ui-hover-card', UIHoverCard);
}
