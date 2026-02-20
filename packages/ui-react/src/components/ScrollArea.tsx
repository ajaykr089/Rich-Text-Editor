import * as React from 'react';

export const ScrollArea = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-scroll-area ref={ref as any} {...props} />
));
ScrollArea.displayName = 'ScrollArea';
