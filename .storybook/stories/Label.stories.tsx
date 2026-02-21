import React from 'react';
import { Box, Grid, Input, Label } from '@editora/ui-react';

export default {
  title: 'UI/Label',
  component: Label,
  argTypes: {
    htmlFor: { control: 'text' },
    required: { control: 'boolean' },
    description: { control: 'text' },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'contrast', 'minimal', 'elevated'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', '1', '2', '3'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] }
  }
};

export const Playground = (args: any) => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label
      htmlFor={args.htmlFor}
      required={args.required}
      description={args.description}
      variant={args.variant}
      tone={args.tone}
      size={args.size}
      density={args.density}
      shape={args.shape}
    >
      Workspace name
    </Label>
    <Input id={args.htmlFor} placeholder="Acme Production" />
  </Grid>
);

Playground.args = {
  htmlFor: 'storybook-label-input',
  required: true,
  description: 'Used in account settings and billing reports.',
  variant: 'surface',
  tone: 'default',
  size: 'md',
  density: 'default',
  shape: 'default'
};

export const ProModes = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))' }}>
    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
      <Label htmlFor="label-mui" variant="surface" tone="brand">MUI-like Label</Label>
      <Input id="label-mui" placeholder="Outlined control" variant="outlined" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, background: 'linear-gradient(145deg, #f8fafc, #eef2ff)' }}>
      <Label htmlFor="label-chakra" variant="soft" tone="success" shape="soft" description="Low-noise form grouping">Chakra-like Label</Label>
      <Input id="label-chakra" placeholder="Soft control" variant="soft" shape="soft" />
    </Box>

    <Box style={{ display: 'grid', gap: 8, border: '1px solid #1e293b', borderRadius: 12, padding: 12, background: '#020617' }}>
      <Label htmlFor="label-ant" variant="contrast" description="Dark admin mode">Ant-like Label</Label>
      <Input id="label-ant" placeholder="Contrast control" variant="contrast" />
    </Box>
  </Grid>
);

export const WithHintSlot = () => (
  <Grid style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
    <Label htmlFor="storybook-email-input" required>
      Email
      <span slot="description">We use this only for account notifications.</span>
    </Label>
    <Input id="storybook-email-input" type="email" placeholder="you@company.com" />
  </Grid>
);
