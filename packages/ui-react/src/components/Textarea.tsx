import React, { useEffect, useImperativeHandle, useRef } from 'react';

type TextareaDetail = {
  value: string;
  length: number;
  name: string;
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type TextareaProps = BaseProps & {
  value?: string;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onDebouncedInput?: (value: string) => void;
  onClear?: () => void;
  clearable?: boolean;
  debounce?: number;
  validation?: 'error' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  minlength?: number;
  maxlength?: number;
  rows?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placeholder?: string;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  variant?: 'classic' | 'surface' | 'soft' | 'filled' | 'ghost' | 'contrast';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
  autosize?: boolean;
  maxRows?: number;
  showCount?: boolean;
  density?: 'compact' | 'default' | 'comfortable';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  headless?: boolean;
};

export const Textarea = React.forwardRef<HTMLElement, TextareaProps>(function Textarea(
  {
    value,
    onChange,
    onInput,
    onDebouncedInput,
    onClear,
    clearable,
    debounce,
    validation,
    size,
    minlength,
    maxlength,
    rows,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    resize,
    variant,
    color,
    radius,
    label,
    description,
    autosize,
    maxRows,
    showCount,
    density,
    tone,
    headless,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inputHandler = (event: Event) => {
      const detail = (event as CustomEvent<TextareaDetail>).detail;
      if (detail) onInput?.(detail.value);
    };

    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<TextareaDetail>).detail;
      if (detail) onChange?.(detail.value);
    };

    const debouncedHandler = (event: Event) => {
      const detail = (event as CustomEvent<TextareaDetail>).detail;
      if (detail) onDebouncedInput?.(detail.value);
    };

    const clearHandler = () => onClear?.();

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);
    el.addEventListener('debounced-input', debouncedHandler as EventListener);
    el.addEventListener('clear', clearHandler as EventListener);

    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
      el.removeEventListener('debounced-input', debouncedHandler as EventListener);
      el.removeEventListener('clear', clearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onClear]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (attr: string, next: string | null) => {
      const current = el.getAttribute(attr);
      if (next == null) {
        if (current != null) el.removeAttribute(attr);
        return;
      }
      if (current !== next) el.setAttribute(attr, next);
    };

    const syncBool = (attr: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(attr, '');
      else syncAttr(attr, null);
    };

    syncAttr('value', value != null ? String(value) : null);

    syncBool('clearable', clearable);
    syncBool('readonly', readOnly);
    syncBool('autofocus', autofocus);
    syncBool('disabled', disabled);
    syncBool('required', required);
    syncBool('autosize', autosize);
    syncBool('show-count', showCount);
    syncBool('headless', headless);

    syncAttr('debounce', typeof debounce === 'number' && Number.isFinite(debounce) ? String(debounce) : null);
    syncAttr('validation', validation && validation !== 'none' ? validation : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? String(size) : null);
    syncAttr('minlength', typeof minlength === 'number' ? String(minlength) : null);
    syncAttr('maxlength', typeof maxlength === 'number' ? String(maxlength) : null);
    syncAttr('rows', typeof rows === 'number' ? String(rows) : null);
    syncAttr('name', name || null);
    syncAttr('placeholder', placeholder || null);
    syncAttr('resize', resize || null);
    syncAttr('variant', variant && variant !== 'classic' ? variant : null);
    syncAttr('color', color || null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('label', label || null);
    syncAttr('description', description || null);
    syncAttr('max-rows', typeof maxRows === 'number' ? String(maxRows) : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
  }, [
    value,
    clearable,
    debounce,
    validation,
    size,
    minlength,
    maxlength,
    rows,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    resize,
    variant,
    color,
    radius,
    label,
    description,
    autosize,
    maxRows,
    showCount,
    density,
    tone,
    headless
  ]);

  return React.createElement('ui-textarea', { ref, ...rest }, children);
});

Textarea.displayName = 'Textarea';

export default Textarea;
