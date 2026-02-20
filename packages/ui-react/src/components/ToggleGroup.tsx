import * as React from 'react';

export const ToggleGroup = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-toggle-group ref={ref as any} {...props} />
));
ToggleGroup.displayName = 'ToggleGroup';
