import { ElementBase } from '../ElementBase';

/**
 * UIBox — rewritten from scratch per request.
 * - single-value attributes (p, m, width, etc.) set inline styles
 * - responsive JSON attributes (initial, sm, md, lg, xl) inject scoped stylesheet
 * - mirrors legacy `classname` attribute into element.classList
 */
export class UIBox extends ElementBase {
  static get observedAttributes() {
    return [
      'classname',
      'p','px','py','pt','pr','pb','pl',
      'm','mx','my','mt','mr','mb','ml',
      'width','w','minwidth','minw','maxwidth','maxw','height','h','minheight','minh','maxheight','maxh',
      'background','bg','color',
      'display','position','inset','top','right','bottom','left','align',
      'flexbasis','flexgrow','flexshrink',
      'gridarea','gridcolumn','gridcolumnstart','gridcolumnend','gridrow','gridrowstart','gridrowend'
    ];
  }

  constructor() {
    super();
  }

  // parse JSON-like responsive attribute; return null if not JSON
  private parseResponsiveAttr(val: string | null) {
    if (!val) return null;
    const s = val.trim();
    if (!s.startsWith('{')) return null;
    try { return JSON.parse(s); } catch { return null; }
  }

  private expandSpaceToken(val: string | null) {
    if (!val) return '';
    const map: Record<string,string> = { xs: 'var(--ui-space-xs, 4px)', sm: 'var(--ui-space-sm, 8px)', md: 'var(--ui-space-md, 12px)', lg: 'var(--ui-space-lg, 20px)' };
    return map[val as keyof typeof map] ?? val;
  }

