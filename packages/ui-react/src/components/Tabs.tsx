import React, { useEffect, useImperativeHandle, useRef } from 'react';

type TabsDetail = {
  selected: number;
  index: number;
  value: string;
  label: string;
  tabId: string;
  panelId: string;
};

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type TabsProps = BaseProps & {
  selected?: number | string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'auto' | 'manual';
  variant?: 'default' | 'soft' | 'contrast' | 'minimal' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  stretched?: boolean;
  headless?: boolean;
  onChange?: (index: number) => void;
  onTabChange?: (detail: TabsDetail) => void;
};

export const Tabs = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  {
    children,
    selected,
    value,
    orientation,
    activation,
    variant,
    size,
    tone,
    stretched,
    headless,
    onChange,
    onTabChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handle = (event: Event) => {
      const detail = (event as CustomEvent<TabsDetail>).detail;
      if (!detail) return;
      onChange?.(detail.index);
      onTabChange?.(detail);
    };

    el.addEventListener('change', handle as EventListener);

    return () => {
      el.removeEventListener('change', handle as EventListener);
    };
  }, [onChange, onTabChange]);

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

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncAttr('selected', selected != null ? String(selected) : null);
    syncAttr('value', value || null);
    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('activation', activation && activation !== 'auto' ? activation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncBool('stretched', stretched);
    syncBool('headless', headless);
  }, [selected, value, orientation, activation, variant, size, tone, stretched, headless]);

  return React.createElement('ui-tabs', { ref, ...rest }, children);
});

Tabs.displayName = 'Tabs';

export default Tabs;
