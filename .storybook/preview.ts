
import type { Preview } from '@storybook/react';
import { withThemeSwitcher } from './withThemeSwitcher';

const preview: Preview = {
  decorators: [withThemeSwitcher],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
