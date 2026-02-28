import React, { useEffect, useRef } from 'react';

type ProgressProps = React.HTMLAttributes<HTMLElement> & {
  value?: number | string;
  buffer?: number | string;
  max?: number | string;
  min?: number | string;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
  format?: 'percent' | 'value' | 'fraction';
  precision?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'solid' | 'soft' | 'line' | 'glass' | 'contrast';
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  shape?: 'round' | 'pill' | 'square';
  mode?: 'line' | 'circle' | 'radial';
  onValueChange?: (detail: {
    value: number;
    buffer: number;
    max: number;
    min: number;
    percent: number;
    bufferPercent: number;
  }) => void;
  onComplete?: (detail: { value: number; max: number }) => void;
};

export const Progress = React.forwardRef<HTMLElement, ProgressProps>(function Progress(
  {
    value,
    buffer,
    max,
    min,
    indeterminate,
    striped,
    animated,
    showLabel,
    label,
    format,
    precision,
    size,
    variant,
    tone,
    shape,
    mode,
    onValueChange,
    onComplete,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (detail) onValueChange?.(detail);
    };
    const completeHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value: number; max: number }>).detail;
      if (detail) onComplete?.(detail);
    };
    el.addEventListener('change', changeHandler as EventListener);
    el.addEventListener('complete', completeHandler as EventListener);
    return () => {
      el.removeEventListener('change', changeHandler as EventListener);
      el.removeEventListener('complete', completeHandler as EventListener);
    };
  }, [onValueChange, onComplete]);

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

    const syncBooleanAttr = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('value', value != null ? String(value) : null);
    syncAttr('buffer', buffer != null ? String(buffer) : null);
    syncAttr('max', max != null ? String(max) : null);
    syncAttr('min', min != null ? String(min) : null);

    syncBooleanAttr('indeterminate', indeterminate);
    syncBooleanAttr('striped', striped);
    syncBooleanAttr('animated', animated);
    syncBooleanAttr('show-label', showLabel);

    syncAttr('label', label != null && label !== '' ? label : null);
    syncAttr('format', format != null && format !== 'percent' ? format : null);
    syncAttr('precision', precision != null ? String(precision) : null);

    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('shape', shape && shape !== 'pill' ? shape : null);
    syncAttr('mode', mode && mode !== 'line' ? mode : null);
  }, [value, buffer, max, min, indeterminate, striped, animated, showLabel, label, format, precision, size, variant, tone, shape, mode]);

  return React.createElement('ui-progress', { ref, ...rest }, children);
});

Progress.displayName = 'Progress';
