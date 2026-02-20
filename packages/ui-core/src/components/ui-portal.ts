import { ElementBase } from '../ElementBase';

/**
 * <ui-portal target="#modal-root"></ui-portal>
 * Moves its children to document.body or a custom target node.
 * Supports headless mode and robust event dispatch.
 */
export class UIPortal extends ElementBase {
  static get observedAttributes() {
    return ['target', 'headless'];
  }

  private _portalTarget: HTMLElement | null = null;
  private _portalNodes: Node[] = [];
  private _headless = false;
  private _slotEl: HTMLSlotElement | null = null;

  constructor() {
    super();
    this._handleSlotChange = this._handleSlotChange.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._headless = this.hasAttribute('headless');
    if (!this._headless) {
      this._mountPortal();
    }
  }

  disconnectedCallback() {
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._handleSlotChange);
      this._slotEl = null;
    }
    this._unmountPortal();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'target' || name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this._unmountPortal();
      if (!this._headless) {
        this._mountPortal();
      }
    }
  }

  protected render() {
    // Render a slot for fallback if not portaling
    this.setContent('<slot></slot>');
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._handleSlotChange);
      this._slotEl = null;
    }
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (!slot) return;
    this._slotEl = slot;
    this._slotEl.addEventListener('slotchange', this._handleSlotChange);
  }

  private _getTarget(): HTMLElement {
    const selector = this.getAttribute('target');
    if (selector) {
      const el = document.querySelector(selector);
      if (el instanceof HTMLElement) return el;
    }
    return document.body;
  }

  private _mountPortal() {
    this._portalTarget = this._getTarget();
    const slot = this._slotEl || (this.root.querySelector('slot') as HTMLSlotElement | null);
    if (!slot) return;
    this._portalNodes = slot.assignedNodes({ flatten: true }).filter(n => n.nodeType === 1 || n.nodeType === 3);
    this._portalNodes.forEach(node => {
      this._portalTarget!.appendChild(node);
    });
    this.dispatchEvent(new CustomEvent('mount', { bubbles: true }));
  }

  private _unmountPortal() {
    if (this._portalNodes.length) {
      this._portalNodes.forEach(node => {
        try {
          this.appendChild(node);
        } catch {}
      });
      this._portalNodes = [];
      this.dispatchEvent(new CustomEvent('unmount', { bubbles: true }));
    }
    this._portalTarget = null;
  }

  private _handleSlotChange() {
    if (!this._headless) {
      this._unmountPortal();
      this._mountPortal();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-portal')) {
  customElements.define('ui-portal', UIPortal);
}
