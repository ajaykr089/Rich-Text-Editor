import React from 'react';
import { Dropdown, Button } from '@editora/ui-react';

export default {
  title: 'UI/Dropdown',
  component: Dropdown
};

export const Default = (args: any) => (
  <Dropdown>
    <Button slot="trigger">Open dropdown</Button>
    <div slot="content" style={{ padding: 8 }}>
      <div style={{ padding: 6 }}>Item 1</div>
      <div style={{ padding: 6 }}>Item 2</div>
      <div style={{ padding: 6 }}>Item 3</div>
    </div>
  </Dropdown>
);

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 6 });
  return (
    <div style={{ padding: 80 }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Headless trigger</button>
      <div {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <div style={{ background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)', minWidth: 160 }} role="menu">
          <div role="menuitem" tabIndex={-1} style={{ padding: 8 }}>First (headless)</div>
          <div role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Second</div>
          <div role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Third</div>
        </div>
      </div>
    </div>
  );
};
