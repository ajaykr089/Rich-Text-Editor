import * as React from 'react';

export const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-slot ref={ref as any} {...props} />
));
Slot.displayName = 'Slot';
