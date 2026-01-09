import { Plugin, EditorState } from '@rte-editor/core';

/**
 * Paragraph plugin for rich text editor.
 * Provides basic paragraph functionality and Enter key handling.
 */
export class ParagraphPlugin extends Plugin {
  constructor() {
    super({
      name: 'paragraph',
      schema: {
        nodes: {
          paragraph: {
            content: 'inline*',
            group: 'block',
            parseDOM: [{ tag: 'p' }],
            toDOM: () => ['p', 0]
          }
        }
      },
      commands: {
        insertParagraph: (state: EditorState, dispatch?: (tr: any) => void) => {
          if (dispatch) {
            const { from } = state.selection;
            const paragraph = state.schema.nodes.paragraph.create();
            const tr = state.tr.insert(from, paragraph);
            dispatch(tr);
          }
          return true;
        }
      },
      keybindings: {
        'Enter': 'insertParagraph'
      }
    });
  }
}

/**
 * Create a paragraph plugin instance.
 */
export function createParagraphPlugin(): ParagraphPlugin {
  return new ParagraphPlugin();
}