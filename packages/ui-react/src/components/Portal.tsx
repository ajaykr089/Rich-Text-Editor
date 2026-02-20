import * as React from 'react';

export const Portal = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-portal ref={ref as any} {...props} />
));
Portal.displayName = 'Portal';
