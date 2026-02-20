import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-label-font: 14px;
    --ui-label-color: var(--ui-foreground, #111);
    --ui-label-weight: 500;
    --ui-label-margin: 0 0 4px 0;
  }
  label {
    font-size: var(--ui-label-font);
    color: var(--ui-label-color);
    font-weight: var(--ui-label-weight);
    cursor: pointer;
    margin-bottom: 4px;
    margin: var(--ui-label-margin);
    display: inline-block;
    transition: color 0.18s;
  }
  :host([headless]) label { display: none; }
`;


export class UILabel extends ElementBase {
  static get observedAttributes() {
    return ['for', 'headless'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('focusin', this._onFocus as EventListener);
    this.root.addEventListener('focusout', this._onBlur as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('focusin', this._onFocus as EventListener);
    this.root.removeEventListener('focusout', this._onBlur as EventListener);
    super.disconnectedCallback();
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
    const htmlFor = this.getAttribute('for');
    if (htmlFor) {
      const control = document.getElementById(htmlFor);
      if (control && typeof (control as HTMLElement).focus === 'function') {
        (control as HTMLElement).focus();
      }
    }
    this.dispatchEvent(new CustomEvent('click', { bubbles: true }));
  }

  _onFocus(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('focus', { bubbles: true }));
  }

  _onBlur(e: FocusEvent) {
    this.dispatchEvent(new CustomEvent('blur', { bubbles: true }));
  }

  protected render() {
    const htmlFor = this.getAttribute('for') || '';
    this.setContent(`
      <style>${style}</style>
      <label for="${htmlFor}"><slot></slot></label>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-label')) {
  customElements.define('ui-label', UILabel);
}
