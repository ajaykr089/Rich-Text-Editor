import React from 'react';
import { warnIfElementNotRegistered } from './_internals';

type BlockControlsProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const BlockControls = React.forwardRef<HTMLElement, BlockControlsProps>(({ children, ...rest }, ref) => {
  React.useEffect(() => {
    warnIfElementNotRegistered('ui-block-controls', 'BlockControls');
  }, []);

  return React.createElement('ui-block-controls', { ref, ...rest }, children);
});

BlockControls.displayName = 'BlockControls';

export default BlockControls;
