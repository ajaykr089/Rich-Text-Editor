import React, { useState } from 'react';
import { Drawer, Button } from '@editora/ui-react';

export default {
  title: 'UI/Drawer',
  component: Drawer,
  argTypes: {
    open: { control: 'boolean' },
    side: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    dismissible: { control: 'boolean' }
  }
};

export const Controlled = (args: any) => {
  const [open, setOpen] = useState(!!args.open);

  return (
    <div style={{ minHeight: 220 }}>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>

      <Drawer
        open={open}
        side={args.side}
        dismissible={args.dismissible}
        onChange={setOpen}
      >
        <div slot="header" style={{ fontWeight: 700 }}>Filters</div>
        <div style={{ display: 'grid', gap: 10 }}>
          <label><input type="checkbox" defaultChecked /> Active only</label>
          <label><input type="checkbox" /> Include archived</label>
          <label><input type="checkbox" /> Assigned to me</label>
        </div>
        <div slot="footer" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={() => setOpen(false)}>Apply</Button>
        </div>
      </Drawer>
    </div>
  );
};
Controlled.args = { open: false, side: 'left', dismissible: true };

export const SideVariants = () => {
  const [openSide, setOpenSide] = useState<string | null>(null);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpenSide('left')}>Open Left</Button>
        <Button size="sm" onClick={() => setOpenSide('right')}>Open Right</Button>
        <Button size="sm" onClick={() => setOpenSide('top')}>Open Top</Button>
        <Button size="sm" onClick={() => setOpenSide('bottom')}>Open Bottom</Button>
      </div>

      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Drawer
          key={side}
          open={openSide === side}
          side={side}
          dismissible
          onChange={(next) => {
            if (!next && openSide === side) setOpenSide(null);
          }}
        >
          <div slot="header" style={{ fontWeight: 700, textTransform: 'capitalize' }}>{side} drawer</div>
          <p style={{ margin: 0 }}>Reusable panel for {side} anchored workflows.</p>
          <div slot="footer">
            <Button size="sm" onClick={() => setOpenSide(null)}>Close</Button>
          </div>
        </Drawer>
      ))}
    </div>
  );
};

export const TokenStyled = () => {
  const [open, setOpen] = useState(true);

  return (
    <Drawer
      open={open}
      side="right"
      dismissible
      onChange={setOpen}
      style={{
        ['--ui-drawer-width' as any]: '420px',
        ['--ui-drawer-bg' as any]: '#0f172a',
        ['--ui-drawer-color' as any]: '#e2e8f0',
        ['--ui-drawer-border' as any]: '#1e293b',
        ['--ui-drawer-overlay' as any]: 'rgba(2, 6, 23, 0.72)'
      }}
    >
      <div slot="header" style={{ fontWeight: 700 }}>Dark Drawer</div>
      <p style={{ margin: 0, color: '#cbd5e1' }}>Use tokens to align drawer with your dashboard theme.</p>
      <div slot="footer">
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
      </div>
    </Drawer>
  );
};
