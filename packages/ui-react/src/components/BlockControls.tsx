import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export interface BlockControlsProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  density?: 'compact' | 'comfortable';
  ariaLabel?: string;
}

export const BlockControls = React.forwardRef<HTMLElement, BlockControlsProps>(function BlockControls(
  { children, orientation, density, ariaLabel, ...rest },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-block-controls', 'BlockControls');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (orientation) element.setAttribute('orientation', orientation);
    else element.removeAttribute('orientation');

    if (density) element.setAttribute('density', density);
    else element.removeAttribute('density');

    if (ariaLabel) element.setAttribute('aria-label', ariaLabel);
    else element.removeAttribute('aria-label');
  }, [orientation, density, ariaLabel]);

  return React.createElement('ui-block-controls', { ref, ...rest }, children);
});

BlockControls.displayName = 'BlockControls';

export default BlockControls;
