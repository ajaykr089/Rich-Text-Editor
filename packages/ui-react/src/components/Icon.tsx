import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type IconProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  name?: string;
  iconVariant?: 'outline' | 'solid' | 'duotone';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  color?: string;
  secondaryColor?: string;
  variant?: 'default' | 'surface' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  shape?: 'default' | 'square' | 'soft';
  spin?: boolean;
  pulse?: boolean;
  badge?: boolean;
  label?: string;
  decorative?: boolean;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  rtl?: boolean;
};

export const Icon = React.forwardRef<HTMLElement, IconProps>(function Icon(
  {
    children,
    name,
    iconVariant,
    size,
    color,
    secondaryColor,
    variant,
    tone,
    shape,
    spin,
    pulse,
    badge,
    label,
    decorative,
    strokeWidth,
    absoluteStrokeWidth,
    strokeLinecap,
    strokeLinejoin,
    rotate,
    flip,
    rtl,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (name) el.setAttribute('name', name);
    else el.removeAttribute('name');

    if (iconVariant) el.setAttribute('icon-variant', iconVariant);
    else el.removeAttribute('icon-variant');

    if (size != null && size !== '') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (color) el.setAttribute('color', color);
    else el.removeAttribute('color');

    if (secondaryColor) el.setAttribute('secondary-color', secondaryColor);
    else el.removeAttribute('secondary-color');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (spin) el.setAttribute('spin', '');
    else el.removeAttribute('spin');

    if (pulse) el.setAttribute('pulse', '');
    else el.removeAttribute('pulse');

    if (badge) el.setAttribute('badge', '');
    else el.removeAttribute('badge');

    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (decorative) el.setAttribute('decorative', '');
    else el.removeAttribute('decorative');

    if (strokeWidth != null && strokeWidth !== '') el.setAttribute('stroke-width', String(strokeWidth));
    else el.removeAttribute('stroke-width');

    if (absoluteStrokeWidth) el.setAttribute('absolute-stroke-width', '');
    else el.removeAttribute('absolute-stroke-width');

    if (strokeLinecap) el.setAttribute('stroke-linecap', strokeLinecap);
    else el.removeAttribute('stroke-linecap');

    if (strokeLinejoin) el.setAttribute('stroke-linejoin', strokeLinejoin);
    else el.removeAttribute('stroke-linejoin');

    if (rotate != null && Number.isFinite(rotate)) el.setAttribute('rotate', String(rotate));
    else el.removeAttribute('rotate');

    if (flip) el.setAttribute('flip', flip);
    else el.removeAttribute('flip');

    if (rtl) el.setAttribute('rtl', '');
    else el.removeAttribute('rtl');
  }, [
    name,
    iconVariant,
    size,
    color,
    secondaryColor,
    variant,
    tone,
    shape,
    spin,
    pulse,
    badge,
    label,
    decorative,
    strokeWidth,
    absoluteStrokeWidth,
    strokeLinecap,
    strokeLinejoin,
    rotate,
    flip,
    rtl
  ]);

  return React.createElement('ui-icon', { ref, ...rest }, children);
});

Icon.displayName = 'Icon';

export default Icon;
