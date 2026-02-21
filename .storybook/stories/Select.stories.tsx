import React from 'react';
import { Box, Flex, Grid, Select, Separator } from '@editora/ui-react';

export default {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    variant: { control: 'select', options: ['classic', 'surface', 'soft', 'filled', 'glass', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    tone: { control: 'select', options: ['default', 'brand', 'success', 'warning', 'danger'] },
    validation: { control: 'select', options: ['none', 'success', 'warning', 'error'] }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState(args.value || 'draft');

  return (
    <Grid style={{ display: 'grid', gap: 14, maxWidth: 360 }}>
      <Select
        {...args}
        label="Workflow status"
        description="Used by approvers and automations."
        value={value}
        onChange={setValue}
        variant={args.variant || 'glass'}
        tone={args.tone || 'brand'}
        validation={args.validation && args.validation !== 'none' ? args.validation : undefined}
      >
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected value: {value}</Box>
    </Grid>
  );
};

Controlled.args = {
  value: 'draft',
  disabled: false,
  size: 'md',
  variant: 'glass',
  tone: 'brand',
  validation: 'none'
};

export const Disabled = () => (
  <Grid style={{ display: 'grid', gap: 14, maxWidth: 340 }}>
    <Select disabled value="published" label="Environment" variant="surface">
      <option value="dev">Development</option>
      <option value="staging">Staging</option>
      <option value="published">Production</option>
    </Select>
    <Select disabled value="" placeholder="Choose owner" variant="filled" />
  </Grid>
);

export const VisualModes = () => {
  const [priority, setPriority] = React.useState('high');
  return (
    <Grid style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Box style={{ minWidth: 220 }}>
          <Select label="Classic" value={priority} onChange={setPriority} variant="classic">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
            <option value="critical">Critical</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Soft / success" value="healthy" variant="soft" tone="success" validation="success">
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="outage">Outage</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 220 }}>
          <Select label="Contrast" value="ops" variant="contrast" tone="warning" description="For dark command center cards">
            <option value="ops">Ops</option>
            <option value="support">Support</option>
            <option value="security">Security</option>
          </Select>
        </Box>
      </Flex>
      <Separator label="Sizes + Radius" variant="gradient" />
      <Flex style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Box style={{ minWidth: 210 }}>
          <Select size="sm" label="Small" value="week">
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 210 }}>
          <Select size="md" radius="large" label="Large radius" value="month" variant="glass">
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </Select>
        </Box>
        <Box style={{ minWidth: 210 }}>
          <Select size="lg" radius="full" label="Pill" value="quarter" variant="soft">
            <option value="month">Monthly</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </Select>
        </Box>
      </Flex>
    </Grid>
  );
};
