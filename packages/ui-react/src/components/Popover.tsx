import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type PopoverProps = Props & { onOpen?: () => void; onClose?: () => void };

export const Popover = React.forwardRef<HTMLElement, PopoverProps>(function Popover(
  { children, onOpen, onClose, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hOpen = () => onOpen?.();
    const hClose = () => onClose?.();
    el.addEventListener('open', hOpen as EventListener);
    el.addEventListener('close', hClose as EventListener);
    return () => { el.removeEventListener('open', hOpen as EventListener); el.removeEventListener('close', hClose as EventListener); };
  }, [onOpen, onClose]);
  return React.createElement('ui-popover', { ref, ...rest }, children);
});

Popover.displayName = 'Popover';

export default Popover;
