import { Plugin } from '@editora/core';

/**
 * Text Alignment Plugin - Native Implementation
 *
 * Allows users to set text alignment (left, center, right, justify)
 * for selected paragraphs by applying CSS styles directly to <p> elements
 * 
 * Uses modern CSS manipulation instead of deprecated execCommand for:
 * - More reliable behavior across browsers
 * - Better control over styling
 * - Consistent results
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper function to find the containing paragraph element
 */
function findContainingParagraph(node: Node): HTMLElement | null {
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
}

/**
 * Helper function to find all paragraphs that intersect with the range
 */
function getParagraphsInRange(range: Range): HTMLElement[] {
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
}

/**
 * Set text alignment command
 * Applies CSS text-align styles directly to paragraph elements
 */
export const setTextAlignmentCommand = (alignment?: string) => {
  if (!alignment) return false;

  const validAlignments = ['left', 'center', 'right', 'justify'];
  if (!validAlignments.includes(alignment)) return false;

  // Get current selection
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const paragraphs = getParagraphsInRange(range);

  // Apply text alignment to each paragraph
  paragraphs.forEach(paragraph => {
    if (paragraph) {
      paragraph.style.textAlign = alignment;
    }
  });

  // Restore the selection
  selection.removeAllRanges();
  selection.addRange(range);

  return true;
};

// ============================================================================
// Plugin Definition
// ============================================================================

export const TextAlignmentPlugin = (): Plugin => ({
  name: 'textAlignment',

  toolbar: [
    {
      label: 'Text Alignment',
      command: 'setTextAlignment',
      type: 'inline-menu',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
      ],
      icon: '<svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>'
    }
  ],

  commands: {
    setTextAlignment: setTextAlignmentCommand
  },

  keymap: {}
});
