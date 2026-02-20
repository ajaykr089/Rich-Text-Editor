
import * as React from 'react';

interface CollapsibleProps extends React.HTMLAttributes<HTMLElement> {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

export const Collapsible = React.forwardRef<HTMLElement, CollapsibleProps>(
  ({ header, children, ...rest }, ref) => {
    // Always render a slot="header" element, even for string header
    let headerNode: React.ReactNode = null;
    if (header !== undefined && header !== null) {
      if (typeof header === 'string' || typeof header === 'number') {
        headerNode = <span slot="header">{header}</span>;
      } else if (React.isValidElement(header)) {
        headerNode = React.cloneElement(header as React.ReactElement, { slot: 'header' });
      } else {
        headerNode = <span slot="header">{header}</span>;
      }
    }
    return (
      <ui-collapsible ref={ref as any} {...rest}>
        {headerNode}
        {children}
      </ui-collapsible>
    );
  }
);
Collapsible.displayName = 'Collapsible';
