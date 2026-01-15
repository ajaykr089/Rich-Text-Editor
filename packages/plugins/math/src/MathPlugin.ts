import { Plugin } from '@rte-editor/core';
import katex from 'katex';
import { MathMLToLaTeX } from 'mathml-to-latex';

/**
 * Math Plugin for Rich Text Editor
 *
 * Allows users to insert and edit mathematical formulas
 * using LaTeX or MathML syntax with live preview
 */

// Math Node Model - Source of Truth
export interface MathNode {
  id: string;
  type: 'inline' | 'block';
  format: 'latex' | 'mathml';
  formula: string;
  renderedHtml: string;
  semanticLabel: string;
  created: Date;
  modified: Date;
}

// Math Registry - Central store for all math nodes
class MathRegistry {
  private nodes = new Map<string, MathNode>();
  private observers: ((node: MathNode, action: 'add' | 'update' | 'delete') => void)[] = [];

  add(node: MathNode): void {
    this.nodes.set(node.id, node);
    this.notifyObservers(node, 'add');
  }

  update(id: string, updates: Partial<MathNode>): void {
    const node = this.nodes.get(id);
    if (node) {
      Object.assign(node, updates, { modified: new Date() });
      this.notifyObservers(node, 'update');
    }
  }

  delete(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      this.nodes.delete(id);
      this.notifyObservers(node, 'delete');
    }
  }

  get(id: string): MathNode | undefined {
    return this.nodes.get(id);
  }

  getAll(): MathNode[] {
    return Array.from(this.nodes.values());
  }

  subscribe(observer: (node: MathNode, action: 'add' | 'update' | 'delete') => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(node: MathNode, action: 'add' | 'update' | 'delete'): void {
    this.observers.forEach(observer => observer(node, action));
  }
}

// Selection Manager - Handles cursor and selection behavior
class MathSelectionManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Check if selection is inside a math element
    const mathElement = this.findMathElement(range.commonAncestorContainer);
    if (mathElement) {
      this.handleSelectionInMath(event, range, mathElement);
    } else {
      this.handleSelectionNearMath(event, range);
    }
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const mathElement = target.closest('.math-node') as HTMLElement;

    if (mathElement) {
      // Select the entire math element
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(mathElement);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  private handleSelectionInMath(event: KeyboardEvent, range: Range, mathElement: HTMLElement): void {
    // Prevent normal text editing inside math elements
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      // Move cursor after the math element
      this.placeCursorAfterMath(mathElement);
    }

    // Handle deletion of math elements
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.deleteMathElement(mathElement);
    }
  }

  private handleSelectionNearMath(event: KeyboardEvent, range: Range): void {
    // Handle deletion near math elements
    if (event.key === 'Backspace') {
      const previousElement = this.findPreviousElement(range.startContainer, range.startOffset);
      if (previousElement && previousElement.classList.contains('math-node')) {
        event.preventDefault();
        this.deleteMathElement(previousElement);
      }
    }

    if (event.key === 'Delete') {
      const nextElement = this.findNextElement(range.endContainer, range.endOffset);
      if (nextElement && nextElement.classList.contains('math-node')) {
        event.preventDefault();
        this.deleteMathElement(nextElement);
      }
    }
  }

  private findMathElement(node: Node): HTMLElement | null {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('math-node')) {
        return element;
      }
    }

    let current = node;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (element.classList.contains('math-node')) {
          return element;
        }
      }
      current = current.parentNode as Node;
    }

    return null;
  }

  private placeCursorAfterMath(mathElement: HTMLElement): void {
    const selection = window.getSelection()!;
    const range = document.createRange();

    const nextNode = this.findNextTextNode(mathElement);
    if (nextNode) {
      range.setStart(nextNode, 0);
      range.setEnd(nextNode, 0);
    } else {
      // Insert a text node if none exists
      const textNode = document.createTextNode('');
      if (mathElement.parentNode) {
        mathElement.parentNode.insertBefore(textNode, mathElement.nextSibling);
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  private deleteMathElement(mathElement: HTMLElement): void {
    const mathId = mathElement.getAttribute('data-math-id');
    if (mathId) {
      this.registry.delete(mathId);
    }
    mathElement.remove();
  }

  private findPreviousElement(container: Node, offset: number): HTMLElement | null {
    if (container.nodeType === Node.TEXT_NODE) {
      if (offset > 0) return null;
      const parent = container.parentNode as HTMLElement;
      const siblings = Array.from(parent.parentNode?.children || []);
      const index = siblings.indexOf(parent);
      for (let i = index - 1; i >= 0; i--) {
        const sibling = siblings[i] as HTMLElement;
        if (sibling.classList.contains('math-node')) {
          return sibling;
        }
      }
    }
    return null;
  }

  private findNextElement(container: Node, offset: number): HTMLElement | null {
    if (container.nodeType === Node.TEXT_NODE) {
      const textNode = container as Text;
      if (offset < textNode.length) return null;
      const parent = container.parentNode as HTMLElement;
      const siblings = Array.from(parent.parentNode?.children || []);
      const index = siblings.indexOf(parent);
      for (let i = index + 1; i < siblings.length; i++) {
        const sibling = siblings[i] as HTMLElement;
        if (sibling.classList.contains('math-node')) {
          return sibling;
        }
      }
    }
    return null;
  }

  private findNextTextNode(element: HTMLElement): Text | null {
    let current: Node | null = element.nextSibling;
    while (current) {
      if (current.nodeType === Node.TEXT_NODE && current.textContent?.trim()) {
        return current as Text;
      }
      if (current.nodeType === Node.ELEMENT_NODE && !(current as HTMLElement).classList.contains('math-node')) {
        // Look inside non-math elements for text nodes
        const textNode = this.findTextNodeInElement(current as HTMLElement);
        if (textNode) return textNode;
      }
      current = current.nextSibling;
    }
    return null;
  }

  private findTextNodeInElement(element: HTMLElement): Text | null {
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        return child as Text;
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const textNode = this.findTextNodeInElement(child as HTMLElement);
        if (textNode) return textNode;
      }
    }
    return null;
  }
}

