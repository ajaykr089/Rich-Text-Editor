import React from 'react';

type Props = React.HTMLAttributes<HTMLElement> & { size?: 'small'|'medium'|'large' };

export function Section(props: Props) {
  const { children, size = 'medium', ...rest } = props as any;
  return React.createElement('ui-section', { size, ...rest }, children);
}

export default Section;
