import React, { useEffect, useRef } from 'react';

export type BadgeProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  text?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: 'none' | 'large' | 'full' | string;
  pill?: boolean;
  dot?: boolean;
  removable?: boolean;
  autoRemove?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  onRemove?: () => void;
};

export function Badge(props: BadgeProps) {
  const {
    text,
    tone,
    variant,
    size,
    radius,
    pill,
    dot,
    removable,
    autoRemove,
    iconOnly,
    disabled,
    onRemove,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onRemoveHandler = () => onRemove?.();
    el.addEventListener('remove', onRemoveHandler as EventListener);
    return () => el.removeEventListener('remove', onRemoveHandler as EventListener);
  }, [onRemove]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (text) el.setAttribute('text', text);
    else el.removeAttribute('text');

    if (tone) el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (radius) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (pill) el.setAttribute('pill', '');
    else el.removeAttribute('pill');

    if (dot) el.setAttribute('dot', '');
    else el.removeAttribute('dot');

    if (removable) el.setAttribute('removable', '');
    else el.removeAttribute('removable');

    if (autoRemove) el.setAttribute('auto-remove', '');
    else el.removeAttribute('auto-remove');

    if (iconOnly) el.setAttribute('icon-only', '');
    else el.removeAttribute('icon-only');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [text, tone, variant, size, radius, pill, dot, removable, autoRemove, iconOnly, disabled]);

  return React.createElement('ui-badge', { ref, ...rest }, children);
}

export default Badge;
