import React, { useEffect, useRef } from 'react';

type LayoutMode = 'dashboard' | 'split' | 'stack';
type LayoutVariant = 'default' | 'flat' | 'elevated' | 'glass' | 'contrast';
type LayoutDensity = 'default' | 'compact' | 'comfortable';
type LayoutMaxWidth = 'sm' | 'md' | 'lg' | 'xl';
type LayoutSidebarSide = 'start' | 'end';

type Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  mode?: LayoutMode;
  variant?: LayoutVariant;
  density?: LayoutDensity;
  maxWidth?: LayoutMaxWidth;
  sidebarSide?: LayoutSidebarSide;
  collapsed?: boolean;
  headless?: boolean;
  sidebarWidth?: string;
  asideWidth?: string;
  onLayoutChange?: () => void;
};

export const Layout = React.forwardRef<HTMLElement, Props>(function Layout(
  {
    children,
    mode,
    variant,
    density,
    maxWidth,
    sidebarSide,
    collapsed,
    headless,
    sidebarWidth,
    asideWidth,
    onLayoutChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => onLayoutChange?.();
    el.addEventListener('layoutchange', handler as EventListener);
    return () => el.removeEventListener('layoutchange', handler as EventListener);
  }, [onLayoutChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (mode && mode !== 'dashboard') el.setAttribute('mode', mode);
    else el.removeAttribute('mode');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (maxWidth) el.setAttribute('max-width', maxWidth);
    else el.removeAttribute('max-width');

    if (sidebarSide && sidebarSide !== 'start') el.setAttribute('sidebar-side', sidebarSide);
    else el.removeAttribute('sidebar-side');

    if (collapsed) el.setAttribute('collapsed', '');
    else el.removeAttribute('collapsed');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (sidebarWidth) el.setAttribute('sidebar-width', sidebarWidth);
    else el.removeAttribute('sidebar-width');

    if (asideWidth) el.setAttribute('aside-width', asideWidth);
    else el.removeAttribute('aside-width');
  }, [mode, variant, density, maxWidth, sidebarSide, collapsed, headless, sidebarWidth, asideWidth]);

  return React.createElement('ui-layout', { ref, ...rest }, children);
});

Layout.displayName = 'Layout';

export default Layout;
