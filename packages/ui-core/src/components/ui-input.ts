import { ElementBase } from '../ElementBase';

const style = `
  :host { 
    --ui-input-padding: var(--ui-padding, 8px 10px);
    --ui-input-border: var(--ui-border, 1px solid rgba(0,0,0,0.12));
    --ui-input-border-radius: var(--ui-radius, 6px);
    --ui-input-min-height: var(--ui-min-height, 36px);
    --ui-input-width: var(--ui-width, auto);
    --ui-label-color: var(--ui-muted, #6b6b6b);
    --ui-description-color: var(--ui-muted, #6b6b6b);
    display: inline-block;
    width: auto;
    font-family: inherit;
  }

  .label-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 4px; }
  .label-row .label { font-size: 13px; color: var(--ui-label-color); }
  .label-row .description { font-size: 12px; color: var(--ui-description-color); }

  .input-root { display: inline-flex; align-items: center; gap: 8px; }
  .input-wrap { position: relative; display: inline-flex; align-items: center; width: 100%; }

  input {
    box-sizing: border-box;
    padding: var(--ui-input-padding);
    border: var(--ui-input-border);
    border-radius: var(--ui-input-border-radius);
    min-height: var(--ui-input-min-height);
    width: var(--ui-input-width);
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
  }

  input[disabled] { opacity: 0.6; pointer-events: none; }

  :host([size="sm"]) input, :host([size="1"]) input { padding: 4px 8px; min-height: 28px; font-size: 12px; }
  :host([size="lg"]) input, :host([size="3"]) input { padding: 10px 14px; min-height: 44px; font-size: 16px; }
  :host([size="2"]) input { /* default mid-size */ }

  /* variants */
  :host([variant="classic"]) input { background: white; }
  :host([variant="surface"]) input { background: var(--ui-surface, #f9fafb); border-radius: var(--ui-input-border-radius); }
  :host([variant="soft"]) input { background: rgba(2,6,23,0.03); border: 1px solid rgba(2,6,23,0.06); }

  /* radius token mapping */
  :host([radius="none"]) input { border-radius: 0; }
  :host([radius="large"]) input { border-radius: 12px; }
  :host([radius="full"]) input { border-radius: 9999px; }

  :host([validation="error"]) input { border-color: var(--ui-error, #dc2626); box-shadow: 0 0 0 4px rgba(220,38,38,0.06); }
  :host([validation="success"]) input { border-color: var(--ui-success, #16a34a); }

  .prefix, .suffix { display: inline-flex; align-items: center; gap: 6px; }

  button.clear-btn {
    position: absolute;
    right: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    font-size: 14px;
    line-height: 1;
    color: currentColor;
  }

  button.clear-btn[hidden] { display: none; }

  .error-text { margin-top: 6px; color: var(--ui-error, #dc2626); font-size: 12px; }
`;

export class UIInput extends ElementBase {
  static get observedAttributes() {
    return [
      'value', 'placeholder', 'disabled', 'clearable', 'size', 'validation', 'debounce', 'maxlength', 'readonly', 'autofocus',
      /* form attrs */ 'type', 'name', 'required', 'pattern', 'inputmode', 'autocomplete',
      /* presentation */ 'variant', 'color', 'radius',
      /* label/description */ 'label', 'description'
    ];
  }

  private _input!: HTMLInputElement | null;
  private _debounceTimer: any = null;

  private _uid = Math.random().toString(36).slice(2, 8);

  constructor() {
    super();
  }

  private _formUnregister: (() => void) | null = null;

