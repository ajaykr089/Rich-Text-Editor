import React, { useEffect, useImperativeHandle, useRef } from 'react';

type SidebarSelectDetail = {
  index: number;
  value: string;
  label: string;
};

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  collapsed?: boolean;
  collapsible?: boolean;
  position?: 'left' | 'right';
  value?: string;
  onSelect?: (detail: SidebarSelectDetail) => void;
  onToggle?: (collapsed: boolean) => void;
};

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { children, collapsed, collapsible, position, value, onSelect, onToggle, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<SidebarSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleToggle = (event: Event) => {
      const next = (event as CustomEvent<{ collapsed?: boolean }>).detail?.collapsed;
      if (typeof next === 'boolean') onToggle?.(next);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('toggle', handleToggle as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('toggle', handleToggle as EventListener);
    };
  }, [onSelect, onToggle]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (collapsed) el.setAttribute('collapsed', '');
    else el.removeAttribute('collapsed');
  }, [collapsed]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (collapsible) el.setAttribute('collapsible', '');
    else el.removeAttribute('collapsible');
  }, [collapsible]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (position) el.setAttribute('position', position);
    else el.removeAttribute('position');
  }, [position]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value != null && value !== '') el.setAttribute('value', value);
    else el.removeAttribute('value');
  }, [value]);

  return React.createElement('ui-sidebar', { ref, ...rest }, children);
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
