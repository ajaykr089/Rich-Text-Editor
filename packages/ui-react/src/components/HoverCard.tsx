import React, { useEffect, useImperativeHandle, useRef } from 'react';

type HoverCardElement = HTMLElement & {
  open: boolean;
};

export type HoverCardProps = React.HTMLAttributes<HTMLElement> & {
  open?: boolean;
  delay?: number;
  closeDelay?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  variant?: 'default' | 'line' | 'glass' | 'contrast' | 'minimal' | 'elevated';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  headless?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
};

export const HoverCard = React.forwardRef<HTMLElement, HoverCardProps>(function HoverCard(
  {
    children,
    open,
    delay,
    closeDelay,
    placement,
    offset,
    variant,
    tone,
    density,
    shape,
    elevation,
    headless,
    onOpen,
    onClose,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HoverCardElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    const handleChange = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };

    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    el.addEventListener('change', handleChange as EventListener);

    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
    };
  }, [onOpen, onClose, onChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof delay === 'number') el.setAttribute('delay', String(delay));
    else el.removeAttribute('delay');

    if (typeof closeDelay === 'number') el.setAttribute('close-delay', String(closeDelay));
    else el.removeAttribute('close-delay');

    if (placement) el.setAttribute('placement', placement);
    else el.removeAttribute('placement');

    if (typeof offset === 'number') el.setAttribute('offset', String(offset));
    else el.removeAttribute('offset');

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

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [delay, closeDelay, placement, offset, variant, tone, density, shape, elevation, headless]);

  return React.createElement('ui-hover-card', { ref, ...rest }, children);
});

HoverCard.displayName = 'HoverCard';

export default HoverCard;
