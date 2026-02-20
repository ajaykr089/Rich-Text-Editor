import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-separator-color: #e5e7eb;
    --ui-separator-thickness: 1px;
    --ui-separator-margin: 8px 0;
  }
  hr, .vertical {
    border: none;
    background: var(--ui-separator-color);
    margin: var(--ui-separator-margin);
  }
  hr {
    height: 0;
    border-top: var(--ui-separator-thickness) solid var(--ui-separator-color);
    width: 100%;
  }
  .vertical {
    width: 0;
    height: 100%;
    border-left: var(--ui-separator-thickness) solid var(--ui-separator-color);
    min-height: 24px;
    margin: 0 8px;
    display: inline-block;
  }
  :host([headless]) hr, :host([headless]) .vertical { display: none; }
`;


export class UISeparator extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'headless'];
  }

  private _orientation: 'horizontal' | 'vertical' = 'horizontal';
  private _headless = false;

  constructor() {
    super();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'orientation' || name === 'headless') {
      this._orientation = (this.getAttribute('orientation') === 'vertical') ? 'vertical' : 'horizontal';
      this._headless = this.hasAttribute('headless');
      this.render();
    }
  }

  protected render() {
    const isVertical = this._orientation === 'vertical';
    this.setContent(`
      <style>${style}</style>
      ${isVertical
        ? '<div class="vertical" role="separator" aria-orientation="vertical"></div>'
        : '<hr role="separator" aria-orientation="horizontal" />'}
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-separator')) {
  customElements.define('ui-separator', UISeparator);
}