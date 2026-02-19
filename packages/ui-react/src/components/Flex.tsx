import React, { useEffect, useRef } from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

type Props = React.HTMLAttributes<HTMLElement> & {
  direction?: Responsive<'row'|'column'>;
  align?: Responsive<string>;
  justify?: Responsive<string>;
  wrap?: Responsive<string>;
  gap?: Responsive<string>;
};

function isResponsiveValue(v: any) { return v && typeof v === 'object'; }

function mapPropToCss(prop: string, value: string) {
  switch (prop) {
    case 'direction': return { 'flex-direction': value };
    case 'align': return { 'align-items': value };
    case 'justify': return { 'justify-content': value };
    case 'wrap': return { 'flex-wrap': value };
    case 'gap': return { gap: value };
    default: return { [prop]: value } as Record<string,string>;
  }
}

export function Flex(props: Props) {
  const { children, className, direction, align, justify, wrap, gap, ...rest } = props as any;
  const uid = useRef(`ui-flex-rsp-${Math.random().toString(36).slice(2,8)}`);
  const styleEl = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const responsiveEntries: Array<{prop: string; map: any}> = [];
    const candidates: Record<string, any> = { direction, align, justify, wrap, gap };
    for (const [k,v] of Object.entries(candidates)) if (isResponsiveValue(v)) responsiveEntries.push({ prop: k, map: v });
    if (responsiveEntries.length === 0) return;

    const cls = uid.current;
    const lines: string[] = [];

    const baseRules: Record<string,string> = {};
    for (const ent of responsiveEntries) {
      if ((ent.map as any).initial !== undefined) {
        const css = mapPropToCss(ent.prop, (ent.map as any).initial as string);
        Object.assign(baseRules, css);
      }
    }
    if (Object.keys(baseRules).length) {
      const rule = Object.entries(baseRules).map(([k,v]) => `${k}: ${v};`).join(' ');
      lines.push(`.${cls} { ${rule} }`);
    }

    const bpKeys: Array<BreakpointKey> = ['sm','md','lg','xl'];
    const bpVar: Record<BreakpointKey,string> = { sm: '--ui-breakpoint-sm', md: '--ui-breakpoint-md', lg: '--ui-breakpoint-lg', xl: '--ui-breakpoint-lg' };
    for (const bp of bpKeys) {
      const rules: string[] = [];
      for (const ent of responsiveEntries) {
        const v = (ent.map as any)[bp];
        if (v !== undefined) {
          const css = mapPropToCss(ent.prop, v as string);
          for (const [k,val] of Object.entries(css)) rules.push(`${k}: ${val};`);
        }
      }
      if (rules.length) lines.push(`@media (min-width: var(${bpVar[bp]})) { .${cls} { ${rules.join(' ')} } }`);
    }

    let el = styleEl.current;
    if (!el) { el = document.createElement('style'); document.head.appendChild(el); styleEl.current = el; }
    el.textContent = lines.join('\n');

    return () => { if (styleEl.current) { try { styleEl.current.remove(); } catch (e) {} styleEl.current = null; } };
  }, [JSON.stringify({direction,align,justify,wrap,gap})]);

  // strip responsive props so host doesn't receive objects
  const hostProps: Record<string, any> = {};
  if (!isResponsiveValue(direction) && direction !== undefined) hostProps.direction = direction;
  if (!isResponsiveValue(align) && align !== undefined) hostProps.align = align;
  if (!isResponsiveValue(justify) && justify !== undefined) hostProps.justify = justify;
  if (!isResponsiveValue(wrap) && wrap !== undefined) hostProps.wrap = wrap;
  if (!isResponsiveValue(gap) && gap !== undefined) hostProps.gap = gap;
  Object.assign(hostProps, rest);

  const combinedClass = `${className ? className + ' ' : ''}${uid.current}`.trim();
  return React.createElement('ui-flex', { className: combinedClass, ...hostProps }, children);
}

export default Flex;
