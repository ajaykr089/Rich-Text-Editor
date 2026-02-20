import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type MenuProps = Props & { onSelect?: (idx: number) => void };

export const Menu = React.forwardRef<HTMLElement, MenuProps>(function Menu(
  { children, onSelect, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e: Event) => {
      const index = (e as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof index === 'number') onSelect?.(index);
    };
    el.addEventListener('select', h as EventListener);
    return () => el.removeEventListener('select', h as EventListener);
  }, [onSelect]);
  return React.createElement('ui-menu', { ref, ...rest }, children);
});

Menu.displayName = 'Menu';

export default Menu;
