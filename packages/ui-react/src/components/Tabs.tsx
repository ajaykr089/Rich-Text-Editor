import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type TabsProps = Props & { onChange?: (idx: number) => void };

export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  { children, onChange, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e: Event) => {
      const selected = (e as CustomEvent<{ selected?: number }>).detail?.selected;
      if (typeof selected === 'number') onChange?.(selected);
    };
    el.addEventListener('change', h as EventListener);
    return () => el.removeEventListener('change', h as EventListener);
  }, [onChange]);
  return React.createElement('ui-tabs', { ref, ...rest }, children);
});

Tabs.displayName = 'Tabs';

export default Tabs;
