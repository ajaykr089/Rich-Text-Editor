import { ElementBase } from '@editora/ui-core';
import { showPortalFor } from '@editora/ui-core';

export class UIContextMenu extends ElementBase {
  static get observedAttributes() { return ['anchor-id','open']; }
  private _portalEl: HTMLElement | null = null;
  private _cleanup: (() => void) | undefined = undefined;

  constructor() { super(); }

  openFor(anchorId: string) { this.setAttribute('anchor-id', anchorId); this.setAttribute('open',''); }
  close() { this.removeAttribute('open'); }

  // open the context menu at arbitrary client coordinates (uses a virtual anchor)
  openAt(x: number, y: number) {
    // create a very small virtual rect centered at the provided point
    const virtual: any = {
      getBoundingClientRect: () => ({ top: y, bottom: y, left: x, right: x, width: 0, height: 0 })
    };
    this.setAttribute('open','');
    if (!this._portalEl) this._portalEl = document.createElement('div');
    this._portalEl.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'context-menu';
    const sl = this.querySelector('[slot="content"]');
    if (sl) panel.appendChild(sl.cloneNode(true));
    this._portalEl.appendChild(panel);
    this._cleanup = showPortalFor(virtual, this._portalEl, { placement: 'bottom', shift: true });
  }

  protected render() {
    const anchorId = this.getAttribute('anchor-id');
    const open = this.hasAttribute('open');
    this.setContent(`<slot></slot>`);
    if (open && anchorId) {
      const anchor = document.getElementById(anchorId);
      // anchor missing -> ensure any previous portal is cleaned up and bail out
      if (!anchor) {
        if (this._cleanup) { try { this._cleanup(); } catch (e) {} this._cleanup = undefined; }
        this._portalEl = null;
        return;
      }

      if (!this._portalEl) this._portalEl = document.createElement('div');
      this._portalEl.innerHTML = '';
      const panel = document.createElement('div');
      panel.className = 'context-menu';
      const sl = this.querySelector('[slot="content"]');
      if (sl) panel.appendChild(sl.cloneNode(true));
      this._portalEl.appendChild(panel);
      this._cleanup = showPortalFor(anchor as HTMLElement, this._portalEl, 'bottom');
    } else {
      if (this._cleanup) { this._cleanup(); this._cleanup = undefined; }
      this._portalEl = null;
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-context-menu')) {
  customElements.define('ui-context-menu', UIContextMenu);
}
