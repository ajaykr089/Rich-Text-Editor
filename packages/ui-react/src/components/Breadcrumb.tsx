import React, { useEffect, useImperativeHandle, useRef } from 'react';

type BreadcrumbSelectDetail = {
  index: number;
  label: string;
  href?: string;
};

type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  separator?: string;
  maxItems?: number;
  onSelect?: (detail: BreadcrumbSelectDetail) => void;
};

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { children, separator, maxItems, onSelect, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onSelect) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<BreadcrumbSelectDetail>).detail;
      if (detail) onSelect(detail);
    };

    el.addEventListener('select', handleSelect as EventListener);
    return () => el.removeEventListener('select', handleSelect as EventListener);
  }, [onSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (separator != null && separator !== '') el.setAttribute('separator', separator);
    else el.removeAttribute('separator');
  }, [separator]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof maxItems === 'number' && Number.isFinite(maxItems)) {
      el.setAttribute('max-items', String(maxItems));
    } else {
      el.removeAttribute('max-items');
    }
  }, [maxItems]);

  return React.createElement('ui-breadcrumb', { ref, ...rest }, children);
});

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
