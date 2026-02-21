import React, { useEffect, useImperativeHandle, useRef } from 'react';

type SidebarItemInput = {
  value?: string;
  label?: string;
  icon?: string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
};

type SidebarSelectDetail = {
  index: number;
  value: string;
  label: string;
  item?: SidebarItemInput;
};

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  collapsed?: boolean;
  collapsible?: boolean;
  rail?: boolean;
  position?: 'left' | 'right';
  value?: string;
  items?: SidebarItemInput[];
  variant?: 'surface' | 'soft' | 'floating' | 'contrast' | 'minimal' | 'split';
  size?: 'sm' | 'md' | 'lg';
  density?: 'compact' | 'default' | 'comfortable';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  showIcons?: boolean;
  showBadges?: boolean;
  headless?: boolean;
  onSelect?: (detail: SidebarSelectDetail) => void;
  onChange?: (detail: SidebarSelectDetail) => void;
  onToggle?: (collapsed: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
};

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    children,
    collapsed,
    collapsible,
    rail,
    position,
    value,
    items,
    variant,
    size,
    density,
    tone,
    showIcons,
    showBadges,
    headless,
    onSelect,
    onChange,
    onToggle,
    onCollapseChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<SidebarSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<SidebarSelectDetail>).detail;
      if (detail) onChange?.(detail);
    };

    const handleToggle = (event: Event) => {
      const next = (event as CustomEvent<{ collapsed?: boolean }>).detail?.collapsed;
      if (typeof next === 'boolean') onToggle?.(next);
    };

    const handleCollapseChange = (event: Event) => {
      const next = (event as CustomEvent<{ collapsed?: boolean }>).detail?.collapsed;
      if (typeof next === 'boolean') onCollapseChange?.(next);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('toggle', handleToggle as EventListener);
    el.addEventListener('collapse-change', handleCollapseChange as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('toggle', handleToggle as EventListener);
      el.removeEventListener('collapse-change', handleCollapseChange as EventListener);
    };
  }, [onSelect, onChange, onToggle, onCollapseChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined, defaultValue?: boolean) => {
      if (enabled == null) {
        if (defaultValue !== undefined && defaultValue === false) syncAttr(name, null);
        return;
      }
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncBool('collapsed', collapsed);
    syncBool('collapsible', collapsible);
    syncBool('rail', rail);
    syncBool('headless', headless);

    syncAttr('position', position && position !== 'left' ? position : null);
    syncAttr('value', value != null && value !== '' ? String(value) : null);

    if (items && items.length) {
      try {
        syncAttr('items', JSON.stringify(items));
      } catch {
        syncAttr('items', null);
      }
    } else {
      syncAttr('items', null);
    }

    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);

    if (typeof showIcons === 'boolean') syncAttr('show-icons', showIcons ? 'true' : 'false');
    else syncAttr('show-icons', null);

    if (typeof showBadges === 'boolean') syncAttr('show-badges', showBadges ? 'true' : 'false');
    else syncAttr('show-badges', null);
  }, [collapsed, collapsible, rail, headless, position, value, items, variant, size, density, tone, showIcons, showBadges]);

  return React.createElement('ui-sidebar', { ref, ...rest }, children);
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
