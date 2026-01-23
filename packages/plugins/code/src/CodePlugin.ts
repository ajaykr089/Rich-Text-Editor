import { Plugin } from '@rte-editor/core';

export const CodePlugin = (): Plugin => ({
  name: 'code',
  toolbar: [
    {
      label: 'Source',
      command: 'toggleSourceView',
      type: 'button',
      icon: '<>'
    }
  ]
});
