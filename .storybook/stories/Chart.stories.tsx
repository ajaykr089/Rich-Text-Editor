import React from 'react';
import { Box, Chart, Flex, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Chart',
  component: Chart,
  argTypes: {
    type: { control: 'select', options: ['line', 'area', 'bar', 'donut'] },
    variant: { control: 'select', options: ['default', 'contrast', 'minimal'] }
  }
};

const revenueData = [
  { label: 'Mon', value: 28 },
  { label: 'Tue', value: 34 },
  { label: 'Wed', value: 31 },
  { label: 'Thu', value: 38 },
  { label: 'Fri', value: 44 },
  { label: 'Sat', value: 36 },
  { label: 'Sun', value: 42 }
];

export const Playground = (args: any) => (
  <Box style={{ maxWidth: 820 }}>
    <Chart
      type={args.type || 'line'}
      variant={args.variant || 'default'}
      title="Weekly Revenue"
      subtitle="USD in thousands"
      data={revenueData}
    />
  </Box>
);

Playground.args = {
  type: 'line',
  variant: 'default'
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
    <Chart type="line" title="Line" subtitle="Conversion" data={revenueData} />
    <Chart type="area" title="Area" subtitle="Traffic" data={revenueData} />
    <Chart type="bar" title="Bar" subtitle="Orders" data={revenueData} />
    <Chart
      type="donut"
      title="Donut"
      subtitle="Channel split"
      data={[
        { label: 'Direct', value: 42, tone: '#2563eb' },
        { label: 'Search', value: 33, tone: '#16a34a' },
        { label: 'Referral', value: 15, tone: '#d97706' },
        { label: 'Other', value: 10, tone: '#dc2626' }
      ]}
    />
  </Grid>
);

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg">
    <Flex gap="12px" wrap="wrap">
      <Box style={{ minWidth: 260, flex: 1 }}>
        <Chart variant="contrast" type="line" title="Runtime Errors" subtitle="Last 7 days" data={revenueData.map((point) => ({ ...point, value: point.value / 3 }))} />
      </Box>
      <Box style={{ minWidth: 260, flex: 1 }}>
        <Chart variant="contrast" type="donut" title="Incident Types" data={[
          { label: 'API', value: 14, tone: '#93c5fd' },
          { label: 'DB', value: 7, tone: '#34d399' },
          { label: 'Infra', value: 4, tone: '#fbbf24' }
        ]} />
      </Box>
    </Flex>
  </Box>
);
