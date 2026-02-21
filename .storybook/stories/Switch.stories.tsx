import React from 'react';
import { Box, Flex, Grid, Switch } from '@editora/ui-react';

export default {
  title: 'UI/Switch',
  component: Switch,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'soft', 'outline', 'contrast', 'minimal'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] }
  }
};

export const Controlled = (args: any) => {
  const [checked, setChecked] = React.useState(Boolean(args.checked));

  return (
    <Grid gap="12px" style={{ maxWidth: 460 }}>
      <Switch
        checked={checked}
        disabled={args.disabled}
        size={args.size || 'md'}
        variant={args.variant || 'default'}
        tone={args.tone || 'brand'}
        onChange={(detail) => setChecked(detail.checked)}
      >
        Enable workspace automations
        <span slot="description">Run triggers when publishing or archiving content.</span>
      </Switch>

      <Box variant="surface" p="10px" style={{ fontSize: 13, color: '#475569' }}>
        Current state: <strong>{checked ? 'on' : 'off'}</strong>
      </Box>
    </Grid>
  );
};

Controlled.args = {
  checked: true,
  disabled: false,
  size: 'md',
  variant: 'default',
  tone: 'brand'
};

export const VisualModes = () => (
  <Grid gap="12px" style={{ maxWidth: 680 }}>
    <Flex gap="12px" wrap="wrap">
      <Switch checked variant="default">Default</Switch>
      <Switch checked variant="soft">Soft</Switch>
      <Switch checked variant="outline">Outline</Switch>
      <Switch checked variant="minimal">Minimal</Switch>
    </Flex>

    <Box variant="contrast" p="12px" radius="lg">
      <Switch checked variant="contrast" tone="warning">
        Contrast mode
        <span slot="description">Improved visibility for command center layouts.</span>
      </Switch>
    </Box>

    <Flex gap="12px" wrap="wrap">
      <Switch checked tone="success">Healthy sync</Switch>
      <Switch checked tone="warning">Pending approvals</Switch>
      <Switch checked tone="danger">Destructive action</Switch>
      <Switch disabled checked>Disabled</Switch>
    </Flex>
  </Grid>
);
