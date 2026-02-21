import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type GanttTask = {
  id?: string;
  label: string;
  start: string;
  end: string;
  progress?: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type GanttProps = React.HTMLAttributes<HTMLElement> & {
  tasks?: GanttTask[];
  variant?: 'default' | 'contrast';
  headless?: boolean;
};

export const Gantt = React.forwardRef<HTMLElement, GanttProps>(function Gantt(
  { tasks, variant, headless, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    if (tasks && tasks.length) {
      try {
        syncAttr('tasks', JSON.stringify(tasks));
      } catch {
        syncAttr('tasks', null);
      }
    } else {
      syncAttr('tasks', null);
    }

    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncBool('headless', headless);
  }, [tasks, variant, headless]);

  return React.createElement('ui-gantt', { ref, ...rest }, children);
});

Gantt.displayName = 'Gantt';

export default Gantt;
