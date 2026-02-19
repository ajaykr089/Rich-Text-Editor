import { useRef, useCallback } from 'react';

export function useForm() {
  const ref = useRef<HTMLElement | null>(null);

  const submit = useCallback(async () => {
    const el: any = ref.current;
    if (!el) return false;
    return await el.submit();
  }, []);

  const validate = useCallback(async () => {
    const el: any = ref.current;
    if (!el) return { valid: true, errors: {} };
    return await el.validate();
  }, []);

  const getValues = useCallback(() => {
    const el: any = ref.current;
    return el ? el.getValues?.() : {};
  }, []);

  return { ref, submit, validate, getValues } as const;
}

export default useForm;
