import React, { useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, Sidebar } from '@editora/ui-react';

export default {
  title: 'UI/Sidebar',
  component: Sidebar,
  argTypes: {
    collapsed: { control: 'boolean' },
    collapsible: { control: 'boolean' },
    rail: { control: 'boolean' },
    position: { control: 'select', options: ['left', 'right'] },
    variant: { control: 'select', options: ['surface', 'soft', 'floating', 'contrast', 'minimal', 'split'] },
    density: { control: 'select', options: ['compact', 'default', 'comfortable'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const InteractiveShell = (args: any) => {
  const [value, setValue] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(!!args.collapsed);

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 440, border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
      <Sidebar
        value={value}
        collapsed={collapsed}
        collapsible={args.collapsible}
        rail={args.rail}
        position={args.position || 'left'}
        variant={args.variant || 'floating'}
        density={args.density || 'default'}
        size={args.size || 'md'}
        onSelect={(detail) => setValue(detail.value)}
        onToggle={setCollapsed}
      >
        <Flex slot="header" align="center" justify="space-between" style={{ fontWeight: 700 }}>
          <span>Editora Admin</span>
          <Badge tone="info" variant="soft" size="sm">v3</Badge>
        </Flex>

        <Box slot="search" variant="outline" radius="lg" p="8px" style={{ fontSize: 12, color: '#64748b' }}>
          Search apps, teams, reports...
        </Box>

        <Box slot="item" data-section="Workspace" data-value="dashboard" data-icon="🏠" data-description="Overview and KPIs" data-active>
          Dashboard
        </Box>
        <Box slot="item" data-section="Workspace" data-value="analytics" data-icon="📈" data-description="Funnels and retention" data-badge="12">
          Analytics
        </Box>
        <Box slot="item" data-section="Workspace" data-value="customers" data-icon="👥" data-description="Segments and lifecycle">
          Customers
        </Box>
        <Box slot="item" data-section="Operations" data-value="orders" data-icon="📦" data-description="Pending fulfillment" data-badge="8" data-tone="warning">
          Orders
        </Box>
        <Box slot="item" data-section="Operations" data-value="incidents" data-icon="🚨" data-description="Urgent incidents" data-badge="3" data-tone="danger">
          Incidents
        </Box>
        <Box slot="item" data-section="System" data-value="settings" data-icon="⚙️" data-description="Preferences and access">
          Settings
        </Box>

        <Box slot="footer">Signed in as owner@editora.dev</Box>
      </Sidebar>

      <Box variant="surface" p="20px" style={{ background: '#f8fafc' }}>
        <Box style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Section: {value}</Box>
        <Box style={{ color: '#475569', marginBottom: 12 }}>
          Production shell pattern with grouped items, badge states, keyboard navigation, and collapsible rail mode.
        </Box>
        <Flex gap="10px" align="center">
          <Button size="sm" variant="secondary" onClick={() => setCollapsed((current) => !current)}>
            {collapsed ? 'Expand nav' : 'Collapse nav'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setValue('dashboard')}>Reset selection</Button>
        </Flex>
      </Box>
    </Grid>
  );
};

InteractiveShell.args = {
  collapsed: false,
  collapsible: true,
  rail: false,
  position: 'left',
  variant: 'floating',
  density: 'default',
  size: 'md'
};

export const DataDriven = () => {
  const [value, setValue] = useState('overview');
  const items = useMemo(
    () => [
      { section: 'General', value: 'overview', label: 'Overview', icon: '🧭', description: 'Health summary', active: true },
      { section: 'General', value: 'reports', label: 'Reports', icon: '🧾', description: 'Revenue exports', badge: '4' },
      { section: 'Management', value: 'team', label: 'Team', icon: '🫂', description: 'Roles and invites' },
      { section: 'Management', value: 'security', label: 'Security', icon: '🔐', description: 'Policies', tone: 'danger' as const }
    ],
    []
  );

  return (
    <Grid columns="auto 1fr" style={{ minHeight: 360, border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
      <Sidebar
        items={items}
        value={value}
        variant="soft"
        tone="brand"
        showBadges
        collapsible
        onSelect={(detail) => setValue(detail.value)}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>Data-driven Navigation</Box>
      </Sidebar>
      <Box p="18px" style={{ background: '#f8fafc' }}>
        <strong>Active:</strong> {value}
      </Box>
    </Grid>
  );
};

export const VisualModes = () => (
  <Grid columns={{ initial: '1fr', lg: 'repeat(3, minmax(0, 1fr))' } as any} gap="14px">
    <Sidebar variant="surface" value="home" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Surface</Box>
      <Box slot="item" data-value="home" data-icon="🏠" data-active>Home</Box>
      <Box slot="item" data-value="updates" data-icon="🛰">Updates</Box>
      <Box slot="item" data-value="tasks" data-icon="✅">Tasks</Box>
    </Sidebar>

    <Sidebar variant="soft" tone="success" density="comfortable" value="review" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Soft Success</Box>
      <Box slot="item" data-value="builds" data-icon="⚙️">Builds</Box>
      <Box slot="item" data-value="review" data-icon="🔍" data-active>Review</Box>
      <Box slot="item" data-value="deploy" data-icon="🚀" data-badge="2">Deploy</Box>
    </Sidebar>

    <Sidebar variant="contrast" value="alerts" style={{ height: 300 }}>
      <Box slot="header" style={{ fontWeight: 700 }}>Contrast</Box>
      <Box slot="item" data-value="alerts" data-icon="🚨" data-tone="danger" data-active>Alerts</Box>
      <Box slot="item" data-value="ops" data-icon="🧠">Ops</Box>
      <Box slot="item" data-value="logs" data-icon="📜">Logs</Box>
      <Box slot="footer">24/7 command center</Box>
    </Sidebar>
  </Grid>
);
