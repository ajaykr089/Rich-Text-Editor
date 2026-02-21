import React, { useEffect, useImperativeHandle, useRef } from 'react';

type SliderValueDetail = {
  value: number;
  valueStart: number;
  valueEnd: number;
  range: boolean;
  min: number;
  max: number;
  step: number;
  percent: number;
  percentStart: number;
  percentEnd: number;
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type SliderProps = BaseProps & {
  value?: number;
  valueStart?: number;
  valueEnd?: number;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  disabled?: boolean;
  headless?: boolean;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'glass' | 'contrast' | 'minimal';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  format?: 'value' | 'percent' | 'range';
  label?: string;
  description?: string;
  marks?: Array<number | { value: number; label?: string }>;
  name?: string;
  nameStart?: string;
  nameEnd?: string;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
  onValueChange?: (detail: SliderValueDetail) => void;
};

export const Slider = React.forwardRef<HTMLElement, SliderProps>(function Slider(
  {
    children,
    value,
    valueStart,
    valueEnd,
    min,
    max,
    step,
    range,
    disabled,
    headless,
    orientation,
    size,
    variant,
    tone,
    showValue,
    format,
    label,
    description,
    marks,
    name,
    nameStart,
    nameEnd,
    onInput,
    onChange,
    onValueChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleInput = (event: Event) => {
      const detail = (event as CustomEvent<SliderValueDetail>).detail;
      if (!detail) return;
      onInput?.(Number(detail.value));
      onValueChange?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<SliderValueDetail>).detail;
      if (!detail) return;
      onChange?.(Number(detail.value));
      onValueChange?.(detail);
    };

    el.addEventListener('input', handleInput as EventListener);
    el.addEventListener('change', handleChange as EventListener);

    return () => {
      el.removeEventListener('input', handleInput as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onInput, onChange, onValueChange]);

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

    syncAttr('value', typeof value === 'number' && Number.isFinite(value) ? String(value) : null);
    syncAttr('value-start', typeof valueStart === 'number' && Number.isFinite(valueStart) ? String(valueStart) : null);
    syncAttr('value-end', typeof valueEnd === 'number' && Number.isFinite(valueEnd) ? String(valueEnd) : null);

    syncAttr('min', typeof min === 'number' && Number.isFinite(min) ? String(min) : null);
    syncAttr('max', typeof max === 'number' && Number.isFinite(max) ? String(max) : null);
    syncAttr('step', typeof step === 'number' && Number.isFinite(step) ? String(step) : null);

    syncBool('range', range);
    syncBool('disabled', disabled);
    syncBool('headless', headless);

    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);

    if (typeof showValue === 'boolean') syncAttr('show-value', showValue ? 'true' : 'false');
    else syncAttr('show-value', null);

    syncAttr('format', format ? format : null);
    syncAttr('label', label ? label : null);
    syncAttr('description', description ? description : null);
    syncAttr('name', name ? name : null);
    syncAttr('name-start', nameStart ? nameStart : null);
    syncAttr('name-end', nameEnd ? nameEnd : null);

    if (marks && marks.length) {
      try {
        syncAttr('marks', JSON.stringify(marks));
      } catch {
        syncAttr('marks', null);
      }
    } else {
      syncAttr('marks', null);
    }
  }, [
    value,
    valueStart,
    valueEnd,
    min,
    max,
    step,
    range,
    disabled,
    headless,
    orientation,
    size,
    variant,
    tone,
    showValue,
    format,
    label,
    description,
    marks,
    name,
    nameStart,
    nameEnd
  ]);

  return React.createElement('ui-slider', { ref, ...rest }, children);
});

Slider.displayName = 'Slider';

export default Slider;
