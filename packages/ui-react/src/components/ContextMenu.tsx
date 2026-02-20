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
};

export function ContextMenu(props: ContextMenuProps) {

  const { items, anchorId, anchorPoint, open, children, ...rest } = props;
  const ref = useRef<UIContextMenuElement | null>(null);

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
