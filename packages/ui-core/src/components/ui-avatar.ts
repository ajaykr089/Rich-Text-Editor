import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: inline-block;
    --ui-avatar-size: 32px;
    --ui-avatar-bg: #e5e7eb;
    --ui-avatar-color: #2563eb;
    --ui-avatar-border: none;
    --ui-avatar-radius: 50%;
    --ui-avatar-font: 16px;
    --ui-avatar-font-weight: 400;
    
  }
  .avatar {
    width: var(--ui-avatar-size);
    height: var(--ui-avatar-size);
    border-radius: var(--ui-avatar-radius);
    background: var(--ui-avatar-bg);
    color: var(--ui-avatar-color);
    border: var(--ui-avatar-border);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: var(--ui-avatar-font);
    font-weight: var(--ui-avatar-font-weight);
    position: relative;
    user-select: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--ui-avatar-radius);
    display: block;
  }
  .fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--ui-avatar-font);
    color: var(--ui-avatar-color);
    background: var(--ui-avatar-bg);
    font-weight: var(--ui-avatar-font-weight);
    position: absolute;
    top: 0; left: 0;
    pointer-events: none;
  }
  :host([headless]) .avatar { display: none; }
`;


export class UIAvatar extends ElementBase {
  private _imgFailed: boolean = false;
  private _imgEl: HTMLImageElement | null = null;
  static get observedAttributes() {
    return ['src', 'alt', 'headless', 'size', 'bg', 'color', 'radius', 'fontweight'];
  }

  constructor() {
    super();
    this._onImgError = this._onImgError.bind(this);
    this._onImgLoad = this._onImgLoad.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'img');
    this.setAttribute('tabindex', '0');
  }

  disconnectedCallback() {
    this._detachImgListeners();
    super.disconnectedCallback();
  }

  get headless() {
    return this.hasAttribute('headless');
  }
  set headless(val: boolean) {
    if (val === this.headless) return;
    if (val) this.setAttribute('headless', '');
    else this.removeAttribute('headless');
  }

  _onImgError(e: any) {
    this._imgFailed = true;
    this.render();
    this.dispatchEvent(new CustomEvent('error', { detail: { src: this.getAttribute('src') }, bubbles: true }));
  }

  _onImgLoad(e: any) {
    this._imgFailed = false;
    this.dispatchEvent(new CustomEvent('load', { detail: { src: this.getAttribute('src') }, bubbles: true }));
  }

  private _detachImgListeners() {
    if (!this._imgEl) return;
    this._imgEl.removeEventListener('error', this._onImgError as EventListener);
    this._imgEl.removeEventListener('load', this._onImgLoad as EventListener);
    this._imgEl = null;
  }

  protected render() {
    const src = this.getAttribute('src');
    const alt = this.getAttribute('alt') || '';
    const headless = this.headless;
    // Shorthands
    const size = this.getAttribute('size');
    const bg = this.getAttribute('bg');
    const color = this.getAttribute('color');
    const radius = this.getAttribute('radius');
    const fontWeight = this.getAttribute('fontweight');
    let styleVars = '';
    if (size) styleVars += `--ui-avatar-size:${size}px;`;
    if (bg) styleVars += `--ui-avatar-bg:${bg};`;
    if (color) styleVars += `--ui-avatar-color:${color};`;
    if (radius) styleVars += `--ui-avatar-radius:${radius};`;
    if (fontWeight) styleVars += `--ui-avatar-font-weight:${fontWeight};`;

    // Extract font-size and font-weight from host's style attribute, if present
    let extraStyle = '';
    if (this.hasAttribute('style')) {
      const styleAttr = this.getAttribute('style') || '';
      // Only extract font-size and font-weight from style attribute
      const fontSizeMatch = styleAttr.match(/font-size\s*:\s*([^;]+);?/i);
      const fontWeightMatch = styleAttr.match(/font-weight\s*:\s*([^;]+);?/i);
      if (fontSizeMatch) extraStyle += `font-size:${fontSizeMatch[1]};`;
      if (fontWeightMatch) extraStyle += `font-weight:${fontWeightMatch[1]};`;
    }

    let fallback = '';
    if (!src || this._imgFailed) {
      fallback = `<span class="fallback"><slot>${alt ? alt[0] : '?'}</slot></span>`;
    }
    this._detachImgListeners();
    this.setContent(`
      <style>${style}</style>
      <div class="avatar" aria-label="${alt || 'avatar'}" tabindex="0" style="${styleVars}${extraStyle}">
        ${src && !this._imgFailed ? `<img src="${src}" alt="${alt}" />` : ''}
        ${fallback}
      </div>
    `);
    this._imgEl = this.root.querySelector('img');
    if (this._imgEl) {
      this._imgEl.addEventListener('error', this._onImgError as EventListener);
      this._imgEl.addEventListener('load', this._onImgLoad as EventListener);
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-avatar')) {
  customElements.define('ui-avatar', UIAvatar);
}
