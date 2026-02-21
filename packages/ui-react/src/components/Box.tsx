import React from 'react';

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
  variant?: 'default' | 'surface' | 'elevated' | 'outline' | 'glass' | 'gradient' | 'contrast';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  elevation?: 'default' | 'none' | 'low' | 'high';
  radius?: 'default' | 'sm' | 'lg' | 'xl';
  interactive?: boolean;
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

export function Box(props: Props) {
  const {
    children,
    className,
    variant,
    tone,
    elevation,
    radius,
    interactive,
    headless,
    p, px, py, pt, pr, pb, pl,
    m, mx, my, mt, mr, mb, ml,
    width, w, minWidth, minW, maxWidth, maxW, height, h, minHeight, minH, maxHeight, maxH,
    display, position, inset, top, right, bottom, left,
    flexBasis, flexGrow, flexShrink,
    gridArea, gridColumn, gridColumnStart, gridColumnEnd, gridRow, gridRowStart, gridRowEnd,
    align,
    bg,
    color,
    ...rest
  } = props;

  const hostProps: Record<string, unknown> = {
    className,
    ...rest,
    p: serializeResponsive(p),
    px: serializeResponsive(px),
    py: serializeResponsive(py),
    pt: serializeResponsive(pt),
    pr: serializeResponsive(pr),
    pb: serializeResponsive(pb),
    pl: serializeResponsive(pl),
    m: serializeResponsive(m),
    mx: serializeResponsive(mx),
    my: serializeResponsive(my),
    mt: serializeResponsive(mt),
    mr: serializeResponsive(mr),
    mb: serializeResponsive(mb),
    ml: serializeResponsive(ml),
    width: serializeResponsive(width),
    w: serializeResponsive(w),
    minwidth: serializeResponsive(minWidth ?? minW),
    maxwidth: serializeResponsive(maxWidth ?? maxW),
    height: serializeResponsive(height),
    h: serializeResponsive(h),
    minheight: serializeResponsive(minHeight ?? minH),
    maxheight: serializeResponsive(maxHeight ?? maxH),
    display: serializeResponsive(display),
    position: serializeResponsive(position),
    inset: serializeResponsive(inset),
    top: serializeResponsive(top),
    right: serializeResponsive(right),
    bottom: serializeResponsive(bottom),
    left: serializeResponsive(left),
    flexbasis: serializeResponsive(flexBasis),
    flexgrow: serializeResponsive(flexGrow),
    flexshrink: serializeResponsive(flexShrink),
    gridarea: serializeResponsive(gridArea),
    gridcolumn: serializeResponsive(gridColumn),
    gridcolumnstart: serializeResponsive(gridColumnStart),
    gridcolumnend: serializeResponsive(gridColumnEnd),
    gridrow: serializeResponsive(gridRow),
    gridrowstart: serializeResponsive(gridRowStart),
    gridrowend: serializeResponsive(gridRowEnd),
    align: serializeResponsive(align),
    bg: serializeResponsive(bg),
    color: serializeResponsive(color),
    variant: variant && variant !== 'default' ? variant : undefined,
    tone: tone && tone !== 'default' ? tone : undefined,
    elevation: elevation && elevation !== 'default' ? elevation : undefined,
    radius: radius && radius !== 'default' ? radius : undefined,
    interactive: interactive ? '' : undefined,
    headless: headless ? '' : undefined
  };

  return React.createElement('ui-box', hostProps, children);
}

export default Box;
