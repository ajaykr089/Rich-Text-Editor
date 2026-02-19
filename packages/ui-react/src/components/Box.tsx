import React, { useEffect, useRef } from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

type Props = React.HTMLAttributes<HTMLElement> & {
  p?: Responsive<string>; px?: Responsive<string>; py?: Responsive<string>; pt?: Responsive<string>; pr?: Responsive<string>; pb?: Responsive<string>; pl?: Responsive<string>;
  m?: Responsive<string>; mx?: Responsive<string>; my?: Responsive<string>; mt?: Responsive<string>; mr?: Responsive<string>; mb?: Responsive<string>; ml?: Responsive<string>;
  width?: Responsive<string>; w?: Responsive<string>; minWidth?: Responsive<string>; minW?: Responsive<string>; maxWidth?: Responsive<string>; maxW?: Responsive<string>; height?: Responsive<string>; h?: Responsive<string>; minHeight?: Responsive<string>; minH?: Responsive<string>; maxHeight?: Responsive<string>; maxH?: Responsive<string>;
  display?: Responsive<string>; position?: Responsive<string>; inset?: Responsive<string>; top?: Responsive<string>; right?: Responsive<string>; bottom?: Responsive<string>; left?: Responsive<string>;
  flexBasis?: Responsive<string>; flexGrow?: Responsive<string>; flexShrink?: Responsive<string>;
  gridArea?: Responsive<string>; gridColumn?: Responsive<string>; gridColumnStart?: Responsive<string>; gridColumnEnd?: Responsive<string>; gridRow?: Responsive<string>; gridRowStart?: Responsive<string>; gridRowEnd?: Responsive<string>;
  align?: Responsive<string>;
  bg?: Responsive<string>; color?: Responsive<string>;
};

const RESPONSIVE_KEYS: Array<keyof Props> = [
  'p','px','py','pt','pr','pb','pl',
  'm','mx','my','mt','mr','mb','ml',
  'width','w','minWidth','minW','maxWidth','maxW','height','h','minHeight','minH','maxHeight','maxH',
  'display','position','inset','top','right','bottom','left',
  'flexBasis','flexGrow','flexShrink',
  'gridArea','gridColumn','gridColumnStart','gridColumnEnd','gridRow','gridRowStart','gridRowEnd',
  'align',
  'bg','color'
];

function isResponsiveValue(v: any) {
  return v !== null && typeof v === 'object';
}

function propToCssEntries(prop: string, value: string) {
  switch (prop) {
    case 'p': return { padding: value };
    case 'px': return { paddingLeft: value, paddingRight: value };
    case 'py': return { paddingTop: value, paddingBottom: value };
    case 'pt': return { paddingTop: value };
    case 'pr': return { paddingRight: value };
    case 'pb': return { paddingBottom: value };
    case 'pl': return { paddingLeft: value };
    case 'm': return { margin: value };
    case 'mx': return { marginLeft: value, marginRight: value };
    case 'my': return { marginTop: value, marginBottom: value };
    case 'mt': return { marginTop: value };
    case 'mr': return { marginRight: value };
    case 'mb': return { marginBottom: value };
    case 'ml': return { marginLeft: value };
    case 'minWidth': return { minWidth: value };
    case 'maxWidth': return { maxWidth: value };
    case 'minHeight': return { minHeight: value };
    case 'maxHeight': return { maxHeight: value };
    case 'flexBasis': return { flexBasis: value };
    case 'flexGrow': return { flexGrow: value };
    case 'flexShrink': return { flexShrink: value };
    case 'gridArea': return { gridArea: value };
    case 'gridColumn': return { gridColumn: value };
    case 'gridColumnStart': return { gridColumnStart: value };
    case 'gridColumnEnd': return { gridColumnEnd: value };
    case 'gridRow': return { gridRow: value };
    case 'gridRowStart': return { gridRowStart: value };
    case 'gridRowEnd': return { gridRowEnd: value };
    // shorthand support
    case 'bg': return { background: value };
    case 'w': return { width: value };
    case 'h': return { height: value };
    case 'minW': return { minWidth: value };
    case 'maxW': return { maxWidth: value };
    case 'minH': return { minHeight: value };
    case 'maxH': return { maxHeight: value };    case 'align': return { alignItems: value };    case 'color': return { color: value };
    default:
      // direct mapping for simple props
      return { [prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)]: value } as Record<string,string>;
  }
}

export function Box(props: Props) {
  const { children, className, ...rest } = props as any;
  const uid = useRef(`ui-box-rsp-${Math.random().toString(36).slice(2,8)}`);
  const styleElRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // gather responsive props
    const responsiveEntries: Array<{ prop: string; map: Partial<Record<string,string>> }> = [];
    for (const k of RESPONSIVE_KEYS) {
      const val = (rest as any)[k];
      if (isResponsiveValue(val)) {
        responsiveEntries.push({ prop: k as string, map: val as any });
      }
    }

    if (responsiveEntries.length === 0) return;

    const cls = uid.current;
    const lines: string[] = [];

    // base rules (initial)
    const baseRules: Record<string,string> = {};
    for (const ent of responsiveEntries) {
      const initial = (ent.map as any).initial;
      if (typeof initial !== 'undefined') {
        const css = propToCssEntries(ent.prop, initial as string);
        Object.assign(baseRules, css);
      }
    }
    if (Object.keys(baseRules).length) {
      const rule = Object.entries(baseRules).map(([k,v]) => `${k.replace(/[A-Z]/g, m=>`-${m.toLowerCase()}`)}: ${v};`).join(' ');
      lines.push(`.${cls} { ${rule} }`);
    }

    // breakpoints -> media queries
    const bpKeys: Array<BreakpointKey> = ['sm','md','lg','xl'];
    const bpVar: Record<BreakpointKey,string> = {
      sm: '--ui-breakpoint-sm', md: '--ui-breakpoint-md', lg: '--ui-breakpoint-lg', xl: '--ui-breakpoint-lg'
    };

    for (const bp of bpKeys) {
      const rules: string[] = [];
      for (const ent of responsiveEntries) {
        const v = (ent.map as any)[bp];
        if (typeof v !== 'undefined') {
          const css = propToCssEntries(ent.prop, v as string);
          for (const [k, val] of Object.entries(css)) {
            rules.push(`${k.replace(/[A-Z]/g, m=>`-${m.toLowerCase()}`)}: ${val};`);
          }
        }
      }
      if (rules.length) {
        const mq = `@media (min-width: var(${bpVar[bp]})) { .${cls} { ${rules.join(' ')} } }`;
        lines.push(mq);
      }
    }

    // inject style
    let el = styleElRef.current;
    if (!el) {
      el = document.createElement('style');
      el.dataset['uid'] = uid.current;
      document.head.appendChild(el);
      styleElRef.current = el;
    }
    el.textContent = lines.join('\n');

    return () => {
      if (styleElRef.current) {
        try { styleElRef.current.parentElement?.removeChild(styleElRef.current); } catch (e) {}
        styleElRef.current = null;
      }
    };
  }, [JSON.stringify(rest)]);

  // strip responsive props from attributes we pass to the host element
  const hostProps: Record<string, any> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (RESPONSIVE_KEYS.indexOf(k as any) !== -1 && isResponsiveValue(v)) continue;
    hostProps[k] = v;
  }

  const combinedClass = `${className ? className + ' ' : ''}${uid.current}`.trim();
  return React.createElement('ui-box', { className: combinedClass, ...hostProps }, children);
}

export default Box;
