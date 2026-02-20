import { ElementBase } from '../ElementBase';

const style = `
  :host {
    display: block;
    --ui-gap: 12px;
    --ui-grid-columns: 1fr;
  }
  .grid {
    display: grid;
    gap: var(--ui-gap, 12px);
    grid-template-columns: var(--ui-grid-columns, 1fr);
    align-items: center;
    width: 100%;
  }
  :host([headless]) .grid { display: none; }
`;

export class UIGrid extends ElementBase {
  static get observedAttributes() { return ['classname', 'headless']; }

  private _headless = false;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    if ((this as any)._cleanup) (this as any)._cleanup();
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'headless') {
      this._headless = this.hasAttribute('headless');
      this.render();
    }
    if (name === 'classname') {
      this.render();
    }
  }

  protected render() {
    const parseJson = (v: string | null) => {
      if (!v) return null;
      const t = v.trim();
      if (!t.startsWith('{')) return null;
      try { return JSON.parse(t); } catch (e) { return null; }
    };

    // mirror legacy `classname` attribute into classList
    const legacyClassAttr = this.getAttribute('classname');
    const prevLegacy = (this as any).__legacyClassName;
    if (legacyClassAttr && legacyClassAttr !== prevLegacy) {
      if (prevLegacy) prevLegacy.split(/\s+/).forEach((c: string) => { if (c) this.classList.remove(c); });
      legacyClassAttr.split(/\s+/).forEach((c: string) => { if (c) this.classList.add(c); });
      (this as any).__legacyClassName = legacyClassAttr;
    } else if (!legacyClassAttr && prevLegacy) {
      prevLegacy.split(/\s+/).forEach((c: string) => { if (c) this.classList.remove(c); });
      (this as any).__legacyClassName = undefined;
    }

    const tokenOrRaw = (v: string | null): string => {
      if (!v) return '';
      const map: Record<string,string> = { xs: 'var(--ui-space-xs, 4px)', sm: 'var(--ui-space-sm, 8px)', md: 'var(--ui-space-md, 12px)', lg: 'var(--ui-space-lg, 20px)' };
      return (v in map) ? map[v as keyof typeof map] : v;
    };

    const rspKeys = ['columns','gap'];
    const responsiveEntries: Array<{ prop: string; map: any }> = [];
    for (const k of rspKeys) {
      const raw = this.getAttribute(k);
      const parsed = parseJson(raw);
      if (parsed && typeof parsed === 'object') responsiveEntries.push({ prop: k, map: parsed });
    }

    if (responsiveEntries.length) {
      if (!(this as any).__rspUid) {
        (this as any).__rspUid = `ui-grid-rsp-${Math.random().toString(36).slice(2,8)}`;
        this.classList.add((this as any).__rspUid);
      }
      const uid = (this as any).__rspUid as string;
      const lines: string[] = [];

      const baseVars: Record<string,string> = {};
      for (const ent of responsiveEntries) {
        const initial = ent.map.initial;
        if (typeof initial !== 'undefined') {
          if (ent.prop === 'columns') baseVars['--ui-grid-columns'] = initial;
          if (ent.prop === 'gap') baseVars['--ui-gap'] = tokenOrRaw(initial);
        }
      }
      if (Object.keys(baseVars).length) {
        const rule = Object.entries(baseVars).map(([k,v]) => `${k}: ${v};`).join(' ');
        lines.push(`.${uid} { ${rule} }`);
      }

      const bpKeys = ['sm','md','lg','xl'];
      const bpVar: Record<string,string> = { sm: '--ui-breakpoint-sm', md: '--ui-breakpoint-md', lg: '--ui-breakpoint-lg', xl: '--ui-breakpoint-lg' };
      for (const bp of bpKeys) {
        const setVars: string[] = [];
        for (const ent of responsiveEntries) {
          const v = ent.map[bp];
          if (typeof v !== 'undefined') {
            if (ent.prop === 'columns') setVars.push(`--ui-grid-columns: ${v};`);
            if (ent.prop === 'gap') setVars.push(`--ui-gap: ${tokenOrRaw(v)};`);
          }
        }
        if (setVars.length) lines.push(`@media (min-width: var(${bpVar[bp]})) { .${uid} { ${setVars.join(' ')} } }`);
      }

      let styleEl = (this as any).__rspStyleEl as HTMLStyleElement | null | undefined;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.dataset['uid'] = uid;
        document.head.appendChild(styleEl);
        (this as any).__rspStyleEl = styleEl;
        (this as any)._cleanup = () => {
          try { styleEl?.parentElement?.removeChild(styleEl); } catch (e) {}
          (this as any).__rspStyleEl = null;
          try { this.classList.remove(uid); } catch (e) {}
        };
      }
      styleEl.textContent = lines.join('\n');
    } else {
      if ((this as any).__rspStyleEl) {
        try { (this as any).__rspStyleEl.parentElement?.removeChild((this as any).__rspStyleEl); } catch (e) {}
        (this as any).__rspStyleEl = null;
      }
      if ((this as any).__rspUid) {
        try { this.classList.remove((this as any).__rspUid); } catch (e) {}
        (this as any).__rspUid = undefined;
      }
    }

    // single-value attributes -> set CSS variables on host
    const columns = parseJson(this.getAttribute('columns')) ? undefined : (this.getAttribute('columns') || undefined);
    const gap = parseJson(this.getAttribute('gap')) ? undefined : (this.getAttribute('gap') || undefined);
    if (columns) this.style.setProperty('--ui-grid-columns', columns);
    if (gap) this.style.setProperty('--ui-gap', tokenOrRaw(gap));

    if (this._headless) {
      this.setContent('');
      return;
    }
    this.setContent(`<style>${style}</style><div class="grid" role="group" aria-label="Grid layout"><slot></slot></div>`);
    this.dispatchEvent(new CustomEvent('layoutchange', { bubbles: true }));
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-grid')) {
  customElements.define('ui-grid', UIGrid);
}
