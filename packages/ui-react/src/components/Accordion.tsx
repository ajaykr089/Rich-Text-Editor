import * as React from 'react';

type UIAccordionElement = HTMLElement & {
  open: number | number[];
};

export interface AccordionItemData {
  header: string;
  panel: string;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLElement> {
  multiple?: boolean;
  open?: number | number[];
  onToggle?: (open: number | number[]) => void;
  data?: AccordionItemData[];
}

export const Accordion = React.forwardRef<HTMLElement, AccordionProps>(
  ({ multiple, open, onToggle, data, children, ...rest }, forwardedRef) => {
    const ref = React.useRef<UIAccordionElement | null>(null);

    React.useImperativeHandle(forwardedRef, () => ref.current as any);

    React.useEffect(() => {
      const el = ref.current;
      if (!el || multiple == null) return;
      if (multiple) el.setAttribute('multiple', '');
      else el.removeAttribute('multiple');
    }, [multiple]);

    React.useEffect(() => {
      const el = ref.current;
      if (!el || open == null) return;
      const next = Array.isArray(open) ? JSON.stringify(open) : String(open);
      if (el.getAttribute('open') !== next) {
        el.setAttribute('open', next);
      }
    }, [open]);

    React.useEffect(() => {
      const el = ref.current;
      if (!el || !onToggle) return;

      const handleToggle = (event: Event) => {
        const detail = (event as CustomEvent<{ open?: number | number[] }>).detail;
        if (detail?.open != null) onToggle(detail.open);
      };

      el.addEventListener('toggle', handleToggle as EventListener);
      return () => {
        el.removeEventListener('toggle', handleToggle as EventListener);
      };
    }, [onToggle]);

    React.useEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (Array.isArray(data) && data.length > 0) {
        const next = JSON.stringify(data);
        if (el.getAttribute('items') !== next) {
          el.setAttribute('items', next);
        }
        return;
      }

      el.removeAttribute('items');
    }, [data]);

    return React.createElement('ui-accordion', { ref, ...rest }, children);
  }
);

Accordion.displayName = 'Accordion';
