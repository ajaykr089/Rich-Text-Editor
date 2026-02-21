import React, { useEffect, useImperativeHandle, useRef } from 'react';

type ToggleDetail = {
  pressed: boolean;
  value: string;
  name: string;
  required: boolean;
};

export type ToggleProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> & {
  pressed?: boolean;
  disabled?: boolean;
  loading?: boolean;
  headless?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'soft' | 'outline' | 'contrast' | 'minimal';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  name?: string;
  value?: string;
  required?: boolean;
  iconOn?: string;
  iconOff?: string;
  onInput?: (detail: ToggleDetail) => void;
  onChange?: (detail: ToggleDetail) => void;
};

export const Toggle = React.forwardRef<HTMLElement, ToggleProps>(function Toggle(
  {
    children,
    pressed,
    disabled,
    loading,
    headless,
    size,
    variant,
    tone,
    name,
    value,
    required,
    iconOn,
    iconOff,
    onInput,
    onChange,
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
      const detail = (event as CustomEvent<ToggleDetail>).detail;
      if (detail) onInput?.(detail);
    };

    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<ToggleDetail>).detail;
      if (detail) onChange?.(detail);
    };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onInput, onChange]);

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

    syncBool('pressed', pressed);
    syncBool('disabled', disabled);
    syncBool('loading', loading);
    syncBool('headless', headless);
    syncBool('required', required);

    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('name', name || null);
    syncAttr('value', value || null);
    syncAttr('icon-on', iconOn || null);
    syncAttr('icon-off', iconOff || null);
  }, [pressed, disabled, loading, headless, required, size, variant, tone, name, value, iconOn, iconOff]);

  return React.createElement('ui-toggle', { ref, ...rest }, children);
});

Toggle.displayName = 'Toggle';

export default Toggle;
