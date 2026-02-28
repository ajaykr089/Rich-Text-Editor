import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export interface AvatarProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number | string;
  bg?: string;
  color?: string;
  radius?: string;
  fontWeight?: number | string;
  shape?: 'circle' | 'rounded' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
  ring?: boolean;
  loading?: 'lazy' | 'eager' | boolean;
}

function deriveInitials(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
}

function toLoading(value: AvatarProps['loading']): string | undefined {
  if (value == null) return undefined;
  if (value === 'lazy' || value === 'eager') return value;
  return value ? 'eager' : 'lazy';
}

function toFallback(initials: string | undefined, alt: string | undefined, children: React.ReactNode): string {
  if (initials && initials.trim()) return initials.trim().slice(0, 2).toUpperCase();
  if (alt && alt.trim()) return deriveInitials(alt);
  if (typeof children === 'string' && children.trim()) return deriveInitials(children);
  return '?';
}

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    initials,
    size,
    bg,
    color,
    radius,
    fontWeight,
    shape,
    status,
    ring,
    loading,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);
  const fallback = React.useMemo(() => toFallback(initials, alt, children), [initials, alt, children]);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-avatar', 'Avatar');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (src) element.setAttribute('src', src);
    else element.removeAttribute('src');

    if (alt) element.setAttribute('alt', alt);
    else element.removeAttribute('alt');

    if (initials) element.setAttribute('initials', initials);
    else element.removeAttribute('initials');

    if (size != null) element.setAttribute('size', String(size));
    else element.removeAttribute('size');

    if (bg) element.setAttribute('bg', bg);
    else element.removeAttribute('bg');

    if (color) element.setAttribute('color', color);
    else element.removeAttribute('color');

    if (radius) element.setAttribute('radius', radius);
    else element.removeAttribute('radius');

    if (fontWeight != null) element.setAttribute('fontweight', String(fontWeight));
    else element.removeAttribute('fontweight');

    if (shape) element.setAttribute('shape', shape);
    else element.removeAttribute('shape');

    if (status) element.setAttribute('status', status);
    else element.removeAttribute('status');

    if (ring == null) element.removeAttribute('ring');
    else if (ring) element.setAttribute('ring', '');
    else element.removeAttribute('ring');

    const loadingAttr = toLoading(loading);
    if (loadingAttr) element.setAttribute('loading', loadingAttr);
    else element.removeAttribute('loading');
  }, [src, alt, initials, size, bg, color, radius, fontWeight, shape, status, ring, loading]);

  return React.createElement('ui-avatar', { ref, ...rest }, fallback);
});

Avatar.displayName = 'Avatar';
