import React, { useEffect, useRef } from 'react';

export type NavigationMenuChangeDetail = {
  selected: number;
  previous: number;
  reason: 'click' | 'keyboard' | 'programmatic';
};

export type NavigationMenuProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  selected?: number;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'automatic' | 'manual';
  loop?: boolean;
  collapsible?: boolean;
  headless?: boolean;
  onChange?: (detail: NavigationMenuChangeDetail) => void;
  onSelect?: (selected: number) => void;
};

export function NavigationMenu(props: NavigationMenuProps) {
  const {
    selected,
    orientation,
    activation,
    loop,
    collapsible,
    headless,
    onChange,
    onSelect,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<NavigationMenuChangeDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
      onSelect?.(detail.selected);
    };

    el.addEventListener('change', onChangeHandler as EventListener);
    return () => el.removeEventListener('change', onChangeHandler as EventListener);
  }, [onChange, onSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof selected === 'number') el.setAttribute('selected', String(selected));
    else el.removeAttribute('selected');

    if (orientation) el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');

    if (activation) el.setAttribute('activation', activation);
    else el.removeAttribute('activation');

    if (typeof loop === 'boolean') el.setAttribute('loop', String(loop));
    else el.removeAttribute('loop');

    if (collapsible) el.setAttribute('collapsible', '');
    else el.removeAttribute('collapsible');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [selected, orientation, activation, loop, collapsible, headless]);

  return React.createElement('ui-navigation-menu', { ref, ...rest }, children);
}

export default NavigationMenu;
