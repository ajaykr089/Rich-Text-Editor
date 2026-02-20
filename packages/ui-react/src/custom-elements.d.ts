import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [tagName: `ui-${string}`]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export {};
