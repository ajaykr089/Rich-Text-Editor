import {
  Plugin,
  Command,
  EditorState,
  NodeType
} from '@rte-editor/core';

/**
 * Blockquote plugin for rich text editor.
 * Provides blockquote functionality for quoted content.
 */
export class BlockquotePlugin extends Plugin {
  constructor() {
    super({
      name: 'blockquote',
      commands: {
        toggleBlockquote: toggleBlockquoteCommand
      },
      toolbar: {
        items: [{
          id: 'blockquote',
          icon: '"', // Simple quote symbol
          label: 'Blockquote',
          command: 'toggleBlockquote',
          active: (state: EditorState) => isBlockquoteActive(state)
        }]
      },
      keybindings: {
        'Mod-Shift->': 'toggleBlockquote', // Ctrl+Shift+>
        'Mod-\'': 'toggleBlockquote'       // Ctrl+'
      }
    });
  }
}

/**
 * Check if blockquote is active at current selection.
 */
function isBlockquoteActive(state: EditorState): boolean {
  const { $from, $to } = state.selection;
  let isActive = false;

  state.doc.nodesBetween($from.pos, $to.pos, (node) => {
    if (node.type.name === 'blockquote') {
      isActive = true;
      return false; // Stop traversal
    }
    return true;
  });

  return isActive;
}

/**
 * Toggle blockquote command.
 */
function toggleBlockquoteCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const blockquoteType = state.schema.nodes.blockquote;
  const paragraphType = state.schema.nodes.paragraph;

  if (!blockquoteType || !paragraphType) {
    return false;
  }

  const { $from, $to } = state.selection;

  if (isBlockquoteActive(state)) {
    // Remove blockquote wrapper
    if (dispatch) {
      const tr = state.tr;
      // This would need more sophisticated blockquote unwrapping
      // For now, simple implementation
      tr.setBlockType($from.pos, $to.pos, paragraphType);
      dispatch(tr);
    }
    return true;
  } else {
    // Wrap in blockquote
    if (dispatch) {
      const tr = state.tr;
      tr.wrapIn(blockquoteType);
      dispatch(tr);
    }
    return true;
  }
}

/**
 * Create a blockquote plugin instance.
 */
export function createBlockquotePlugin(): BlockquotePlugin {
  return new BlockquotePlugin();
}