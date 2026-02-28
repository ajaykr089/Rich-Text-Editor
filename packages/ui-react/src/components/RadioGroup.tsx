import React, { useEffect, useRef } from 'react';

type RadioOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type RadioGroupProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'card' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  options?: Array<RadioOption | string>;
  onValueChange?: (detail: {
    value: string;
    option?: RadioOption;
    reason?: 'click' | 'keyboard';
    name?: string;
  }) => void;
};

export const RadioGroup = React.forwardRef<HTMLElement, RadioGroupProps>(function RadioGroup(
  {
    value,
    disabled,
    required,
    name,
    orientation,
    variant,
    size,
    tone,
    options,
    onValueChange,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      if (detail) onValueChange?.(detail);
    };
    el.addEventListener('change', handler as EventListener);
    return () => el.removeEventListener('change', handler as EventListener);
  }, [onValueChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (key: string, next: string | null) => {
      const current = el.getAttribute(key);
      if (next == null) {
        if (current != null) el.removeAttribute(key);
        return;
      }
      if (current !== next) el.setAttribute(key, next);
    };

    const syncBool = (key: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(key)) el.setAttribute(key, '');
      } else if (el.hasAttribute(key)) {
        el.removeAttribute(key);
      }
    };

    syncAttr('value', value != null ? value : null);
    syncBool('disabled', disabled);
    syncBool('required', required);
    syncAttr('name', name || null);

    syncAttr('orientation', orientation && orientation !== 'vertical' ? orientation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);

    if (options && options.length) {
      syncAttr('options', JSON.stringify(options));
    } else {
      syncAttr('options', null);
    }
  }, [value, disabled, required, name, orientation, variant, size, tone, options]);

  return React.createElement('ui-radio-group', { ref, ...rest }, children);
});

RadioGroup.displayName = 'RadioGroup';
