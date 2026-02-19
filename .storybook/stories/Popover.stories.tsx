import React from 'react';
import { Popover, Button } from '@editora/ui-react';

export default {
  title: 'UI/Popover',
  component: Popover
};

export const Default = (args: any) => (
  <div style={{ padding: 60 }}>
    <Popover>
      <Button slot="trigger">Show popover</Button>
      <div slot="content" style={{ padding: 8 }}>Popover content with <strong>HTML</strong></div>
    </Popover>
  </div>
);

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords, toggle, open } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 8 });
  return (
    <div style={{ padding: 80, position: 'relative' }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Anchor (headless)</button>
      <div {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <div style={{ padding: 8, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong>Headless panel</strong>
            <em style={{ color: '#666' }}>{coords.placement}</em>
            <div style={{ marginLeft: 'auto' }}><button onClick={() => toggle()}>{open ? 'Close' : 'Open'}</button></div>
          </div>
          <div style={{ marginTop: 8 }}>Use Arrow keys and Escape — keyboard helpers are wired by the headless hook.</div>
        </div>
      </div>
    </div>
  );
};

export const ArrowAndShift = () => (
  <div style={{ padding: 24 }}>
    <p>Click the button near the right edge to trigger <code>shift</code> and watch the arrow animate.</p>
    <div style={{ position: 'relative', height: 140 }}>
      <div style={{ position: 'absolute', right: 8, top: 40 }}>
        <Popover>
          <Button slot="trigger">Edge trigger</Button>
          <div slot="content" style={{ padding: 12, width: 220 }}>This popover uses arrow + shift — it should stay on-screen and the arrow will move smoothly.</div>
        </Popover>
      </div>
    </div>
  </div>
);
