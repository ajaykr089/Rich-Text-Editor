import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type IconProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string | number;
  color?: string;
  variant?: 'default' | 'surface' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  shape?: 'default' | 'square' | 'soft';
  spin?: boolean;
  pulse?: boolean;
  badge?: boolean;
  label?: string;
  decorative?: boolean;
  strokeWidth?: number | string;
};

export const Icon = React.forwardRef<HTMLElement, IconProps>(function Icon(
  {
    children,
    name,
    size,
    color,
    variant,
    tone,
    shape,
    spin,
    pulse,
    badge,
    label,
    decorative,
    strokeWidth,
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

    if (size != null && size !== '') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (color) el.setAttribute('color', color);
    else el.removeAttribute('color');

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
  }, [name, size, color, variant, tone, shape, spin, pulse, badge, label, decorative, strokeWidth]);

  return React.createElement('ui-icon', { ref, ...rest }, children);
});

Icon.displayName = 'Icon';

export default Icon;
