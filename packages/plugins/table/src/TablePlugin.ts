import React from 'react';
import {
  Plugin,
  Command,
  EditorState,
  NodeType,
  Fragment
} from '@rte-editor/core';

/**
 * Table plugin for rich text editor.
 * Provides advanced table functionality with custom node views.
 */
export class TablePlugin extends Plugin {
  constructor() {
    super({
      name: 'table',
      schema: {
        nodes: {
          table: {
            content: 'table_row+',
            group: 'block',
            isolating: true,
            parseDOM: [{ tag: 'table' }],
            toDOM: () => ['table', { class: 'rte-table' }, ['tbody', 0]]
          },
          table_row: {
            content: 'table_cell+',
            parseDOM: [{ tag: 'tr' }],
            toDOM: () => ['tr', 0]
          },
          table_cell: {
            content: 'block+',
            attrs: {
              colspan: { default: 1 },
              rowspan: { default: 1 }
            },
            parseDOM: [{ tag: 'td' }],
            toDOM: (node) => ['td', node.attrs, 0]
          }
        }
      },
      commands: {
        insertTable: insertTableCommand,
        addRowBefore: addRowBeforeCommand,
        addRowAfter: addRowAfterCommand,
        addColumnBefore: addColumnBeforeCommand,
        addColumnAfter: addColumnAfterCommand,
        deleteRow: deleteRowCommand,
        deleteColumn: deleteColumnCommand,
        toggleHeaderRow: toggleHeaderRowCommand
      },
      toolbar: {
        items: [{
          id: 'insert-table',
          icon: '⊞', // Simple table symbol
          label: 'Insert Table',
          command: 'insertTable'
        }]
      },
      keybindings: {
        // Table insertion
        'Mod-Alt-T': 'insertTable'
      },
      nodeViews: {
        table: TableNodeView,
        table_cell: TableCellNodeView
      }
    });
  }
}

/**
 * Insert table command.
 */
function insertTableCommand(rows: number = 3, cols: number = 3): Command {
  return (state: EditorState, dispatch?: (tr: any) => void): boolean => {
    const tableType = state.schema.nodes.table;
    const rowType = state.schema.nodes.table_row;
    const cellType = state.schema.nodes.table_cell;
    const paragraphType = state.schema.nodes.paragraph;

    if (!tableType || !rowType || !cellType || !paragraphType) {
      return false;
    }

    if (dispatch) {
      const tr = state.tr;

      // Create table rows
      const rowsContent = [];
      for (let i = 0; i < rows; i++) {
        const cellsContent = [];
        for (let j = 0; j < cols; j++) {
          cellsContent.push(cellType.create({}, paragraphType.create()));
        }
        rowsContent.push(rowType.create({}, cellsContent));
      }

      const table = tableType.create({}, rowsContent);
      tr.replaceSelectionWith(table);

      dispatch(tr);
    }

    return true;
  };
}

/**
 * Add row before current position.
 */
function addRowBeforeCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find current table row and add a new row before it
  return false;
}

/**
 * Add row after current position.
 */
function addRowAfterCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find current table row and add a new row after it
  return false;
}

/**
 * Add column before current position.
 */
function addColumnBeforeCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find current table column and add a new column before it
  return false;
}

/**
 * Add column after current position.
 */
function addColumnAfterCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find current table column and add a new column after it
  return false;
}

/**
 * Delete current row.
 */
function deleteRowCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find and remove current table row
  return false;
}

/**
 * Delete current column.
 */
function deleteColumnCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would find and remove current table column
  return false;
}

/**
 * Toggle header row.
 */
function toggleHeaderRowCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // Implementation would toggle first row as header
  return false;
}

/**
 * Custom node view for table rendering.
 */
const TableNodeView: any = (node: any, view: any, getPos: () => number) => {
  const dom = document.createElement('div');
  dom.className = 'rte-table-wrapper';

  const table = document.createElement('table');
  table.className = 'rte-table';

  // Table controls (add/remove rows/columns)
  const controls = document.createElement('div');
  controls.className = 'rte-table-controls';
  controls.innerHTML = `
    <button class="rte-table-add-row" title="Add Row">+</button>
    <button class="rte-table-add-col" title="Add Column">+</button>
    <button class="rte-table-del-row" title="Delete Row">-</button>
    <button class="rte-table-del-col" title="Delete Column">-</button>
  `;

  dom.appendChild(controls);
  dom.appendChild(table);

  // Add event listeners for controls
  controls.querySelector('.rte-table-add-row')?.addEventListener('click', () => {
    // Trigger add row command
  });

  controls.querySelector('.rte-table-add-col')?.addEventListener('click', () => {
    // Trigger add column command
  });

  return {
    dom,
    contentDOM: table,
    update: (node: any) => {
      return true; // Always update
    },
    destroy: () => {
      // Cleanup
    }
  };
};

/**
 * Custom node view for table cell rendering.
 */
const TableCellNodeView: any = (node: any, view: any, getPos: () => number) => {
  const dom = document.createElement('td');
  dom.className = 'rte-table-cell';

  // Apply cell attributes
  if (node.attrs.colspan && node.attrs.colspan > 1) {
    dom.colSpan = node.attrs.colspan;
  }
  if (node.attrs.rowspan && node.attrs.rowspan > 1) {
    dom.rowSpan = node.attrs.rowspan;
  }

  return {
    dom,
    contentDOM: dom,
    update: (node: any) => {
      // Update attributes
      if (node.attrs.colspan && node.attrs.colspan > 1) {
        dom.colSpan = node.attrs.colspan;
      }
      if (node.attrs.rowspan && node.attrs.rowspan > 1) {
        dom.rowSpan = node.attrs.rowspan;
      }
      return true;
    },
    destroy: () => {
      // Cleanup
    }
  };
};

/**
 * Create a table plugin instance.
 */
export function createTablePlugin(): TablePlugin {
  return new TablePlugin();
}