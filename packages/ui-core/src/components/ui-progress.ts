import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-progress-bg: #e5e7eb;
    --ui-progress-fill: #2563eb;
    --ui-progress-radius: 4px;
    --ui-progress-height: 8px;
  }
  .bar {
    width: 100%;
    height: var(--ui-progress-height);
    background: var(--ui-progress-bg);
    border-radius: var(--ui-progress-radius);
    overflow: hidden;
    position: relative;
  }
  .fill {
    height: 100%;
    background: var(--ui-progress-fill);
    border-radius: var(--ui-progress-radius);
    transition: width 0.2s;
    width: 0;
  }
  :host([indeterminate]) .fill {
    width: 100%;
    animation: indeterminate 1.2s infinite linear;
    background: repeating-linear-gradient(90deg, var(--ui-progress-fill) 0 20%, #3b82f6 20% 40%, var(--ui-progress-fill) 40% 100%);
  }
  @keyframes indeterminate {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  :host([headless]) .bar { display: none; }
`;


export class UIProgress extends ElementBase {
  static get observedAttributes() {
    return ['value', 'max', 'indeterminate', 'headless'];
  }

  private _value = 0;
  private _max = 100;
  private _indeterminate = false;
  private _headless = false;

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'value' || name === 'max' || name === 'indeterminate' || name === 'headless') {
      this._value = Number(this.getAttribute('value'));
      if (isNaN(this._value)) this._value = 0;
      this._max = Number(this.getAttribute('max'));
      if (isNaN(this._max) || this._max <= 0) this._max = 100;
      this._indeterminate = this.hasAttribute('indeterminate');
      this._headless = this.hasAttribute('headless');
      this.render();
      this._dispatchEvents();
    }
  }

  protected render() {
    const percent = this._indeterminate ? 100 : Math.max(0, Math.min(100, (this._value / this._max) * 100));
    this.setContent(`
      <style>${style}</style>
      <div class="bar" role="progressbar"
        aria-valuenow="${this._indeterminate ? '' : this._value}"
        aria-valuemax="${this._max}"
        aria-valuemin="0"
        aria-busy="${this._indeterminate ? 'true' : 'false'}"
        ${this._indeterminate ? 'aria-valuetext="Loading"' : ''}
      >
        <div class="fill" style="width:${percent}%;"></div>
        <slot></slot>
      </div>
    `);
  }

  private _dispatchEvents() {
    if (this._indeterminate) return;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this._value, max: this._max }, bubbles: true }));
    if (this._value >= this._max) {
      this.dispatchEvent(new CustomEvent('complete', { bubbles: true }));
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-progress')) {
  customElements.define('ui-progress', UIProgress);
}