import React from 'react';
import { Menubar, Menu, Box, Grid, Flex, Button } from '@editora/ui-react';

export default {
  title: 'UI/Menubar',
  component: Menubar,
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' },
    placement: { control: 'select', options: ['bottom', 'top', 'left', 'right'] },
    variant: { control: 'select', options: ['default', 'solid', 'flat', 'line', 'glass', 'contrast'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    shape: { control: 'select', options: ['default', 'square', 'soft'] },
    elevation: { control: 'select', options: ['default', 'none', 'low', 'high'] },
    tone: { control: 'select', options: ['default', 'brand', 'danger', 'success', 'warning'] }
  }
};

function EditorMenubar(args: any) {
  return (
    <Menubar {...args}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitem" tabIndex={-1}><span className="icon">📄</span><span className="label">New document</span><span className="shortcut">⌘N</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">📂</span><span className="label">Open…</span><span className="shortcut">⌘O</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">💾</span><span className="label">Save</span><span className="shortcut">⌘S</span></Box>
        <Box role="separator" className="separator" />
        <Box role="menuitem" tabIndex={-1}><span className="icon">📤</span><span className="label">Export PDF</span><span className="shortcut">⇧⌘E</span></Box>
      </Box>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitem" tabIndex={-1}><span className="icon">↶</span><span className="label">Undo</span><span className="shortcut">⌘Z</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">↷</span><span className="label">Redo</span><span className="shortcut">⇧⌘Z</span></Box>
        <Box role="separator" className="separator" />
        <Box role="menuitem" tabIndex={-1}><span className="icon">🔎</span><span className="label">Find</span><span className="shortcut">⌘F</span></Box>
        <Box role="menuitem" tabIndex={-1}><span className="icon">🪄</span><span className="label">Replace</span><span className="shortcut">⌘H</span></Box>
      </Box>

      <Box slot="content" style={{ minWidth: 220 }}>
        <Box role="menuitemcheckbox" aria-checked="true" tabIndex={-1}>Show minimap</Box>
        <Box role="menuitemcheckbox" aria-checked="false" tabIndex={-1}>Wrap lines</Box>
        <Box role="separator" className="separator" />
        <Box role="menuitemradio" data-group="zoom" aria-checked="true" tabIndex={-1}>100%</Box>
        <Box role="menuitemradio" data-group="zoom" aria-checked="false" tabIndex={-1}>125%</Box>
        <Box role="menuitemradio" data-group="zoom" aria-checked="false" tabIndex={-1}>150%</Box>
      </Box>
    </Menubar>
  );
}

export const Playground = (args: any) => <EditorMenubar {...args} />;
Playground.args = {
  selected: 0,
  open: false,
  loop: true,
  placement: 'bottom',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default'
};

export const Interactive = () => {
  const [state, setState] = React.useState({ open: false, selected: 0 });
  return (
    <Grid style={{ display: 'grid', gap: 10 }}>
      <EditorMenubar
        selected={state.selected}
        open={state.open}
        onOpen={(selected) => setState({ open: true, selected })}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
      />
      <Box style={{ fontSize: 13, color: '#475569' }}>
        open: {String(state.open)} | selected: {state.selected}
      </Box>
    </Grid>
  );
};

export const OpenByDefault = (args: any) => <EditorMenubar {...args} />;
OpenByDefault.args = {
  selected: 1,
  open: true
};

export const VisualModes = () => (
  <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))', gap: 16, padding: 20 }}>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Default</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={0} open variant="default" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <strong>Square / Flat</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={1} open variant="flat" shape="square" density="compact" elevation="none" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, background: 'linear-gradient(135deg, #f8fafc, #eef2ff)' }}>
      <strong>Glass</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={2} open variant="glass" shape="soft" elevation="high" />
      </Box>
    </Box>
    <Box style={{ border: '1px solid #1e293b', borderRadius: 12, padding: 14, background: '#0f172a', color: '#e2e8f0' }}>
      <strong>Contrast + Warning</strong>
      <Box style={{ marginTop: 10 }}>
        <EditorMenubar selected={0} open variant="contrast" tone="warning" />
      </Box>
    </Box>
  </Grid>
);

export const Vertical = () => (
  <Flex style={{ display: 'flex', gap: 16, padding: 24, alignItems: 'flex-start' }}>
    <Menubar orientation="vertical" open selected={0} shape="soft" density="comfortable" style={{ width: 240 }}>
      <Button slot="item" variant="ghost">Project</Button>
      <Button slot="item" variant="ghost">Team</Button>
      <Button slot="item" variant="ghost">Settings</Button>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Overview</Box>
        <Box role="menuitem" tabIndex={-1}>Files</Box>
        <Box role="menuitem" tabIndex={-1}>Activity</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Members</Box>
        <Box role="menuitem" tabIndex={-1}>Roles</Box>
        <Box role="menuitem" tabIndex={-1}>Invites</Box>
      </Box>
      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Preferences</Box>
        <Box role="menuitem" tabIndex={-1}>Billing</Box>
        <Box role="menuitem" tabIndex={-1}>API Keys</Box>
      </Box>
    </Menubar>
    <Box style={{ fontSize: 13, color: '#64748b' }}>
      Vertical mode is useful for command strips and compact admin side tools.
    </Box>
  </Flex>
);

export const SubmenuExample = () => (
  <Box style={{ padding: 32 }}>
    <Menubar open selected={0} closeOnSelect={false}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <Box slot="content" style={{ minWidth: 240 }}>
        <Box role="menuitem" tabIndex={-1}>New file</Box>
        <Box role="menuitem" tabIndex={-1}>Open…</Box>
        <Box role="separator" className="separator" />
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 8px',
            borderRadius: 8
          }}
        >
          <span style={{ fontSize: 13, color: '#334155' }}>Export</span>
          <Menu placement="right" density="compact" shape="square" variant="line">
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
              Formats ▸
            </button>
            <Box slot="content">
              <Box role="menuitem" tabIndex={-1}>Export as PDF</Box>
              <Box role="menuitem" tabIndex={-1}>Export as HTML</Box>
              <Box role="menuitem" tabIndex={-1}>Export as Markdown</Box>
            </Box>
          </Menu>
        </Box>
      </Box>

      <Box slot="content">
        <Box role="menuitem" tabIndex={-1}>Undo</Box>
        <Box role="menuitem" tabIndex={-1}>Redo</Box>
      </Box>

      <Box slot="content">
        <Box role="menuitemcheckbox" aria-checked="true" tabIndex={-1}>Show toolbar</Box>
        <Box role="menuitemcheckbox" aria-checked="false" tabIndex={-1}>Show minimap</Box>
      </Box>
    </Menubar>
  </Box>
);
