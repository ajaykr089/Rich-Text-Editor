import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-collapsible-transition: max-height 0.22s cubic-bezier(.4,0,.2,1), opacity 0.18s;
    --ui-collapsible-max: 800px;
  }
  .collapsible-header {
    cursor: pointer;
    user-select: none;
    font-weight: 500;
    padding: 0.5em 0;
    outline: none;
    transition: color 0.18s;
  }
  .collapsible-header:focus {
    color: var(--ui-primary, #2563eb);
  }
  ::slotted([slot="header"]) {
    font-size: 1rem;
    color: var(--ui-foreground, #222);
    font-weight: 500;
  }
  .content {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: var(--ui-collapsible-transition);
    will-change: max-height, opacity;
  }
  :host([open]) .content {
    max-height: var(--ui-collapsible-max);
    opacity: 1;
  }
  :host([headless]) .content { display: none; }
  ::slotted(*) {
    font-size: 0.98rem;
    color: var(--ui-foreground, #222);
  }
`;


export class UICollapsible extends ElementBase {
  static get observedAttributes() {
    return ['open', 'headless'];
  }
  private _uid: string;

  constructor() {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._uid = `ui-collapsible-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onToggle as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onToggle as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get open() {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    if (val === this.open) return;
    if (val) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onToggle(e: MouseEvent) {
    const path = e.composedPath() as Array<EventTarget>;
    const toggledFromHeader = path.some((node) => {
      const el = node as HTMLElement;
      if (!el || typeof el.getAttribute !== 'function') return false;
      return el.classList?.contains('collapsible-header') || el.getAttribute('slot') === 'header';
    });
    if (toggledFromHeader) {
      this.open = !this.open;
      this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true }));
    }
  }

  _onKeyDown(e: KeyboardEvent) {
    const path = e.composedPath() as Array<EventTarget>;
    const fromHeader = path.some((node) => {
      const el = node as HTMLElement;
      if (!el || typeof el.getAttribute !== 'function') return false;
      return el.classList?.contains('collapsible-header') || el.getAttribute('slot') === 'header';
    });
    if (!fromHeader) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.open = !this.open;
      this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open }, bubbles: true }));
    }
  }

  protected render() {
    const open = this.open;
    const headerId = `${this._uid}-header`;
    const contentId = `${this._uid}-content`;
    this.setContent(`
      <style>${style}</style>
      <div id="${headerId}" class="collapsible-header" part="header" tabindex="0" role="button" aria-controls="${contentId}" aria-expanded="${open ? 'true' : 'false'}"><slot name="header"></slot></div>
      <div id="${contentId}" class="content" part="content" role="region" aria-labelledby="${headerId}" aria-hidden="${open ? 'false' : 'true'}"><slot></slot></div>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-collapsible')) {
  customElements.define('ui-collapsible', UICollapsible);
}
