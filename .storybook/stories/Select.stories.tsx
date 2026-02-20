import React from 'react';
import { Select } from '@editora/ui-react';

export default {
  title: 'UI/Select',
  component: Select,
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' }
  }
};

export const Controlled = (args: any) => {
  const [value, setValue] = React.useState(args.value || 'draft');

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <Select
        {...args}
        value={value}
        onChange={setValue}
      >
        <option value="draft">Draft</option>
        <option value="review">In Review</option>
        <option value="published">Published</option>
        <option value="archived">Archived</option>
      </Select>
      <div style={{ fontSize: 13, color: '#475569' }}>Selected: {value}</div>
    </div>
  );
};

Controlled.args = {
  value: 'draft',
  disabled: false
};

export const Disabled = () => (
  <Select disabled value="published">
    <option value="draft">Draft</option>
    <option value="review">In Review</option>
    <option value="published">Published</option>
  </Select>
);
