import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: flex;
    gap: 8px;
    align-items: center;
    --ui-toolbar-gap: 8px;
    --ui-toolbar-bg: transparent;
    --ui-toolbar-padding: 0;
    --ui-toolbar-radius: 0;
  }
  .toolbar {
    display: flex;
    gap: var(--ui-toolbar-gap);
    align-items: center;
    background: var(--ui-toolbar-bg);
    padding: var(--ui-toolbar-padding);
    border-radius: var(--ui-toolbar-radius);
    width: 100%;
  }
  :host([orientation="vertical"]) .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  :host([headless]) .toolbar { display: none; }
`;


export class UIToolbar extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'headless'];
  }

  private _orientation: 'horizontal' | 'vertical' = 'horizontal';
  private _headless = false;

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._orientation = (this.getAttribute('orientation') === 'vertical') ? 'vertical' : 'horizontal';
    this._headless = this.hasAttribute('headless');
    this.render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'orientation' || name === 'headless') {
      this._orientation = (this.getAttribute('orientation') === 'vertical') ? 'vertical' : 'horizontal';
      this._headless = this.hasAttribute('headless');
      this.render();
      this._attachEvents();
    }
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="toolbar" role="toolbar" aria-orientation="${this._orientation}"><slot></slot></div>
    `);
  }

  private _attachEvents() {
    const toolbar = this.root.querySelector('.toolbar');
    if (toolbar) {
      toolbar.removeEventListener('keydown', this._onKeyDown as EventListener);
      toolbar.addEventListener('keydown', this._onKeyDown as EventListener);
    }
  }

  private _detachEvents() {
    const toolbar = this.root.querySelector('.toolbar');
    if (toolbar) {
      toolbar.removeEventListener('keydown', this._onKeyDown as EventListener);
    }
  }

  private _onKeyDown(e: KeyboardEvent) {
    const items = Array.from(this.root.querySelector('slot')?.assignedElements() || []).filter(el => !el.hasAttribute('disabled'));
    const path = e.composedPath();
    const idx = items.findIndex((item) => path.includes(item));
    if (items.length < 2 || idx === -1) return;
    let nextIdx = idx;
    if (this._orientation === 'horizontal') {
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
      if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
    } else {
      if (e.key === 'ArrowDown') nextIdx = (idx + 1) % items.length;
      if (e.key === 'ArrowUp') nextIdx = (idx - 1 + items.length) % items.length;
    }
    if (nextIdx !== idx) {
      (items[nextIdx] as HTMLElement).focus();
      e.preventDefault();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toolbar')) {
  customElements.define('ui-toolbar', UIToolbar);
}
