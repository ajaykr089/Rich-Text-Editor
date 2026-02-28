import React from 'react';
import { Box, ContextMenu, Grid } from '@editora/ui-react';

export default {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success'] },
    closeOnSelect: { control: 'boolean' },
    typeahead: { control: 'boolean' }
  }
};

const MenuTemplate = () => (
  <div slot="menu">
    <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">📄</span><span className="label">New file</span></div>
    <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">📝</span><span className="label">Rename</span></div>
    <div className="menuitem" role="menuitem" tabIndex={0}><span className="icon">📤</span><span className="label">Share</span></div>
    <div className="separator" role="separator" />
    <div className="menuitem" role="menuitem" tabIndex={0}>
      <span className="icon">➡</span><span className="label">Move to</span>
      <div className="submenu">
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Workspace</span></div>
        <div className="menuitem" role="menuitem" tabIndex={0}><span className="label">Archive</span></div>
      </div>
    </div>
    <div className="menuitem" role="menuitem" tabIndex={-1} aria-disabled="true"><span className="icon">🗑</span><span className="label">Delete (disabled)</span></div>
  </div>
);

export const Playground = (args: any) => (
  <Box>
    <Box id="ctx-anchor" style={{ margin: 40, padding: 20, border: '1px dashed #cbd5e1', borderRadius: 10, display: 'inline-block' }}>
      Anchor element
    </Box>
    <ContextMenu
      anchorId={args.anchorId || 'ctx-anchor'}
      open={args.open}
      variant={args.variant}
      density={args.density}
      shape={args.shape}
      elevation={args.elevation}
      tone={args.tone}
      closeOnSelect={args.closeOnSelect}
      typeahead={args.typeahead}
    >
      <MenuTemplate />
    </ContextMenu>
  </Box>
);

Playground.args = {
  open: true,
  anchorId: 'ctx-anchor',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  typeahead: true
};

export const VisualVariants = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(260px, 1fr))', gap: 14, padding: 20 }}>
    <Box style={{ position: 'relative', minHeight: 200, border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Default / Soft</strong>
      <Box id="ctx-v-default" style={{ marginTop: 10, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'inline-block' }}>Open</Box>
      <ContextMenu open anchorId="ctx-v-default" shape="soft">
        <MenuTemplate />
      </ContextMenu>
    </Box>

    <Box style={{ position: 'relative', minHeight: 200, border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square / Flat</strong>
      <Box id="ctx-v-square" style={{ marginTop: 10, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'inline-block' }}>Open</Box>
      <ContextMenu open anchorId="ctx-v-square" shape="square" variant="flat" elevation="none">
        <MenuTemplate />
      </ContextMenu>
    </Box>

    <Box style={{ position: 'relative', minHeight: 200, border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Compact / Solid</strong>
      <Box id="ctx-v-compact" style={{ marginTop: 10, padding: 10, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'inline-block' }}>Open</Box>
      <ContextMenu open anchorId="ctx-v-compact" density="compact" variant="solid" elevation="low">
        <MenuTemplate />
      </ContextMenu>
    </Box>

    <Box style={{ position: 'relative', minHeight: 200, border: '1px solid #1e293b', background: '#0f172a', color: '#e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Contrast / Danger Tone</strong>
      <Box id="ctx-v-contrast" style={{ marginTop: 10, padding: 10, border: '1px dashed #475569', borderRadius: 8, display: 'inline-block' }}>Open</Box>
      <ContextMenu open anchorId="ctx-v-contrast" variant="contrast" tone="danger" elevation="high">
        <MenuTemplate />
      </ContextMenu>
    </Box>
  </Grid>
);

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');
  return (
    <Box style={{ padding: 32 }}>
      <Box id="ctx-functional" style={{ padding: 14, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'inline-block' }}>
        Functional context menu
      </Box>

      <Box style={{ marginTop: 10, fontSize: 13, color: '#475569' }}>Last action: {last}</Box>

      <ContextMenu
        open
        anchorId="ctx-functional"
        closeOnSelect={false}
        onSelect={(detail) => setLast(`${detail.label || detail.value || 'item'}${typeof detail.checked === 'boolean' ? ` (${detail.checked ? 'on' : 'off'})` : ''}`)}
      >
        <div slot="menu">
          <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={0}><span className="label">Show grid</span></div>
          <div className="menuitem" role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={0}><span className="label">Snap to guides</span></div>
          <div className="separator" role="separator" />
          <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="true" data-value="theme-light" tabIndex={0}><span className="label">Theme: Light</span></div>
          <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-dark" tabIndex={0}><span className="label">Theme: Dark</span></div>
          <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-system" tabIndex={0}><span className="label">Theme: System</span></div>
        </div>
      </ContextMenu>
    </Box>
  );
};

export const RightClickDemo = () => {
  const [state, setState] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });
  return (
    <Box style={{ padding: 40 }} onContextMenu={(e) => { e.preventDefault(); setState({ open: true, point: { x: e.clientX, y: e.clientY } }); }}>
      <Box style={{ padding: 20, border: '1px dashed #cbd5e1', borderRadius: 8, display: 'inline-block' }}>Right-click in this box</Box>
      <ContextMenu open={state.open} anchorPoint={state.point} shape="square" density="comfortable">
        <MenuTemplate />
      </ContextMenu>
    </Box>
  );
};
