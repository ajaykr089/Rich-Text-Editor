import type { Plugin } from '@editora/core';

/**
 * ParagraphPlugin - Native implementation for paragraph formatting
 * 
 * Features:
 * - Converts selection to paragraph block
 * - Default block type for text content
 * - Supports paragraph node in schema
 * 
 * Commands:
 * - setParagraph: Converts current block to paragraph
 */
export const ParagraphPlugin = (): Plugin => {
  return {
    name: 'paragraph',
    
    nodes: {
      paragraph: {
        content: 'inline*',
        group: 'block',
        parseDOM: [{ tag: 'p' }],
        toDOM: () => ['p', 0]
      }
    },

    toolbar: [
      {
        label: 'Paragraph',
        command: 'setParagraph',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="15" y2="18"/>
        </svg>`,
        shortcut: 'Mod-Alt-0'
      }
    ],

    commands: {
      setParagraph: () => {
        try {
          // Convert current block to paragraph using formatBlock
          document.execCommand('formatBlock', false, 'p');
          return true;
        } catch (error) {
          console.error('Failed to set paragraph:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Alt-0': 'setParagraph'
    }
  };
};
