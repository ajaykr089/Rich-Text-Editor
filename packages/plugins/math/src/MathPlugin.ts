import { Plugin } from '@rte-editor/core';
import katex from 'katex';

/**
 * Math Plugin for Rich Text Editor
 *
 * Allows users to insert and edit mathematical formulas
 * using LaTeX or MathML syntax with live preview
 */
export const MathPlugin = (): Plugin => ({
  name: 'math',
  toolbar: [
    {
      label: 'Insert Math',
      command: 'insertMath',
      icon: '∑'
    }
  ]
});

/**
 * Math Commands
 * Handles math formula insertion and editing
 */

// Store selection when math command is triggered
let storedMathSelection: Range | null = null;

// Insert math command - opens dialog
export const insertMathCommand = () => {
  // Store current selection before dialog opens
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    storedMathSelection = selection.getRangeAt(0).cloneRange();
  }
  // This will be handled by the MathProvider which manages the dialog state
  // The command triggers the dialog opening
};

// Update math command - for editing existing formulas
export const updateMathCommand = (mathData: MathData) => {
  applyMathToSelection(mathData);
  // Clear stored selection after use
  storedMathSelection = null;
};

export interface MathData {
  formula: string;
  format: 'latex' | 'mathml';
  inline: boolean; // true for inline math, false for block math
}

/**
 * Helper function to apply math formula to stored selection
 */
function applyMathToSelection(mathData: MathData) {
  // Use stored selection from before dialog opened
  const range = storedMathSelection;
  if (!range) {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  // Restore the stored selection
  selection.removeAllRanges();
  selection.addRange(range);

  // For collapsed selections (just cursor), we'll still insert the math
  // For non-collapsed selections, we'll wrap the selected content

  // Create a math span with data attributes
  const mathSpan = document.createElement('span');
  mathSpan.className = 'math-formula';
  mathSpan.setAttribute('data-math-formula', mathData.formula);
  mathSpan.setAttribute('data-math-format', mathData.format);
  mathSpan.setAttribute('data-math-inline', mathData.inline.toString());

  // Render the math formula using KaTeX
  try {
    const renderedHtml = katex.renderToString(mathData.formula, {
      displayMode: false, // inline mode
      throwOnError: false,
      errorColor: '#cc0000'
    }).replace('aria-hidden="true"', ''); // Remove aria-hidden to ensure visibility

    // Instead of innerHTML, create a temporary element and append its children
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedHtml;

    // Append the KaTeX elements to our math span
    while (tempDiv.firstChild) {
      mathSpan.appendChild(tempDiv.firstChild);
    }
  } catch (error) {
    console.error('MathPlugin: KaTeX rendering failed:', error);
    // Fallback to placeholder text if KaTeX fails
    const fallbackText = `[Math: ${mathData.formula.substring(0, 20)}${mathData.formula.length > 20 ? '...' : ''}]`;
    mathSpan.textContent = fallbackText;
  }

  // For inline math, use a span wrapper
  // For block math, replace the entire paragraph
  if (mathData.inline) {
    // Use insertHTML command for safe insertion of complex HTML
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Insert the math span at the cursor position
      range.insertNode(mathSpan);

      // Move cursor after the inserted math
      range.setStartAfter(mathSpan);
      range.setEndAfter(mathSpan);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // For block math, replace the entire block element
    const blockElement = findBlockAncestor(range.commonAncestorContainer);
    if (blockElement) {
      // Create a block math div
      const mathBlock = document.createElement('div');
      mathBlock.className = 'math-block';
      mathBlock.setAttribute('data-math-formula', mathData.formula);
      mathBlock.setAttribute('data-math-format', mathData.format);
      mathBlock.setAttribute('data-math-inline', 'false');

      // Render the block math formula using KaTeX
      try {
        const renderedHtml = katex.renderToString(mathData.formula, {
          displayMode: true, // block/display mode
          throwOnError: false,
          errorColor: '#cc0000'
        });
        mathBlock.innerHTML = renderedHtml;
      } catch (error) {
        console.error('MathPlugin: KaTeX block rendering failed:', error);
        // Fallback to placeholder text if KaTeX fails
        mathBlock.textContent = `[Math Block: ${mathData.formula.substring(0, 30)}${mathData.formula.length > 30 ? '...' : ''}]`;
      }

      blockElement.parentNode?.replaceChild(mathBlock, blockElement);
    }
  }

  // Restore selection to after the inserted math
  try {
    const newRange = document.createRange();
    newRange.setStartAfter(mathSpan);
    newRange.setEndAfter(mathSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } catch (error) {
    console.error('MathPlugin: Error restoring selection:', error);
  }
}

/**
 * Helper function to find the block ancestor of a node
 */
function findBlockAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].includes(tagName)) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}
