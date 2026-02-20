import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    position: relative;
    width: 100%;
    --ui-aspect-bg: transparent;
    --ui-aspect-radius: 0;
  }
  .wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    position: relative;
    background: var(--ui-aspect-bg);
    border-radius: var(--ui-aspect-radius);
    overflow: hidden;
    transition: padding-bottom 0.18s;
  }
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :host([headless]) .wrapper, :host([headless]) .content { display: none; }
`;


export class UIAspectRatio extends ElementBase {
  private _resizeObserver: ResizeObserver | null = null;
  static get observedAttributes() {
    return ['ratio', 'headless'];
  }

  constructor() {
    super();
    this._onResize = this._onResize.bind(this);
    this._resizeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this._observeResize();
  }

  disconnectedCallback() {
    this._unobserveResize();
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

  _observeResize() {
    if (this._resizeObserver) return;
    if (window.ResizeObserver) {
      this._resizeObserver = new ResizeObserver(this._onResize);
      this._resizeObserver.observe(this);
    }
  }

  _unobserveResize() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  _onResize() {
    this.dispatchEvent(new CustomEvent('resize', { bubbles: true }));
  }

  protected render() {
    const ratio = this.getAttribute('ratio') || '16/9';
    let w = 16, h = 9, padding = 56.25;
    if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(ratio)) {
      [w, h] = ratio.split('/').map(Number);
      padding = h && w ? (h / w) * 100 : 56.25;
    }
    const headless = this.headless;
    this.setContent(`
      <style>${style}</style>
      <div class="wrapper" style="padding-bottom:${padding}%" aria-hidden="${headless ? 'true' : 'false'}">
        <div class="content"><slot></slot></div>
      </div>
    `);
    this.dispatchEvent(new CustomEvent('change', { detail: { ratio, width: w, height: h, padding }, bubbles: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-aspect-ratio')) {
  customElements.define('ui-aspect-ratio', UIAspectRatio);
}
