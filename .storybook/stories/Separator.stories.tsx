import React from 'react';
import { Separator } from '@editora/ui-react';

export default {
  title: 'UI/Separator',
  component: Separator
};

export const Horizontal = () => (
  <div style={{ maxWidth: 480 }}>
    <div>Section A</div>
    <Separator />
    <div>Section B</div>
  </div>
);

export const Vertical = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>Left</span>
    <Separator orientation="vertical" />
    <span>Center</span>
    <Separator orientation="vertical" />
    <span>Right</span>
  </div>
);
