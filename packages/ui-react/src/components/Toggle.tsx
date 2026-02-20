import * as React from 'react';

export const Toggle = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-toggle ref={ref as any} {...props} />
));
Toggle.displayName = 'Toggle';