// Math Renderer - Handles rendering with caching
class MathRenderer {
  private cache = new Map<string, { html: string; semantic: string }>();
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
  }

  render(node: MathNode): { html: string; semantic: string } {
    const cacheKey = `${node.format}:${node.formula}:${node.type}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const result = this.doRender(node);
    this.cache.set(cacheKey, result);
    return result;
  }

  private doRender(node: MathNode): { html: string; semantic: string } {
    try {
      let latexFormula = node.formula;

      // Convert MathML to LaTeX if needed
      if (node.format === 'mathml') {
        latexFormula = this.convertMathMLToLatex(node.formula);
      }

      // Render with KaTeX
      const renderedHtml = katex.renderToString(latexFormula, {
        displayMode: node.type === 'block',
        throwOnError: false,
        errorColor: '#cc0000'
      }).replace('aria-hidden="true"', '');

      // Generate semantic label
      const semanticLabel = this.generateSemanticLabel(latexFormula, node.format);

      return { html: renderedHtml, semantic: semanticLabel };
    } catch (error) {
      console.error('Math rendering failed:', error);
      const fallback = `[${node.format.toUpperCase()}: ${node.formula.substring(0, 20)}]`;
      return { html: fallback, semantic: fallback };
    }
  }

  private convertMathMLToLatex(mathml: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<root>${mathml}</root>`, 'text/xml');

      const rootChildren = Array.from(doc.documentElement.children);
      const convertedParts: string[] = [];

      for (const child of rootChildren) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const converted = this.convertMathMLElement(child as Element);
          if (converted) {
            convertedParts.push(converted);
          }
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          convertedParts.push(child.textContent.trim());
        }
      }

      return convertedParts.join(' ');
    } catch (error) {
      // Fallback to manual conversion
      return convertMathMLToLatexManual(mathml);
    }
  }

  private convertMathMLElement(element: Element): string {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'msqrt':
        const sqrtContent = Array.from(element.children).map(child => this.convertMathMLElement(child as Element)).join('');
        return `\\sqrt{${sqrtContent}}`;

      case 'msup':
        const supChildren = Array.from(element.children);
        if (supChildren.length >= 2) {
          const base = this.convertMathMLElement(supChildren[0]);
          const exponent = this.convertMathMLElement(supChildren[1]);
          return `${base}^{${exponent}}`;
        }
        break;

      case 'msub':
        const subChildren = Array.from(element.children);
        if (subChildren.length >= 2) {
          const base = this.convertMathMLElement(subChildren[0]);
          const subscript = this.convertMathMLElement(subChildren[1]);
          return `${base}_{${subscript}}`;
        }
        break;

      case 'mfrac':
        const fracChildren = Array.from(element.children);
        if (fracChildren.length >= 2) {
          const numerator = this.convertMathMLElement(fracChildren[0]);
          const denominator = this.convertMathMLElement(fracChildren[1]);
          return `\\frac{${numerator}}{${denominator}}`;
        }
        break;

      case 'mfenced':
        const fencedChildren = Array.from(element.children);
        const open = element.getAttribute('open') || '(';
        const close = element.getAttribute('close') || ')';
        const content = fencedChildren.map(child => this.convertMathMLElement(child as Element)).join('');
        return `${open}${content}${close}`;

      case 'mrow':
        return Array.from(element.children).map(child => this.convertMathMLElement(child as Element)).join('');

      case 'mi':
      case 'mn':
      case 'mo':
        return element.textContent || '';

      default:
        return element.textContent || '';
    }

    return element.textContent || '';
  }

  private generateSemanticLabel(latex: string, format: 'latex' | 'mathml'): string {
    // Simple semantic label generation
    if (format === 'latex') {
      // Basic LaTeX to English conversion
      return latex
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, 'fraction $1 over $2')
        .replace(/\\sqrt{([^}]*)}/g, 'square root of $1')
        .replace(/([^_]*)_{([^}]*)}/g, '$1 sub $2')
        .replace(/([^\\^]*)\\^([^}]*)/g, '$1 to the power of $2')
        .replace(/[{}]/g, '');
    } else {
      // For MathML, use the text content
      return latex.replace(/<[^>]+>/g, '').trim();
    }
  }
}

