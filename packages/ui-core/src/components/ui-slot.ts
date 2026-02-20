import { ElementBase } from '../ElementBase';


export class UISlot extends ElementBase {
  static get observedAttributes() {
    return ['name', 'headless'];
  }

  private _name = '';
  private _headless = false;
  private _slotEl: HTMLSlotElement | null = null;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'name' || name === 'headless') {
      this._name = this.getAttribute('name') || '';
      this._headless = this.hasAttribute('headless');
      this.render();
    }
  }

  connectedCallback() {
    this._name = this.getAttribute('name') || '';
    this._headless = this.hasAttribute('headless');
    super.connectedCallback();
  }

  disconnectedCallback() {
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._onSlotChange);
      this._slotEl = null;
    }
    super.disconnectedCallback();
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    const slotName = this._name.trim();
    const slotTag = slotName ? `<slot name="${slotName}"></slot>` : '<slot></slot>';
    this.setContent(slotTag);
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._onSlotChange);
      this._slotEl = null;
    }
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;
    this._slotEl = slot;
    this._slotEl.addEventListener('slotchange', this._onSlotChange);
  }

  private _onSlotChange(e: Event) {
    this.dispatchEvent(new CustomEvent('slotchange', { bubbles: true, detail: { name: this._name } }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-slot')) {
  customElements.define('ui-slot', UISlot);
}
