import React, { useEffect, useRef } from 'react';

type BaseProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export type SliderProps = BaseProps & {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  headless?: boolean;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
};

export const Slider = React.forwardRef<HTMLElement, SliderProps>(function Slider(
  { children, value, min, max, step, disabled, headless, onChange, onInput, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inputHandler = (event: Event) => {
      const raw =
        (event as CustomEvent<{ value?: number }>).detail?.value ??
        Number((event.target as HTMLInputElement | null)?.value ?? 0);
      onInput?.(Number(raw));
    };

    const changeHandler = (event: Event) => {
      const raw =
        (event as CustomEvent<{ value?: number }>).detail?.value ??
        Number((event.target as HTMLInputElement | null)?.value ?? 0);
      onChange?.(Number(raw));
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

    if (typeof value === 'number' && Number.isFinite(value)) el.setAttribute('value', String(value));
    else el.removeAttribute('value');

    if (typeof min === 'number' && Number.isFinite(min)) el.setAttribute('min', String(min));
    else el.removeAttribute('min');

    if (typeof max === 'number' && Number.isFinite(max)) el.setAttribute('max', String(max));
    else el.removeAttribute('max');

    if (typeof step === 'number' && Number.isFinite(step)) el.setAttribute('step', String(step));
    else el.removeAttribute('step');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [value, min, max, step, disabled, headless]);

  return React.createElement('ui-slider', { ref, ...rest }, children);
});

Slider.displayName = 'Slider';

export default Slider;
