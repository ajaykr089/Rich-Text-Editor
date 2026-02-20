import React, { useEffect, useRef } from 'react';

type FieldProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  invalid?: boolean;
  orientation?: 'vertical' | 'horizontal';
};

export function Field(props: FieldProps) {
  const {
    children,
    label,
    description,
    error,
    htmlFor,
    required,
    invalid,
    orientation,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (error) el.setAttribute('error', error);
    else el.removeAttribute('error');

    if (htmlFor) el.setAttribute('for', htmlFor);
    else el.removeAttribute('for');

    if (required) el.setAttribute('required', '');
    else el.removeAttribute('required');

    if (invalid) el.setAttribute('invalid', '');
    else el.removeAttribute('invalid');

    if (orientation && orientation !== 'vertical') el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');
  }, [label, description, error, htmlFor, required, invalid, orientation]);

  return React.createElement('ui-field', { ref, ...rest }, children);
}

export default Field;
