import React, { useEffect, useRef } from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;
type ResponsiveBreakpoint = Exclude<BreakpointKey, 'initial'>;

type Props = React.HTMLAttributes<HTMLElement> & { columns?: Responsive<string>; gap?: Responsive<string> };

function isResponsiveValue(v: any) { return v && typeof v === 'object'; }

export function Grid(props: Props) {
  const { children, className, columns = '1fr', gap, ...rest } = props as any;
  const uid = useRef(`ui-grid-rsp-${Math.random().toString(36).slice(2,8)}`);
  const styleEl = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!isResponsiveValue(columns) && !isResponsiveValue(gap)) return;
    const cls = uid.current;
    const lines: string[] = [];

    const base: string[] = [];
    if (!isResponsiveValue(columns)) base.push(`grid-template-columns: ${columns};`);
    if (!isResponsiveValue(gap) && gap) base.push(`gap: ${gap};`);
    if (base.length) lines.push(`.${cls} { ${base.join(' ')} }`);

    const bpKeys: Array<ResponsiveBreakpoint> = ['sm','md','lg','xl'];
    const bpVar: Record<ResponsiveBreakpoint,string> = { sm: '--ui-breakpoint-sm', md: '--ui-breakpoint-md', lg: '--ui-breakpoint-lg', xl: '--ui-breakpoint-lg' };
    for (const bp of bpKeys) {
      const rules: string[] = [];
      if (isResponsiveValue(columns) && (columns as any)[bp]) rules.push(`grid-template-columns: ${(columns as any)[bp]};`);
      if (isResponsiveValue(gap) && (gap as any)[bp]) rules.push(`gap: ${(gap as any)[bp]};`);
      if (rules.length) lines.push(`@media (min-width: var(${bpVar[bp]})) { .${cls} { ${rules.join(' ')} } }`);
    }

    let el = styleEl.current;
    if (!el) { el = document.createElement('style'); document.head.appendChild(el); styleEl.current = el; }
    el.textContent = lines.join('\n');

    return () => { if (styleEl.current) { try { styleEl.current.remove(); } catch (e) {} styleEl.current = null; } };
  }, [JSON.stringify({ columns, gap })]);

  const hostProps: Record<string, any> = {};
  if (!isResponsiveValue(columns)) hostProps.columns = columns;
  if (!isResponsiveValue(gap) && gap) hostProps.gap = gap;
  Object.assign(hostProps, rest);

  const combinedClass = `${className ? className + ' ' : ''}${uid.current}`.trim();
  return React.createElement('ui-grid', { className: combinedClass, ...hostProps }, children);
}

export default Grid;
