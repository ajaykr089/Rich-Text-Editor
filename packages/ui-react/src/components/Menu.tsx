import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export type MenuSelectDetail = {
  index?: number;
  value?: string;
  label?: string;
  checked?: boolean;
  item?: HTMLElement;
};

type MenuProps = Props & {
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
  onSelect?: (idx: number) => void;
  onSelectDetail?: (detail: MenuSelectDetail) => void;
};

export const Menu = React.forwardRef<HTMLElement, MenuProps>(function Menu(
  {
    children,
    open,
    placement,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead,
    onOpen,
    onClose,
    onChange,
    onSelect,
    onSelectDetail,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onOpenHandler = () => onOpen?.();
    const onCloseHandler = () => onClose?.();
    const onChangeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };
    const onSelectHandler = (event: Event) => {
      const detail = ((event as CustomEvent<MenuSelectDetail>).detail || {}) as MenuSelectDetail;
      onSelectDetail?.(detail);
      if (typeof detail.index === 'number') onSelect?.(detail.index);
    };
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    return () => {
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
    };
  }, [onOpen, onClose, onChange, onSelect, onSelectDetail]);

  useEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');
  }, [placement]);

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
    if (closeOnSelect == null) {
      el.removeAttribute('close-on-select');
      return;
    }
    el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');
  }, [closeOnSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeahead == null) {
      el.removeAttribute('typeahead');
      return;
    }
    el.setAttribute('typeahead', typeahead ? 'true' : 'false');
  }, [typeahead]);

  return React.createElement('ui-menu', { ref, ...rest }, children);
});

Menu.displayName = 'Menu';

export default Menu;
