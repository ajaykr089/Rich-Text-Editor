import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '@rte-editor/react';
import {
  ParagraphPlugin,
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  ListPlugin
} from '@rte-editor/plugins';
import '@rte-editor/themes/src/themes/default.css';

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
