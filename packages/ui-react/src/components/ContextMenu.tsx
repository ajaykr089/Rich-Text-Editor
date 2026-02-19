import React, { useEffect, useRef } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { anchorId?: string; anchorPoint?: { x: number; y: number }; open?: boolean };

export function ContextMenu(props: Props) {
  const { children, anchorId, anchorPoint, open, ...rest } = props as any;
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && anchorPoint && (el as any).openAt) {
      (el as any).openAt(anchorPoint.x, anchorPoint.y);
    } else if (open && anchorId) {
      (el as any).openFor && (el as any).openFor(anchorId);
    } else {
      (el as any).close && (el as any).close();
    }
  }, [open, anchorId, anchorPoint]);
  return React.createElement('ui-context-menu', { ref, ...rest }, children);
}

export default ContextMenu;
