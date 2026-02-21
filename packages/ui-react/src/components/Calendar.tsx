import React, { useEffect, useImperativeHandle, useRef } from 'react';

export type CalendarEvent = {
  date: string;
  title?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type CalendarSelectDetail = { value: string };

export type CalendarProps = React.HTMLAttributes<HTMLElement> & {
  year?: number;
  month?: number;
  value?: string;
  events?: CalendarEvent[];
  variant?: 'default' | 'contrast';
  headless?: boolean;
  onSelect?: (detail: CalendarSelectDetail) => void;
  onChange?: (detail: CalendarSelectDetail) => void;
};

export const Calendar = React.forwardRef<HTMLElement, CalendarProps>(function Calendar(
  { year, month, value, events, variant, headless, onSelect, onChange, children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<CalendarSelectDetail>).detail;
      if (!detail) return;
      onSelect?.(detail);
      onChange?.(detail);
    };

    el.addEventListener('select', handleSelect as EventListener);
    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
    };
  }, [onSelect, onChange]);

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

    if (typeof year === 'number' && Number.isFinite(year)) syncAttr('year', String(year));
    else syncAttr('year', null);

    if (typeof month === 'number' && Number.isFinite(month)) syncAttr('month', String(month));
    else syncAttr('month', null);

    syncAttr('value', value || null);

    if (events && events.length) {
      try {
        syncAttr('events', JSON.stringify(events));
      } catch {
        syncAttr('events', null);
      }
    } else {
      syncAttr('events', null);
    }

    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncBool('headless', headless);
  }, [year, month, value, events, variant, headless]);

  return React.createElement('ui-calendar', { ref, ...rest }, children);
});

Calendar.displayName = 'Calendar';

export default Calendar;
