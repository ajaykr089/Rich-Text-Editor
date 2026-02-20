import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-toggle-radius: 6px;
    --ui-toggle-bg: #fff;
    --ui-toggle-border: 1px solid #e5e7eb;
    --ui-toggle-color: #111;
    --ui-toggle-active-bg: var(--ui-primary, #2563eb);
    --ui-toggle-active-color: #fff;
    --ui-toggle-active-border: var(--ui-primary, #2563eb);
    --ui-toggle-disabled-bg: #f3f4f6;
    --ui-toggle-disabled-color: #bdbdbd;
    --ui-toggle-padding: 6px 14px;
    --ui-toggle-font: 14px;
  }
  button {
    padding: var(--ui-toggle-padding);
    border-radius: var(--ui-toggle-radius);
    border: var(--ui-toggle-border);
    background: var(--ui-toggle-bg);
    color: var(--ui-toggle-color);
    font-size: var(--ui-toggle-font);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    outline: none;
    min-width: 36px;
    min-height: 32px;
    box-sizing: border-box;
  }
  button[aria-pressed="true"] {
    background: var(--ui-toggle-active-bg);
    color: var(--ui-toggle-active-color);
    border-color: var(--ui-toggle-active-border);
  }
  button:disabled {
    background: var(--ui-toggle-disabled-bg);
    color: var(--ui-toggle-disabled-color);
    cursor: not-allowed;
    opacity: 0.7;
  }
  :host([headless]) button { display: none; }
`;


export class UIToggle extends ElementBase {
  private _controlled: boolean = false;
  static get observedAttributes() {
    return ['pressed', 'disabled', 'headless', 'tabindex'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._controlled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('focusin', this._onFocus as EventListener);
    this.root.addEventListener('focusout', this._onBlur as EventListener);
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    this._controlled = this.hasAttribute('pressed');
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('focusin', this._onFocus as EventListener);
    this.root.removeEventListener('focusout', this._onBlur as EventListener);
    super.disconnectedCallback();
  }

  get pressed() {
    return this.hasAttribute('pressed');
  }
  set pressed(val: boolean) {
    if (val === this.pressed) return;
    if (val) this.setAttribute('pressed', '');
    else this.removeAttribute('pressed');
    this._controlled = true;
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
    const prev = this.pressed;
    const next = !prev;
    if (!this._controlled) {
      if (next) this.setAttribute('pressed', '');
      else this.removeAttribute('pressed');
    }
    this.dispatchEvent(new CustomEvent('input', { detail: { pressed: next }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { pressed: next }, bubbles: true }));
  }

  _onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._onClick(new MouseEvent('click'));
    }
  }

  _onFocus(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true }));
  }

  _onBlur(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }

  protected render() {
    const pressed = this.pressed;
    const disabled = this.disabled;
    const headless = this.headless;
    this.setContent(`
      <style>${style}</style>
      <button type="button" aria-pressed="${pressed ? 'true' : 'false'}" ${disabled ? 'disabled' : ''} tabindex="0"><slot></slot></button>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toggle')) {
  customElements.define('ui-toggle', UIToggle);
}
