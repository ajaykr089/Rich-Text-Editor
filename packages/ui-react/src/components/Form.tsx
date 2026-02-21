import React, { useEffect, useImperativeHandle, useRef } from 'react';

type FormElement = HTMLElement & {
  submit: () => Promise<boolean>;
  requestSubmit?: () => Promise<boolean>;
  validate: () => Promise<{ valid: boolean; errors: Record<string, string | undefined> }>;
  getValues: () => Record<string, any>;
  setValue?: (name: string, value: any) => void;
  setValues?: (values: Record<string, any>) => void;
  reset?: (values?: Record<string, any>) => void;
};

export type FormProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  onSubmit?: (values: Record<string, any>) => void;
  onInvalid?: (errors: Record<string, string | undefined>, values: Record<string, any>) => void;
  onValidate?: (result: { valid: boolean; errors: Record<string, string | undefined> }) => void;
  novalidate?: boolean;
  variant?: 'default' | 'surface' | 'outline' | 'soft' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  gap?: string;
  headless?: boolean;
  loading?: boolean;
};

export const Form = React.forwardRef<HTMLElement, FormProps>(function Form(props, forwardedRef) {
  const {
    children,
    onSubmit,
    onInvalid,
    onValidate,
    novalidate,
    variant,
    tone,
    density,
    shape,
    elevation,
    gap,
    headless,
    loading,
    ...rest
  } = props;

  const ref = useRef<FormElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSubmit = (event: Event) => {
      const detail = (event as CustomEvent<{ values?: Record<string, any> }>).detail || {};
      onSubmit?.(detail.values || {});
    };

    const handleInvalid = (event: Event) => {
      const detail = (event as CustomEvent<{ errors?: Record<string, string | undefined>; values?: Record<string, any> }>).detail || {};
      onInvalid?.(detail.errors || {}, detail.values || {});
    };

    const handleValidate = (event: Event) => {
      const detail = (event as CustomEvent<{ valid?: boolean; errors?: Record<string, string | undefined> }>).detail || {};
      onValidate?.({ valid: !!detail.valid, errors: detail.errors || {} });
    };

    el.addEventListener('submit', handleSubmit as EventListener);
    el.addEventListener('invalid', handleInvalid as EventListener);
    el.addEventListener('validate', handleValidate as EventListener);

    return () => {
      el.removeEventListener('submit', handleSubmit as EventListener);
      el.removeEventListener('invalid', handleInvalid as EventListener);
      el.removeEventListener('validate', handleValidate as EventListener);
    };
  }, [onSubmit, onInvalid, onValidate]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (novalidate) el.setAttribute('novalidate', '');
    else el.removeAttribute('novalidate');

    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');

    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');

    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (gap) el.setAttribute('gap', gap);
    else el.removeAttribute('gap');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (loading) el.setAttribute('loading', '');
    else el.removeAttribute('loading');
  }, [novalidate, variant, tone, density, shape, elevation, gap, headless, loading]);

  return React.createElement('ui-form', { ref, ...rest }, children);
});

Form.displayName = 'Form';

export default Form;
