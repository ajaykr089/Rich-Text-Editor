import React from 'react';
import { Grid } from '@editora/ui-react';

export default {
  title: 'UI/Grid',
  component: Grid
};

export const Default = () => (
  <Grid columns="repeat(3, minmax(0, 1fr))" gap="10px">
    <div style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>1</div>
    <div style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>2</div>
    <div style={{ background: '#e2e8f0', padding: 12, borderRadius: 8 }}>3</div>
  </Grid>
);

export const ResponsiveColumns = () => (
  <Grid
    columns={{ initial: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } as any}
    gap={{ initial: '8px', md: '12px' } as any}
  >
    {Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} style={{ background: '#f1f5f9', padding: 12, borderRadius: 8 }}>
        Item {idx + 1}
      </div>
    ))}
  </Grid>
);