// Undo/Redo Manager - Phase 3 Implementation
class MathUndoManager {
  private operations: MathOperation[] = [];
  private maxOperations = 50; // Limit undo history

  record(operation: MathOperation): void {
    this.operations.push(operation);
    // Limit history size
    if (this.operations.length > this.maxOperations) {
      this.operations.shift();
    }
  }

  canUndo(): boolean {
    return this.operations.length > 0;
  }

  canRedo(): boolean {
    return false; // For now, no redo support
  }

  undo(): void {
    const operation = this.operations.pop();
    if (operation) {
      operation.undo();
    }
  }

  clear(): void {
    this.operations = [];
  }
}

interface MathOperation {
  type: 'insert' | 'update' | 'delete';
  nodeId: string;
  before: MathNode | null;
  after: MathNode | null;
  timestamp: Date;

  undo(): void;
  redo(): void;
}

// Export/Import Manager - Phase 3 Implementation
class MathSerializationManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
  }

  // Export math content as JSON
  exportToJSON(): string {
    const nodes = this.registry.getAll();
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      mathNodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        format: node.format,
        formula: node.formula,
        created: node.created.toISOString(),
        modified: node.modified.toISOString()
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import math content from JSON
  importFromJSON(jsonString: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const importData = JSON.parse(jsonString);

      if (!importData.mathNodes || !Array.isArray(importData.mathNodes)) {
        errors.push('Invalid JSON format: missing mathNodes array');
        return { success: false, imported: 0, errors };
      }

      for (const nodeData of importData.mathNodes) {
        try {
          const node: MathNode = {
            id: nodeData.id || generateMathId(),
            type: nodeData.type || 'inline',
            format: nodeData.format || 'latex',
            formula: nodeData.formula || '',
            renderedHtml: '',
            semanticLabel: '',
            created: nodeData.created ? new Date(nodeData.created) : new Date(),
            modified: nodeData.modified ? new Date(nodeData.modified) : new Date()
          };

          // Validate the node
          if (!node.formula.trim()) {
            errors.push(`Skipping empty formula for node ${node.id}`);
            continue;
          }

          // Render the node
          const renderResult = mathRenderer.render(node);
          node.renderedHtml = renderResult.html;
          node.semanticLabel = renderResult.semantic;

          this.registry.add(node);
          imported++;

        } catch (nodeError) {
          errors.push(`Failed to import node ${nodeData.id}: ${nodeError}`);
        }
      }

    } catch (parseError) {
      errors.push(`JSON parsing failed: ${parseError}`);
      return { success: false, imported: 0, errors };
    }

    return {
      success: errors.length === 0,
      imported,
      errors
    };
  }

  // Export as HTML with data attributes
  exportToHTML(): string {
    const nodes = this.registry.getAll();
    let html = '';

    for (const node of nodes) {
      const element = createMathElement(node);
      html += element.outerHTML + '\n';
    }

    return html;
  }

  // Import from HTML with data attributes
  importFromHTML(htmlString: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;

      const mathElements = tempDiv.querySelectorAll('.math-node');
      for (const element of mathElements) {
        try {
          const node: MathNode = {
            id: element.getAttribute('data-math-id') || generateMathId(),
            type: (element.getAttribute('data-math-type') as 'inline' | 'block') || 'inline',
            format: (element.getAttribute('data-math-format') as 'latex' | 'mathml') || 'latex',
            formula: element.getAttribute('data-math-formula') || '',
            renderedHtml: element.innerHTML,
            semanticLabel: element.getAttribute('aria-label') || '',
            created: new Date(),
            modified: new Date()
          };

          // Validate the node
          if (!node.formula.trim()) {
            errors.push(`Skipping empty formula for node ${node.id}`);
            continue;
          }

          this.registry.add(node);
          imported++;

        } catch (nodeError) {
          errors.push(`Failed to import HTML node: ${nodeError}`);
        }
      }

    } catch (htmlError) {
      errors.push(`HTML parsing failed: ${htmlError}`);
      return { success: false, imported: 0, errors };
    }

    return {
      success: errors.length === 0,
      imported,
      errors
    };
  }
}

