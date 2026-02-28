import React, { useEffect, useImperativeHandle, useRef } from 'react';

type AppHeaderProps = React.HTMLAttributes<HTMLElement> & {
  sticky?: boolean;
  bordered?: boolean;
  dense?: boolean;
  showMenuButton?: boolean;
  onMenuTrigger?: () => void;
};

export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  { children, sticky, bordered, dense, showMenuButton, onMenuTrigger, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onMenuTrigger) return;

    const handler = () => onMenuTrigger();
    el.addEventListener('menu-trigger', handler as EventListener);
    return () => el.removeEventListener('menu-trigger', handler as EventListener);
  }, [onMenuTrigger]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (sticky) el.setAttribute('sticky', '');
    else el.removeAttribute('sticky');
  }, [sticky]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (bordered) el.setAttribute('bordered', '');
    else el.removeAttribute('bordered');
  }, [bordered]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (dense) el.setAttribute('dense', '');
    else el.removeAttribute('dense');
  }, [dense]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (showMenuButton) el.setAttribute('show-menu-button', '');
    else el.removeAttribute('show-menu-button');
  }, [showMenuButton]);

  return React.createElement('ui-app-header', { ref, ...rest }, children);
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;
