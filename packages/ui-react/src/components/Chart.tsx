import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type ChartPoint = { label: string; value: number; tone?: string };

export type ChartProps = React.HTMLAttributes<HTMLElement> & {
  data?: ChartPoint[];
  values?: number[];
  labels?: string[];
  type?: 'line' | 'area' | 'bar' | 'donut';
  variant?: 'default' | 'contrast' | 'minimal';
  title?: string;
  subtitle?: string;
  headless?: boolean;
};

export const Chart = React.forwardRef<HTMLElement, ChartProps>(function Chart(
  { data, values, labels, type, variant, title, subtitle, headless, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

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

    if (data && data.length) {
      try {
        syncAttr('data', JSON.stringify(data));
      } catch {
        syncAttr('data', null);
      }
    } else {
      syncAttr('data', null);
    }

    if (values && values.length) syncAttr('values', values.join(','));
    else syncAttr('values', null);

    if (labels && labels.length) syncAttr('labels', labels.join(','));
    else syncAttr('labels', null);

    syncAttr('type', type && type !== 'line' ? type : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('title', title || null);
    syncAttr('subtitle', subtitle || null);
    syncBool('headless', headless);
  }, [data, values, labels, type, variant, title, subtitle, headless]);

  return React.createElement('ui-chart', { ref, ...rest }, children);
});

Chart.displayName = 'Chart';

export default Chart;
