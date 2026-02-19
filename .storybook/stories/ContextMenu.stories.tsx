import React from 'react';
import { ContextMenu, Button } from '@editora/ui-react';

export default {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  argTypes: { open: { control: 'boolean' }, anchorId: { control: 'text' } }
};

export const Default = (args: any) => (
  <div>
    <div id="ctx-anchor" style={{ margin: 40, padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>Right-click / anchor</div>
    <ContextMenu anchorId={args.anchorId || 'ctx-anchor'} open={args.open}>
      <div slot="content">Context item A</div>
      <div slot="content">Context item B</div>
    </ContextMenu>
  </div>
);
Default.args = { open: true, anchorId: 'ctx-anchor' };

export const RightClickDemo = () => {
  const [state, setState] = React.useState<{open: boolean; point?: {x:number;y:number}}>({ open: false });
  return (
    <div style={{ padding: 40 }} onContextMenu={(e) => { e.preventDefault(); setState({ open: true, point: { x: e.clientX, y: e.clientY } }); }}>
      <div style={{ padding: 20, border: '1px dashed #ccc', display: 'inline-block' }}>Right-click anywhere inside this box</div>
      <ContextMenu open={state.open} anchorPoint={state.point}>
        <div slot="content">Context action 1</div>
        <div slot="content">Context action 2</div>
      </ContextMenu>
    </div>
  );
};
