import React, { useState } from 'react';
import { DirectionProvider, Button } from '@editora/ui-react';

export default {
  title: 'UI/DirectionProvider',
  component: DirectionProvider,
  argTypes: {
    dir: { control: 'select', options: ['ltr', 'rtl', 'auto'] }
  }
};

export const Default = (args: any) => (
  <DirectionProvider dir={args.dir}>
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
      <p style={{ margin: 0 }}>Navigation / التنقل / ניווט</p>
    </div>
  </DirectionProvider>
);
Default.args = { dir: 'ltr' };

export const ToggleDirection = () => {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Button size="sm" onClick={() => setDir((v) => (v === 'ltr' ? 'rtl' : 'ltr'))}>Switch direction ({dir})</Button>
      <DirectionProvider dir={dir}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <strong>Current dir:</strong> {dir}
          <p style={{ marginBottom: 0 }}>Toolbar | Sidebar | Inspector</p>
        </div>
      </DirectionProvider>
    </div>
  );
};
