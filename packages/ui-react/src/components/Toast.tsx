import React, { useEffect, useRef } from 'react';

export type ToastShowDetail = { id: number; message: string };
export type ToastHideDetail = { id: number };

export type ToastShowOptions = {
  duration?: number;
  type?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
};

export type ToastElement = HTMLElement & {
  show: (message: string, options?: ToastShowOptions) => number;
  hide: (id: number) => void;
};

type ToastProps = React.HTMLAttributes<HTMLElement> & {
  headless?: boolean;
  onShow?: (detail: ToastShowDetail) => void;
  onHide?: (detail: ToastHideDetail) => void;
};

export const Toast = React.forwardRef<ToastElement, ToastProps>(function Toast(
  { children, headless, onShow, onHide, ...rest },
  forwardedRef
) {
  const ref = useRef<ToastElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as ToastElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const showHandler = (event: Event) => {
      const detail = (event as CustomEvent<ToastShowDetail>).detail;
      if (detail) onShow?.(detail);
    };
    const hideHandler = (event: Event) => {
      const detail = (event as CustomEvent<ToastHideDetail>).detail;
      if (detail) onHide?.(detail);
    };

    el.addEventListener('show', showHandler as EventListener);
    el.addEventListener('hide', hideHandler as EventListener);
    return () => {
      el.removeEventListener('show', showHandler as EventListener);
      el.removeEventListener('hide', hideHandler as EventListener);
    };
  }, [onShow, onHide]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [headless]);

  return React.createElement('ui-toast', { ref, ...rest }, children);
});

Toast.displayName = 'Toast';

export default Toast;
