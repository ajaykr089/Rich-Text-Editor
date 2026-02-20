import * as React from 'react';

export const Progress = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-progress ref={ref as any} {...props} />
));
Progress.displayName = 'Progress';
