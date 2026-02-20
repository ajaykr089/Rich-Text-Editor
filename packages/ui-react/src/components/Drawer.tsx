import React, { useEffect, useImperativeHandle, useRef } from 'react';

type DrawerProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
  dismissible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
};

export const Drawer = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  { children, open, side, dismissible, onOpen, onClose, onChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const changeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onOpen, onClose, onChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (side) el.setAttribute('side', side);
    else el.removeAttribute('side');
  }, [side]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (dismissible) el.setAttribute('dismissible', '');
    else el.removeAttribute('dismissible');
  }, [dismissible]);

  return React.createElement('ui-drawer', { ref, ...rest }, children);
});

Drawer.displayName = 'Drawer';

export default Drawer;
