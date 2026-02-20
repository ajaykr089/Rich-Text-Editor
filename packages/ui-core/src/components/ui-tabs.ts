import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-tabs-gap: 8px;
    --ui-tabs-radius: 4px;
    --ui-tabs-bg: transparent;
    --ui-tabs-active-bg: var(--ui-primary, #2563eb);
    --ui-tabs-active-color: var(--ui-foreground, #fff);
  }
  .nav {
    display: flex;
    gap: var(--ui-tabs-gap);
    margin-bottom: 8px;
  }
  .tab {
    padding: 6px 8px;
    cursor: pointer;
    border-radius: var(--ui-tabs-radius);
    background: var(--ui-tabs-bg);
    outline: none;
    border: none;
    color: inherit;
    font: inherit;
    transition: background 0.18s, color 0.18s;
  }
  .tab[aria-selected="true"] {
    background: var(--ui-tabs-active-bg);
    color: var(--ui-tabs-active-color);
  }
  :host([headless]) .nav, :host([headless]) .panels { display: none; }
`;


export class UITabs extends ElementBase {
  static get observedAttributes() { return ['selected', 'headless']; }

  private _headless = false;
  private _onTabClickBound: (e: Event) => void;

  constructor() {
    super();
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onTabClickBound = this._onTabClick.bind(this);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'selected' || name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this.render();
    }
  }

  protected render() {
    if (this._headless) {
      this.setContent('');
      return;
    }
    const selected = Math.max(0, Number(this.getAttribute('selected')) || 0);
    const tabs = Array.from(this.querySelectorAll('[slot="tab"]'));
    const panels = Array.from(this.querySelectorAll('[slot="panel"]'));
    const nav = tabs.map((t, i) => `<button class="tab" role="tab" data-index="${i}" aria-selected="${String(i === selected)}" tabindex="${i === selected ? 0 : -1}">${(t as HTMLElement).innerHTML}</button>`).join('');
    this.setContent(`<style>${style}</style><div class="nav" role="tablist">${nav}</div><div class="panels"></div>`);
    const navEl = this.root.querySelector('.nav') as HTMLElement;
    const panelsEl = this.root.querySelector('.panels') as HTMLElement;
    panelsEl.innerHTML = '';
    panels.forEach((p, i) => {
      const node = (p as HTMLElement).cloneNode(true) as HTMLElement;
      node.style.display = i === selected ? 'block' : 'none';
      node.setAttribute('role', 'tabpanel');
      node.setAttribute('aria-hidden', String(i !== selected));
      panelsEl.appendChild(node);
    });
    navEl.querySelectorAll('.tab').forEach((el) => {
      el.removeEventListener('click', this._onTabClickBound);
      el.addEventListener('click', this._onTabClickBound);
    });
    navEl.removeEventListener('keydown', this._onKeyDown);
    navEl.addEventListener('keydown', this._onKeyDown);
  }

  private _onTabClick(e: Event) {
    const idx = Number((e.currentTarget as HTMLElement).getAttribute('data-index'));
    this.setAttribute('selected', String(idx));
    this.dispatchEvent(new CustomEvent('change', { detail: { selected: idx }, bubbles: true }));
  }

  private _onKeyDown(e: KeyboardEvent) {
    const navEl = this.root.querySelector('.nav');
    if (!navEl) return;
    const tabs = Array.from(navEl.querySelectorAll('.tab')) as HTMLElement[];
    if (tabs.length === 0) return;
    const selected = Math.max(0, Number(this.getAttribute('selected')) || 0);
    let idx = selected;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      idx = (selected + 1) % tabs.length;
      tabs[idx].focus();
      this.setAttribute('selected', String(idx));
      this.dispatchEvent(new CustomEvent('focus', { detail: { selected: idx }, bubbles: true }));
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      idx = (selected - 1 + tabs.length) % tabs.length;
      tabs[idx].focus();
      this.setAttribute('selected', String(idx));
      this.dispatchEvent(new CustomEvent('focus', { detail: { selected: idx }, bubbles: true }));
      e.preventDefault();
    } else if (e.key === 'Home') {
      tabs[0].focus();
      this.setAttribute('selected', '0');
      this.dispatchEvent(new CustomEvent('focus', { detail: { selected: 0 }, bubbles: true }));
      e.preventDefault();
    } else if (e.key === 'End') {
      tabs[tabs.length - 1].focus();
      this.setAttribute('selected', String(tabs.length - 1));
      this.dispatchEvent(new CustomEvent('focus', { detail: { selected: tabs.length - 1 }, bubbles: true }));
      e.preventDefault();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-tabs')) {
  customElements.define('ui-tabs', UITabs);
}
