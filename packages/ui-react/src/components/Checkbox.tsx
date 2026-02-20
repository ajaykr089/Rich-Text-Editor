import * as React from 'react';

export const Checkbox = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-checkbox ref={ref as any} {...props} />
));
Checkbox.displayName = 'Checkbox';
