import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '../packages/react/src';
import {
  ParagraphPlugin,
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ListPlugin
} from '../packages/plugins/src';
import '../packages/themes/src/themes/default.css';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Editor/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    plugins: [
      ParagraphPlugin(),
      HeadingPlugin(),
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      ListPlugin()
    ]
  }
};

export const MinimalPlugins: Story = {
  args: {
    plugins: [
      ParagraphPlugin(),
      BoldPlugin(),
      ItalicPlugin()
    ]
  }
};

export const OnlyFormatting: Story = {
  args: {
    plugins: [
      ParagraphPlugin(),
      HeadingPlugin()
    ]
  }
};
