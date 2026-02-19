import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; }
  .section { width: 100%; box-sizing: border-box; }
  .section.small { padding: var(--ui-space-sm, 8px) 0; }
  .section.medium { padding: var(--ui-space-md, 12px) 0; }
  .section.large { padding: var(--ui-space-lg, 20px) 0; }
`;

export class UISection extends ElementBase {
  static get observedAttributes() { return ['size']; }
  constructor() { super(); }
  protected render() {
    const size = (this.getAttribute('size') || 'medium');
    const cls = `section ${size}`;
    if (!this.shadowRoot) return;
    this.setContent(`<style>${style}</style><div class="${cls}"><slot></slot></div>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-section')) {
  customElements.define('ui-section', UISection);
}
