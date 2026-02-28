import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle' | 'onChange'> {
  header?: React.ReactNode;
  open?: boolean;
  headless?: boolean;
  onToggle?: (open: boolean) => void;
  onChangeOpen?: (open: boolean) => void;
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null) {
    element.removeAttribute(name);
    return;
  }
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function readOpen(event: Event): boolean | undefined {
  return (event as CustomEvent<{ open?: boolean }>).detail?.open;
}

export const Collapsible = React.forwardRef<HTMLElement, CollapsibleProps>(function Collapsible(
  { header, open, headless, onToggle, onChangeOpen, children, ...rest },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-collapsible', 'Collapsible');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setBooleanAttribute(element, 'open', open);
    setBooleanAttribute(element, 'headless', headless);
  }, [open, headless]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onToggle && !onChangeOpen)) return;

    const handleToggle = (event: Event) => {
      const next = readOpen(event);
      if (typeof next === 'boolean') onToggle?.(next);
    };

    const handleChange = (event: Event) => {
      const next = readOpen(event);
      if (typeof next === 'boolean') onChangeOpen?.(next);
    };

    element.addEventListener('toggle', handleToggle as EventListener);
    element.addEventListener('change', handleChange as EventListener);
    return () => {
      element.removeEventListener('toggle', handleToggle as EventListener);
      element.removeEventListener('change', handleChange as EventListener);
    };
  }, [onToggle, onChangeOpen]);

  let headerNode: React.ReactNode = null;
  if (header != null) {
    if (typeof header === 'string' || typeof header === 'number') {
      headerNode = <span slot="header">{header}</span>;
    } else if (React.isValidElement(header)) {
      headerNode = React.cloneElement(header as React.ReactElement<any>, { slot: 'header' } as any);
    } else {
      headerNode = <span slot="header">{header}</span>;
    }
  }

  return (
    <ui-collapsible ref={ref as any} {...rest}>
      {headerNode}
      {children}
    </ui-collapsible>
  );
});

Collapsible.displayName = 'Collapsible';
