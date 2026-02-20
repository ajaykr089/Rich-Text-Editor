import React, { useEffect, useRef } from 'react';

type BaseProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export type SelectProps = BaseProps & {
  value?: string;
  disabled?: boolean;
  headless?: boolean;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
};

export const Select = React.forwardRef<HTMLElement, SelectProps>(function Select(
  { children, value, disabled, headless, onChange, onInput, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inputHandler = (event: Event) => {
      const next =
        (event as CustomEvent<{ value?: string }>).detail?.value ??
        ((event.target as HTMLSelectElement | null)?.value || '');
      onInput?.(next);
    };

    const changeHandler = (event: Event) => {
      const next =
        (event as CustomEvent<{ value?: string }>).detail?.value ??
        ((event.target as HTMLSelectElement | null)?.value || '');
      onChange?.(next);
    };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onChange, onInput]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof value === 'string') el.setAttribute('value', value);
    else el.removeAttribute('value');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [value, disabled, headless]);

  return React.createElement('ui-select', { ref, ...rest }, children);
});

Select.displayName = 'Select';

export default Select;
