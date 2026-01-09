import {
  Plugin,
  Command,
  EditorState,
  NodeType
} from '@rte-editor/core';

/**
 * List plugin for rich text editor.
 * Provides ordered and unordered list functionality.
 */
export class ListPlugin extends Plugin {
  constructor() {
    super({
      name: 'list',
      commands: {
        toggleBulletList: toggleBulletListCommand,
        toggleOrderedList: toggleOrderedListCommand,
        liftListItem: liftListItemCommand,
        sinkListItem: sinkListItemCommand
      },
      toolbar: {
        items: [
          {
            id: 'bullet-list',
            icon: '•', // Simple bullet symbol
            label: 'Bullet List',
            command: 'toggleBulletList',
            active: (state: EditorState) => isBulletListActive(state)
          },
          {
            id: 'ordered-list',
            icon: '1.', // Simple numbered list symbol
            label: 'Numbered List',
            command: 'toggleOrderedList',
            active: (state: EditorState) => isOrderedListActive(state)
          }
        ]
      },
      keybindings: {
        'Mod-Shift-8': 'toggleBulletList', // Ctrl+Shift+8
        'Mod-Shift-7': 'toggleOrderedList', // Ctrl+Shift+7
        'Tab': 'sinkListItem',
        'Shift-Tab': 'liftListItem'
      }
    });
  }
}

/**
 * Check if bullet list is active at current selection.
 */
function isBulletListActive(state: EditorState): boolean {
  const { $from, $to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (node.type.name === 'list_item' && node.parent?.type.name === 'bullet_list') {
      isActive = true;
      return false;
    }
    return true;
  });

  return isActive;
}

/**
 * Check if ordered list is active at current selection.
 */
function isOrderedListActive(state: EditorState): boolean {
  const { $from, $to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (node.type.name === 'list_item' && node.parent?.type.name === 'ordered_list') {
      isActive = true;
      return false;
    }
    return true;
  });

  return isActive;
}

/**
 * Toggle bullet list command.
 */
function toggleBulletListCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const bulletListType = state.schema.nodes.bullet_list;
  const listItemType = state.schema.nodes.list_item;
  const paragraphType = state.schema.nodes.paragraph;

  if (!bulletListType || !listItemType || !paragraphType) {
    return false;
  }

  const { $from, $to } = state.selection;

  if (isBulletListActive(state)) {
    // Convert list to paragraphs
    if (dispatch) {
      const tr = state.tr;
      // This would need more sophisticated list-to-paragraph conversion
      // For now, simple implementation
      tr.setBlockType($from.pos, $to.pos, paragraphType);
      dispatch(tr);
    }
    return true;
  } else {
    // Convert paragraphs to bullet list
    if (dispatch) {
      const tr = state.tr;
      tr.wrapIn(bulletListType);
      tr.setBlockType($from.pos, $to.pos, listItemType);
      dispatch(tr);
    }
    return true;
  }
}

/**
 * Toggle ordered list command.
 */
function toggleOrderedListCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const orderedListType = state.schema.nodes.ordered_list;
  const listItemType = state.schema.nodes.list_item;
  const paragraphType = state.schema.nodes.paragraph;

  if (!orderedListType || !listItemType || !paragraphType) {
    return false;
  }

  const { $from, $to } = state.selection;

  if (isOrderedListActive(state)) {
    // Convert list to paragraphs
    if (dispatch) {
      const tr = state.tr;
      tr.setBlockType($from.pos, $to.pos, paragraphType);
      dispatch(tr);
    }
    return true;
  } else {
    // Convert paragraphs to ordered list
    if (dispatch) {
      const tr = state.tr;
      tr.wrapIn(orderedListType);
      tr.setBlockType($from.pos, $to.pos, listItemType);
      dispatch(tr);
    }
    return true;
  }
}

/**
 * Lift list item (outdent).
 */
function liftListItemCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // This would implement list item outdenting
  // For now, placeholder implementation
  return false;
}

/**
 * Sink list item (indent).
 */
function sinkListItemCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  // This would implement list item indenting
  // For now, placeholder implementation
  return false;
}

/**
 * Create a list plugin instance.
 */
export function createListPlugin(): ListPlugin {
  return new ListPlugin();
}