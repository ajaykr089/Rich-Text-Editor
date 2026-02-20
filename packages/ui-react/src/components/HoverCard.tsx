import * as React from 'react';

export const HoverCard = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-hover-card ref={ref as any} {...props} />
));
HoverCard.displayName = 'HoverCard';
