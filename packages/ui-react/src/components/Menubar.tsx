import React, { useEffect, useRef } from 'react';

export type MenubarChangeDetail = {
  selected: number;
  previous: number;
  open: boolean;
  reason: 'click' | 'keyboard' | 'programmatic';
};

export type MenubarProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  selected?: number;
  open?: boolean;
  loop?: boolean;
  headless?: boolean;
  orientation?: 'horizontal' | 'vertical';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'solid' | 'flat' | 'line' | 'glass' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success' | 'warning';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onChange?: (detail: MenubarChangeDetail) => void;
  onOpen?: (selected: number) => void;
  onClose?: () => void;
  onSelect?: (detail: { selected?: number; index?: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void;
};

export function Menubar(props: MenubarProps) {
  const {
    selected,
    open,
    loop,
    headless,
    orientation,
    placement,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead,
    onChange,
    onOpen,
    onClose,
    onSelect,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<MenubarChangeDetail>).detail;
      if (detail) onChange?.(detail);
    };
    const onOpenHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ selected?: number }>).detail;
      if (typeof detail?.selected === 'number') onOpen?.(detail.selected);
      else onOpen?.(-1);
    };
    const onCloseHandler = () => onClose?.();
    const onSelectHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ selected?: number; index?: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }>).detail;
      if (detail) onSelect?.(detail);
    };

    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    return () => {
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
    };
  }, [onChange, onOpen, onClose, onSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof selected === 'number') el.setAttribute('selected', String(selected));
    else el.removeAttribute('selected');

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    } else el.removeAttribute('open');

    if (typeof loop === 'boolean') el.setAttribute('loop', String(loop));
    else el.removeAttribute('loop');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (orientation && orientation !== 'horizontal') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');

    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (closeOnSelect == null) el.removeAttribute('close-on-select');
    else el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');

    if (typeahead == null) el.removeAttribute('typeahead');
    else el.setAttribute('typeahead', typeahead ? 'true' : 'false');
  }, [
    selected,
    open,
    loop,
    headless,
    orientation,
    placement,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead
  ]);

  return React.createElement('ui-menubar', { ref, ...rest }, children);
}

export default Menubar;
