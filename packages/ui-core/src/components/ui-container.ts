import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    box-sizing: border-box;
    --ui-container-padding: var(--ui-space-sm, 8px);
    --ui-container-max-sm: 640px;
    --ui-container-max-md: 960px;
    --ui-container-max-lg: 1280px;
    --ui-container-max-xl: 1440px;
  }
  .container {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    padding-left: var(--ui-container-padding);
    padding-right: var(--ui-container-padding);
  }
  .container.sm { max-width: var(--ui-container-max-sm); }
  .container.md { max-width: var(--ui-container-max-md); }
  .container.lg { max-width: var(--ui-container-max-lg); }
  .container.xl { max-width: var(--ui-container-max-xl); }
  :host([headless]) .container { display: none; }
`;


export class UIContainer extends ElementBase {
  static get observedAttributes() { return ['size', 'headless']; }

  private _headless = false;
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this._headless = this.hasAttribute('headless');
    this._observeResize();
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this.render();
    }
    if (name === 'size') {
      this.render();
    }
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    const validSizes = ['sm', 'md', 'lg', 'xl'];
    let size = (this.getAttribute('size') || 'md');
    if (!validSizes.includes(size)) size = 'md';
    const cls = `container ${size}`;
    this.setContent(`<style>${style}</style><div class="${cls}" role="group" aria-label="Container"><slot></slot></div>`);
    this._observeResize();
  }

  private _observeResize() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    const el = this.root?.querySelector('.container');
    if (!el) return;
    this._resizeObserver = new ResizeObserver(() => {
      this.dispatchEvent(new CustomEvent('resize', { bubbles: true }));
    });
    this._resizeObserver.observe(el);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-container')) {
  customElements.define('ui-container', UIContainer);
}
