import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  value?: string;
  onChange?: (v: string) => void;
  onInput?: (v: string) => void;
  onDebouncedInput?: (v: string) => void;
  onClear?: () => void;
  clearable?: boolean;
  debounce?: number;
  validation?: 'error' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  maxlength?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  /* form props */
  type?: string;
  name?: string;
  required?: boolean;
  pattern?: string;
  inputMode?: string;
  autoComplete?: string;
  /* presentation */
  variant?: 'classic' | 'surface' | 'soft';
  color?: string;
  radius?: 'none' | 'large' | 'full' | string;
  /* convenience */
  label?: string;
  description?: string;
};

export function Input(props: Props) {
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
    maxlength,
    readOnly,
    autofocus,
    disabled,
    /* form attrs */
    type,
    name,
    required,
    pattern,
    inputMode,
    autoComplete,
    /* presentation */
    variant,
    color,
    radius,
    /* convenience */
    label,
    description,
    children,
    ...rest
  } = props as any;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inputHandler = (e: any) => {
      const v = e.detail?.value ?? (e.target && (e.target as HTMLInputElement).value);
      if (onChange) onChange(v);
      if (onInput) onInput(v);
    };

    const debouncedHandler = (e: any) => {
      if (onDebouncedInput) onDebouncedInput(e.detail?.value);
    };

    const clearHandler = () => { if (onClear) onClear(); };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('debounced-input', debouncedHandler as EventListener);
    el.addEventListener('change', inputHandler as EventListener);
    el.addEventListener('clear', clearHandler as EventListener);

    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('debounced-input', debouncedHandler as EventListener);
      el.removeEventListener('change', inputHandler as EventListener);
      el.removeEventListener('clear', clearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onClear]);

  // Reflect attributes for the custom element
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (clearable) el.setAttribute('clearable', ''); else el.removeAttribute('clearable');
    if (typeof debounce !== 'undefined' && debounce !== null) el.setAttribute('debounce', String(debounce)); else el.removeAttribute('debounce');
    if (validation && validation !== 'none') el.setAttribute('validation', validation); else el.removeAttribute('validation');
    // size mapping: accept '1'|'2'|'3' as synonyms
    if (size && size !== 'md') el.setAttribute('size', String(size)); else el.removeAttribute('size');
    if (typeof maxlength !== 'undefined' && maxlength !== null) el.setAttribute('maxlength', String(maxlength)); else el.removeAttribute('maxlength');
    if (readOnly) el.setAttribute('readonly', ''); else el.removeAttribute('readonly');
    if (autofocus) el.setAttribute('autofocus', ''); else el.removeAttribute('autofocus');
    // reflect disabled explicitly so passing disabled={false} enables the input
    if (disabled) el.setAttribute('disabled', ''); else el.removeAttribute('disabled');

    /* reflect form attributes */
    if (type) el.setAttribute('type', type); else el.removeAttribute('type');
    if (name) el.setAttribute('name', name); else el.removeAttribute('name');
    if (required) el.setAttribute('required', ''); else el.removeAttribute('required');
    if (pattern) el.setAttribute('pattern', pattern); else el.removeAttribute('pattern');
    if (inputMode) el.setAttribute('inputmode', inputMode); else el.removeAttribute('inputmode');
    if (autoComplete) el.setAttribute('autocomplete', autoComplete); else el.removeAttribute('autocomplete');

    /* presentation */
    if (variant) el.setAttribute('variant', variant); else el.removeAttribute('variant');
    if (color) el.setAttribute('color', color); else el.removeAttribute('color');
    if (radius) el.setAttribute('radius', String(radius)); else el.removeAttribute('radius');

    /* label/description attrs for convenience */
    if (label) el.setAttribute('label', label); else el.removeAttribute('label');
    if (description) el.setAttribute('description', description); else el.removeAttribute('description');
  }, [
    clearable, debounce, validation, size, maxlength, readOnly, autofocus, disabled,
    type, name, required, pattern, inputMode, autoComplete, variant, color, radius, label, description
  ]);

  return React.createElement('ui-input', { ref, value, ...rest }, children);
}

export default Input;
