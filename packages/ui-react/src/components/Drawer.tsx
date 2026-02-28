import React, { useEffect, useImperativeHandle, useRef } from 'react';

type DrawerProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
  variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning';
  size?: 'default' | 'sm' | 'lg';
  inset?: boolean;
  dismissible?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
};

export const Drawer = React.forwardRef<HTMLElement, DrawerProps>(function Drawer(
  { children, open, side, variant, density, shape, elevation, tone, size, inset, dismissible, onOpen, onClose, onChange, ...rest },
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
  }, [variant]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
  }, [density]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
  }, [shape]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
  }, [elevation]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
  }, [tone]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (size && size !== 'default') el.setAttribute('size', size);
    else el.removeAttribute('size');
  }, [size]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inset) el.setAttribute('inset', '');
    else el.removeAttribute('inset');
  }, [inset]);

  return React.createElement('ui-drawer', { ref, ...rest }, children);
});

Drawer.displayName = 'Drawer';

export default Drawer;
