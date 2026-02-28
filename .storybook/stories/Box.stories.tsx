import React from 'react';
import { Box, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Box',
  component: Box,
  argTypes: {
    variant: { control: 'select', options: ['default', 'surface', 'elevated', 'outline', 'glass', 'gradient', 'contrast'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    radius: { control: 'select', options: ['default', 'sm', 'lg', 'xl'] },
    interactive: { control: 'boolean' }
  }
};

export const Playground = (args: any) => (
  <Box
    p="16px"
    variant={args.variant}
    tone={args.tone}
    elevation={args.elevation}
    radius={args.radius}
    interactive={args.interactive}
    style={{ maxWidth: 420 }}
  >
    Modern ui-box visual mode with tokenized styling.
  </Box>
);

Playground.args = {
  variant: 'surface',
  tone: 'default',
  elevation: 'default',
  radius: 'default',
  interactive: false
};

export const ResponsiveSpacing = () => (
  <Box
    p={{ initial: '8px', md: '16px', lg: '24px' } as any}
    bg={{ initial: '#f8fafc', md: '#e2e8f0' } as any}
    color="#0f172a"
    style={{ borderRadius: 10 }}
  >
    Responsive box: padding and background change by breakpoint tokens.
  </Box>
);

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))', gap: 14 }}>
    <Box variant="surface" p="16px">Surface</Box>
    <Box variant="elevated" p="16px">Elevated</Box>
    <Box variant="outline" tone="brand" p="16px">Outline / Brand</Box>
    <Box variant="glass" radius="lg" p="16px" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}>Glass</Box>
    <Box variant="gradient" tone="success" p="16px">Gradient / Success</Box>
    <Box variant="contrast" p="16px">Contrast</Box>
  </Grid>
);
