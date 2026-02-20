import React, { useEffect, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

type UICommandPaletteElement = HTMLElement;
type Props = React.HTMLAttributes<HTMLElement> & { open?: boolean; onSelect?: (idx: number) => void };

export function CommandPalette(props: Props) {
  const { children, open, onSelect, ...rest } = props;
  const ref = useRef<UICommandPaletteElement | null>(null);

  useEffect(() => {
    warnIfElementNotRegistered('ui-command-palette', 'CommandPalette');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => {
      const index = (e as CustomEvent<{ index?: number }>).detail?.index;
      if (typeof index === 'number') onSelect?.(index);
    };

    el.addEventListener('select', handler as EventListener);
    if (open) el.setAttribute('open', '');
    else el.removeAttribute('open');

    return () => el.removeEventListener('select', handler as EventListener);
  }, [open, onSelect]);

  return React.createElement('ui-command-palette', { ref, ...rest }, children);
}

export default CommandPalette;
