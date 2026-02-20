import React from 'react';
import { Toolbar, Button } from '@editora/ui-react';

export default {
  title: 'UI/Toolbar',
  component: Toolbar,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] }
  }
};

export const Default = (args: any) => (
  <Toolbar orientation={args.orientation} style={{ ['--ui-toolbar-gap' as any]: '10px' }}>
    <Button size="sm">Undo</Button>
    <Button size="sm">Redo</Button>
    <Button size="sm" variant="secondary">Comment</Button>
  </Toolbar>
);
Default.args = { orientation: 'horizontal' };
