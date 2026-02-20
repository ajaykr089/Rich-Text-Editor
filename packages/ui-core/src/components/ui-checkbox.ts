import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    align-items: center;
    --ui-checkbox-size: 18px;
    --ui-checkbox-border: 2px solid var(--ui-primary, #2563eb);
    --ui-checkbox-background: var(--ui-bg, #fff);
    --ui-checkbox-checked-background: var(--ui-primary, #2563eb);
    --ui-checkbox-checked-border: none;
    --ui-checkbox-radius: 4px;
    --ui-checkbox-transition: box-shadow 0.18s, background 0.18s, border-color 0.18s;
    --ui-checkbox-focus: 0 0 0 3px rgba(37,99,235,0.18);
    --ui-checkbox-disabled-bg: #f3f4f6;
    --ui-checkbox-disabled-border: 2px solid #d1d5db;
    --ui-checkbox-indeterminate-bg: #fbbf24;
  }

  .checkbox {
    position: relative;
    width: var(--ui-checkbox-size);
    height: var(--ui-checkbox-size);
    border: var(--ui-checkbox-border);
    background: var(--ui-checkbox-background);
    border-radius: var(--ui-checkbox-radius);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: var(--ui-checkbox-transition);
    box-sizing: border-box;
    outline: none;
    user-select: none;
  }
  .checkbox[aria-checked="true"] {
    background: var(--ui-checkbox-checked-background);
    border: var(--ui-checkbox-checked-border, 2px solid var(--ui-primary, #2563eb));
  }
  .checkbox[aria-checked="mixed"] {
    background: var(--ui-checkbox-indeterminate-bg);
    border: var(--ui-checkbox-border);
  }
  .checkbox:focus-visible {
    box-shadow: var(--ui-checkbox-focus);
  }
  .checkbox[aria-disabled="true"] {
    background: var(--ui-checkbox-disabled-bg);
    border: var(--ui-checkbox-disabled-border);
    cursor: not-allowed;
    opacity: 0.7;
  }
  .checkmark, .indeterminate {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    pointer-events: none;
    transition: opacity 0.18s, transform 0.18s;
  }
  .checkmark {
    width: 12px;
    height: 12px;
    display: none;
    color: #fff;
  }
  .checkbox[aria-checked="true"] .checkmark {
    display: block;
  }
  .indeterminate {
    width: 10px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
    display: none;
  }
  .checkbox[aria-checked="mixed"] .indeterminate {
    display: block;
  }
  .label {
    margin-left: 10px;
    font-size: 15px;
    color: var(--ui-foreground, #222);
    cursor: pointer;
    user-select: none;
    transition: color 0.18s;
  }
  :host([headless]) .checkbox, :host([headless]) .label { display: none; }
`;


export class UICheckbox extends ElementBase {
  private _uid: string;
  static get observedAttributes() {
    return ['checked', 'disabled', 'indeterminate', 'headless', 'loading'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._uid = `ui-checkbox-${Math.random().toString(36).slice(2, 9)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'checkbox');
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get checked() {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    if (val === this.checked) return;
    if (val) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
  }

  get indeterminate() {
    return this.hasAttribute('indeterminate');
  }
  set indeterminate(val: boolean) {
    if (val === this.indeterminate) return;
    if (val) this.setAttribute('indeterminate', '');
    else this.removeAttribute('indeterminate');
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

  private _toggleChecked() {
    if (this.disabled) return;
    if (this.indeterminate) {
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true }));
  }

  _onClick(e: MouseEvent) {
    if (this.disabled) return;
    const path = e.composedPath();
    const toggledFromCheckbox = path.some((node) => {
      const el = node as HTMLElement;
      if (!el || typeof el.classList === 'undefined') return false;
      return el.classList.contains('checkbox') || el.classList.contains('label');
    });
    if (toggledFromCheckbox) {
      this._toggleChecked();
    }
  }

  _onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._toggleChecked();
    }
  }

  protected render() {
    const checked = this.checked;
    const indeterminate = this.indeterminate;
    const disabled = this.disabled;
    const ariaChecked = indeterminate ? 'mixed' : checked ? 'true' : 'false';
    const ariaDisabled = disabled ? 'true' : 'false';
    const labelId = `${this._uid}-label`;

    this.setAttribute('aria-checked', ariaChecked);
    this.setAttribute('aria-disabled', ariaDisabled);
    this.setAttribute('aria-labelledby', labelId);
    this.setAttribute('tabindex', disabled ? '-1' : '0');

    this.setContent(`
      <style>${style}</style>
      <div class="checkbox" role="checkbox" aria-checked="${ariaChecked}" aria-disabled="${ariaDisabled}" tabindex="-1">
        <svg class="checkmark" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8.5 7 12.5 13 5.5" /></svg>
        <span class="indeterminate"></span>
      </div>
      <span class="label" id="${labelId}"><slot></slot></span>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-checkbox')) {
  customElements.define('ui-checkbox', UICheckbox);
}
