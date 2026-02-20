import React, { useEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type UISelectionPopupElement = HTMLElement & {
  openFor?: (anchorId: string) => void;
  close?: () => void;
};

type Props = React.HTMLAttributes<HTMLElement> & { anchorId?: string; open?: boolean };

export function SelectionPopup(props: Props) {
  const { children, anchorId, open, ...rest } = props;
  const ref = useRef<UISelectionPopupElement | null>(null);

  useEffect(() => {
    warnIfElementNotRegistered('ui-selection-popup', 'SelectionPopup');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && anchorId) {
      el.openFor?.(anchorId);
    } else {
      el.close?.();
    }
  }, [open, anchorId]);
  return React.createElement('ui-selection-popup', { ref, ...rest }, children);
}

export default SelectionPopup;
