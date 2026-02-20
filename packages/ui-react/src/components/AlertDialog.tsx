import React, { useEffect, useRef } from 'react';

type BaseProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export type AlertDialogProps = BaseProps & {
  open?: boolean;
  headless?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
};

export const AlertDialog = React.forwardRef<HTMLElement, AlertDialogProps>(function AlertDialog(
  { children, open, headless, onOpen, onClose, onCancel, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const cancelHandler = () => onCancel?.();

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('cancel', cancelHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('cancel', cancelHandler as EventListener);
    };
  }, [onOpen, onClose, onCancel]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    }

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [open, headless]);

  return React.createElement('ui-alert-dialog', { ref, ...rest }, children);
});

AlertDialog.displayName = 'AlertDialog';

export default AlertDialog;