  private toKebab(s: string) { return s.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`); }

  private cssForProp(prop: string, value: string): Record<string,string> {
    switch (prop) {
      case 'p': return { padding: this.expandSpaceToken(value) };
      case 'px': return { paddingLeft: this.expandSpaceToken(value), paddingRight: this.expandSpaceToken(value) };
      case 'py': return { paddingTop: this.expandSpaceToken(value), paddingBottom: this.expandSpaceToken(value) };
      case 'pt': return { paddingTop: this.expandSpaceToken(value) };
      case 'pr': return { paddingRight: this.expandSpaceToken(value) };
      case 'pb': return { paddingBottom: this.expandSpaceToken(value) };
      case 'pl': return { paddingLeft: this.expandSpaceToken(value) };
      case 'm': return { margin: this.expandSpaceToken(value) };
      case 'mx': return { marginLeft: this.expandSpaceToken(value), marginRight: this.expandSpaceToken(value) };
      case 'my': return { marginTop: this.expandSpaceToken(value), marginBottom: this.expandSpaceToken(value) };
      case 'mt': return { marginTop: this.expandSpaceToken(value) };
      case 'mr': return { marginRight: this.expandSpaceToken(value) };
      case 'mb': return { marginBottom: this.expandSpaceToken(value) };
      case 'ml': return { marginLeft: this.expandSpaceToken(value) };
      case 'minwidth': return { minWidth: value };
      case 'maxwidth': return { maxWidth: value };
      case 'minheight': return { minHeight: value };
      case 'maxheight': return { maxHeight: value };
      case 'flexbasis': return { flexBasis: value };
      case 'flexgrow': return { flexGrow: value };
      case 'flexshrink': return { flexShrink: value };
      case 'gridarea': return { gridArea: value };
      case 'gridcolumn': return { gridColumn: value };
      case 'gridcolumnstart': return { gridColumnStart: value };
      case 'gridcolumnend': return { gridColumnEnd: value };
      case 'gridrow': return { gridRow: value };
      case 'gridrowstart': return { gridRowStart: value };
      case 'gridrowend': return { gridRowEnd: value };
      // shorthand / alias support
      case 'bg':
      case 'background':
        return { background: value };
      case 'color':
        return { color: value };
      case 'w':
        return { width: value };
      case 'h':
        return { height: value };
      case 'minw':
        return { minWidth: value };
      case 'maxw':
        return { maxWidth: value };
      case 'minh':
        return { minHeight: value };
      case 'maxh':
        return { maxHeight: value };
      case 'align':
        return { alignItems: value };
      default:
        return { [this.toKebab(prop)]: value } as Record<string,string>;
    }
  }

  protected render() {
    // mirror legacy `classname` attribute into classList
    const legacy = this.getAttribute('classname');
    const snapshot = (this as any).__legacySnapshot as string | undefined;
    if (legacy && legacy !== snapshot) {
      if (snapshot) snapshot.split(/\s+/).forEach(c => this.classList.remove(c));
      legacy.split(/\s+/).forEach(c => { if (c) this.classList.add(c); });
      (this as any).__legacySnapshot = legacy;
    } else if (!legacy && snapshot) {
      snapshot.split(/\s+/).forEach(c => this.classList.remove(c));
      (this as any).__legacySnapshot = undefined;
    }

    // collect responsive attributes (JSON)
    const rspKeys = ['p','px','py','pt','pr','pb','pl','m','mx','my','mt','mr','mb','ml','width','w','minwidth','minw','maxwidth','maxw','height','h','minheight','minh','maxheight','maxh','bg','background','color','display','position','inset','top','right','bottom','left','align','flexbasis','flexgrow','flexshrink','gridarea','gridcolumn','gridcolumnstart','gridcolumnend','gridrow','gridrowstart','gridrowend'];
    const responsive: Array<{ prop: string; map: Record<string,string> }> = [];
    for (const k of rspKeys) {
      const raw = this.getAttribute(k);
      const parsed = this.parseResponsiveAttr(raw);
      if (parsed && typeof parsed === 'object') responsive.push({ prop: k, map: parsed as any });
    }

    // inject/update responsive stylesheet when needed
    if (responsive.length) {
      if (!(this as any).__rspClass) {
        (this as any).__rspClass = `ui-box-rsp-${Math.random().toString(36).slice(2,8)}`;
        this.classList.add((this as any).__rspClass);
      }
      const rspClass = (this as any).__rspClass as string;
      const rules: string[] = [];

      // base (initial)
      const baseStyles: Record<string,string> = {};
      for (const r of responsive) {
        if (typeof r.map.initial !== 'undefined') Object.assign(baseStyles, this.cssForProp(r.prop, r.map.initial));
      }
      if (Object.keys(baseStyles).length) {
        rules.push(`.${rspClass} { ${Object.entries(baseStyles).map(([k,v]) => `${this.toKebab(k)}: ${v};`).join(' ')} }`);
      }

      // breakpoints
      const bps = ['sm','md','lg','xl'];
      const bpVars: Record<string,string> = { sm: '--ui-breakpoint-sm', md: '--ui-breakpoint-md', lg: '--ui-breakpoint-lg', xl: '--ui-breakpoint-lg' };
      for (const bp of bps) {
        const bpRules: string[] = [];
        for (const r of responsive) {
          if (typeof r.map[bp] !== 'undefined') {
            const css = this.cssForProp(r.prop, r.map[bp]);
            for (const [k, v] of Object.entries(css)) bpRules.push(`${this.toKebab(k)}: ${v};`);
          }
        }
        if (bpRules.length) rules.push(`@media (min-width: var(${bpVars[bp]})) { .${rspClass} { ${bpRules.join(' ')} } }`);
      }

      let el = (this as any).__rspStyle as HTMLStyleElement | undefined;
      if (!el) {
        el = document.createElement('style');
        el.dataset.uid = (this as any).__rspClass;
        document.head.appendChild(el);
        (this as any).__rspStyle = el;
        (this as any)._cleanup = () => {
          try { el?.parentElement?.removeChild(el); } catch (_) {}
          (this as any).__rspStyle = undefined;
          try { this.classList.remove((this as any).__rspClass); } catch (_) {}
          (this as any).__rspClass = undefined;
        };
      }
      el.textContent = rules.join('\n');
    } else {
      // remove responsive stylesheet if present
      const el = (this as any).__rspStyle as HTMLStyleElement | undefined;
      if (el) { try { el.parentElement?.removeChild(el); } catch(_) {} (this as any).__rspStyle = undefined; }
      if ((this as any).__rspClass) { try { this.classList.remove((this as any).__rspClass); } catch(_) {} (this as any).__rspClass = undefined; }
    }

    // compute inline styles for single-value attributes (skip JSON attrs)
    const inline: Record<string,string> = {};
    const get = (n: string) => this.getAttribute(n) || null;

    const applyIfNotJson = (name: string, transform?: (v: string) => string) => {
      const raw = get(name);
      if (!raw || this.parseResponsiveAttr(raw)) return;
      const val = transform ? transform(raw) : raw;
      Object.assign(inline, this.cssForProp(name, val));
    };

    ['p','px','py','pt','pr','pb','pl','m','mx','my','mt','mr','mb','ml'].forEach(n => applyIfNotJson(n));
    ['width','w','minwidth','minw','maxwidth','maxw','height','h','minheight','minh','maxheight','maxh'].forEach(n => applyIfNotJson(n));
    ['bg','background','color'].forEach(n => applyIfNotJson(n));
    ['display','position','inset','top','right','bottom','left','align'].forEach(n => applyIfNotJson(n));
    ['flexbasis','flexgrow','flexshrink','gridarea','gridcolumn','gridcolumnstart','gridcolumnend','gridrow','gridrowstart','gridrowend'].forEach(n => applyIfNotJson(n));

    // preserve and merge any inline styles set by consumers (React `style` prop, etc.)
    const existingCssText = this.style.cssText || '';
    const parseCssText = (s: string) => {
      const out: Record<string,string> = {};
      s.split(';').map(p => p.trim()).filter(Boolean).forEach(pair => {
        const idx = pair.indexOf(':');
        if (idx > -1) {
          const name = pair.slice(0, idx).trim();
          const value = pair.slice(idx + 1).trim();
          out[name] = value;
        }
      });
      return out;
    };
    const existingMap = parseCssText(existingCssText);

    // default display only when not provided by attribute, inline map, or existing styles
    if (!this.getAttribute('display') && !inline['display'] && !existingMap['display']) inline['display'] = 'block';

    // default align-items: center unless explicitly provided (keeps layout centered by default)
    const hasAlignProvided = !!(this.getAttribute('align') || inline['alignItems'] || existingMap['align-items']);
    if (!hasAlignProvided) inline['alignItems'] = 'center';

    // convert computed inline props to kebab-case and merge with existing (inline overrides existing)
    const inlineKebab: Record<string,string> = {};
    for (const [k, v] of Object.entries(inline)) inlineKebab[this.toKebab(k)] = v;
    const merged = { ...existingMap, ...inlineKebab };

    this.style.cssText = Object.entries(merged).map(([k, v]) => `${k}: ${v};`).join(' ');

    // render children
    this.setContent('<slot></slot>');
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-box')) {
  customElements.define('ui-box', UIBox);
}
