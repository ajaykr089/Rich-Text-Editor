import { useEffect, useRef, useState, useCallback } from 'react';
import { computePosition as coreComputePosition } from '@editora/ui-core';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export function useFloating(options?: { placement?: Placement; offset?: number; open?: boolean; onOpen?: () => void; onClose?: () => void; role?: string }) {
  const { placement = 'bottom', offset = 8, open: controlledOpen, onOpen, onClose, role = 'menu' } = options || {};
  const reference = useRef<HTMLElement | null>(null);
  const floating = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; placement: Placement; arrow?: { x?: number; y?: number } }>({ top: 0, left: 0, placement });

  // controlled vs uncontrolled open state
  const isControlled = typeof controlledOpen !== 'undefined';
  const [internalOpen, setInternalOpen] = useState<boolean>(!!controlledOpen);
  const open = isControlled ? (controlledOpen as boolean) : internalOpen;

  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    if (v) onOpen && onOpen(); else onClose && onClose();
  };
  const toggle = () => setOpen(!open);
  const openPopup = () => setOpen(true);
  const closePopup = () => setOpen(false);

  const update = useCallback(() => {
    const r = reference.current;
    const f = floating.current;
    if (!r || !f) return;
    const pos = coreComputePosition(r, f as HTMLElement, { placement, offset });
    setCoords({ top: Math.round(pos.top), left: Math.round(pos.left), placement: pos.placement as Placement, arrow: pos.x || pos.y ? { x: pos.x, y: pos.y } : undefined });
  }, [placement, offset]);

  useEffect(() => {
    if (!open) return;
    const r = reference.current;
    const f = floating.current;
    if (!r || !f) return;

    update();

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => update());
    };
    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => update());
    };

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    let ro1: ResizeObserver | null = null;
    let ro2: ResizeObserver | null = null;
    try {
      if (typeof ResizeObserver !== 'undefined') {
        ro1 = new ResizeObserver(onResize);
        ro2 = new ResizeObserver(onResize);
        ro1.observe(r);
        ro2.observe(f);
      }
    } catch (e) {
      ro1 = ro2 = null;
    }

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      if (ro1) ro1.disconnect();
      if (ro2) ro2.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, update]);

  const referenceRef = useCallback((node: HTMLElement | null) => {
    reference.current = node;
  }, []);

  const floatingRef = useCallback((node: HTMLElement | null) => {
    floating.current = node;
  }, []);

  // accessibility / keyboard helpers
  const uid = useRef(`floating-${Math.random().toString(36).slice(2,9)}`);

  const getMenuItems = () => {
    if (!floating.current) return [] as HTMLElement[];
    const items = Array.from(floating.current.querySelectorAll('[role="menuitem"], .item, [data-menu-item]')) as HTMLElement[];
    return items.filter(Boolean);
  };

  const focusItem = (index: number) => {
    const items = getMenuItems();
    if (!items.length) return;
    const i = Math.max(0, Math.min(items.length - 1, index));
    try { items[i].focus(); } catch (e) {}
  };
  const focusFirstItem = () => focusItem(0);
  const focusLastItem = () => {
    const items = getMenuItems();
    if (items.length) focusItem(items.length - 1);
  };
  const focusNext = () => {
    const items = getMenuItems();
    const idx = items.findIndex(i => i === document.activeElement);
    focusItem(idx < 0 ? 0 : (idx + 1) % items.length);
  };
  const focusPrev = () => {
    const items = getMenuItems();
    const idx = items.findIndex(i => i === document.activeElement);
    focusItem(idx <= 0 ? items.length - 1 : idx - 1);
  };

  const getReferenceProps = (props: any = {}) => {
    return {
      ref: referenceRef,
      'aria-haspopup': role,
      'aria-controls': uid.current,
      'aria-expanded': open ? 'true' : 'false',
      onClick: (e: Event) => {
        props.onClick && props.onClick(e);
        toggle();
      },
      onKeyDown: (e: KeyboardEvent) => {
        props.onKeyDown && props.onKeyDown(e);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          openPopup();
          // delay focusing first item until rendered
          setTimeout(() => focusFirstItem(), 0);
        }
      },
      ...props
    };
  };

  const getFloatingProps = (props: any = {}) => ({
    id: uid.current,
    ref: floatingRef,
    role,
    tabIndex: -1,
    style: { position: 'absolute', top: `${coords.top}px`, left: `${coords.left}px` },
    hidden: !open,
    onKeyDown: (e: KeyboardEvent) => {
      props.onKeyDown && props.onKeyDown(e);
      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusFirstItem();
      } else if (e.key === 'End') {
        e.preventDefault();
        focusLastItem();
      }
    },
    ...props
  });

  return {
    referenceRef,
    floatingRef,
    coords,
    update,
    open,
    setOpen,
    toggle,
    openPopup,
    closePopup,
    getReferenceProps,
    getFloatingProps,
    focusFirstItem,
    focusLastItem,
    focusNext,
    focusPrev,
  } as const;
}
