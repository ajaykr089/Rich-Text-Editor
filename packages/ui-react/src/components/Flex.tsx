import React from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

type Props = React.HTMLAttributes<HTMLElement> & {
  direction?: Responsive<'row' | 'column' | 'row-reverse' | 'column-reverse'>;
  align?: Responsive<string>;
  justify?: Responsive<string>;
  wrap?: Responsive<string>;
  gap?: Responsive<string>;
  rowGap?: Responsive<string>;
  columnGap?: Responsive<string>;
  display?: Responsive<'flex' | 'inline-flex' | string>;
  headless?: boolean;
};

function serializeResponsive(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return undefined;
    }
  }
  return String(value);
}

export function Flex(props: Props) {
  const {
    children,
    className,
    direction,
    align,
    justify,
    wrap,
    gap,
    rowGap,
    columnGap,
    display,
    headless,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    className,
    ...rest,
    direction: serializeResponsive(direction),
    align: serializeResponsive(align),
    justify: serializeResponsive(justify),
    wrap: serializeResponsive(wrap),
    gap: serializeResponsive(gap),
    rowgap: serializeResponsive(rowGap),
    columngap: serializeResponsive(columnGap),
    display: serializeResponsive(display),
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-flex', hostProps, children);
}

export default Flex;
