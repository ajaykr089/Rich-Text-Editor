import { Plugin } from '@rte-editor/core';

/**
 * Table Plugin for Rich Text Editor
 *
 * Provides basic table functionality with:
 * - Table node schema
 * - Insert table command
 * - Basic table structure
 */
export const TablePlugin = (): Plugin => ({
  name: 'table',
  nodes: {
    table: {
      content: 'table_row+',
      group: 'block',
      parseDOM: [{ tag: 'table' }],
      toDOM: (node: any) => ['table', { class: 'rte-table' }, 0]
    },
    table_row: {
      content: 'table_cell+',
      parseDOM: [{ tag: 'tr' }],
      toDOM: (node: any) => ['tr', undefined, 0]
    },
    table_cell: {
      content: 'block+',
      parseDOM: [{ tag: 'td' }, { tag: 'th' }],
      toDOM: (node: any) => ['td', undefined, 0]
    }
  },
  toolbar: [
    {
      label: 'Insert Table',
      command: 'insertTable',
      icon: '⊞'
    }
  ]
});
