import { ElementBase } from '../ElementBase';

const style = `
  :host { display: contents; }
  .presence {
    display: block;
    transition: opacity 0.18s, transform 0.18s;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.98);
  }
  :host([present]) .presence {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1);
  }
  :host([headless]) .presence { display: none; }
`;

export class UIPresence extends ElementBase {
  static get observedAttributes() {
    return ['present', 'headless'];
  }

  private _isPresent = false;
  private _headless = false;
  private _transitioning = false;

  constructor() {
    super();
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._headless = this.hasAttribute('headless');
    this._isPresent = this.hasAttribute('present');
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'present' || name === 'headless') {
      this._headless = this.hasAttribute('headless');
      const wasPresent = this._isPresent;
      this._isPresent = this.hasAttribute('present');
      this.render();
      if (this._isPresent && !wasPresent) {
        this._dispatch('enter');
      } else if (!this._isPresent && wasPresent) {
        this._dispatch('exit');
      }
    }
  }

  protected render() {
    const present = this._isPresent;
    const headless = this._headless;
    this.setContent(`
      <style>${style}</style>
      <div class="presence" tabindex="-1"><slot></slot></div>
    `);
    const el = this.root.querySelector('.presence');
    if (el) {
      el.removeEventListener('transitionend', this._onTransitionEnd as EventListener);
      el.addEventListener('transitionend', this._onTransitionEnd as EventListener);
      if (present && !headless) {
        requestAnimationFrame(() => {
          el.classList.add('present');
        });
      } else {
        el.classList.remove('present');
      }
    }
  }

  private _onTransitionEnd(e: TransitionEvent) {
    if (e.target !== e.currentTarget) return;
    if (this._isPresent) {
      this._dispatch('after-enter');
    } else {
      this._dispatch('after-exit');
    }
  }

  private _dispatch(type: string) {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-presence')) {
  customElements.define('ui-presence', UIPresence);
}