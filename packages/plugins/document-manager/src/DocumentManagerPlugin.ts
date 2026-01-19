import { Plugin } from '@rte-editor/core';

export const DocumentManagerPlugin = (): Plugin => ({
  name: 'document-manager',
  toolbar: [
    {
      label: 'Import Word',
      command: 'importWord',
      icon: '📥'
    },
    {
      label: 'Export Word',
      command: 'exportWord',
      icon: '📄'
    },
    {
      label: 'Export PDF',
      command: 'exportPdf',
      icon: '📋'
    }
  ]
});
