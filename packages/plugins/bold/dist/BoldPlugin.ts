import {
  Plugin,
  Command,
  EditorState,
  MarkType
} from '@rte-editor/core';

/**
 * Bold plugin for rich text editor.
 * Provides bold text formatting functionality.
 */
export class BoldPlugin extends Plugin {
  constructor() {
    super({
      name: 'bold',
      commands: {
        toggleBold: toggleBoldCommand
      },
      toolbar: {
        items: [{
          id: 'bold',
          icon: 'B', // Simple text icon, can be replaced with SVG component
          label: 'Bold',
          command: 'toggleBold',
          active: (state: EditorState) => {
            return state.schema.marks.bold.isInSet(state.storedMarks || []);
          },
          enabled: (state: EditorState) => {
            return !state.selection.empty || !!state.storedMarks;
          }
        }]
      },
      keybindings: {
        'Mod-b': 'toggleBold', // Ctrl/Cmd + B
        'Mod-B': 'toggleBold'  // Ctrl/Cmd + Shift + B (for uppercase)
      }
    });
  }
}

/**
 * Command to toggle bold formatting on the current selection.
 */
function toggleBoldCommand(state: EditorState, dispatch?: (tr: any) => void): boolean {
  const markType = state.schema.marks.bold;
  if (!markType) {
    return false;
  }

  const { from, to, empty } = state.selection;

  if (empty) {
    // Toggle stored marks for cursor position
    if (dispatch) {
      const tr = state.tr;
      if (state.storedMarks) {
        // Remove bold from stored marks
        tr.setStoredMarks(state.storedMarks.filter(mark => mark.type !== markType));
      } else {
        // Add bold to stored marks
        tr.setStoredMarks([markType.create()]);
      }
      dispatch(tr);
    }
    return true;
  } else {
    // Toggle mark on selection range
    if (dispatch) {
      const tr = state.tr;
      const hasMark = state.doc.rangeHasMark(from, to, markType);

      if (hasMark) {
        tr.removeMark(from, to, markType);
      } else {
        tr.addMark(from, to, markType.create());
      }

      dispatch(tr);
    }
    return true;
  }
}

/**
 * Create a bold plugin instance.
 */
export function createBoldPlugin(): BoldPlugin {
  return new BoldPlugin();
}