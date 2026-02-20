import * as React from 'react';

export const Presence = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-presence ref={ref as any} {...props} />
));
Presence.displayName = 'Presence';