// Global instances (isolated within plugin)
const mathRegistry = new MathRegistry();
const mathRenderer = new MathRenderer(mathRegistry);
const mathSelectionManager = new MathSelectionManager(mathRegistry);
const mathUndoManager = new MathUndoManager();
const mathSerializationManager = new MathSerializationManager(mathRegistry);

// Utility functions
function generateMathId(): string {
  return `math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createMathElement(node: MathNode): HTMLElement {
  const element = document.createElement(node.type === 'inline' ? 'span' : 'div');
  element.className = `math-node math-${node.type}`;
  element.setAttribute('data-math-id', node.id);
  element.setAttribute('data-math-format', node.format);
  element.setAttribute('data-math-formula', node.formula);
  element.setAttribute('contenteditable', 'false');
  element.setAttribute('role', 'math');
  element.setAttribute('aria-label', node.semanticLabel);

  // Add rendered content
  element.innerHTML = node.renderedHtml;

  return element;
}

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

// Clipboard Support - Phase 1 Implementation
class MathClipboardManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
    this.initializeClipboardHandlers();
  }

  private initializeClipboardHandlers(): void {
    document.addEventListener('copy', this.handleCopy.bind(this));
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  private handleCopy(event: ClipboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const mathElement = this.findMathElement(range.commonAncestorContainer);

    if (mathElement) {
      event.preventDefault();

      const mathId = mathElement.getAttribute('data-math-id');
      if (mathId) {
        const node = this.registry.get(mathId);
        if (node) {
          // Create HTML format for internal paste
          const htmlFormat = this.createHtmlClipboardFormat(node);

          // Create plain text fallback
          const textFormat = node.format === 'latex' ? node.formula : node.formula.replace(/<[^>]+>/g, '');

          if (event.clipboardData) {
            event.clipboardData.setData('text/html', htmlFormat);
            event.clipboardData.setData('text/plain', textFormat);
          }
        }
      }
    }
  }

  private handlePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    // Check if it's our math paste format
    if (htmlData && htmlData.includes('data-math-format')) {
      event.preventDefault();

      const mathNode = this.parseHtmlClipboardFormat(htmlData);
      if (mathNode) {
        this.insertMathNodeAtCursor(mathNode);
      }
    }
  }

  private findMathElement(node: Node): HTMLElement | null {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('math-node')) {
        return element;
      }
    }

    let current = node;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (element.classList.contains('math-node')) {
          return element;
        }
      }
      current = current.parentNode as Node;
    }

    return null;
  }

  private createHtmlClipboardFormat(node: MathNode): string {
    return `<span class="math-paste-data" data-math-format="${node.format}" data-math-formula="${this.escapeHtml(node.formula)}" data-math-type="${node.type}">${this.escapeHtml(node.formula)}</span>`;
  }

  private parseHtmlClipboardFormat(html: string): MathNode | null {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const pasteElement = tempDiv.querySelector('.math-paste-data') as HTMLElement;
    if (!pasteElement) return null;

    const format = pasteElement.getAttribute('data-math-format') as 'latex' | 'mathml';
    const formula = pasteElement.getAttribute('data-math-formula');
    const type = pasteElement.getAttribute('data-math-type') as 'inline' | 'block';

    if (!format || !formula || !type) return null;

    return {
      id: generateMathId(),
      type,
      format,
      formula,
      renderedHtml: '',
      semanticLabel: '',
      created: new Date(),
      modified: new Date()
    };
  }

  private insertMathNodeAtCursor(node: MathNode): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Render the node
    const renderResult = mathRenderer.render(node);
    node.renderedHtml = renderResult.html;
    node.semanticLabel = renderResult.semantic;

    // Create DOM element
    const element = createMathElement(node);

    // Insert at cursor
    range.insertNode(element);

    // Register the node
    mathRegistry.add(node);

    // Move cursor after the element
    range.setStartAfter(element);
    range.setEndAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize clipboard manager
const mathClipboardManager = new MathClipboardManager(mathRegistry);

/**
 * Math Commands - Updated for new architecture
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
export const updateMathCommand = (mathData: MathData, existingSpan?: HTMLElement) => {
  if (existingSpan) {
    // Editing existing math - update the span in place
    updateExistingMath(existingSpan, mathData);
  } else {
    // New math insertion
    applyMathToSelection(mathData);
  }
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
  mathSpan.setAttribute('contenteditable', 'false'); // Make it non-editable

  // Render the math formula
  try {
    let latexFormula = mathData.formula;

    // Convert MathML to LaTeX if needed
    if (mathData.format === 'mathml') {
      console.log('MathPlugin: Converting MathML to LaTeX:', mathData.formula);
      try {
        latexFormula = MathMLToLaTeX.convert(mathData.formula);
        console.log('MathPlugin: MathML converted to LaTeX:', latexFormula);

        // If conversion returns empty, try manual mapping
        if (!latexFormula || latexFormula.trim() === '') {
          console.log('MathPlugin: Conversion returned empty, trying manual mapping');
          latexFormula = convertMathMLToLatexManual(mathData.formula);
          console.log('MathPlugin: Manual conversion result:', latexFormula);
        }
      } catch (conversionError) {
        console.error('MathPlugin: MathML to LaTeX conversion failed:', conversionError);
        // Fallback: try manual mapping
        latexFormula = convertMathMLToLatexManual(mathData.formula);
        console.log('MathPlugin: Using manual conversion fallback:', latexFormula);
      }
    }

    // Use KaTeX for LaTeX rendering (both original LaTeX and converted MathML)
    const renderedHtml = katex.renderToString(latexFormula, {
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
    console.error('MathPlugin: Rendering failed:', error);
    // Fallback to placeholder text
    const fallbackText = `[${mathData.format.toUpperCase()}: ${mathData.formula.substring(0, 20)}${mathData.formula.length > 20 ? '...' : ''}]`;
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
 * Helper function to update existing math span in place
 */
function updateExistingMath(existingSpan: HTMLElement, mathData: MathData) {
  // Clear existing content
  existingSpan.innerHTML = '';

  // Update data attributes
  existingSpan.setAttribute('data-math-formula', mathData.formula);
  existingSpan.setAttribute('data-math-format', mathData.format);
  existingSpan.setAttribute('data-math-inline', mathData.inline.toString());

  // Render the new math formula
  try {
    let latexFormula = mathData.formula;

    // Convert MathML to LaTeX if needed
    if (mathData.format === 'mathml') {
      try {
        latexFormula = MathMLToLaTeX.convert(mathData.formula);
      } catch (conversionError) {
        console.warn('MathPlugin: MathML to LaTeX conversion failed, using original:', conversionError);
        // Fallback: try to extract text content from MathML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mathData.formula;
        latexFormula = tempDiv.textContent || mathData.formula;
      }
    }

    // Use KaTeX for LaTeX rendering (both original LaTeX and converted MathML)
    const renderedHtml = katex.renderToString(latexFormula, {
      displayMode: false, // inline mode
      throwOnError: false,
      errorColor: '#cc0000'
    }).replace('aria-hidden="true"', ''); // Remove aria-hidden to ensure visibility

    // Instead of innerHTML, create a temporary element and append its children
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedHtml;

    // Append the KaTeX elements to the existing span
    while (tempDiv.firstChild) {
      existingSpan.appendChild(tempDiv.firstChild);
    }
  } catch (error) {
    console.error('MathPlugin: Rendering failed:', error);
    // Fallback to placeholder text
    const fallbackText = `[${mathData.format.toUpperCase()}: ${mathData.formula.substring(0, 20)}${mathData.formula.length > 20 ? '...' : ''}]`;
    existingSpan.textContent = fallbackText;
  }
}

/**
 * Manual MathML to LaTeX conversion for common elements
 */
function convertMathMLToLatexManual(mathml: string): string {
  try {
    console.log('Manual conversion input:', mathml);

    // Handle complex MathML expressions by parsing the structure
    // First, try to parse as XML to handle nested structures
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<root>${mathml}</root>`, 'text/xml');

      // If parsing succeeds, convert the top-level elements
      const rootChildren = Array.from(doc.documentElement.children);
      const convertedParts: string[] = [];

      for (const child of rootChildren) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const converted = convertMathMLElement(child as Element);
          if (converted) {
            convertedParts.push(converted);
          }
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          // Handle text content (operators, etc.)
          convertedParts.push(child.textContent.trim());
        }
      }

      const result = convertedParts.join(' ');
      console.log('XML parsing conversion result:', result);
      return result;

    } catch (xmlError) {
      console.warn('XML parsing failed, falling back to regex approach:', xmlError);
    }

    // Fallback: Simple regex-based approach for basic cases
    const parts = mathml.trim().split(/\s+/);
    console.log('Fallback parsed parts:', parts);

    const convertedParts: string[] = [];

    for (const part of parts) {
      if (part.startsWith('<') && part.includes('</')) {
        // This looks like complete MathML, try to convert it
        const converted = convertSingleMathML(part);
        if (converted) {
          convertedParts.push(converted);
        } else {
          convertedParts.push(extractTextContent(part));
        }
      } else {
        // This is plain text (like operators +, -, etc.)
        convertedParts.push(part);
      }
    }

    const result = convertedParts.join(' ');
    console.log('Manual conversion result:', result);
    return result;

  } catch (error) {
    console.error('Manual MathML conversion failed:', error);
    // Extract text content as final fallback
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mathml;
    return tempDiv.textContent || mathml;
  }
}

