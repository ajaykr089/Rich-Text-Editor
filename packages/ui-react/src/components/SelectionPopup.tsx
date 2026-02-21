import React, { useEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type UISelectionPopupElement = HTMLElement & {
  openFor?: (anchorId: string) => void;
  close?: () => void;
};

type Props = React.HTMLAttributes<HTMLElement> & {
  anchorId?: string;
  open?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  offset?: number;
  strategy?: 'fixed' | 'absolute';
  arrow?: boolean;
  variant?: 'default' | 'surface' | 'soft' | 'glass' | 'contrast';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  radius?: 'none' | 'large' | 'full' | string;
  size?: 'sm' | 'md' | 'lg';
  closeOnOutside?: boolean;
  closeOnEscape?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
};

export function SelectionPopup(props: Props) {
  const {
    children,
    anchorId,
    open,
    placement,
    offset,
    strategy,
    arrow,
    variant,
    tone,
    radius,
    size,
    closeOnOutside,
    closeOnEscape,
    onOpen,
    onClose,
    onOpenChange,
    ...rest
  } = props;
  const ref = useRef<UISelectionPopupElement | null>(null);

  useEffect(() => {
    warnIfElementNotRegistered('ui-selection-popup', 'SelectionPopup');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => {
      onOpen?.();
      onOpenChange?.(true);
    };

    const closeHandler = () => {
      onClose?.();
      onOpenChange?.(false);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
    };
  }, [onOpen, onClose, onOpenChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBooleanAttr = (name: string, enabled: boolean | undefined, defaultValue: boolean | undefined = undefined) => {
      if (enabled == null) {
        if (defaultValue !== undefined) {
          syncAttr(name, defaultValue ? null : 'false');
        }
        return;
      }
      if (enabled) syncAttr(name, '');
      else syncAttr(name, 'false');
    };

    syncAttr('anchor-id', anchorId ?? null);
    syncAttr('placement', placement && placement !== 'top' ? placement : null);
    syncAttr('offset', typeof offset === 'number' && Number.isFinite(offset) ? String(offset) : null);
    syncAttr('strategy', strategy && strategy !== 'fixed' ? strategy : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('radius', radius ? String(radius) : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncBooleanAttr('arrow', arrow);
    syncBooleanAttr('close-on-outside', closeOnOutside, true);
    syncBooleanAttr('close-on-escape', closeOnEscape, true);

    if (open && anchorId) {
      el.openFor?.(anchorId);
    } else if (open) {
      el.setAttribute('open', '');
    } else if (open === false) {
      el.close?.();
    } else {
      el.removeAttribute('open');
    }
  }, [
    open,
    anchorId,
    placement,
    offset,
    strategy,
    arrow,
    variant,
    tone,
    radius,
    size,
    closeOnOutside,
    closeOnEscape
  ]);

  return React.createElement('ui-selection-popup', { ref, ...rest }, children);
}

export default SelectionPopup;
