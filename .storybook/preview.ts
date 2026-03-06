
import type { Preview } from '@storybook/react';
import { withThemeSwitcher } from './withThemeSwitcher';

if (typeof document !== 'undefined' && !document.getElementById('editora-not-defined-guard')) {
  const style = document.createElement('style');
  style.id = 'editora-not-defined-guard';
  // Prevent upgrade flicker for web components before customElements.define runs.
  style.textContent = ':not(:defined) { visibility: hidden; }';
  document.head.appendChild(style);
}

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