/**
 * Convert a MathML DOM element to LaTeX
 */
function convertMathMLElement(element: Element): string {
  const tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'msqrt':
      const sqrtContent = Array.from(element.children).map(convertMathMLElement).join('');
      return `\\sqrt{${sqrtContent}}`;

    case 'msup':
      const supChildren = Array.from(element.children);
      if (supChildren.length >= 2) {
        const base = convertMathMLElement(supChildren[0]);
        const exponent = convertMathMLElement(supChildren[1]);
        return `${base}^{${exponent}}`;
      }
      break;

    case 'msub':
      const subChildren = Array.from(element.children);
      if (subChildren.length >= 2) {
        const base = convertMathMLElement(subChildren[0]);
        const subscript = convertMathMLElement(subChildren[1]);
        return `${base}_{${subscript}}`;
      }
      break;

    case 'mfrac':
      const fracChildren = Array.from(element.children);
      if (fracChildren.length >= 2) {
        const numerator = convertMathMLElement(fracChildren[0]);
        const denominator = convertMathMLElement(fracChildren[1]);
        return `\\frac{${numerator}}{${denominator}}`;
      }
      break;

    case 'mfenced':
      const fencedChildren = Array.from(element.children);
      const open = element.getAttribute('open') || '(';
      const close = element.getAttribute('close') || ')';
      const content = fencedChildren.map(convertMathMLElement).join('');
      return `${open}${content}${close}`;

    case 'mrow':
      return Array.from(element.children).map(convertMathMLElement).join('');

    case 'mi': // identifier
    case 'mn': // number
    case 'mo': // operator
      return element.textContent || '';

    default:
      // For unknown elements, try to extract text content
      return element.textContent || '';
  }

  // Fallback for unhandled elements
  return element.textContent || '';
}

