
import * as React from 'react';

/**
 * AspectRatio component
 * @param ratio - number (e.g. 16/9 or 4/3) or string (e.g. '16/9')
 * @example <AspectRatio ratio={16/9}>...</AspectRatio>
 */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLElement> {
  ratio?: number | string;
}

export const AspectRatio = React.forwardRef<HTMLElement, AspectRatioProps>(({ ratio, ...rest }, ref) => {
  let ratioProp = ratio;
  if (typeof ratio === 'number' && isFinite(ratio)) {
    // Convert number to string format w/h
    // Use 100 as denominator for precision if decimal
    if (Number.isInteger(ratio)) {
      ratioProp = `${ratio}/1`;
    } else {
      // Try to find a simple fraction for common ratios
      if (Math.abs(ratio - 16/9) < 0.01) ratioProp = '16/9';
      else if (Math.abs(ratio - 4/3) < 0.01) ratioProp = '4/3';
      else if (Math.abs(ratio - 1) < 0.01) ratioProp = '1/1';
      else ratioProp = `${ratio}/1`;
    }
  }
  return React.createElement('ui-aspect-ratio', { ref, ratio: ratioProp, ...rest });
});
AspectRatio.displayName = 'AspectRatio';
