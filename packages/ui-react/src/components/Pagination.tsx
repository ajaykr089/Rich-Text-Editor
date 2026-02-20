import * as React from 'react';

export const Pagination = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-pagination ref={ref as any} {...props} />
));
Pagination.displayName = 'Pagination';
