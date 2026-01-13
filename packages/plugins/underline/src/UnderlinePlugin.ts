import { Plugin } from '@rte-editor/core';

export const UnderlinePlugin = (): Plugin => ({
  name: 'underline',
  marks: {
    underline: {
      parseDOM: [{ tag: 'u' }],
      toDOM: () => ['u', 0]
    }
  },
  toolbar: [
    {
      label: 'Underline',
      command: 'toggleUnderline',
      icon: 'U'
    }
  ]
});
