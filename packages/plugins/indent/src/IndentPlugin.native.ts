import { Plugin } from '@editora/core';

/**
 * Indent Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides advanced indentation with:
 * - Custom padding-based indentation (40px increments)
 * - Multi-paragraph selection support
 * - Smart paragraph detection
 * - Unit conversion (px, em)
 * - Keyboard shortcuts (Tab, Shift-Tab, Cmd-[, Cmd-])
 */

const INDENT_AMOUNT = 40; // pixels

/**
 * Find the containing paragraph element
 */
const findContainingParagraph = (node: Node): HTMLElement | null => {
  let current: Node | null = node;

  // If the node itself is a paragraph, return it
  if (current.nodeType === Node.ELEMENT_NODE) {
    const element = current as HTMLElement;
    if (element.tagName === 'P') {
      return element;
    }
  }

  // Traverse up the DOM tree to find the nearest paragraph
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'P') {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
};

/**
 * Find all paragraphs that intersect with the range
 */
const getParagraphsInRange = (range: Range): HTMLElement[] => {
  const paragraphs: HTMLElement[] = [];
  const startParagraph = findContainingParagraph(range.startContainer);
  const endParagraph = findContainingParagraph(range.endContainer);

  if (!startParagraph && !endParagraph) return paragraphs;

  // If range is collapsed (just cursor), return the paragraph containing the cursor
  if (range.collapsed) {
    if (startParagraph) paragraphs.push(startParagraph);
    return paragraphs;
  }

  // For actual selections, find all paragraphs between start and end
  if (startParagraph === endParagraph) {
    // Selection is within a single paragraph
    if (startParagraph) paragraphs.push(startParagraph);
  } else {
    // Selection spans multiple paragraphs - find all paragraphs in between
    let current: HTMLElement | null = startParagraph;
    while (current && current !== endParagraph) {
      paragraphs.push(current);
      let nextSibling = current.nextElementSibling as HTMLElement | null;
      // If we hit a non-paragraph element, continue until we find the next paragraph
      while (nextSibling && nextSibling.tagName !== 'P') {
        nextSibling = nextSibling.nextElementSibling as HTMLElement | null;
      }
      current = nextSibling;
    }
    // Add the end paragraph if it's different
    if (endParagraph && endParagraph !== startParagraph) {
      paragraphs.push(endParagraph);
    }
  }

  return paragraphs;
};

/**
 * Get current padding-left value in pixels
 */
const getCurrentPadding = (element: HTMLElement): number => {
  const computedStyle = window.getComputedStyle(element);
  const paddingLeft = computedStyle.paddingLeft;
  
  // Convert to pixels (assuming px or em units)
  if (paddingLeft.endsWith('px')) {
    return parseFloat(paddingLeft);
  } else if (paddingLeft.endsWith('em')) {
    const fontSize = parseFloat(computedStyle.fontSize);
    return parseFloat(paddingLeft) * fontSize;
  }
  
  return 0;
};

/**
 * Increase indentation level
 */
export const increaseIndent = (): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const paragraphs = getParagraphsInRange(range);

  if (paragraphs.length === 0) return false;

  // Apply indentation to all selected paragraphs
  paragraphs.forEach(paragraph => {
    const currentPadding = getCurrentPadding(paragraph);
    const newPadding = currentPadding + INDENT_AMOUNT;
    paragraph.style.paddingLeft = `${newPadding}px`;
  });

  return true;
};

/**
 * Decrease indentation level
 */
export const decreaseIndent = (): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const paragraphs = getParagraphsInRange(range);

  if (paragraphs.length === 0) return false;

  // Apply indentation to all selected paragraphs
  paragraphs.forEach(paragraph => {
    const currentPadding = getCurrentPadding(paragraph);
    const newPadding = Math.max(0, currentPadding - INDENT_AMOUNT); // Minimum 0
    paragraph.style.paddingLeft = `${newPadding}px`;
  });

  return true;
};

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: () => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('increaseIndent', increaseIndent);
  registerCommand('decreaseIndent', decreaseIndent);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const IndentPlugin = (): Plugin => ({
  name: 'indent',
  
  toolbar: [
    {
      label: 'Increase Indent',
      command: 'increaseIndent',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 0 1 0-2Zm-2.6-3.8L6.2 12l-1.8-1.2a1 1 0 0 1 1.2-1.6l3 2a1 1 0 0 1 0 1.6l-3 2a1 1 0 1 1-1.2-1.6Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-]'
    },
    {
      label: 'Decrease Indent',
      command: 'decreaseIndent',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M7 5h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 1 1 0-2Zm5 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm0 4h7c.6 0 1 .4 1 1s-.4 1-1 1h-7a1 1 0 0 1 0-2Zm-5 4h12c.6 0 1 .4 1 1s-.4 1-1 1H7a1 1 0 0 1 0-2ZM3.6 10.2 5.4 12l-1.8 1.2a1 1 0 0 0 1.2 1.6l3-2a1 1 0 0 0 0-1.6l-3-2a1 1 0 1 0-1.2 1.6Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-['
    }
  ],
  
  commands: {
    increaseIndent,
    decreaseIndent
  },
  
  keymap: {
    'Mod-]': 'increaseIndent',
    'Mod-[': 'decreaseIndent',
    'Tab': 'increaseIndent',
    'Shift-Tab': 'decreaseIndent'
  }
});
