import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-app-header-height: 60px;
    --ui-app-header-height-dense: 48px;
    --ui-app-header-bg: #ffffff;
    --ui-app-header-color: #0f172a;
    --ui-app-header-border: #e2e8f0;
    --ui-app-header-gap: 10px;
    --ui-app-header-padding-x: 14px;
    --ui-app-header-z: 60;
    --ui-app-header-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
  }
  header {
    min-height: var(--ui-app-header-height);
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--ui-app-header-gap);
    background: var(--ui-app-header-bg);
    color: var(--ui-app-header-color);
    border-bottom: 1px solid transparent;
    padding: 0 var(--ui-app-header-padding-x);
    box-sizing: border-box;
  }
  :host([dense]) header {
    min-height: var(--ui-app-header-height-dense);
  }
  :host([bordered]) header {
    border-bottom-color: var(--ui-app-header-border);
  }
  :host([sticky]) {
    position: sticky;
    top: 0;
    z-index: var(--ui-app-header-z);
    box-shadow: var(--ui-app-header-shadow);
  }
  .start,
  .center,
  .end {
    min-width: 0;
    display: inline-flex;
    align-items: center;
    gap: var(--ui-app-header-gap);
  }
  .center {
    justify-content: flex-start;
    overflow: hidden;
  }
  .title-slot {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
  .end {
    justify-content: flex-end;
  }
  .menu-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--ui-app-header-border);
    background: #ffffff;
    color: var(--ui-app-header-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
  }
  .menu-btn:hover {
    background: #f8fafc;
  }
  .menu-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.28);
  }
  .menu-btn[hidden] {
    display: none;
  }
  :host([headless]) header {
    display: none;
  }
`;

export class UIAppHeader extends ElementBase {
  static get observedAttributes() {
    return ['sticky', 'bordered', 'dense', 'headless', 'show-menu-button'];
  }

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    super.disconnectedCallback();
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    const menuBtn = target.closest('.menu-btn');
    if (!menuBtn) return;

    this.dispatchEvent(
      new CustomEvent('menu-trigger', {
        bubbles: true,
      })
    );
  }

  protected render() {
    const showMenuButton = this.hasAttribute('show-menu-button');

    this.setContent(`
      <style>${style}</style>
      <header role="banner">
        <div class="start">
          <button
            type="button"
            class="menu-btn"
            aria-label="Open navigation"
            ${showMenuButton ? '' : 'hidden'}
          >☰</button>
          <slot name="start"></slot>
        </div>

        <div class="center">
          <slot name="center"></slot>
          <span class="title-slot"><slot name="title"></slot></span>
        </div>

        <div class="end">
          <slot name="end"></slot>
        </div>
      </header>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-app-header')) {
  customElements.define('ui-app-header', UIAppHeader);
}
