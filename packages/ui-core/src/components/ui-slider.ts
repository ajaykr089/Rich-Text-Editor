import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    align-items: center;
    width: 180px;
    --ui-slider-track: #e5e7eb;
    --ui-slider-thumb: var(--ui-primary, #2563eb);
    --ui-slider-thumb-size: 18px;
    --ui-slider-thumb-shadow: 0 1px 4px rgba(0,0,0,0.08);
    --ui-slider-focus: 0 0 0 3px rgba(37,99,235,0.18);
    --ui-slider-disabled: #f3f4f6;
    --ui-slider-transition: background 0.18s, box-shadow 0.18s;
  }
  .slider {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
  }
  input[type="range"] {
    width: 100%;
    height: 4px;
    background: var(--ui-slider-track);
    border-radius: 2px;
    outline: none;
    margin: 0;
    padding: 0;
    appearance: none;
    transition: var(--ui-slider-transition);
  }
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: var(--ui-slider-thumb-size);
    height: var(--ui-slider-thumb-size);
    background: var(--ui-slider-thumb);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: var(--ui-slider-thumb-shadow);
    transition: background 0.18s;
  }
  input[type="range"]:focus-visible::-webkit-slider-thumb {
    box-shadow: var(--ui-slider-focus);
  }
  input[type="range"]::-moz-range-thumb {
    width: var(--ui-slider-thumb-size);
    height: var(--ui-slider-thumb-size);
    background: var(--ui-slider-thumb);
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  input[type="range"]:disabled {
    background: var(--ui-slider-disabled);
    cursor: not-allowed;
    opacity: 0.7;
  }
  .value {
    margin-left: 10px;
    font-size: 14px;
    color: var(--ui-foreground, #222);
    min-width: 32px;
    text-align: right;
  }
  :host([headless]) .slider, :host([headless]) .value { display: none; }
`;

export class UISlider extends ElementBase {
  private _rangeEl: HTMLInputElement | null = null;
  private _valueEl: HTMLElement | null = null;
  static get observedAttributes() {
    return ['min', 'max', 'step', 'value', 'disabled', 'headless'];
  }

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('input', this._onInput);
    this.root.addEventListener('change', this._onChange);
    this.setAttribute('role', 'slider');
    this.setAttribute('tabindex', '0');
  }

  disconnectedCallback() {
    this.root.removeEventListener('input', this._onInput);
    this.root.removeEventListener('change', this._onChange);
    super.disconnectedCallback();
  }

  get value() {
    return Number(this.getAttribute('value') || 0);
  }
  set value(val: number) {
    if (Number(val) === this.value) return;
    this.setAttribute('value', String(val));
  }

  get min() {
    return Number(this.getAttribute('min') || 0);
  }
  set min(val: number) {
    if (Number(val) === this.min) return;
    this.setAttribute('min', String(val));
  }

  get max() {
    return Number(this.getAttribute('max') || 100);
  }
  set max(val: number) {
    if (Number(val) === this.max) return;
    this.setAttribute('max', String(val));
  }

  get step() {
    return Number(this.getAttribute('step') || 1);
  }
  set step(val: number) {
    if (Number(val) === this.step) return;
    this.setAttribute('step', String(val));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val === this.disabled) return;
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onInput(e: Event) {
    if (this.disabled) return;
    const input = this._rangeEl || (this.root.querySelector('input[type="range"]') as HTMLInputElement | null);
    if (input) {
      this.value = Number(input.value);
      this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true }));
      if (this._valueEl) this._valueEl.textContent = String(this.value);
    }
  }

  _onChange(e: Event) {
    if (this.disabled) return;
    const input = this._rangeEl || (this.root.querySelector('input[type="range"]') as HTMLInputElement | null);
    if (input) {
      this.value = Number(input.value);
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
      if (this._valueEl) this._valueEl.textContent = String(this.value);
    }
  }

  protected render() {
    const min = this.min;
    const max = this.max;
    const step = this.step;
    const value = this.value;
    const disabled = this.disabled;
    this.setAttribute('aria-valuenow', String(value));
    this.setAttribute('aria-valuemin', String(min));
    this.setAttribute('aria-valuemax', String(max));
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('tabindex', disabled ? '-1' : '0');
    this.setContent(`
      <style>${style}</style>
      <div class="slider">
        <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" ${disabled ? 'disabled' : ''} />
      </div>
      <span class="value">${value}</span>
      <slot></slot>
    `);
    this._rangeEl = this.root.querySelector('input[type="range"]') as HTMLInputElement | null;
    this._valueEl = this.root.querySelector('.value') as HTMLElement | null;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-slider')) {
  customElements.define('ui-slider', UISlider);
}
