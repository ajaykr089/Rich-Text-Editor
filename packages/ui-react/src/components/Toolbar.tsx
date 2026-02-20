import * as React from 'react';

export const Toolbar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-toolbar ref={ref as any} {...props} />
));
Toolbar.displayName = 'Toolbar';
