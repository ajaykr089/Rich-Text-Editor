import React from 'react';
import { Menu, Button, Box, Grid, Flex } from '@editora/ui-react';

export default {
  title: 'UI/Menu',
  component: Menu,
  argTypes: {
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

const BaseMenuContent = () => (
  <Box slot="content">
    <Box role="menuitem" tabIndex={-1}><span className="icon">✏</span><span className="label">Rename</span><span className="shortcut">R</span></Box>
    <Box role="menuitem" tabIndex={-1}><span className="icon">⧉</span><span className="label">Duplicate</span><span className="shortcut">D</span></Box>
    <Box role="separator" className="separator" />
    <Box role="menuitem" tabIndex={-1}><span className="icon">📦</span><span className="label">Archive</span><span className="shortcut">A</span></Box>
    <Box role="menuitem" tabIndex={-1} data-value="delete" style={{ color: '#b91c1c' }}>
      <span className="icon">🗑</span><span className="label">Delete permanently</span><span className="shortcut">⌘⌫</span>
    </Box>
  </Box>
);

export const Playground = (args: any) => {
  const [last, setLast] = React.useState('none');

  return (
    <Box style={{ padding: 64 }}>
      <Menu
        open={args.open}
        placement={args.placement}
        variant={args.variant}
        density={args.density}
        shape={args.shape}
        elevation={args.elevation}
        tone={args.tone}
        closeOnSelect={args.closeOnSelect}
        typeahead={args.typeahead}
        onSelectDetail={(detail) => {
          const token = detail.label || detail.value || (typeof detail.index === 'number' ? `#${detail.index}` : 'item');
          setLast(token);
        }}
      >
        <Button slot="trigger">Open menu</Button>
        <BaseMenuContent />
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>
        Last action: {last}
      </Box>
    </Box>
  );
};

Playground.args = {
  open: false,
  placement: 'bottom',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  typeahead: true
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Default Soft</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open shape="soft">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Line / Warning</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Solid Comfortable</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Danger</strong>
      <Box style={{ marginTop: 10 }}>
        <Menu open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Actions</Button>
          <BaseMenuContent />
        </Menu>
      </Box>
    </Box>
  </Grid>
);

export const LegacySlotItems = () => {
  const actions = ['Rename', 'Duplicate', 'Archive', 'Delete'];
  const [selected, setSelected] = React.useState<number | null>(null);
  return (
    <Flex style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <Menu onSelect={(index) => setSelected(index)}>
        <Button slot="trigger" variant="secondary">Legacy item slots</Button>
        {actions.map((action) => (
          <Box key={action} slot="item">{action}</Box>
        ))}
      </Menu>
      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected index: {selected == null ? 'none' : selected} {selected == null ? '' : `(${actions[selected]})`}
      </Box>
    </Flex>
  );
};

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');
  return (
    <Box style={{ padding: 56 }}>
      <Menu
        open
        closeOnSelect={false}
        onSelectDetail={(detail) =>
          setLast(
            `${detail.label || detail.value || (typeof detail.index === 'number' ? `item-${detail.index}` : 'item')}${
              typeof detail.checked === 'boolean' ? ` (${detail.checked ? 'on' : 'off'})` : ''
            }`
          )
        }
      >
        <Button slot="trigger">View options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap-guides" tabIndex={-1}>Snap to guides</Box>
          <Box role="separator" className="separator" />
          <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
          <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-review" tabIndex={-1}>Mode: Review</Box>
        </Box>
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Box>
  );
};

export const SubmenuExample = () => {
  const [last, setLast] = React.useState('none');
  return (
    <Box style={{ padding: 56 }}>
      <Menu
        open
        closeOnSelect={false}
        onSelectDetail={(detail) => setLast(detail.label || detail.value || 'item')}
      >
        <Button slot="trigger">Project menu</Button>
        <Box slot="content">
          <Box role="menuitem" tabIndex={-1}>Rename</Box>
          <Box role="menuitem" tabIndex={-1}>Duplicate</Box>
          <Box role="separator" className="separator" />
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 8,
              gap: 8
            }}
          >
            <span style={{ fontSize: 13, color: '#334155' }}>Share</span>
            <Menu placement="right" density="compact" shape="square" variant="line" onSelectDetail={(detail) => setLast(`share:${detail.label || detail.value || 'item'}`)}>
              <button
                slot="trigger"
                style={{
                  fontSize: 12,
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  background: '#fff',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                More ▸
              </button>
              <Box slot="content">
                <Box role="menuitem" tabIndex={-1}>Copy link</Box>
                <Box role="menuitem" tabIndex={-1}>Invite by email</Box>
                <Box role="menuitem" tabIndex={-1}>Manage access</Box>
              </Box>
            </Menu>
          </Box>
          <Box role="separator" className="separator" />
          <Box role="menuitem" tabIndex={-1} style={{ color: '#b91c1c' }}>Delete</Box>
        </Box>
      </Menu>
      <Box style={{ marginTop: 12, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Box>
  );
};
