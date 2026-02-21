import React, { useRef, useEffect } from 'react';

type UIContextMenuElement = HTMLElement & {
  open: boolean;
  close?: () => void;
  openAt?: (point: { x: number; y: number }) => void;
  openForAnchorId?: (anchorId: string) => void;
  showForAnchorId?: (anchorId: string) => void;
};


export type MenuItem = {
  label?: string;
  icon?: string | React.ReactNode;
  disabled?: boolean;
  separator?: boolean;
  submenu?: MenuItem[];
  onClick?: () => void;
  value?: string;
};


export type ContextMenuProps = React.HTMLAttributes<HTMLElement> & {
  anchorId?: string;
  anchorPoint?: { x: number; y: number };
  open?: boolean;
  items?: MenuItem[];
  variant?: 'default' | 'solid' | 'flat' | 'contrast';
  density?: 'default' | 'compact' | 'comfortable';
  shape?: 'default' | 'square' | 'soft';
  elevation?: 'default' | 'none' | 'low' | 'high';
  tone?: 'default' | 'brand' | 'danger' | 'success';
  closeOnSelect?: boolean;
  typeahead?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (open: boolean) => void;
  onSelect?: (detail: { index: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }) => void;
};

export function ContextMenu(props: ContextMenuProps) {

  const {
    items,
    anchorId,
    anchorPoint,
    open,
    variant,
    density,
    shape,
    elevation,
    tone,
    closeOnSelect,
    typeahead,
    children,
    onOpen,
    onClose,
    onChange,
    onSelect,
    ...rest
  } = props;
  const ref = useRef<UIContextMenuElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const changeHandler = (event: Event) => {
      const next = (event as CustomEvent<{ open?: boolean }>).detail?.open;
      if (typeof next === 'boolean') onChange?.(next);
    };
    const selectHandler = (event: Event) => {
      onSelect?.((event as CustomEvent<{ index: number; value?: string; label?: string; checked?: boolean; item?: HTMLElement }>).detail);
    };

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);
    el.addEventListener('select', selectHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
      el.removeEventListener('select', selectHandler as EventListener);
    };
  }, [onOpen, onClose, onChange, onSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el || open == null) return;

    if (!open) {
      if (el.close) el.close();
      else el.open = false;
      return;
    }

    if (anchorPoint && el.openAt) {
      el.openAt(anchorPoint);
      return;
    }

    if (anchorId) {
      if (el.openForAnchorId) {
        el.openForAnchorId(anchorId);
        return;
      }
      if (el.showForAnchorId) {
        el.showForAnchorId(anchorId);
        return;
      }
    }

    el.open = true;
  }, [open, anchorId, anchorPoint]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (variant && variant !== 'default') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
  }, [variant]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
  }, [density]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shape && shape !== 'default') el.setAttribute('shape', shape);
    else el.removeAttribute('shape');
  }, [shape]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (elevation && elevation !== 'default') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');
  }, [elevation]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (tone && tone !== 'default' && tone !== 'brand') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');
  }, [tone]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (closeOnSelect == null) {
      el.removeAttribute('close-on-select');
      return;
    }
    el.setAttribute('close-on-select', closeOnSelect ? 'true' : 'false');
  }, [closeOnSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeahead == null) {
      el.removeAttribute('typeahead');
      return;
    }
    el.setAttribute('typeahead', typeahead ? 'true' : 'false');
  }, [typeahead]);

  // Render menu items recursively
  const renderMenuItems = (menuItems?: MenuItem[]) => {
    if (!menuItems) return null;
    return menuItems.map((item, i) => {
      if (item.separator) {
        return <div key={i} className="separator" role="separator" />;
      }
      let iconNode = null;
      if (item.icon) {
        iconNode = typeof item.icon === 'string' ? <span className="icon">{item.icon}</span> : item.icon;
      }
      let submenuNode = null;
      if (item.submenu) {
        submenuNode = (
          <div className="submenu">
            {renderMenuItems(item.submenu)}
          </div>
        );
      }
      return (
        <div
          key={i}
          className="menuitem"
          role="menuitem"
          tabIndex={item.disabled ? -1 : 0}
          aria-disabled={item.disabled ? 'true' : undefined}
          data-value={item.value}
          onClick={item.disabled ? undefined : item.onClick}
        >
          {iconNode}
          <span className="label">{item.label}</span>
          {item.submenu && <span className="submenu-arrow">▶</span>}
          {submenuNode}
        </div>
      );
    });
  };

  const hasChildren = React.Children.count(children) > 0;

  return (
    <ui-context-menu ref={ref} {...rest} {...(open ? { open: '' } : {})}>
      {hasChildren ? children : <div slot="menu">{renderMenuItems(items)}</div>}
    </ui-context-menu>
  );
}

export default ContextMenu;
