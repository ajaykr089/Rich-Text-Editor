import React from 'react';
import { Flex } from '@editora/ui-react';

export default {
  title: 'UI/Flex',
  component: Flex
};

export const Default = () => (
  <Flex gap="8px" align="center" justify="space-between" style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
    <div style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Left</div>
    <div style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Center</div>
    <div style={{ background: '#e2e8f0', padding: 8, borderRadius: 8 }}>Right</div>
  </Flex>
);

export const ResponsiveProps = () => (
  <Flex
    direction={{ initial: 'column', md: 'row' } as any}
    gap={{ initial: '8px', md: '14px' } as any}
    align={{ initial: 'stretch', md: 'center' } as any}
    style={{ border: '1px dashed #cbd5e1', borderRadius: 10, padding: 12 }}
  >
    <div style={{ background: '#dbeafe', padding: 10, borderRadius: 8 }}>Card A</div>
    <div style={{ background: '#dcfce7', padding: 10, borderRadius: 8 }}>Card B</div>
    <div style={{ background: '#fef3c7', padding: 10, borderRadius: 8 }}>Card C</div>
  </Flex>
);
