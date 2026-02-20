import React from 'react';
import { Box } from '@editora/ui-react';

export default {
  title: 'UI/Box',
  component: Box
};

export const Default = () => (
  <Box p="16px" bg="#f1f5f9" style={{ border: '1px solid #e2e8f0', borderRadius: 10 }}>
    Box with spacing shorthand
  </Box>
);

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
