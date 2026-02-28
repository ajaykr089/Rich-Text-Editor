import React, { useEffect, useRef } from 'react';

type ComboboxProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onInput?: (query: string) => void;
  onDebouncedInput?: (query: string) => void;
  onSelect?: (value: string, label: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onClear?: () => void;
  clearable?: boolean;
  debounce?: number;
  validation?: 'error' | 'success' | 'none';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  maxlength?: number;
  readOnly?: boolean;
  autofocus?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placeholder?: string;
  variant?: 'classic' | 'surface' | 'soft';
  radius?: 'none' | 'large' | 'full' | string;
  label?: string;
  description?: string;
  emptyText?: string;
  noFilter?: boolean;
  allowCustom?: boolean;
};

export function Combobox(props: ComboboxProps) {
  const {
    value,
    onChange,
    onInput,
    onDebouncedInput,
    onSelect,
    onOpen,
    onClose,
    onClear,
    clearable,
    debounce,
    validation,
    size,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    variant,
    radius,
    label,
    description,
    emptyText,
    noFilter,
    allowCustom,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onInputHandler = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') onInput?.(query);
    };

    const onChangeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ value?: string }>).detail?.value;
      if (typeof next === 'string') onChange?.(next);
    };

    const onDebouncedHandler = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') onDebouncedInput?.(query);
    };

    const onSelectHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ value?: string; label?: string }>).detail;
      if (typeof detail?.value === 'string') onSelect?.(detail.value, detail.label || detail.value);
    };

    const onOpenHandler = () => onOpen?.();
    const onCloseHandler = () => onClose?.();
    const onClearHandler = () => onClear?.();

    el.addEventListener('input', onInputHandler as EventListener);
    el.addEventListener('change', onChangeHandler as EventListener);
    el.addEventListener('debounced-input', onDebouncedHandler as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    el.addEventListener('open', onOpenHandler as EventListener);
    el.addEventListener('close', onCloseHandler as EventListener);
    el.addEventListener('clear', onClearHandler as EventListener);

    return () => {
      el.removeEventListener('input', onInputHandler as EventListener);
      el.removeEventListener('change', onChangeHandler as EventListener);
      el.removeEventListener('debounced-input', onDebouncedHandler as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
      el.removeEventListener('open', onOpenHandler as EventListener);
      el.removeEventListener('close', onCloseHandler as EventListener);
      el.removeEventListener('clear', onClearHandler as EventListener);
    };
  }, [onChange, onInput, onDebouncedInput, onSelect, onOpen, onClose, onClear]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (clearable) el.setAttribute('clearable', '');
    else el.removeAttribute('clearable');

    if (typeof debounce === 'number' && Number.isFinite(debounce)) el.setAttribute('debounce', String(debounce));
    else el.removeAttribute('debounce');

    if (validation && validation !== 'none') el.setAttribute('validation', validation);
    else el.removeAttribute('validation');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', String(size));
    else el.removeAttribute('size');

    if (typeof maxlength === 'number') el.setAttribute('maxlength', String(maxlength));
    else el.removeAttribute('maxlength');

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

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (radius) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (emptyText) el.setAttribute('empty-text', emptyText);
    else el.removeAttribute('empty-text');

    if (noFilter) el.setAttribute('no-filter', '');
    else el.removeAttribute('no-filter');

    if (allowCustom) el.setAttribute('allow-custom', '');
    else el.removeAttribute('allow-custom');
  }, [
    clearable,
    debounce,
    validation,
    size,
    maxlength,
    readOnly,
    autofocus,
    disabled,
    name,
    required,
    placeholder,
    variant,
    radius,
    label,
    description,
    emptyText,
    noFilter,
    allowCustom
  ]);

  return React.createElement('ui-combobox', { ref, value, ...rest }, children);
}

export default Combobox;
