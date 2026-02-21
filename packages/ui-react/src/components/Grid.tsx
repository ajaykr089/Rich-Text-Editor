import React from 'react';

type BreakpointKey = 'initial' | 'sm' | 'md' | 'lg' | 'xl';
type Responsive<T> = T | Partial<Record<BreakpointKey, T>>;

type Props = React.HTMLAttributes<HTMLElement> & {
  columns?: Responsive<string>;
  rows?: Responsive<string>;
  gap?: Responsive<string>;
  rowGap?: Responsive<string>;
  columnGap?: Responsive<string>;
  autoFlow?: Responsive<string>;
  autoRows?: Responsive<string>;
  autoColumns?: Responsive<string>;
  align?: Responsive<string>;
  justify?: Responsive<string>;
  place?: Responsive<string>;
  alignContent?: Responsive<string>;
  justifyContent?: Responsive<string>;
  placeContent?: Responsive<string>;
  display?: Responsive<'grid' | 'inline-grid' | string>;
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

export function Grid(props: Props) {
  const {
    children,
    className,
    columns,
    rows,
    gap,
    rowGap,
    columnGap,
    autoFlow,
    autoRows,
    autoColumns,
    align,
    justify,
    place,
    alignContent,
    justifyContent,
    placeContent,
    display,
    headless,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    className,
    ...rest,
    columns: serializeResponsive(columns),
    rows: serializeResponsive(rows),
    gap: serializeResponsive(gap),
    rowgap: serializeResponsive(rowGap),
    columngap: serializeResponsive(columnGap),
    autoflow: serializeResponsive(autoFlow),
    autorows: serializeResponsive(autoRows),
    autocolumns: serializeResponsive(autoColumns),
    align: serializeResponsive(align),
    justify: serializeResponsive(justify),
    place: serializeResponsive(place),
    aligncontent: serializeResponsive(alignContent),
    justifycontent: serializeResponsive(justifyContent),
    placecontent: serializeResponsive(placeContent),
    display: serializeResponsive(display),
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-grid', hostProps, children);
}

export default Grid;
