import React, { useState } from 'react';
import { AppHeader, Button, Drawer, Sidebar } from '@editora/ui-react';

export default {
  title: 'UI/AppHeader',
  component: AppHeader,
  argTypes: {
    sticky: { control: 'boolean' },
    bordered: { control: 'boolean' },
    dense: { control: 'boolean' },
    showMenuButton: { control: 'boolean' }
  }
};

export const Default = (args: any) => {
  const [menuCount, setMenuCount] = useState(0);

  return (
    <div style={{ minHeight: 220 }}>
      <AppHeader
        sticky={args.sticky}
        bordered={args.bordered}
        dense={args.dense}
        showMenuButton={args.showMenuButton}
        onMenuTrigger={() => setMenuCount((v) => v + 1)}
      >
        <div slot="start" style={{ fontWeight: 700 }}>Editora Admin</div>
        <div slot="title">Workspace</div>
        <div slot="end" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary">Search</Button>
          <Button size="sm">Create</Button>
        </div>
      </AppHeader>

      <div style={{ padding: 16, color: '#475569', fontSize: 13 }}>
        Menu trigger count: {menuCount}
      </div>
    </div>
  );
};
Default.args = { sticky: false, bordered: true, dense: false, showMenuButton: true };

export const MobileShell = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dashboard');

  return (
    <div style={{ minHeight: 360, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <AppHeader bordered showMenuButton onMenuTrigger={() => setOpen(true)}>
        <div slot="title">Admin Shell</div>
        <div slot="end">
          <Button size="sm" variant="secondary">Profile</Button>
        </div>
      </AppHeader>

      <main style={{ padding: 16, background: '#f8fafc', minHeight: 280 }}>
        <h3 style={{ marginTop: 0 }}>Page: {active}</h3>
        <p style={{ color: '#475569' }}>This pattern combines AppHeader + Drawer + Sidebar for mobile nav.</p>
      </main>

      <Drawer open={open} side="left" dismissible onChange={setOpen}>
        <div slot="header" style={{ fontWeight: 700 }}>Navigation</div>
        <Sidebar value={active} onSelect={(detail) => { setActive(detail.value); setOpen(false); }}>
          <div slot="item" data-value="dashboard" data-icon="🏠" data-active>Dashboard</div>
          <div slot="item" data-value="users" data-icon="👥">Users</div>
          <div slot="item" data-value="reports" data-icon="📊">Reports</div>
          <div slot="item" data-value="settings" data-icon="⚙️">Settings</div>
        </Sidebar>
      </Drawer>
    </div>
  );
};
