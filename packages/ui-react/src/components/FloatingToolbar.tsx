import React, { useEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type UIFloatingToolbarElement = HTMLElement & {
  showForAnchorId?: (anchorId: string) => void;
  hide?: () => void;
};

type Props = React.HTMLAttributes<HTMLElement> & { anchorId?: string; open?: boolean };

export function FloatingToolbar(props: Props) {
  const { children, anchorId, open, ...rest } = props;
  const ref = useRef<UIFloatingToolbarElement | null>(null);

  useEffect(() => {
    warnIfElementNotRegistered('ui-floating-toolbar', 'FloatingToolbar');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && anchorId) {
      el.showForAnchorId?.(anchorId);
    } else {
      el.hide?.();
    }
  }, [open, anchorId]);
  return React.createElement('ui-floating-toolbar', { ref, ...rest }, children);
}

export default FloatingToolbar;
