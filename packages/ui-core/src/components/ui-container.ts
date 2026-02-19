import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; box-sizing: border-box; }
  .container { margin-left: auto; margin-right: auto; width: 100%; padding-left: var(--ui-space-sm, 8px); padding-right: var(--ui-space-sm, 8px); }
  .container.sm { max-width: 640px; }
  .container.md { max-width: 960px; }
  .container.lg { max-width: 1280px; }
  .container.xl { max-width: 1440px; }
`;

export class UIContainer extends ElementBase {
  static get observedAttributes() { return ['size']; }
  constructor() { super(); }
  protected render() {
    const size = (this.getAttribute('size') || 'md');
    const cls = `container ${size}`;
    this.setContent(`<style>${style}</style><div class="${cls}"><slot></slot></div>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-container')) {
  customElements.define('ui-container', UIContainer);
}
