import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: flex;
    gap: 4px;
    align-items: center;
    --ui-pagination-radius: 4px;
    --ui-pagination-bg: #fff;
    --ui-pagination-active-bg: #2563eb;
    --ui-pagination-active-color: #fff;
    --ui-pagination-border: #e5e7eb;
    --ui-pagination-color: #111;
    --ui-pagination-padding: 4px 10px;
    --ui-pagination-font-size: 14px;
  }
  .pagination {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  button {
    padding: var(--ui-pagination-padding);
    border-radius: var(--ui-pagination-radius);
    border: 1px solid var(--ui-pagination-border);
    background: var(--ui-pagination-bg);
    color: var(--ui-pagination-color);
    font-size: var(--ui-pagination-font-size);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    min-width: 32px;
  }
  button[aria-current="true"] {
    background: var(--ui-pagination-active-bg);
    color: var(--ui-pagination-active-color);
    border-color: var(--ui-pagination-active-bg);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :host([headless]) .pagination { display: none; }
`;


export class UIPagination extends ElementBase {
  static get observedAttributes() {
    return ['page', 'count', 'headless'];
  }

  private _page = 1;
  private _count = 1;
  private _headless = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'page' || name === 'count' || name === 'headless') {
      this._page = Math.max(1, Number(this.getAttribute('page')) || 1);
      this._count = Math.max(1, Number(this.getAttribute('count')) || 1);
      this._headless = this.hasAttribute('headless');
      if (this._page > this._count) this._page = this._count;
      this.render();
    }
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    let buttons = '';
    // First/Prev
    buttons += `<button type="button" data-page="1" aria-label="First" ${this._page === 1 ? 'disabled' : ''}>&laquo;</button>`;
    buttons += `<button type="button" data-page="${this._page - 1}" aria-label="Previous" ${this._page === 1 ? 'disabled' : ''}>&lsaquo;</button>`;
    // Page numbers (show up to 5, with ellipsis)
    const range = this._getPageRange(this._page, this._count);
    if (range[0] > 1) {
      buttons += `<button type="button" data-page="1">1</button>`;
      if (range[0] > 2) buttons += `<span aria-hidden="true">…</span>`;
    }
    for (let i = range[0]; i <= range[1]; i++) {
      buttons += `<button type="button" data-page="${i}" aria-current="${i === this._page}">${i}</button>`;
    }
    if (range[1] < this._count) {
      if (range[1] < this._count - 1) buttons += `<span aria-hidden="true">…</span>`;
      buttons += `<button type="button" data-page="${this._count}">${this._count}</button>`;
    }
    // Next/Last
    buttons += `<button type="button" data-page="${this._page + 1}" aria-label="Next" ${this._page === this._count ? 'disabled' : ''}>&rsaquo;</button>`;
    buttons += `<button type="button" data-page="${this._count}" aria-label="Last" ${this._page === this._count ? 'disabled' : ''}>&raquo;</button>`;
    this.setContent(`
      <style>${style}</style>
      <nav class="pagination" role="navigation" aria-label="Pagination" tabindex="0">
        ${buttons}
      </nav>
    `);
    const nav = this.root.querySelector('.pagination');
    if (nav) {
      nav.removeEventListener('click', this._onClick as EventListener);
      nav.addEventListener('click', this._onClick as EventListener);
      nav.removeEventListener('keydown', this._onKeyDown as EventListener);
      nav.addEventListener('keydown', this._onKeyDown as EventListener);
    }
  }

  private _getPageRange(page: number, count: number): [number, number] {
    if (count <= 5) return [1, count];
    if (page <= 3) return [1, 5];
    if (page >= count - 2) return [count - 4, count];
    return [page - 2, page + 2];
  }

  private _onClick(e: Event) {
    const btn = (e.target as HTMLElement).closest('button[data-page]');
    if (!btn || btn.hasAttribute('disabled')) return;
    const page = Number(btn.getAttribute('data-page'));
    if (isNaN(page) || page < 1 || page > this._count || page === this._page) return;
    const type =
      page === 1 && this._page !== 1 ? 'first'
      : page === this._count && this._page !== this._count ? 'last'
      : page === this._page - 1 ? 'prev'
      : page === this._page + 1 ? 'next'
      : 'change';
    this.setAttribute('page', String(page));
    this.dispatchEvent(new CustomEvent(type, { detail: { page }, bubbles: true }));
    this.dispatchEvent(new CustomEvent('change', { detail: { page }, bubbles: true }));
  }

  private _onKeyDown(e: KeyboardEvent) {
    const nav = this.root.querySelector('.pagination');
    if (!nav) return;
    const buttons = Array.from(nav.querySelectorAll('button:not(:disabled)'));
    const active = document.activeElement;
    let idx = buttons.indexOf(active as HTMLButtonElement);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      idx = (idx + 1) % buttons.length;
      (buttons[idx] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      idx = (idx - 1 + buttons.length) % buttons.length;
      (buttons[idx] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'Home') {
      (buttons[0] as HTMLElement).focus();
      e.preventDefault();
    } else if (e.key === 'End') {
      (buttons[buttons.length - 1] as HTMLElement).focus();
      e.preventDefault();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-pagination')) {
  customElements.define('ui-pagination', UIPagination);
}