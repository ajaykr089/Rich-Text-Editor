/**
 * Utility functions for status bar calculations
 */

/**
 * Get cursor position (line and column) from a range within a content element
 */
export function getCursorPosition(contentElement: HTMLElement, range: Range): { line: number; column: number } {
  const text = contentElement.textContent || '';
  const startOffset = getTextOffset(contentElement, range.startContainer, range.startOffset);

  // Count lines up to the cursor position
  const textBeforeCursor = text.substring(0, startOffset);
  const lines = textBeforeCursor.split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;

  return { line, column };
}

/**
 * Get text offset from a DOM node and offset within a root element
 */
export function getTextOffset(rootElement: HTMLElement, node: Node, offset: number): number {
  let textOffset = 0;
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentNode = walker.firstChild();
  while (currentNode) {
    if (currentNode === node) {
      textOffset += offset;
      break;
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      textOffset += currentNode.textContent?.length || 0;
    }
    currentNode = walker.nextNode();
  }

  return textOffset;
}

/**
 * Count lines in a contentEditable element by analyzing block-level elements
 */
export function countLines(contentElement: HTMLElement): number {
  // Count block-level elements and br tags that represent line breaks
  const blocks = contentElement.querySelectorAll('div, p, br, h1, h2, h3, h4, h5, h6, blockquote, li, pre');
  let lineCount = 1; // At least 1 line

  // If there are block elements, count them as separate lines
  if (blocks.length > 0) {
    lineCount = blocks.length;
    // If the last element is empty or just a br, it might represent an additional empty line
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock.tagName === 'BR' ||
        (lastBlock as HTMLElement).innerHTML?.trim() === '' ||
        lastBlock.textContent?.trim() === '') {
      lineCount++;
    }
  } else {
    // No block elements, fall back to text-based line counting
    const text = contentElement.textContent || '';
    const textLines = text.split('\n').length;
    lineCount = Math.max(1, textLines);
  }

  return lineCount;
}

/**
 * Calculate word and character counts from text
 */
export function calculateTextStats(text: string): { words: number; chars: number } {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  return { words, chars };
}

/**
 * Get selection information from a range
 */
export function getSelectionInfo(range: Range, cursorPosition: { line: number; column: number }) {
  const selectedText = range.toString();
  return {
    startLine: cursorPosition.line,
    startColumn: cursorPosition.column,
    endLine: cursorPosition.line, // For now, assuming single line selections
    endColumn: cursorPosition.column + selectedText.length,
    selectedChars: selectedText.length,
    selectedWords: selectedText.trim().split(/\s+/).filter(Boolean).length
  };
}