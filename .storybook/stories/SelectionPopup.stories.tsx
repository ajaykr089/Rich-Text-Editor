import React, { useState } from 'react';
import { SelectionPopup, Button , Box, Grid, Flex} from '@editora/ui-react';

export default {
  title: 'UI/SelectionPopup',
  component: SelectionPopup,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right', 'auto'] },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'glass', 'contrast'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  }
};

export const Default = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [message, setMessage] = useState('No quick action selected');
  const anchorId = args.anchorId || 'sel-anchor';

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show popup</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide popup</Button>
      </Flex>

      <Box id={anchorId} style={{ margin: 42, padding: 18, border: '1px dashed #94a3b8', borderRadius: 12, display: 'inline-block', background: '#f8fafc' }}>
        Highlight this paragraph region to trigger formatting actions.
      </Box>

      <SelectionPopup
        anchorId={anchorId}
        open={open}
        placement={args.placement || 'top'}
        variant={args.variant || 'glass'}
        size={args.size || 'md'}
        arrow
        onClose={() => setOpen(false)}
      >
        <Flex slot="content" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMessage('Bold applied')}>Bold</Button>
          <Button size="sm" variant="secondary" onClick={() => setMessage('Comment added')}>Comment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMessage('Tag created')}>Tag</Button>
        </Flex>
      </SelectionPopup>

      <Box style={{ fontSize: 13, color: '#475569' }}>{message}</Box>
    </Grid>
  );
};
Default.args = { open: true, anchorId: 'sel-anchor', placement: 'top', variant: 'glass', size: 'md' };

export const PlacementMatrix = () => {
  const [openId, setOpenId] = useState('top-anchor');

  const items = [
    { id: 'top-anchor', label: 'Top', placement: 'top' as const },
    { id: 'right-anchor', label: 'Right', placement: 'right' as const },
    { id: 'bottom-anchor', label: 'Bottom', placement: 'bottom' as const },
    { id: 'left-anchor', label: 'Left', placement: 'left' as const }
  ];

  return (
    <Grid style={{ display: 'grid', gap: 16 }}>
      <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map((item) => (
          <Button key={item.id} size="sm" variant={openId === item.id ? 'primary' : 'secondary'} onClick={() => setOpenId(item.id)}>
            {item.label}
          </Button>
        ))}
      </Flex>
      <Flex style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Box
            key={item.id}
            id={item.id}
            style={{
              minWidth: 130,
              padding: 14,
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#ffffff'
            }}
          >
            Anchor: {item.label}
            <SelectionPopup
              anchorId={item.id}
              open={openId === item.id}
              placement={item.placement}
              arrow
              variant={item.id === 'left-anchor' ? 'contrast' : 'soft'}
              tone={item.id === 'bottom-anchor' ? 'success' : 'brand'}
              closeOnOutside
              onClose={() => setOpenId('')}
            >
              <Box slot="content" style={{ padding: 4, fontSize: 12 }}>
                Popup placement: {item.placement}
              </Box>
            </SelectionPopup>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
};
