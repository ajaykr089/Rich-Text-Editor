import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type DropdownProps = Props & { onOpen?: () => void; onClose?: () => void };

export const Dropdown = React.forwardRef<HTMLElement, DropdownProps>(function Dropdown(
  { children, onOpen, onClose, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleOpen = () => onOpen?.();
    const handleClose = () => onClose?.();
    el.addEventListener('open', handleOpen as EventListener);
    el.addEventListener('close', handleClose as EventListener);
    return () => {
      el.removeEventListener('open', handleOpen as EventListener);
      el.removeEventListener('close', handleClose as EventListener);
    };
  }, [onOpen, onClose]);
  return React.createElement('ui-dropdown', { ref, ...rest }, children);
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
