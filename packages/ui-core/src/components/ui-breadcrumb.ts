import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-breadcrumb-gap: 8px;
    --ui-breadcrumb-radius: 8px;
    --ui-breadcrumb-color: #334155;
    --ui-breadcrumb-muted: #94a3b8;
    --ui-breadcrumb-current: #0f172a;
    --ui-breadcrumb-hover-bg: #f1f5f9;
    --ui-breadcrumb-focus: 0 0 0 2px rgba(37, 99, 235, 0.28);
    --ui-breadcrumb-font-size: 14px;
  }
  nav {
    display: block;
    width: 100%;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ui-breadcrumb-gap);
    font-size: var(--ui-breadcrumb-font-size);
    color: var(--ui-breadcrumb-color);
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-breadcrumb-gap);
    min-height: 28px;
  }
  .crumb-btn,
  .crumb-current,
  .crumb-ellipsis {
    border-radius: var(--ui-breadcrumb-radius);
    padding: 4px 8px;
    line-height: 1.2;
  }
  .crumb-btn {
    border: none;
    background: transparent;
    color: var(--ui-breadcrumb-color);
    cursor: pointer;
    font: inherit;
  }
  .crumb-btn:hover {
    background: var(--ui-breadcrumb-hover-bg);
    color: var(--ui-breadcrumb-current);
  }
  .crumb-btn:focus-visible {
    outline: none;
    box-shadow: var(--ui-breadcrumb-focus);
  }
  .crumb-current {
    color: var(--ui-breadcrumb-current);
    font-weight: 600;
    background: #ffffff;
  }
  .crumb-ellipsis,
  .separator {
    color: var(--ui-breadcrumb-muted);
  }
  :host([headless]) nav {
    display: none;
  }
`;

type DisplayToken =
  | { kind: 'item'; item: HTMLElement; sourceIndex: number }
  | { kind: 'ellipsis' };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIBreadcrumb extends ElementBase {
  static get observedAttributes() {
    return ['separator', 'max-items', 'headless'];
  }

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick as EventListener);
    this.root.addEventListener('keydown', this._onRootKeyDown as EventListener);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick as EventListener);
    this.root.removeEventListener('keydown', this._onRootKeyDown as EventListener);
    super.disconnectedCallback();
  }

  get headless() {
    return this.hasAttribute('headless');
  }

  set headless(value: boolean) {
    if (value === this.headless) return;
    if (value) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  private _getSourceItems() {
    const slotted = Array.from(this.querySelectorAll('[slot="item"]')) as HTMLElement[];
    if (slotted.length > 0) return slotted;
    return Array.from(this.children).filter((node) => node instanceof HTMLElement) as HTMLElement[];
  }

  private _maxItems() {
    const parsed = Number(this.getAttribute('max-items'));
    if (!Number.isFinite(parsed) || parsed < 3) return Number.POSITIVE_INFINITY;
    return parsed;
  }

  private _getDisplayTokens(items: HTMLElement[]): DisplayToken[] {
    const maxItems = this._maxItems();
    if (items.length <= maxItems) {
      return items.map((item, index) => ({ kind: 'item', item, sourceIndex: index }));
    }

    const tailCount = Math.max(1, maxItems - 2);
    const tailStart = items.length - tailCount;
    const tokens: DisplayToken[] = [{ kind: 'item', item: items[0], sourceIndex: 0 }, { kind: 'ellipsis' }];

    for (let index = tailStart; index < items.length; index += 1) {
      tokens.push({ kind: 'item', item: items[index], sourceIndex: index });
    }
    return tokens;
  }

  private _renderLabel(item: HTMLElement): string {
    const explicit = item.getAttribute('data-label');
    if (explicit) return escapeHtml(explicit);
    const html = (item.innerHTML || '').trim();
    if (html) return html;
    return escapeHtml((item.textContent || '').trim());
  }

  private _emitSelect(sourceIndex: number) {
    const items = this._getSourceItems();
    const item = items[sourceIndex];
    if (!item) return;

    const label = (item.getAttribute('data-label') || item.textContent || '').trim();
    const href = item.getAttribute('href') || undefined;
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: { index: sourceIndex, label, href },
        bubbles: true,
      })
    );
  }

  private _onRootClick(event: Event) {
    const target = event.target as HTMLElement;
    const button = target.closest('.crumb-btn') as HTMLElement | null;
    if (!button) return;
    const sourceIndex = Number(button.getAttribute('data-source-index'));
    if (Number.isNaN(sourceIndex)) return;
    this._emitSelect(sourceIndex);
  }

  private _onRootKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const button = target.closest('.crumb-btn') as HTMLElement | null;
    if (!button) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const sourceIndex = Number(button.getAttribute('data-source-index'));
      if (!Number.isNaN(sourceIndex)) this._emitSelect(sourceIndex);
      return;
    }

    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;

    const buttons = Array.from(this.root.querySelectorAll('.crumb-btn')) as HTMLElement[];
    if (buttons.length === 0) return;

    const currentIndex = buttons.indexOf(button);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = buttons.length - 1;

    (buttons[nextIndex] as HTMLElement).focus();
    event.preventDefault();
  }

  protected render() {
    const items = this._getSourceItems();
    const separator = escapeHtml(this.getAttribute('separator') || '/');
    const tokens = this._getDisplayTokens(items);

    const listItems = tokens
      .map((token, tokenIndex) => {
        const isLastToken = tokenIndex === tokens.length - 1;

        let content = '';
        if (token.kind === 'ellipsis') {
          content = '<span class="crumb-ellipsis" aria-hidden="true">…</span>';
        } else {
          const isCurrent = token.sourceIndex === items.length - 1;
          const label = this._renderLabel(token.item);
          if (isCurrent || isLastToken) {
            content = `<span class="crumb-current" aria-current="page">${label}</span>`;
          } else {
            content = `<button type="button" class="crumb-btn" data-source-index="${token.sourceIndex}">${label}</button>`;
          }
        }

        const sep = !isLastToken ? `<span class="separator" aria-hidden="true">${separator}</span>` : '';
        return `<li>${content}${sep}</li>`;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <nav role="navigation" aria-label="Breadcrumb">
        <ol>
          ${listItems}
        </ol>
      </nav>
      <slot name="item" hidden></slot>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-breadcrumb')) {
  customElements.define('ui-breadcrumb', UIBreadcrumb);
}
