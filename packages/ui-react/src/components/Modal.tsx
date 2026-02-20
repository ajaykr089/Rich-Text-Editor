import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

type ModalProps = Props & { open?: boolean; onOpen?: () => void; onClose?: () => void };

export const Modal = React.forwardRef<HTMLElement, ModalProps>(function Modal(
  { children, open, onOpen, onClose, ...rest },
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

  return React.createElement('ui-modal', { ref, open: open ? '' : undefined, ...rest }, children);
});

Modal.displayName = 'Modal';

export default Modal;
