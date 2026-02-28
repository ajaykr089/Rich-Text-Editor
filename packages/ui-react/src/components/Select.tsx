import React, { useEffect, useImperativeHandle, useRef } from 'react';

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  children?: React.ReactNode;
};

export type SelectProps = BaseProps & {
  value?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  headless?: boolean;
  placeholder?: string;
  name?: string;
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft' | 'filled' | 'glass' | 'contrast';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  radius?: 'none' | 'large' | 'full' | string;
  validation?: 'none' | 'success' | 'warning' | 'error';
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
  onValueChange?: (value: string) => void;
};

export const Select = React.forwardRef<HTMLElement, SelectProps>(function Select(
  {
    children,
    value,
    disabled,
    required,
    invalid,
    headless,
    placeholder,
    name,
    label,
    description,
    error,
    size,
    variant,
    tone,
    density,
    radius,
    validation,
    onChange,
    onInput,
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

    const resolveValue = (event: Event) =>
      (event as CustomEvent<{ value?: string }>).detail?.value ??
      ((event.target as HTMLSelectElement | null)?.value ?? '');

    const inputHandler = (event: Event) => {
      onInput?.(resolveValue(event));
    };

    const changeHandler = (event: Event) => {
      const next = resolveValue(event);
      onChange?.(next);
      onValueChange?.(next);
    };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);
    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onChange, onInput, onValueChange]);

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

    const syncBoolean = (attr: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(attr)) el.setAttribute(attr, '');
      } else if (el.hasAttribute(attr)) {
        el.removeAttribute(attr);
      }
    };

    syncAttr('value', value != null ? String(value) : null);
    syncBoolean('disabled', disabled);
    syncBoolean('required', required);
    syncBoolean('headless', headless);
    syncBoolean('invalid', invalid);

    syncAttr('placeholder', placeholder ? placeholder : null);
    syncAttr('name', name ? name : null);
    syncAttr('label', label ? label : null);
    syncAttr('description', description ? description : null);
    syncAttr('error', error ? error : null);

    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('variant', variant && variant !== 'classic' ? variant : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('validation', validation && validation !== 'none' ? validation : null);
  }, [
    value,
    disabled,
    required,
    invalid,
    headless,
    placeholder,
    name,
    label,
    description,
    error,
    size,
    variant,
    tone,
    density,
    radius,
    validation
  ]);

  return React.createElement('ui-select', { ref, ...rest }, children);
});

Select.displayName = 'Select';

export default Select;
