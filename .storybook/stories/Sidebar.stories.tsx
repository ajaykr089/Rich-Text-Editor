import React, { useState } from 'react';
import { Sidebar, Button } from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    position: { control: 'select', options: ['left', 'right'] }
  }
};

export const Interactive = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(!!args.collapsed);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', minHeight: 360, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <Sidebar
        value={value}
        collapsed={collapsed}
        collapsible={args.collapsible}
        position={args.position}
        onSelect={(detail) => setValue(detail.value)}
        onToggle={setCollapsed}
      >
        <div slot="header" style={{ fontWeight: 700, padding: '6px 4px' }}>Editora</div>

        <div slot="item" data-value="dashboard" data-icon="🏠" data-active>Dashboard</div>
        <div slot="item" data-value="users" data-icon="👥">Users</div>
        <div slot="item" data-value="analytics" data-icon="📊">Analytics</div>
        <div slot="item" data-value="settings" data-icon="⚙️">Settings</div>

        <div slot="footer" style={{ fontSize: 12, color: '#64748b', padding: '4px 6px' }}>v2.0</div>
      </Sidebar>

      <main style={{ padding: 20, background: '#f8fafc' }}>
        <h3 style={{ marginTop: 0 }}>Admin Content</h3>
        <p style={{ color: '#475569' }}>Selected section: <strong>{value}</strong></p>
        <Button size="sm" variant="secondary" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        </Button>
      </main>
    </div>
  );
};
Interactive.args = { collapsed: false, collapsible: true, position: 'left' };

export const RightPosition = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', minHeight: 320, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
    <main style={{ padding: 20, background: '#f8fafc' }}>
      Content area with right-side inspector navigation.
    </main>
    <Sidebar position="right" value="inspector">
      <div slot="header" style={{ fontWeight: 700, padding: '6px 4px' }}>Inspector</div>
      <div slot="item" data-value="inspector" data-icon="🧩">Inspector</div>
      <div slot="item" data-value="activity" data-icon="🕘">Activity</div>
      <div slot="item" data-value="history" data-icon="🧾">History</div>
    </Sidebar>
  </div>
);

export const CustomTokens = () => (
  <Sidebar
    collapsible
    style={{
      ['--ui-sidebar-width' as any]: '280px',
      ['--ui-sidebar-bg' as any]: '#0f172a',
      ['--ui-sidebar-color' as any]: '#e2e8f0',
      ['--ui-sidebar-border' as any]: '#1e293b',
      ['--ui-sidebar-accent-bg' as any]: '#1e3a8a22',
      ['--ui-sidebar-accent-color' as any]: '#93c5fd'
    }}
  >
    <div slot="header" style={{ fontWeight: 700, padding: '6px 4px' }}>Dark Nav</div>
    <div slot="item" data-value="overview" data-icon="📌" data-active>Overview</div>
    <div slot="item" data-value="reports" data-icon="🧮">Reports</div>
    <div slot="item" data-value="billing" data-icon="💳">Billing</div>
  </Sidebar>
);
