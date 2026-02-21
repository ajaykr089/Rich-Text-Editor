import React from 'react';
import { Box, Grid, Toggle, ToggleGroup } from '@editora/ui-react';

export default {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  argTypes: {
    multiple: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant: { control: 'select', options: ['default', 'soft', 'contrast', 'minimal'] },
    activation: { control: 'select', options: ['auto', 'manual'] }
  }
};

export const SingleSelect = () => {
  const [value, setValue] = React.useState('left');

  return (
    <Grid gap="12px" style={{ maxWidth: 520 }}>
      <ToggleGroup
        value={value}
        orientation="horizontal"
        variant="soft"
        onValueChange={(detail) => {
          if (typeof detail.value === 'string') setValue(detail.value);
        }}
      >
        <Toggle value="left">Left</Toggle>
        <Toggle value="center">Center</Toggle>
        <Toggle value="right">Right</Toggle>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>Alignment: <strong>{value}</strong></Box>
    </Grid>
  );
};

export const MultipleSelect = () => {
  const [value, setValue] = React.useState<string[]>(['bold']);

  return (
    <Grid gap="12px" style={{ maxWidth: 560 }}>
      <ToggleGroup
        multiple
        value={value}
        variant="default"
        onValueChange={(detail) => {
          if (Array.isArray(detail.value)) setValue(detail.value);
        }}
      >
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
        <Toggle value="underline">Underline</Toggle>
        <Toggle value="strike">Strike</Toggle>
      </ToggleGroup>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Active styles: <strong>{value.join(', ') || 'none'}</strong>
      </Box>
    </Grid>
  );
};

export const VerticalContrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 280 }}>
    <ToggleGroup orientation="vertical" variant="contrast" multiple value={["overview", "alerts"]}>
      <Toggle value="overview">Overview</Toggle>
      <Toggle value="analytics">Analytics</Toggle>
      <Toggle value="alerts">Alerts</Toggle>
      <Toggle value="settings">Settings</Toggle>
    </ToggleGroup>
  </Box>
);
