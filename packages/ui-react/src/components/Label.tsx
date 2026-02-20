import * as React from 'react';

export const Label = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-label ref={ref as any} {...props} />
));
Label.displayName = 'Label';
