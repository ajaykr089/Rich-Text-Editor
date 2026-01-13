import { Plugin } from '@rte-editor/core';

export const ItalicPlugin = (): Plugin => ({
  name: 'italic',
  marks: {
    italic: {
      parseDOM: [
        { tag: 'em' },
        { tag: 'i' }
      ],
      toDOM: () => ['em', 0]
    }
  },
  toolbar: [
    {
      label: 'Italic',
      command: 'toggleItalic',
      icon: 'I'
    }
  ]
});
