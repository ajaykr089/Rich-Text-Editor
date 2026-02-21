import React from 'react';
import { Box, Calendar, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Calendar',
  component: Calendar
};

const events = [
  { date: '2026-02-05', title: 'Ops review', tone: 'info' as const },
  { date: '2026-02-08', title: 'Billing run', tone: 'warning' as const },
  { date: '2026-02-13', title: 'Release cut', tone: 'success' as const },
  { date: '2026-02-13', title: 'Stakeholder demo', tone: 'default' as const },
  { date: '2026-02-18', title: 'Incident drill', tone: 'danger' as const },
  { date: '2026-02-24', title: 'Audit export', tone: 'info' as const }
];

export const Default = () => {
  const [value, setValue] = React.useState('2026-02-13');

  return (
    <Box style={{ maxWidth: 720, display: 'grid', gap: 12 }}>
      <Calendar
        year={2026}
        month={2}
        value={value}
        events={events}
        onSelect={(detail) => setValue(detail.value)}
      />
      <Flex style={{ fontSize: 13, color: '#475569' }}>Selected date: <strong style={{ marginLeft: 6 }}>{value}</strong></Flex>
    </Box>
  );
};

export const Contrast = () => (
  <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 720 }}>
    <Calendar variant="contrast" year={2026} month={2} value="2026-02-18" events={events} />
  </Box>
);
