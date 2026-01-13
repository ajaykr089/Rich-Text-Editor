import { Plugin } from '@rte-editor/core';

export const BoldPlugin = (): Plugin => ({
  name: 'bold',
  marks: {
    bold: {
      parseDOM: [
        { tag: 'strong' },
        { tag: 'b' }
      ],
      toDOM: () => ['strong', 0]
    }
  },
  toolbar: [
    {
      label: 'Bold',
      command: 'toggleBold',
      icon: 'B'
    }
  ]
});
