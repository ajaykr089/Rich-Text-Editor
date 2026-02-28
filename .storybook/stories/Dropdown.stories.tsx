import React from 'react';
import { Box, Button, Dropdown, Grid } from '@editora/ui-react';

export default {
  title: 'UI/Dropdown',
  component: Dropdown,
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

const MenuContent = () => (
  <Box slot="content">
    <Box role="menuitem" tabIndex={-1}><span className="icon">✏</span><span className="label">Edit</span><span className="shortcut">E</span></Box>
    <Box role="menuitem" tabIndex={-1}><span className="icon">⧉</span><span className="label">Duplicate</span><span className="shortcut">D</span></Box>
    <Box className="separator" role="separator" />
    <Box role="menuitem" tabIndex={-1}><span className="icon">🗂</span><span className="label">Archive</span><span className="meta">⌘A</span></Box>
  </Box>
);

export const Playground = (args: any) => (
  <Box style={{ padding: 60 }}>
    <Dropdown
      open={args.open}
      placement={args.placement}
      variant={args.variant}
      density={args.density}
      shape={args.shape}
      elevation={args.elevation}
      tone={args.tone}
      closeOnSelect={args.closeOnSelect}
      typeahead={args.typeahead}
    >
      <Button slot="trigger">Open dropdown</Button>
      <MenuContent />
    </Dropdown>
  </Box>
);

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

export const VisualVariants = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Soft Default</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open shape="soft" placement="bottom">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open shape="square" variant="flat" elevation="none" density="compact">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Line / Compact</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="line" shape="square" density="compact" tone="warning">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Solid Comfortable</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="solid" density="comfortable" elevation="low">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass Surface</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="glass" shape="soft" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>

    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Danger Tone</strong>
      <Box style={{ marginTop: 10 }}>
        <Dropdown open variant="contrast" tone="danger" elevation="high">
          <Button slot="trigger">Trigger</Button>
          <MenuContent />
        </Dropdown>
      </Box>
    </Box>
  </Grid>
);

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');
  return (
    <Box style={{ padding: 56 }}>
      <Dropdown
        open
        closeOnSelect={false}
        onSelect={(d) => setLast(`${d.label || d.value || 'item'}${typeof d.checked === 'boolean' ? ` (${d.checked ? 'on' : 'off'})` : ''}`)}
      >
        <Button slot="trigger">Options</Button>
        <Box slot="content">
          <Box role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={-1}>Show grid</Box>
          <Box role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={-1}>Snap to guides</Box>
          <Box className="separator" role="separator" />
          <Box role="menuitemradio" data-group="mode" aria-checked="true" data-value="mode-edit" tabIndex={-1}>Mode: Edit</Box>
          <Box role="menuitemradio" data-group="mode" aria-checked="false" data-value="mode-read" tabIndex={-1}>Mode: Read</Box>
        </Box>
      </Dropdown>
      <Box style={{ marginTop: 10, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>
    </Box>
  );
};

export const Headless = () => {
  const { referenceRef, floatingRef, getReferenceProps, getFloatingProps, coords } = require('@editora/ui-react').useFloating({ placement: 'bottom', offset: 6 });
  return (
    <Box style={{ padding: 80 }}>
      <button {...getReferenceProps()} ref={referenceRef as any} style={{ padding: '8px 12px' }}>Headless trigger</button>
      <Box {...getFloatingProps()} ref={floatingRef as any} style={{ position: 'absolute', top: coords.top, left: coords.left, pointerEvents: 'auto' }}>
        <Box style={{ background: '#fff', border: '1px solid #e6e6e6', borderRadius: 6, boxShadow: '0 8px 30px rgba(2,6,23,0.08)', minWidth: 160 }} role="menu">
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>First (headless)</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Second</Box>
          <Box role="menuitem" tabIndex={-1} style={{ padding: 8 }}>Third</Box>
        </Box>
      </Box>
    </Box>
  );
};
