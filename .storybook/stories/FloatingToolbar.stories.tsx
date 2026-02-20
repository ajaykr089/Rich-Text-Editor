import React, { useState } from 'react';
import { FloatingToolbar, Button } from '@editora/ui-react';

export default {
  title: 'UI/FloatingToolbar',
  component: FloatingToolbar,
  argTypes: {
    anchorId: { control: 'text' },
    open: { control: 'boolean' }
  }
};

export const Anchored = (args: any) => {
  const [open, setOpen] = useState(!!args.open);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide</Button>
      </div>

      <div
        id={args.anchorId}
        style={{ margin: 80, padding: 24, border: '1px dashed #cbd5e1', borderRadius: 12, display: 'inline-block' }}
      >
        Select this block
      </div>

      <FloatingToolbar anchorId={args.anchorId} open={open}>
        <div slot="toolbar" style={{ display: 'flex', gap: 8, padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <Button size="sm">Bold</Button>
          <Button size="sm">Italic</Button>
          <Button size="sm" variant="secondary">Link</Button>
        </div>
      </FloatingToolbar>
    </div>
  );
};
Anchored.args = { anchorId: 'storybook-anchor', open: true };

export const MultipleAnchors = () => {
  const [anchorId, setAnchorId] = useState('anchor-a');
  const [open, setOpen] = useState(true);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setAnchorId('anchor-a')}>Anchor A</Button>
        <Button size="sm" onClick={() => setAnchorId('anchor-b')}>Anchor B</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen((v) => !v)}>{open ? 'Hide' : 'Show'}</Button>
      </div>
      <div id="anchor-a" style={{ padding: 16, border: '1px solid #dbeafe', borderRadius: 10 }}>First anchor</div>
      <div id="anchor-b" style={{ padding: 16, border: '1px solid #fde68a', borderRadius: 10 }}>Second anchor</div>

      <FloatingToolbar anchorId={anchorId} open={open}>
        <div slot="toolbar" style={{ display: 'flex', gap: 8, padding: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
          <Button size="sm">{anchorId === 'anchor-a' ? 'A Action' : 'B Action'}</Button>
        </div>
      </FloatingToolbar>
    </div>
  );
};
