import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    align-items: center;
    --ui-switch-width: 36px;
    --ui-switch-height: 20px;
    --ui-switch-bg: #e5e7eb;
    --ui-switch-checked-bg: var(--ui-primary, #2563eb);
    --ui-switch-thumb: #fff;
    --ui-switch-disabled-bg: #f3f4f6;
    --ui-switch-disabled-thumb: #e5e7eb;
    --ui-switch-focus: 0 0 0 3px rgba(37,99,235,0.18);
    --ui-switch-transition: background 0.18s, box-shadow 0.18s;
    outline: none;
  }
  .switch {
    position: relative;
    width: var(--ui-switch-width);
    height: var(--ui-switch-height);
    background: var(--ui-switch-bg);
    border-radius: 999px;
    cursor: pointer;
    transition: var(--ui-switch-transition);
    display: flex;
    align-items: center;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    border: none;
  }
  .switch[aria-checked="true"] {
    background: var(--ui-switch-checked-bg);
  }
  .switch[aria-disabled="true"] {
    background: var(--ui-switch-disabled-bg);
    cursor: not-allowed;
    opacity: 0.7;
  }
  .switch:focus-visible {
    box-shadow: var(--ui-switch-focus);
  }
  .thumb {
    position: absolute;
    left: 2px;
    top: 2px;
    width: 16px;
    height: 16px;
    background: var(--ui-switch-thumb);
    border-radius: 50%;
    transition: left 0.18s, background 0.18s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    will-change: left;
  }
  .switch[aria-checked="true"] .thumb {
    left: 18px;
  }
  .switch[aria-disabled="true"] .thumb {
    background: var(--ui-switch-disabled-thumb);
  }
  .label {
    margin-left: 10px;
    font-size: 15px;
    color: var(--ui-foreground, #222);
    cursor: pointer;
    user-select: none;
    transition: color 0.18s;
  }
  :host([headless]) .switch, :host([headless]) .label { display: none; }
`;

export class UISwitch extends ElementBase {
  private _controlled: boolean = false;

  static get observedAttributes() {
    return ['checked', 'disabled', 'headless', 'tabindex'];
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
    this.setAttribute('role', 'switch');
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0');
    // Detect controlled usage
    this._controlled = this.hasAttribute('checked');
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('focusin', this._onFocus as EventListener);
    this.root.removeEventListener('focusout', this._onBlur as EventListener);
    super.disconnectedCallback();
  }


  get checked() {
    return this.hasAttribute('checked');
  }
  set checked(val: boolean) {
    if (val === this.checked) return;
    if (val) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
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

  private _toggleChecked() {
    if (this.disabled) return;
    const prev = this.checked;
    const next = !prev;
    if (!this._controlled) {
      if (next) this.setAttribute('checked', '');
      else this.removeAttribute('checked');
    }
    this.dispatchEvent(new CustomEvent('input', { detail: { checked: next }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: next }, bubbles: true }));
  }


  _onClick(e: MouseEvent) {
    if (this.disabled) return;
    const path = e.composedPath();
    const toggledFromSwitch = path.some((node) => {
      const el = node as HTMLElement;
      if (!el || typeof el.classList === 'undefined') return false;
      return el.classList.contains('switch') || el.classList.contains('label');
    });
    if (toggledFromSwitch) {
      this._toggleChecked();
    }
  }


  _onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this._toggleChecked();
    } else if (e.key === 'Tab') {
      // Let Tab propagate for focus
    }
  }

  _onFocus(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true }));
  }

  _onBlur(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }


  /**
   * Render the switch UI. Supports headless mode and slotting for custom label.
   */
  protected render() {
    const checked = this.checked;
    const disabled = this.disabled;
    const ariaChecked = checked ? 'true' : 'false';
    const ariaDisabled = disabled ? 'true' : 'false';
    this.setAttribute('aria-checked', ariaChecked);
    this.setAttribute('aria-disabled', ariaDisabled);
    this.setAttribute('tabindex', disabled ? '-1' : '0');
    this.setContent(`
      <style>${style}</style>
      <div class="switch" role="switch" aria-checked="${ariaChecked}" aria-disabled="${ariaDisabled}" tabindex="-1">
        <span class="thumb"></span>
      </div>
      <span class="label"><slot></slot></span>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-switch')) {
  customElements.define('ui-switch', UISwitch);
}
