import React, { useEffect, useRef } from 'react';
import {
  UIAlertDialogCancelDetail,
  UIAlertDialogCloseDetail,
  UIAlertDialogConfirmDetail,
  UIAlertDialogDismissDetail,
  UIAlertDialogOpenDetail,
  UIAlertDialogTemplateOptions
} from '@editora/ui-core';

type BaseProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export type AlertDialogElement = HTMLElement & {
  open: boolean;
  config?: UIAlertDialogTemplateOptions;
};

export type AlertDialogProps = BaseProps & {
  open?: boolean;
  headless?: boolean;
  dismissible?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  lockWhileLoading?: boolean;
  roleType?: 'alertdialog' | 'dialog';
  size?: 'sm' | 'md' | 'lg';
  state?: 'idle' | 'loading' | 'error';
  initialFocus?: string;
  dialogId?: string;
  config?: UIAlertDialogTemplateOptions;
  onOpen?: (detail: UIAlertDialogOpenDetail) => void;
  onConfirm?: (detail: UIAlertDialogConfirmDetail) => void;
  onCancel?: (detail: UIAlertDialogCancelDetail) => void;
  onDismiss?: (detail: UIAlertDialogDismissDetail) => void;
  onClose?: (detail: UIAlertDialogCloseDetail) => void;
  onChange?: (detail: { id: string; inputValue?: string; checked?: boolean }) => void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const AlertDialog = React.forwardRef<AlertDialogElement, AlertDialogProps>(function AlertDialog(
  {
    children,
    open,
    headless,
    dismissible,
    closeOnEsc,
    closeOnBackdrop,
    lockWhileLoading,
    roleType,
    size,
    state,
    initialFocus,
    dialogId,
    config,
    onOpen,
    onConfirm,
    onCancel,
    onDismiss,
    onClose,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<AlertDialogElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as AlertDialogElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = (event: Event) => onOpen?.((event as CustomEvent<UIAlertDialogOpenDetail>).detail);
    const handleConfirm = (event: Event) => onConfirm?.((event as CustomEvent<UIAlertDialogConfirmDetail>).detail);
    const handleCancel = (event: Event) => onCancel?.((event as CustomEvent<UIAlertDialogCancelDetail>).detail);
    const handleDismiss = (event: Event) => onDismiss?.((event as CustomEvent<UIAlertDialogDismissDetail>).detail);
    const handleClose = (event: Event) => onClose?.((event as CustomEvent<UIAlertDialogCloseDetail>).detail);
    const handleChange = (event: Event) =>
      onChange?.((event as CustomEvent<{ id: string; inputValue?: string; checked?: boolean }>).detail);

    el.addEventListener('ui-open', handleOpen as EventListener);
    el.addEventListener('ui-confirm', handleConfirm as EventListener);
    el.addEventListener('ui-cancel', handleCancel as EventListener);
    el.addEventListener('ui-dismiss', handleDismiss as EventListener);
    el.addEventListener('ui-close', handleClose as EventListener);
    el.addEventListener('ui-change', handleChange as EventListener);

    return () => {
      el.removeEventListener('ui-open', handleOpen as EventListener);
      el.removeEventListener('ui-confirm', handleConfirm as EventListener);
      el.removeEventListener('ui-cancel', handleCancel as EventListener);
      el.removeEventListener('ui-dismiss', handleDismiss as EventListener);
      el.removeEventListener('ui-close', handleClose as EventListener);
      el.removeEventListener('ui-change', handleChange as EventListener);
    };
  }, [onOpen, onConfirm, onCancel, onDismiss, onClose, onChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    }

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (typeof dismissible === 'boolean') el.setAttribute('dismissible', String(dismissible));
    else el.removeAttribute('dismissible');

    if (typeof closeOnEsc === 'boolean') el.setAttribute('close-on-esc', String(closeOnEsc));
    else el.removeAttribute('close-on-esc');

    if (typeof closeOnBackdrop === 'boolean') el.setAttribute('close-on-backdrop', String(closeOnBackdrop));
    else el.removeAttribute('close-on-backdrop');

    if (typeof lockWhileLoading === 'boolean') el.setAttribute('lock-while-loading', String(lockWhileLoading));
    else el.removeAttribute('lock-while-loading');

    if (roleType) el.setAttribute('role', roleType);
    else el.removeAttribute('role');

    if (size && size !== 'md') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (initialFocus) el.setAttribute('initial-focus', initialFocus);
    else el.removeAttribute('initial-focus');

    if (dialogId) (el as any).dialogId = dialogId;

    if (config) (el as any).config = config;
  }, [
    open,
    headless,
    dismissible,
    closeOnEsc,
    closeOnBackdrop,
    lockWhileLoading,
    roleType,
    size,
    state,
    initialFocus,
    dialogId,
    config
  ]);

  return React.createElement('ui-alert-dialog', { ref, ...rest }, children);
});

AlertDialog.displayName = 'AlertDialog';

export default AlertDialog;
