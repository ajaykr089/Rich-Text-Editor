import * as React from 'react';

export const RadioGroup = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-radio-group ref={ref as any} {...props} />
));
RadioGroup.displayName = 'RadioGroup';
