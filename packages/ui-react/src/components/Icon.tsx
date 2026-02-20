import React from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { name: string };

export const Icon = React.forwardRef<HTMLElement, Props>(function Icon(
  { name, className, ...rest },
  ref
) {
  return React.createElement('ui-icon', { ref, name, className, ...rest });
});

Icon.displayName = 'Icon';

export default Icon;
