import { ElementBase } from '../ElementBase';
import { FormController } from '../form';

export class UIForm extends ElementBase {
  private _controller = new FormController();

  static get observedAttributes() { return ['novalidate']; }

  constructor() { super(); }

  connectedCallback() { super.connectedCallback(); }

  // Expose a small API used by input/other fields
  registerField(name: string, field: any) {
    return this._controller.registerField(name, field);
  }

  async validate() {
    return this._controller.validateAll();
  }

  getValues() {
    return this._controller.getValues();
  }

  // simple programmatic submit helper
  async submit() {
    const { valid, errors } = await this._controller.validateAll();
    if (!valid) {
      this.dispatchEvent(new CustomEvent('invalid', { detail: { errors }, bubbles: true }));
      return false;
    }
    this.dispatchEvent(new CustomEvent('submit', { detail: { values: this._controller.getValues() }, bubbles: true }));
    return true;
  }

  protected render() {
    // form is purely logical wrapper — render children as-is
    this.setContent(`<slot></slot>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-form')) {
  customElements.define('ui-form', UIForm);
}
