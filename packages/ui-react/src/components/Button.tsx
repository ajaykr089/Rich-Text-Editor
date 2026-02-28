import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  block?: boolean;
  headless?: boolean;
  disabled?: boolean;
  animation?: 'scale' | 'pulse' | 'none';
  theme?: 'default' | 'dark' | 'brand';
};

export function Button(props: Props) {
  const { children, onClick, variant, size, icon, loading, block, headless, disabled, animation, theme, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => onClick && onClick(e as any);
    if (onClick) el.addEventListener('click', handler as EventListener);
    return () => { if (onClick) el.removeEventListener('click', handler as EventListener); };
  }, [onClick]);

  // Reflect attributes for custom element before paint to avoid style flash (e.g. secondary -> primary -> secondary).
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant) el.setAttribute('variant', variant); else el.removeAttribute('variant');
    if (size) el.setAttribute('size', size); else el.removeAttribute('size');
    if (icon) el.setAttribute('icon', icon); else el.removeAttribute('icon');
    if (loading) el.setAttribute('loading', ''); else el.removeAttribute('loading');
    if (block) el.setAttribute('block', ''); else el.removeAttribute('block');
    if (headless) el.setAttribute('headless', ''); else el.removeAttribute('headless');
    // reflect disabled explicitly (support disabled={false} correctly)
    if (disabled) el.setAttribute('disabled', ''); else el.removeAttribute('disabled');
    // animation is opt-in (do not set by default)
    if (animation) el.setAttribute('animation', animation); else el.removeAttribute('animation');
    if (theme && theme !== 'default') el.setAttribute('theme', theme); else el.removeAttribute('theme');
  }, [variant, size, icon, loading, block, headless, disabled, animation, theme]);

  // Set style-critical attributes on initial render so connectedCallback sees the final variant immediately.
  const hostProps: Record<string, unknown> = {
    ref,
    ...rest,
    variant,
    size,
    icon,
    animation,
    theme: theme && theme !== 'default' ? theme : undefined,
    loading: loading ? '' : undefined,
    block: block ? '' : undefined,
    headless: headless ? '' : undefined,
    disabled: disabled ? '' : undefined,
  };

  return React.createElement('ui-button', hostProps, children);
}

export default Button;
