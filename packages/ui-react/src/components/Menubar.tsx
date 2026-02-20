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
  onChange?: (detail: MenubarChangeDetail) => void;
  onOpen?: (selected: number) => void;
  onClose?: () => void;
};

export function Menubar(props: MenubarProps) {
  const {
    selected,
    open,
    loop,
    headless,
    onChange,
    onOpen,
    onClose,
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

    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    return () => {
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
    };
  }, [onChange, onOpen, onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof selected === 'number') el.setAttribute('selected', String(selected));
    else el.removeAttribute('selected');

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    }

    if (typeof loop === 'boolean') el.setAttribute('loop', String(loop));
    else el.removeAttribute('loop');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [selected, open, loop, headless]);

  return React.createElement('ui-menubar', { ref, ...rest }, children);
}

export default Menubar;
