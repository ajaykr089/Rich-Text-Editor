import * as React from 'react';

export const Switch = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-switch ref={ref as any} {...props} />
));
Switch.displayName = 'Switch';
