import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    gap: 8px;
    --ui-toggle-group-gap: 8px;
  }
  :host([headless]) { display: none; }
`;


export class UIToggleGroup extends ElementBase {
  private _controlled: boolean = false;
  private _onSlotChange: () => void;
  static get observedAttributes() {
    return ['disabled', 'value', 'headless', 'multiple'];
  }

  constructor() {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onSlotChange = this._updateChildren.bind(this);
    this._controlled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this._onToggle as EventListener);
    this.addEventListener('keydown', this._onKeyDown as EventListener);
    this.setAttribute('role', this.multiple ? 'group' : 'radiogroup');
    this._controlled = this.hasAttribute('value');
    const slot = this.root.querySelector('slot');
    if (slot) slot.addEventListener('slotchange', this._onSlotChange);
    this._updateChildren();
  }

  disconnectedCallback() {
    this.removeEventListener('change', this._onToggle as EventListener);
    this.removeEventListener('keydown', this._onKeyDown as EventListener);
    const slot = this.root.querySelector('slot');
    if (slot) slot.removeEventListener('slotchange', this._onSlotChange);
    super.disconnectedCallback();
  }

  get value() {
    const val = this.getAttribute('value');
    if (this.multiple) {
      try { return val ? JSON.parse(val) : []; } catch { return []; }
    }
    return val || '';
  }
  set value(val: string | string[]) {
    const next = this.multiple ? JSON.stringify(val) : String(val as string);
    if (this.getAttribute('value') === next) return;
    this.setAttribute('value', next);
    this._controlled = true;
    this._updateChildren();
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(val: boolean) {
    if (val === this.disabled) return;
    if (val) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
    this._updateChildren();
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }
  set multiple(val: boolean) {
    if (val === this.multiple) return;
    if (val) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
    this._updateChildren();
  }

  _onToggle(e: CustomEvent) {
    if (this.disabled) return;
    const target = e.target as HTMLElement & { pressed?: boolean };
    if (!target || target.tagName.toLowerCase() !== 'ui-toggle') return;
    const toggles = this._getToggles();
    const idx = toggles.indexOf(target as any);
    if (idx === -1) return;

    const toggleValue =
      target.getAttribute('value') ||
      target.getAttribute('data-value') ||
      target.textContent ||
      String(idx);
    const pressedFromEvent = !!(e.detail && typeof e.detail.pressed === 'boolean' ? e.detail.pressed : target.hasAttribute('pressed'));
    let newValue;
    if (this.multiple) {
      let arr = Array.isArray(this.value) ? [...this.value] : [];
      if (pressedFromEvent) arr.push(toggleValue);
      else arr = arr.filter(v => v !== toggleValue);
      arr = Array.from(new Set(arr));
      newValue = arr;
    } else {
      newValue = toggleValue;
    }
    if (!this._controlled) {
      this.value = newValue;
    }
    this.dispatchEvent(new CustomEvent('input', { detail: { value: newValue }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { value: newValue }, bubbles: true }));
    this._updateChildren();
  }

  _onKeyDown(e: KeyboardEvent) {
    if (this.disabled) return;
    const toggles = this._getToggles();
    if (toggles.length === 0) return;
    const active = document.activeElement;
    const idx = toggles.indexOf(active as HTMLElement);
    let nextIdx = idx >= 0 ? idx : 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = idx >= 0 ? (idx + 1) % toggles.length : 0;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = idx >= 0 ? (idx - 1 + toggles.length) % toggles.length : toggles.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const toggle = toggles[nextIdx];
    (toggle as HTMLElement | undefined)?.focus();
  }

  _getToggles() {
    const slot = this.root.querySelector('slot');
    const nodes = slot ? (slot as HTMLSlotElement).assignedElements({ flatten: true }) : [];
    return nodes.filter(n => n.tagName.toLowerCase() === 'ui-toggle');
  }

  _updateChildren() {
    const toggles = this._getToggles();
    const value = this.value;
    toggles.forEach((toggle, idx) => {
      if (this.disabled) toggle.setAttribute('disabled', '');
      else if (!toggle.hasAttribute('data-disabled')) toggle.removeAttribute('disabled');
      if (!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', idx === 0 ? '0' : '-1');

      const toggleValue =
        toggle.getAttribute('value') ||
        toggle.getAttribute('data-value') ||
        toggle.textContent ||
        String(idx);
      if (this.multiple) {
        if (Array.isArray(value) && value.includes(toggleValue)) toggle.setAttribute('pressed', '');
        else toggle.removeAttribute('pressed');
      } else {
        if (value === toggleValue) toggle.setAttribute('pressed', '');
        else toggle.removeAttribute('pressed');
      }
    });
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <slot></slot>
    `);
    this._updateChildren();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-toggle-group')) {
  customElements.define('ui-toggle-group', UIToggleGroup);
}
