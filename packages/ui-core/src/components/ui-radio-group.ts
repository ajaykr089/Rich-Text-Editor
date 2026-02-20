import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: flex;
    flex-direction: column;
    gap: 10px;
    --ui-radio-size: 18px;
    --ui-radio-border: 2px solid var(--ui-primary, #2563eb);
    --ui-radio-bg: #fff;
    --ui-radio-checked-bg: var(--ui-primary, #2563eb);
    --ui-radio-disabled-bg: #f3f4f6;
    --ui-radio-disabled-border: 2px solid #d1d5db;
    --ui-radio-focus: 0 0 0 3px rgba(37,99,235,0.18);
    --ui-radio-transition: box-shadow 0.18s, background 0.18s, border-color 0.18s;
  }
  .radio {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
  }
  .circle {
    position: relative;
    width: var(--ui-radio-size);
    height: var(--ui-radio-size);
    border: var(--ui-radio-border);
    background: var(--ui-radio-bg);
    border-radius: 50%;
    transition: var(--ui-radio-transition);
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    box-sizing: border-box;
  }
  .circle[aria-checked="true"] {
    background: var(--ui-radio-checked-bg);
    border-color: var(--ui-radio-checked-bg);
  }
  .circle[aria-disabled="true"] {
    background: var(--ui-radio-disabled-bg);
    border: var(--ui-radio-disabled-border);
    cursor: not-allowed;
    opacity: 0.7;
  }
  .circle:focus-visible {
    box-shadow: var(--ui-radio-focus);
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    opacity: 0;
    transition: opacity 0.18s;
  }
  .circle[aria-checked="true"] .dot {
    opacity: 1;
  }
  .label {
    font-size: 15px;
    color: var(--ui-foreground, #222);
    cursor: pointer;
    user-select: none;
    transition: color 0.18s;
  }
  :host([headless]) .radio, :host([headless]) .circle, :host([headless]) .label { display: none; }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIRadioGroup extends ElementBase {
  static get observedAttributes() {
    return ['disabled', 'value', 'headless'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.setAttribute('role', 'radiogroup');
    this.setAttribute('tabindex', '0');
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get value() {
    return this.getAttribute('value') || '';
  }
  set value(val: string) {
    if ((val || '') === this.value) return;
    this.setAttribute('value', val);
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

  _onClick(e: MouseEvent) {
    if (this.disabled) return;
    const target = e.target as HTMLElement;
    const radioEl = target.closest('.radio') as HTMLElement | null;
    if (!radioEl) return;
    const idx = Number(radioEl.getAttribute('data-index'));
    const radios = this._getRadios();
    if (Number.isNaN(idx) || !radios[idx] || radios[idx].disabled) return;
    this.value = radios[idx].value;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
  }

  _onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    const radios = this._getRadios();
    if (radios.length === 0) return;
    const idx = radios.findIndex(r => r.value === this.value);
    let nextIdx = idx >= 0 ? idx : 0;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % radios.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + radios.length) % radios.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const current = idx >= 0 ? idx : 0;
      if (radios[current] && !radios[current].disabled) {
        this.value = radios[current].value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
      }
      return;
    } else {
      return;
    }
    e.preventDefault();
    if (radios[nextIdx] && !radios[nextIdx].disabled) {
      this.value = radios[nextIdx].value;
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
    }
  }

  _getRadios() {
    return Array.from(this.children)
      .filter((n) => n instanceof HTMLElement && n.hasAttribute('data-radio'))
      .map((n) => {
        const el = n as HTMLElement;
        return {
          value: el.getAttribute('data-value') || '',
          label: el.textContent || '',
          disabled: el.hasAttribute('data-disabled'),
        };
      });
  }

  protected render() {
    const value = this.value;
    const disabled = this.disabled;
    // For demo: expects children as <div data-radio data-value="foo">Label</div>
    const radios = this._getRadios();
    this.setContent(`
      <style>${style}</style>
      ${radios.map((r, i) => `
        <div class="radio" data-index="${i}" role="radio" aria-checked="${r.value === value ? 'true' : 'false'}" aria-disabled="${disabled || r.disabled ? 'true' : 'false'}" tabindex="${r.value === value ? '0' : '-1'}">
          <div class="circle" data-index="${i}" aria-checked="${r.value === value ? 'true' : 'false'}" aria-disabled="${disabled || r.disabled ? 'true' : 'false'}">
            <span class="dot"></span>
          </div>
          <span class="label">${escapeHtml(r.label)}</span>
        </div>
      `).join('')}
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-radio-group')) {
  customElements.define('ui-radio-group', UIRadioGroup);
}
