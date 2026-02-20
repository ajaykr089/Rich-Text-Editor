import React from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode; text?: string };

export const Tooltip = React.forwardRef<HTMLElement, Props>(function Tooltip(
  { children, text, ...rest },
  ref
) {
  return React.createElement('ui-tooltip', { ref, text, ...rest }, children);
});

Tooltip.displayName = 'Tooltip';

export default Tooltip;
