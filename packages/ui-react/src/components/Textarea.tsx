import React, { useEffect, useRef } from 'react';

type TextareaProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
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
  variant?: 'classic' | 'surface' | 'soft';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
};

export function Textarea(props: TextareaProps) {
  const {
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
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onInputHandler = (event: Event) => {
      const next = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (typeof next === 'string') onInput?.(next);
    };

    const onChangeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (typeof next === 'string') onChange?.(next);
    };

    const onDebouncedHandler = (event: Event) => {
      const next = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (typeof next === 'string') onDebouncedInput?.(next);
    };

    const onClearHandler = () => onClear?.();

    el.addEventListener('input', onInputHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('debounced-input', onDebouncedHandler as EventListener);
    el.addEventListener('clear', onClearHandler as EventListener);

    return () => {
      el.removeEventListener('input', onInputHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('debounced-input', onDebouncedHandler as EventListener);
      el.removeEventListener('clear', onClearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onClear]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (clearable) el.setAttribute('clearable', '');
    else el.removeAttribute('clearable');

    if (typeof debounce === 'number' && Number.isFinite(debounce)) el.setAttribute('debounce', String(debounce));
    else el.removeAttribute('debounce');

    if (validation && validation !== 'none') el.setAttribute('validation', validation);
    else el.removeAttribute('validation');

    if (size && size !== 'md') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (typeof minlength === 'number') el.setAttribute('minlength', String(minlength));
    else el.removeAttribute('minlength');

    if (typeof maxlength === 'number') el.setAttribute('maxlength', String(maxlength));
    else el.removeAttribute('maxlength');

    if (typeof rows === 'number') el.setAttribute('rows', String(rows));
    else el.removeAttribute('rows');

    if (readOnly) el.setAttribute('readonly', '');
    else el.removeAttribute('readonly');

    if (autofocus) el.setAttribute('autofocus', '');
    else el.removeAttribute('autofocus');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (name) el.setAttribute('name', name);
    else el.removeAttribute('name');

    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');

    if (placeholder) el.setAttribute('placeholder', placeholder);
    else el.removeAttribute('placeholder');

    if (resize) el.setAttribute('resize', resize);
    else el.removeAttribute('resize');

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (color) el.setAttribute('color', color);
    else el.removeAttribute('color');

    if (radius) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');
  }, [
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
    description
  ]);

  return React.createElement('ui-textarea', { ref, value, ...rest }, children);
}

export default Textarea;
