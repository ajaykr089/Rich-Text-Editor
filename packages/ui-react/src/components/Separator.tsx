import * as React from 'react';

export const Separator = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-separator ref={ref as any} {...props} />
));
Separator.displayName = 'Separator';
