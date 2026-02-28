import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLElement> {
  ratio?: number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

function normalizeRatio(value: number | string | undefined): string | undefined {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value) || value <= 0) return undefined;

  if (Math.abs(value - 16 / 9) < 0.01) return '16/9';
  if (Math.abs(value - 4 / 3) < 0.01) return '4/3';
  if (Math.abs(value - 1) < 0.01) return '1/1';
  return `${value}/1`;
}

export const AspectRatio = React.forwardRef<HTMLElement, AspectRatioProps>(function AspectRatio(
  { ratio, fit, children, ...rest },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-aspect-ratio', 'AspectRatio');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const nextRatio = normalizeRatio(ratio);
    if (nextRatio) element.setAttribute('ratio', nextRatio);
    else element.removeAttribute('ratio');

    if (fit) element.setAttribute('fit', fit);
    else element.removeAttribute('fit');
  }, [ratio, fit]);

  return React.createElement('ui-aspect-ratio', { ref, ...rest }, children);
});

AspectRatio.displayName = 'AspectRatio';
