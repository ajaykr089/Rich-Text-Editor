import React from 'react';
import { Icon } from './Icon';
import type { IconComponent, NamedIconProps } from './types';

export function createIcon(name: string, displayName?: string): IconComponent {
  const Component = React.forwardRef<SVGSVGElement, NamedIconProps>(function EditoraNamedIcon(props, ref) {
    return <Icon ref={ref} name={name} {...props} />;
  });

  Component.displayName = displayName || `${toPascalCase(name)}Icon`;
  return Component;
}

function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
