import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-alert-radius: 8px;
    --ui-alert-bg: #fff;
    --ui-alert-shadow: 0 8px 32px rgba(0,0,0,0.18);
    --ui-alert-padding: 24px;
    --ui-alert-min-width: 320px;
    --ui-alert-max-width: 90vw;
    --ui-alert-z: 1001;
    --ui-alert-backdrop: rgba(0,0,0,0.32);
  }
  .backdrop {
    position: fixed;
    inset: 0;
    background: var(--ui-alert-backdrop);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dialog {
    background: var(--ui-alert-bg);
    border-radius: var(--ui-alert-radius);
    box-shadow: var(--ui-alert-shadow);
    padding: var(--ui-alert-padding);
    min-width: var(--ui-alert-min-width);
    max-width: var(--ui-alert-max-width);
    z-index: var(--ui-alert-z);
    outline: none;
  }
  :host([headless]) .backdrop, :host([headless]) .dialog { display: none; }
`;


export class UIAlertDialog extends ElementBase {
  private _lastActive?: HTMLElement;
  static get observedAttributes() {
    return ['open', 'headless'];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onBackdropClick = this._onBackdropClick.bind(this);
    this._focusTrap = this._focusTrap.bind(this);
    this._lastActive = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('mousedown', this._onBackdropClick as EventListener);
    if (this.open) {
      this._openDialog();
    }
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('mousedown', this._onBackdropClick as EventListener);
    this._releaseFocusTrap();
    super.disconnectedCallback();
  }

  get open() {
    return this.hasAttribute('open');
  }
  set open(val: boolean) {
    if (val === this.open) return;
    if (val) {
      this.setAttribute('open', '');
      this._openDialog();
      return;
    }
    this._closeDialog('close');
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      this._closeDialog('cancel');
    } else if (e.key === 'Tab') {
      this._focusTrap(e);
    }
  }

  _onBackdropClick(e: MouseEvent) {
    if (!this.open) return;
    const target = e.target as HTMLElement;
    if (target.classList.contains('backdrop')) {
      this._closeDialog('cancel');
    }
  }

  _openDialog() {
    this._lastActive = document.activeElement as HTMLElement;
    setTimeout(() => {
      const dialog = this.root.querySelector('.dialog') as HTMLElement;
      if (dialog) dialog.focus();
    }, 0);
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
    this._trapFocus();
  }

  _closeDialog(reason = 'close') {
    this.removeAttribute('open');
    this._releaseFocusTrap();
    if (this._lastActive && typeof this._lastActive.focus === 'function') {
      setTimeout(() => this._lastActive?.focus(), 0);
    }
    this.dispatchEvent(new CustomEvent(reason, { bubbles: true }));
  }

  _trapFocus() {
    document.addEventListener('focus', this._focusTrap, true);
  }

  _releaseFocusTrap() {
    document.removeEventListener('focus', this._focusTrap, true);
  }

  _focusTrap(e: any) {
    if (!this.open) return;
    const dialog = this.root.querySelector('.dialog') as HTMLElement;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.type === 'focus') {
      if (!dialog.contains(e.target)) {
        e.stopPropagation();
        first.focus();
      }
    } else if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  protected render() {
    const open = this.open;
    const headless = this.headless;
    this.setContent(open ? `
      <style>${style}</style>
      <div class="backdrop" role="presentation">
        <div class="dialog" role="alertdialog" aria-modal="true" tabindex="0">
          <slot></slot>
        </div>
      </div>
    ` : '');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-alert-dialog')) {
  customElements.define('ui-alert-dialog', UIAlertDialog);
}
