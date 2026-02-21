import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

type CheckedDetail = {
  checked?: boolean;
  indeterminate?: boolean;
};

export interface CheckboxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onInput'> {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  loading?: boolean;
  headless?: boolean;
  invalid?: boolean;
  density?: 'default' | 'compact' | 'comfortable';
  preset?: 'default' | 'admin';
  onCheckedChange?: (checked: boolean, detail: CheckedDetail) => void;
  onChange?: (event: CustomEvent<CheckedDetail>) => void;
  onInput?: (event: CustomEvent<CheckedDetail>) => void;
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null) {
    element.removeAttribute(name);
    return;
  }
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function setStringAttribute(element: HTMLElement, name: string, value: string | undefined, fallback?: string) {
  const next = value && value !== fallback ? value : undefined;
  if (!next) {
    element.removeAttribute(name);
    return;
  }
  element.setAttribute(name, next);
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    checked,
    disabled,
    indeterminate,
    loading,
    headless,
    invalid,
    density,
    preset,
    onCheckedChange,
    onChange,
    onInput,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-checkbox', 'Checkbox');
  }, []);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setBooleanAttribute(element, 'checked', checked);
    setBooleanAttribute(element, 'disabled', disabled);
    setBooleanAttribute(element, 'indeterminate', indeterminate);
    setBooleanAttribute(element, 'loading', loading);
    setBooleanAttribute(element, 'headless', headless);
    setBooleanAttribute(element, 'invalid', invalid);
    setStringAttribute(element, 'density', density, 'default');
    setStringAttribute(element, 'preset', preset, 'default');
  }, [checked, disabled, indeterminate, loading, headless, invalid, density, preset]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onCheckedChange && !onChange && !onInput)) return;

    const handleInput = (event: Event) => {
      const custom = event as CustomEvent<CheckedDetail>;
      onInput?.(custom);
      if (typeof custom.detail?.checked === 'boolean') {
        onCheckedChange?.(custom.detail.checked, custom.detail);
      }
    };

    const handleChange = (event: Event) => {
      const custom = event as CustomEvent<CheckedDetail>;
      onChange?.(custom);
    };

    element.addEventListener('input', handleInput as EventListener);
    element.addEventListener('change', handleChange as EventListener);
    return () => {
      element.removeEventListener('input', handleInput as EventListener);
      element.removeEventListener('change', handleChange as EventListener);
    };
  }, [onCheckedChange, onChange, onInput]);

  const hostProps: Record<string, unknown> = {
    ref,
    ...rest,
    checked: checked ? '' : undefined,
    disabled: disabled ? '' : undefined,
    indeterminate: indeterminate ? '' : undefined,
    loading: loading ? '' : undefined,
    headless: headless ? '' : undefined,
    invalid: invalid ? '' : undefined,
    density: density && density !== 'default' ? density : undefined,
    preset: preset && preset !== 'default' ? preset : undefined,
  };

  return React.createElement('ui-checkbox', hostProps, children);
});

Checkbox.displayName = 'Checkbox';