/**
 * Convert a single MathML expression
 */
function convertSingleMathML(mathml: string): string {
  try {
    // Simple regex-based conversion for common patterns
    let result = mathml;

    // Handle fractions: <mfrac><mi>a</mi><mi>b</mi></mfrac> -> \frac{a}{b}
    result = result.replace(/<mfrac[^>]*>(.*?)<\/mfrac>/gi, (match, content) => {
      // Extract numerator and denominator
      const numMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      const denomMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>(.*)/i);

      if (numMatch && denomMatch) {
        const numerator = numMatch[1];
        // Get the second match which should be the denominator
        const remaining = content.replace(numMatch[0], '');
        const denomMatch2 = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (denomMatch2) {
          const denominator = denomMatch2[1];
          return `\\frac{${numerator}}{${denominator}}`;
        }
      }
      return match;
    });

    // Handle square roots: <msqrt><mi>x</mi></msqrt> -> \sqrt{x}
    result = result.replace(/<msqrt[^>]*>(.*?)<\/msqrt>/gi, (match, content) => {
      // Extract the content inside msqrt
      const innerMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (innerMatch) {
        return `\\sqrt{${innerMatch[1]}}`;
      }
      return match;
    });

    // Handle superscripts: <msup><mi>x</mi><mn>2</mn></msup> -> x^{2}
    result = result.replace(/<msup[^>]*>(.*?)<\/msup>/gi, (match, content) => {
      const baseMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (baseMatch) {
        const remaining = content.replace(baseMatch[0], '');
        const expMatch = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (expMatch) {
          return `${baseMatch[1]}^{${expMatch[1]}}`;
        }
      }
      return match;
    });

    // If we successfully converted something, clean up remaining tags
    if (result !== mathml) {
      result = result.replace(/<[^>]+>/g, '');
      return result;
    }

    return ''; // Return empty if no conversion happened

  } catch (error) {
    console.error('Single MathML conversion failed:', error);
    return '';
  }
}

/**
 * Extract text content from MathML as fallback
 */
function extractTextContent(mathml: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = mathml;
  return tempDiv.textContent || mathml;
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
