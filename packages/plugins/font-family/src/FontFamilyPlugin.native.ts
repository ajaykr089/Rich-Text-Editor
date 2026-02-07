import type { Plugin } from '@editora/core';

/**
 * FontFamilyPlugin - Native implementation for font family formatting
 * 
 * Features:
 * - Inline menu with predefined web-safe font families
 * - Applies font family to selected text using span elements
 * - Supports proper font family stacking with fallbacks
 * 
 * Commands:
 * - setFontFamily: Sets the font family to specified value
 * 
 * UI/UX Features:
 * - Inline dropdown menu with font previews
 * - 8 carefully curated web-safe fonts
 * - Professional "A" glyph icon matching React version
 * - Keyboard shortcut (Mod-Shift-f)
 */
export const FontFamilyPlugin = (): Plugin => {
  return {
    name: 'fontFamily',
    
    marks: {
      fontFamily: {
        attrs: {
          family: { default: null }
        },
        parseDOM: [
          {
            tag: 'span[style*="font-family"]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const family = element.style.fontFamily;
              return family ? { family } : false;
            }
          },
          {
            tag: 'font[face]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const family = element.getAttribute('face');
              return family ? { family } : false;
            }
          }
        ],
        toDOM: (mark) => {
          return ['span', { style: `font-family: ${mark.attrs.family}` }, 0];
        }
      }
    },

    toolbar: [
      {
        label: 'Font Family',
        command: 'setFontFamily',
        type: 'inline-menu',
        options: [
          { label: 'Arial', value: 'Arial, sans-serif' },
          { label: 'Times New Roman', value: 'Times New Roman, serif' },
          { label: 'Courier New', value: 'Courier New, monospace' },
          { label: 'Georgia', value: 'Georgia, serif' },
          { label: 'Verdana', value: 'Verdana, sans-serif' },
          { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
          { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
          { label: 'Impact', value: 'Impact, sans-serif' },
        ],
        icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15 4h7v2h-7zm1 4h6v2h-6zm2 4h4v2h-4zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zm-1.239 9L10.5 6.515 12.932 13H8.068z"></path></g></svg>'
      }
    ],

    commands: {
      setFontFamily: (family?: string) => {
        if (!family) return false;
        
        try {
          applyFontFamilyToSelection(family);
          return true;
        } catch (error) {
          console.error('Failed to set font family:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Shift-f': 'setFontFamily'
    }
  };
};

/**
 * Helper function to apply font family to current selection
 * Uses DOM manipulation for reliable font family application
 */
function applyFontFamilyToSelection(fontFamily: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // If there's no actual selection (just cursor), return
  if (range.collapsed) {
    return;
  }

  // Check if the entire selection is within a single font-family span
  const commonAncestor = range.commonAncestorContainer;
  const fontFamilySpan = findFontFamilySpanAncestor(commonAncestor);

  if (fontFamilySpan && isSelectionEntirelyWithinSpan(range, fontFamilySpan)) {
    // Update existing span's font-family
    fontFamilySpan.style.fontFamily = fontFamily;

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(fontFamilySpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Create new span wrapper
    const span = document.createElement('span');
    span.style.fontFamily = fontFamily;

    // Wrap the selected content
    try {
      range.surroundContents(span);
    } catch (e) {
      // surroundContents fails if the range spans multiple elements
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }

    // Restore selection to the inserted span
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

/**
 * Helper function to find if there's a font-family span ancestor
 */
function findFontFamilySpanAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'SPAN' && element.style.fontFamily) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}

/**
 * Helper function to check if selection is entirely within a span
 */
function isSelectionEntirelyWithinSpan(range: Range, span: HTMLElement): boolean {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  // Check if both start and end are within the span
  const startInSpan = span.contains(startContainer) ||
    (startContainer.nodeType === Node.TEXT_NODE &&
     startContainer.parentElement === span);

  const endInSpan = span.contains(endContainer) ||
    (endContainer.nodeType === Node.TEXT_NODE &&
     endContainer.parentElement === span);

  return startInSpan && endInSpan;
}
