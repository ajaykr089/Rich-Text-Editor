import React, { useEffect, useRef, useImperativeHandle } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  onSubmit?: (values: Record<string, any>) => void;
  onInvalid?: (errors: Record<string, string | undefined>) => void;
  novalidate?: boolean;
};

// Forwarding ref so consumers (and useForm) can call submit/validate/getValues
export const Form = React.forwardRef<HTMLElement, Props>(function Form(props, forwardedRef) {
  const { children, onSubmit, onInvalid, novalidate, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current as any;
    if (!el) return;
    const handleSubmit = (e: any) => { if (onSubmit) onSubmit(e.detail?.values); };
    const handleInvalid = (e: any) => { if (onInvalid) onInvalid(e.detail?.errors); };
    el.addEventListener('submit', handleSubmit);
    el.addEventListener('invalid', handleInvalid);
    return () => {
      el.removeEventListener('submit', handleSubmit);
      el.removeEventListener('invalid', handleInvalid);
    };
  }, [onSubmit, onInvalid]);

  // Render the native web component
  return React.createElement('ui-form', { ref, novalidate: novalidate ? '' : undefined, ...rest }, children);
});

export default Form;
