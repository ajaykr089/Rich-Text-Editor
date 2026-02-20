import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-flex;
    --ui-block-controls-gap: 8px;
    --ui-block-controls-padding: 8px;
    --ui-block-controls-radius: 12px;
    --ui-block-controls-bg: rgba(248, 250, 252, 0.92);
    --ui-block-controls-border: 1px solid rgba(15, 23, 42, 0.1);
    --ui-block-controls-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  }

  .controls {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-block-controls-gap);
    padding: var(--ui-block-controls-padding);
    border-radius: var(--ui-block-controls-radius);
    border: var(--ui-block-controls-border);
    background: var(--ui-block-controls-bg);
    box-shadow: var(--ui-block-controls-shadow);
    backdrop-filter: saturate(1.1) blur(10px);
  }

  :host([orientation="vertical"]) .controls {
    flex-direction: column;
    align-items: stretch;
  }

  :host([headless]) .controls {
    display: none;
  }
`;

export class UIBlockControls extends ElementBase {
  static get observedAttributes() {
    return ['orientation', 'headless'];
  }

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    super.disconnectedCallback();
  }

  private _orientation(): 'horizontal' | 'vertical' {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  protected render() {
    const orientation = this._orientation();
    this.setContent(`
      <style>${style}</style>
      <div class="controls" role="toolbar" aria-orientation="${orientation}">
        <slot></slot>
      </div>
    `);
  }

  private _focusables(): HTMLElement[] {
    const slot = this.root.querySelector('slot');
    if (!slot) return [];
    const nodes = (slot as HTMLSlotElement).assignedElements({ flatten: true }) as HTMLElement[];
    return nodes.filter((node) => !node.hasAttribute('disabled'));
  }

  private _onKeyDown(event: KeyboardEvent) {
    const items = this._focusables();
    if (items.length < 2) return;

    const path = event.composedPath();
    const currentIndex = items.findIndex((item) => path.includes(item));
    if (currentIndex < 0) return;

    const orientation = this._orientation();
    let nextIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else {
      if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
      if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      try {
        items[nextIndex].focus();
      } catch {}
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-block-controls')) {
  customElements.define('ui-block-controls', UIBlockControls);
}
