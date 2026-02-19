import { ElementBase } from '../ElementBase';

const style = `
  :host { display: block; }
  .flex {
    display: flex;
    gap: var(--ui-gap, 12px);
    justify-content: var(--ui-justify, flex-start);
    align-items: var(--ui-align, center);
    flex-direction: var(--ui-flex-direction, row);
    flex-wrap: var(--ui-flex-wrap, nowrap);
  }
`;

export class UIFlex extends ElementBase {
  // accept legacy `classname` attribute so host HTML using `classname` still works
  static get observedAttributes() { return ['classname']; }

  constructor() { super(); }

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

    // responsive keys supported for ui-flex
    const rspKeys = ['direction','align','justify','wrap','gap'];
    const responsiveEntries: Array<{ prop: string; map: any }> = [];
    for (const k of rspKeys) {
      const raw = this.getAttribute(k);
      const parsed = parseJson(raw);
      if (parsed && typeof parsed === 'object') responsiveEntries.push({ prop: k, map: parsed });
    }

    if (responsiveEntries.length) {
      if (!(this as any).__rspUid) {
        (this as any).__rspUid = `ui-flex-rsp-${Math.random().toString(36).slice(2,8)}`;
        this.classList.add((this as any).__rspUid);
      }
      const uid = (this as any).__rspUid as string;
      const lines: string[] = [];

      // base initial rules -> set CSS variables on host
      const baseVars: Record<string,string> = {};
      for (const ent of responsiveEntries) {
        const initial = ent.map.initial;
        if (typeof initial !== 'undefined') {
          switch (ent.prop) {
            case 'gap': baseVars['--ui-gap'] = tokenOrRaw(initial); break;
            case 'direction': baseVars['--ui-flex-direction'] = initial; break;
            case 'align': baseVars['--ui-align'] = initial; break;
            case 'justify': baseVars['--ui-justify'] = initial; break;
            case 'wrap': baseVars['--ui-flex-wrap'] = initial; break;
          }
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
            switch (ent.prop) {
              case 'gap': setVars.push(`--ui-gap: ${tokenOrRaw(v)};`); break;
              case 'direction': setVars.push(`--ui-flex-direction: ${v};`); break;
              case 'align': setVars.push(`--ui-align: ${v};`); break;
              case 'justify': setVars.push(`--ui-justify: ${v};`); break;
              case 'wrap': setVars.push(`--ui-flex-wrap: ${v};`); break;
            }
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
      // remove any existing responsive artifacts
      if ((this as any).__rspStyleEl) {
        try { (this as any).__rspStyleEl.parentElement?.removeChild((this as any).__rspStyleEl); } catch (e) {}
        (this as any).__rspStyleEl = null;
      }
      if ((this as any).__rspUid) {
        try { this.classList.remove((this as any).__rspUid); } catch (e) {}
        (this as any).__rspUid = undefined;
      }
    }

    // single-value attributes -> set CSS variables on host so shadow CSS picks them up
    const dir = parseJson(this.getAttribute('direction')) ? undefined : (this.getAttribute('direction') || undefined);
    const gap = parseJson(this.getAttribute('gap')) ? undefined : (this.getAttribute('gap') || undefined);
    const align = parseJson(this.getAttribute('align')) ? undefined : (this.getAttribute('align') || undefined);
    const justify = parseJson(this.getAttribute('justify')) ? undefined : (this.getAttribute('justify') || undefined);
    const wrap = parseJson(this.getAttribute('wrap')) ? undefined : (this.getAttribute('wrap') || undefined);

    if (dir) this.style.setProperty('--ui-flex-direction', dir);
    if (gap) this.style.setProperty('--ui-gap', tokenOrRaw(gap));
    if (align) this.style.setProperty('--ui-align', align);
    if (justify) this.style.setProperty('--ui-justify', justify);
    if (wrap) this.style.setProperty('--ui-flex-wrap', wrap);

    this.setContent(`<style>${style}</style><div class="flex"><slot></slot></div>`);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-flex')) {
  customElements.define('ui-flex', UIFlex);
}
