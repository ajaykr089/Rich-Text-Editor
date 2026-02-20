import React, { useEffect, useRef } from 'react';

export type DialogRequestCloseDetail = {
  reason: 'button' | 'overlay' | 'escape' | 'programmatic';
};

export type DialogProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  open?: boolean;
  title?: string;
  description?: string;
  closable?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  headless?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onRequestClose?: (detail: DialogRequestCloseDetail) => void;
};

export function Dialog(props: DialogProps) {
  const {
    open,
    title,
    description,
    closable,
    closeOnOverlay,
    closeOnEsc,
    size,
    headless,
    onOpen,
    onClose,
    onRequestClose,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const requestCloseHandler = (event: Event) => {
      const detail = (event as CustomEvent<DialogRequestCloseDetail>).detail;
      if (detail) onRequestClose?.(detail);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('request-close', requestCloseHandler as EventListener);
    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('request-close', requestCloseHandler as EventListener);
    };
  }, [onOpen, onClose, onRequestClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    }

    if (title) el.setAttribute('title', title);
    else el.removeAttribute('title');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (typeof closable === 'boolean') el.setAttribute('closable', String(closable));
    else el.removeAttribute('closable');

    if (typeof closeOnOverlay === 'boolean') el.setAttribute('close-on-overlay', String(closeOnOverlay));
    else el.removeAttribute('close-on-overlay');

    if (typeof closeOnEsc === 'boolean') el.setAttribute('close-on-esc', String(closeOnEsc));
    else el.removeAttribute('close-on-esc');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [open, title, description, closable, closeOnOverlay, closeOnEsc, size, headless]);

  return React.createElement('ui-dialog', { ref, ...rest }, children);
}

export default Dialog;
