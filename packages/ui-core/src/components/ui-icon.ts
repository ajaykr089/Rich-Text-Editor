import { getIcon } from '../icons';

const style = `
  :host {
    display: inline-block;
    line-height: 0;
    color: var(--ui-icon-color, currentColor);
    width: var(--ui-icon-size, 1em);
    height: var(--ui-icon-size, 1em);
    vertical-align: middle;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
    fill: currentColor;
  }
  :host([headless]) svg { display: none; }
`;

export class UIIcon extends HTMLElement {
  static get observedAttributes() { return ['name', 'size', 'color', 'headless']; }

  private _headless = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback(name?: string) {
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
    }
    this.render();
  }

  connectedCallback() {
    this._headless = this.hasAttribute('headless');
    this.render();
  }

  render() {
    if (this._headless) {
      this.shadowRoot!.innerHTML = '';
      return;
    }
    const name = this.getAttribute('name') || '';
    const size = this.getAttribute('size') || '1em';
    const color = this.getAttribute('color') || '';
    let svg = getIcon(name);
    if (!svg) {
      svg = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="#e5e7eb"/></svg>';
    }
    this.style.setProperty('--ui-icon-size', size);
    if (color) this.style.setProperty('--ui-icon-color', color);
    else this.style.removeProperty('--ui-icon-color');
    this.shadowRoot!.innerHTML = `<style>${style}</style><span role="img" aria-label="${name}">${svg}</span>`;
    this.dispatchEvent(new CustomEvent('iconchange', { detail: { name }, bubbles: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-icon')) {
  customElements.define('ui-icon', UIIcon);
}
