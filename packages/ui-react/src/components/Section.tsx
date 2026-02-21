import React, { useEffect, useRef } from 'react';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'surface' | 'muted' | 'outline' | 'elevated' | 'contrast' | 'gradient';
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  density?: 'compact' | 'comfortable';
  inset?: boolean;
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(function Section(
  {
    size = 'medium',
    variant = 'default',
    tone = 'neutral',
    radius = 'md',
    density = 'comfortable',
    inset,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as any);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, value: string | null) => {
      const current = el.getAttribute(name);
      if (value == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== value) el.setAttribute(name, value);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) {
        if (!el.hasAttribute(name)) el.setAttribute(name, '');
      } else if (el.hasAttribute(name)) {
        el.removeAttribute(name);
      }
    };

    syncAttr('size', size !== 'medium' ? size : null);
    syncAttr('variant', variant !== 'default' ? variant : null);
    syncAttr('tone', tone !== 'neutral' ? tone : null);
    syncAttr('radius', radius !== 'md' ? radius : null);
    syncAttr('density', density !== 'comfortable' ? density : null);
    syncBool('inset', inset);
  }, [size, variant, tone, radius, density, inset]);

  return React.createElement('ui-section', { ref, ...rest }, children);
});

Section.displayName = 'Section';

export default Section;
