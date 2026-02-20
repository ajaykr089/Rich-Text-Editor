import React from 'react';
import { Menubar } from '@editora/ui-react';

export default {
  title: 'UI/Menubar',
  component: Menubar,
  argTypes: {
    selected: { control: 'number' },
    open: { control: 'boolean' },
    loop: { control: 'boolean' }
  }
};

function EditorMenubar(args: any) {
  return (
    <Menubar {...args}>
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <button slot="item">View</button>

      <div slot="content" style={{ minWidth: 200 }}>
        <div style={{ padding: 8, borderRadius: 8 }}>New Document</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Open...</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Save</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Export PDF</div>
      </div>

      <div slot="content" style={{ minWidth: 200 }}>
        <div style={{ padding: 8, borderRadius: 8 }}>Undo</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Redo</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Find</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Replace</div>
      </div>

      <div slot="content" style={{ minWidth: 220 }}>
        <div style={{ padding: 8, borderRadius: 8 }}>Zoom In</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Zoom Out</div>
        <div style={{ padding: 8, borderRadius: 8 }}>Zen Mode</div>
      </div>
    </Menubar>
  );
}

export const Default = (args: any) => <EditorMenubar {...args} />;
Default.args = {
  selected: 0,
  open: false
};

export const Interactive = () => {
  const [state, setState] = React.useState({ open: false, selected: 0 });
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <EditorMenubar
        selected={state.selected}
        open={state.open}
        onOpen={(selected) => setState({ open: true, selected })}
        onClose={() => setState((prev) => ({ ...prev, open: false }))}
        onChange={(detail) => setState({ open: detail.open, selected: detail.selected })}
      />
      <div style={{ fontSize: 13, color: '#475569' }}>
        open: {String(state.open)} | selected: {state.selected}
      </div>
    </div>
  );
};

export const OpenByDefault = (args: any) => <EditorMenubar {...args} />;
OpenByDefault.args = {
  selected: 1,
  open: true
};