  connectedCallback() {
    super.connectedCallback();

    // auto-register with nearest ui-form (if present)
    try {
      const formEl = (this.getRootNode() as any).host ? (this.getRootNode() as any).host.closest?.('ui-form') : this.closest?.('ui-form');
      const parentForm = formEl || this.closest('ui-form');
      const name = this.getAttribute('name');
      if (parentForm && typeof parentForm.registerField === 'function' && name) {
        this._formUnregister = parentForm.registerField(name, {
          name,
          getValue: () => this.value,
          setValue: (v: any) => { this.value = v; },
          validate: async () => {
            if (!this._input) return { valid: true };
            const valid = this._input.checkValidity();
            return { valid, message: this._input.validationMessage || undefined };
          },
          setError: (msg?: string) => {
            if (msg) {
              this.setAttribute('validation', 'error');
              this.setAttribute('data-error', msg);
            } else {
              this.removeAttribute('validation');
              this.removeAttribute('data-error');
            }
          }
        });
      }
    } catch (err) {
      // ignore registration errors
    }
  }

  disconnectedCallback() {
    if (this._debounceTimer) { clearTimeout(this._debounceTimer); this._debounceTimer = null; }
    if (this._formUnregister) { this._formUnregister(); this._formUnregister = null; }
  }

  // keep a lightweight attributeChangedCallback so updating `value` doesn't force
  // a full re-render (prevents focus loss while typing). Other attribute changes
  // fall back to the base class behavior.
  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    if (name === 'value') {
      // update input's value in-place and toggle clear button visibility
      if (this._input) {
        const v = newVal || '';
        if (this._input.value !== v) this._input.value = v;
        const cb = this.root.querySelector('button.clear-btn') as HTMLButtonElement | null;
        if (cb) {
          if (v) cb.removeAttribute('hidden'); else cb.setAttribute('hidden', '');
        }
      }
      return; // avoid full re-render
    }
    // otherwise perform a normal render
    super.attributeChangedCallback();
  }

  get value() { return this.getAttribute('value') || ''; }
  set value(v: string) { this.setAttribute('value', v); }

  protected render() {
    const headless = this.hasAttribute('headless');
    const value = this.getAttribute('value') || '';
    const placeholder = this.getAttribute('placeholder') || '';
    // robust disabled parsing: support disabled="false" or disabled="0" being treated as NOT disabled
    const rawDisabled = this.getAttribute('disabled');
    const disabled = rawDisabled !== null && String(rawDisabled).toLowerCase() !== 'false' && String(rawDisabled) !== '0';
    const clearable = this.hasAttribute('clearable');
    const maxlength = this.getAttribute('maxlength');
    const readOnly = this.hasAttribute('readonly');

    /* form attributes */
    const type = this.getAttribute('type') || 'text';
    const name = this.getAttribute('name') || '';
    const required = this.hasAttribute('required');
    const pattern = this.getAttribute('pattern') || '';
    const inputMode = this.getAttribute('inputmode') || '';
    const autoComplete = this.getAttribute('autocomplete') || '';

    /* presentation */
    const variant = this.getAttribute('variant') || 'classic';
    const color = this.getAttribute('color') || '';
    const radius = this.getAttribute('radius') || '';

    /* label / description */
    const labelAttr = this.getAttribute('label') || '';
    const descAttr = this.getAttribute('description') || '';

    // prefix / suffix slots + optional clear button + error slot
    // always render a clear button when `clearable` is present; toggle visibility with `hidden` so we don't need to re-render on every keystroke
    const clearBtnHtml = clearable ? `<button part="clear" class="clear-btn" aria-label="Clear" ${value ? '' : 'hidden'}>✕</button>` : '';

    this.setContent(`
      ${headless ? '' : `<style>${style}</style>`}
      ${labelAttr || descAttr || this.querySelector('[slot="label"]') || this.querySelector('[slot="description"]') ? `
        <div class="label-row">
          <label class="label" part="label" id="${this._uid}-label"><slot name="label">${labelAttr}</slot></label>
          <div class="description" part="description" id="${this._uid}-description"><slot name="description">${descAttr}</slot></div>
        </div>
      ` : ''}

      <div class="input-root" part="root" data-variant="${variant}" data-color="${color}" data-radius="${radius}">
        <div class="prefix"><slot name="prefix"></slot></div>
        <div class="input-wrap">
          <input
            part="input"
            type="${type}"
            name="${name}"
            ${required ? 'required' : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
            ${inputMode ? `inputmode="${inputMode}"` : ''}
            ${autoComplete ? `autocomplete="${autoComplete}"` : ''}
            aria-labelledby="${labelAttr || this.querySelector('[slot="label"]') ? `${this._uid}-label` : ''}"
            aria-describedby="${descAttr || this.querySelector('[slot="description"]') || this.getAttribute('validation') === 'error' ? `${this._uid}-description` : ''}"
            value="${value}"
            placeholder="${placeholder}"
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${maxlength ? `maxlength="${maxlength}"` : ''} />
          ${clearBtnHtml}
        </div>
        <div class="suffix"><slot name="suffix"></slot></div>
      </div>
      <div class="error-text">${this.getAttribute('data-error') ? `${this.getAttribute('data-error')}` : `<slot name="error"></slot>`}</div>
    `);

    this._input = this.root.querySelector('input');

    const debounceMs = Number(this.getAttribute('debounce') || 0);
    const validation = this.getAttribute('validation');

    if (this._input) {
      // accessibility: aria-invalid
      if (validation === 'error') this._input.setAttribute('aria-invalid', 'true'); else this._input.removeAttribute('aria-invalid');

      // ensure ARIA references still point to the right shadow ids
      const labelEl = this.root.getElementById(`${this._uid}-label`);
      const descEl = this.root.getElementById(`${this._uid}-description`);
      if (labelEl) this._input.setAttribute('aria-labelledby', `${this._uid}-label`);
      else this._input.removeAttribute('aria-labelledby');
      if (descEl) this._input.setAttribute('aria-describedby', `${this._uid}-description`);
      else this._input.removeAttribute('aria-describedby');

      // autofocus support (focus after render)
      if (this.hasAttribute('autofocus')) {
        setTimeout(() => { try { this._input && this._input.focus(); } catch (e) {} }, 0);
      }

      this._input.addEventListener('input', (e: Event) => {
        const v = (e.target as HTMLInputElement).value;

        // update attribute for external observers but avoid forcing a full re-render here
        this.setAttribute('value', v);
        this.dispatchEvent(new CustomEvent('input', { detail: { value: v }, bubbles: true }));

        // debounce behavior
        if (debounceMs > 0) {
          if (this._debounceTimer) clearTimeout(this._debounceTimer);
          this._debounceTimer = setTimeout(() => {
            this.dispatchEvent(new CustomEvent('debounced-input', { detail: { value: v }, bubbles: true }));
            this._debounceTimer = null;
          }, debounceMs);
        } else {
          // still emit debounced-input synchronously when debounce not set (convenience)
          this.dispatchEvent(new CustomEvent('debounced-input', { detail: { value: v }, bubbles: true }));
        }

        // toggle clear button visibility without re-rendering
        if (clearable) {
          const cb = this.root.querySelector('button.clear-btn') as HTMLButtonElement | null;
          if (cb) {
            if (v) cb.removeAttribute('hidden'); else cb.setAttribute('hidden', '');
          }
        }
      });

      this._input.addEventListener('change', (e: Event) => {
        const v = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new CustomEvent('change', { detail: { value: v }, bubbles: true }));
      });

      // clear button
      const clearBtn = this.root.querySelector('button.clear-btn') as HTMLButtonElement | null;
      if (clearBtn) {
        clearBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          this.setAttribute('value', '');
          if (this._input) {
            this._input.value = '';
            // trigger input/change events
            this._input.dispatchEvent(new Event('input', { bubbles: true }));
            this._input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          this.dispatchEvent(new CustomEvent('clear', { bubbles: true }));
          // hide clear button without re-rendering
          if (clearable) {
            const cb = this.root.querySelector('button.clear-btn') as HTMLButtonElement | null;
            if (cb) cb.setAttribute('hidden', '');
          }
        });
      }
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-input')) {
  customElements.define('ui-input', UIInput);
}
