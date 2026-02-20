import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    max-height: 240px;
    overflow: hidden;
    --ui-scroll-radius: 8px;
    --ui-scroll-thumb: #cbd5e1;
    --ui-scroll-thumb-hover: #94a3b8;
    --ui-scroll-track: #f1f5f9;
    --ui-scroll-width: 8px;
  }
  .scroll-area {
    width: 100%;
    height: 100%;
    max-height: inherit;
    overflow: auto;
    border-radius: var(--ui-scroll-radius);
    scrollbar-width: thin;
    scrollbar-color: var(--ui-scroll-thumb) var(--ui-scroll-track);
  }
  .scroll-area::-webkit-scrollbar {
    width: var(--ui-scroll-width);
    background: var(--ui-scroll-track);
    border-radius: var(--ui-scroll-radius);
  }
  .scroll-area::-webkit-scrollbar-thumb {
    background: var(--ui-scroll-thumb);
    border-radius: var(--ui-scroll-radius);
  }
  .scroll-area:hover::-webkit-scrollbar-thumb {
    background: var(--ui-scroll-thumb-hover);
  }
  .scroll-content { min-width: 100%; }
  :host([headless]) .scroll-area { display: none; }
`;


export class UIScrollArea extends ElementBase {
  static get observedAttributes() {
    return ['headless'];
  }

  private _headless = false;
  private _scrollArea: HTMLElement | null = null;

  constructor() {
    super();
    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._headless = this.hasAttribute('headless');
    this.render();
    this._attachEvents();
  }

  disconnectedCallback() {
    this._detachEvents();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this.render();
      this._attachEvents();
    }
  }

  protected render() {
    this.setContent(`
      <style>${style}</style>
      <div class="scroll-area" role="region" tabindex="0" aria-label="Scrollable area">
        <div class="scroll-content"><slot></slot></div>
      </div>
    `);
  }

  private _attachEvents() {
    this._scrollArea = this.root.querySelector('.scroll-area');
    if (this._scrollArea) {
      this._scrollArea.removeEventListener('scroll', this._onScroll);
      this._scrollArea.addEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      window.addEventListener('resize', this._onResize);
    }
  }

  private _detachEvents() {
    if (this._scrollArea) {
      this._scrollArea.removeEventListener('scroll', this._onScroll);
    }
    window.removeEventListener('resize', this._onResize);
  }

  private _onScroll(e: Event) {
    const el = e.currentTarget as HTMLElement;
    this.dispatchEvent(new CustomEvent('scroll', { detail: { scrollTop: el.scrollTop, scrollLeft: el.scrollLeft }, bubbles: true }));
    if (el.scrollTop === 0) {
      this.dispatchEvent(new CustomEvent('reach-start', { bubbles: true }));
    }
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 1) {
      this.dispatchEvent(new CustomEvent('reach-end', { bubbles: true }));
    }
  }

  private _onResize() {
    // Defensive: re-dispatch scroll events on resize for consumers
    if (this._scrollArea) {
      this._onScroll({ currentTarget: this._scrollArea } as any);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-scroll-area')) {
  customElements.define('ui-scroll-area', UIScrollArea);
}
