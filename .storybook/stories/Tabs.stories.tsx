import React from 'react';
import { Box, Grid, Tabs } from '@editora/ui-react';

export default {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    selected: { control: { type: 'number', min: 0, max: 3, step: 1 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activation: { control: 'select', options: ['auto', 'manual'] },
    variant: { control: 'select', options: ['default', 'soft', 'underline', 'contrast', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const Controlled = (args: any) => {
  const [selected, setSelected] = React.useState(Number(args.selected ?? 0));

  return (
    <Grid gap="12px" style={{ maxWidth: 760 }}>
      <Tabs
        selected={selected}
        orientation={args.orientation || 'horizontal'}
        activation={args.activation || 'auto'}
        variant={args.variant || 'soft'}
        size={args.size || 'md'}
        onChange={setSelected}
      >
        <div slot="tab" data-value="overview" data-icon="📊">Overview</div>
        <div slot="panel">Workspace metrics, revenue, and traffic baseline for this week.</div>

        <div slot="tab" data-value="activity" data-icon="🕒">Activity</div>
        <div slot="panel">Recent approvals, comment threads, and audit trail snapshots.</div>

        <div slot="tab" data-value="permissions" data-icon="🔐">Permissions</div>
        <div slot="panel">Role matrices and granular access overrides for enterprise tenants.</div>

        <div slot="tab" data-value="webhooks" data-icon="⚡">Webhooks</div>
        <div slot="panel">Outbound event delivery, retry queues, and endpoint health.</div>
      </Tabs>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected tab index: <strong>{selected}</strong>
      </Box>
    </Grid>
  );
};

Controlled.args = {
  selected: 0,
  orientation: 'horizontal',
  activation: 'auto',
  variant: 'soft',
  size: 'md'
};

export const VerticalManual = () => (
  <Box style={{ maxWidth: 860 }}>
    <Tabs orientation="vertical" activation="manual" variant="underline" selected={1}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Identity and organization metadata used across connected products.</div>

      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Invoices, payment instruments, and subscription breakdown.</div>

      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Alert channels, digest cadence, and escalation recipients.</div>
    </Tabs>
  </Box>
);

export const ContrastMode = () => (
  <Box variant="contrast" p="14px" radius="lg" style={{ maxWidth: 760 }}>
    <Tabs variant="contrast" tone="warning" size="lg" stretched selected={0}>
      <div slot="tab" data-value="alerts">Alerts</div>
      <div slot="panel">Incident feed with severity thresholds and acknowledgement windows.</div>

      <div slot="tab" data-value="runtime">Runtime</div>
      <div slot="panel">Container health, queue depth, and service-level objective trends.</div>

      <div slot="tab" data-value="logs">Logs</div>
      <div slot="panel">High-signal log stream with retention and query analytics.</div>
    </Tabs>
  </Box>
);
