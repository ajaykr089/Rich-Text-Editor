/**
 * Syntax Highlighting Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorAPI } from '../types';

export class SyntaxHighlightingExtension implements EditorExtension {
  public readonly name = 'syntax-highlighting';
  private editor: EditorAPI | null = null;
  private highlightContainer: HTMLElement | null = null;
  private currentTheme = 'dark';
  private highlightTimeout: number | null = null;
  private lastHighlightedText = '';
  private isHighlighting = false;
  private lastChangeTime = 0;
  private highlightCache = new Map<string, string>();
  private virtualScrollTop = 0;
  private virtualScrollHeight = 0;
  private lineHeight = 21;
  private visibleLines = 50;
  private totalLines = 0;
  private virtualStartLine = 0;
  private virtualEndLine = 0;

  setup(editor: EditorAPI): void {
    this.editor = editor;

    // Register syntax highlighting commands
    editor.registerCommand('highlightSyntax', () => {
      this.highlightSyntax();
    });

    // Listen for theme changes with debounced highlighting
    editor.on('change', (changes) => {
      this.debouncedHighlight(changes);
    });

    // Create syntax highlighting overlay
    this.createHighlightingOverlay();

    // Initial highlighting
    setTimeout(() => this.highlightSyntax(), 100);
  }

  private debouncedHighlight(changes?: any): void {
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
    }

    const now = Date.now();
    const timeSinceLastChange = now - this.lastChangeTime;
    this.lastChangeTime = now;

    // Use shorter debounce for fast typing, longer for slower editing
    const debounceTime = timeSinceLastChange < 100 ? 50 : 150;

    this.highlightTimeout = window.setTimeout(() => {
      this.incrementalHighlight(changes);
    }, debounceTime);
  }

  private incrementalHighlight(changes?: any): void {
    if (this.isHighlighting || !this.editor) return;

    this.isHighlighting = true;

    try {
      const text = this.editor.getValue();

      // For small changes, do incremental highlighting
      if (changes && changes.length === 1 && this.lastHighlightedText) {
        const change = changes[0];
        const incrementalResult = this.tryIncrementalHighlight(text, change);

        if (incrementalResult) {
          this.applyIncrementalHighlight(incrementalResult);
          this.lastHighlightedText = text;
          return;
        }
      }

      // Fall back to full highlighting
      this.fullHighlight(text);
    } finally {
      this.isHighlighting = false;
    }
  }

  private tryIncrementalHighlight(newText: string, change: any): any | null {
    // Simple incremental highlighting for single character changes
    if (!change || !change.text || change.text.length !== 1) {
      return null;
    }

    // Only handle simple insertions/deletions
    const oldText = this.lastHighlightedText;
    if (Math.abs(newText.length - oldText.length) > 10) {
      return null;
    }

    // Find the changed region (simplified)
    const minLength = Math.min(oldText.length, newText.length);
    let start = 0;
    let end = minLength;

    // Find first difference
    for (let i = 0; i < minLength; i++) {
      if (oldText[i] !== newText[i]) {
        start = Math.max(0, i - 50); // Include some context
        break;
      }
    }

    // Find last difference
    for (let i = minLength - 1; i >= 0; i--) {
      if (oldText[i] !== newText[i]) {
        end = Math.min(newText.length, i + 50); // Include some context
        break;
      }
    }

    // Extract and highlight the changed region
    const changedText = newText.substring(start, end);
    const highlightedRegion = this.parseAndHighlightHTML(changedText || '');

    return {
      start,
      end,
      highlightedHTML: highlightedRegion
    };
  }

  private applyIncrementalHighlight(incrementalResult: any): void {
    if (!this.highlightContainer) return;

    // This would require more sophisticated DOM manipulation
    // For now, fall back to full highlight
    this.fullHighlight(this.editor!.getValue());
  }

  private fullHighlight(text: string): void {
    if (!this.editor || !this.highlightContainer) return;

    // Check cache first
    const cacheKey = `${this.currentTheme}:${text.length}`;
    const cachedText = this.highlightCache.get(cacheKey);
    if (cachedText === text) {
      return; // No change needed
    }

    const highlightedHTML = this.parseAndHighlightHTML(text);
    this.highlightContainer.innerHTML = highlightedHTML;

    // Cache the result
    this.highlightCache.set(cacheKey, text);

    // Limit cache size
    if (this.highlightCache.size > 10) {
      const firstKey = this.highlightCache.keys().next().value;
      if (firstKey) {
        this.highlightCache.delete(firstKey);
      }
    }
  }

  private createHighlightingOverlay(): void {
    if (!this.editor) return;

    // Find the editor container
    const container = document.querySelector('.rte-source-editor-modal') as HTMLElement;
    if (!container) return;

    // Create highlighting overlay
    this.highlightContainer = document.createElement('div');
    this.highlightContainer.style.cssText = `
      position: absolute;
      top: 60px; /* Account for header */
      left: 50px; /* Account for line numbers */
      right: 0;
      bottom: 80px; /* Account for footer */
      pointer-events: none;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 21px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      z-index: 1;
      padding: 0;
      margin: 0;
      background: transparent;
      color: transparent;
    `;

    // Insert the overlay
    container.appendChild(this.highlightContainer);
  }

  private highlightSyntax(): void {
    if (!this.editor || !this.highlightContainer) return;

    const text = this.editor.getValue();
    const highlightedHTML = this.parseAndHighlightHTML(text);

    this.highlightContainer.innerHTML = highlightedHTML;
  }

  private parseAndHighlightHTML(html: string): string {
    // Format HTML with proper indentation first
    const formattedHtml = this.formatHTML(html);

    // Simple HTML syntax highlighting
    let highlighted = formattedHtml;

    // Highlight HTML tags
    highlighted = highlighted.replace(/(<\/?[\w:-]+(?:\s[^&]*?)?\/?>)/g, (match) => {
      return `<span style="color: ${this.currentTheme === 'dark' ? '#569cd6' : '#0000ff'};">${match}</span>`;
    });

    // Highlight attributes
    highlighted = highlighted.replace(/(\w+)(=)/g, (match, attr, equals) => {
      return `<span style="color: ${this.currentTheme === 'dark' ? '#9cdcfe' : '#001080'};">${attr}</span><span style="color: ${this.currentTheme === 'dark' ? '#d4d4d4' : '#000000'};">${equals}</span>`;
    });

    // Highlight attribute values
    highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, (match, quote, content) => {
      return `<span style="color: ${this.currentTheme === 'dark' ? '#d4d4d4' : '#000000'};">${quote}</span><span style="color: ${this.currentTheme === 'dark' ? '#ce9178' : '#a31515'};">${content}</span><span style="color: ${this.currentTheme === 'dark' ? '#d4d4d4' : '#000000'};">${quote}</span>`;
    });

    // Highlight comments
    highlighted = highlighted.replace(/(<!--[\s\S]*?-->)/g, (match) => {
      return `<span style="color: ${this.currentTheme === 'dark' ? '#6a9955' : '#008000'};">${match}</span>`;
    });

    // Convert newlines to <br> and spaces to &nbsp; for proper display
    highlighted = highlighted
      .replace(/\n/g, '<br>')
      .replace(/ /g, '&nbsp;')
      .replace(/\t/g, '&nbsp;&nbsp;');

    return highlighted;
  }

  private formatHTML(html: string): string {
    // Simple HTML formatter to add proper indentation
    let formatted = '';
    let indentLevel = 0;
    const indentSize = 2;

    // Split by tags and content, but preserve existing structure
    const tokens = html.split(/(<\/?[a-zA-Z][^>]*>)/);

    for (const token of tokens) {
      if (!token.trim()) continue;

      // Closing tag
      if (token.match(/^<\/[a-zA-Z]/)) {
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
      }
      // Opening tag
      else if (token.match(/^<[a-zA-Z]/) && !token.match(/\/>$/)) {
        formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
        indentLevel++;
      }
      // Self-closing tag
      else if (token.match(/^<[a-zA-Z].*\/>$/)) {
        formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
      }
      // Content (preserve whitespace and line breaks)
      else {
        formatted += token;
      }
    }

    return formatted.trim();
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    this.highlightSyntax();
  }

  // Memory management - clear caches periodically
  private cleanupMemory(): void {
    // Clear highlight cache if it gets too large
    if (this.highlightCache.size > 20) {
      this.highlightCache.clear();
    }

    // Clear timeout if still pending
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
      this.highlightTimeout = null;
    }
  }

  // Performance monitoring (can be enabled for debugging)
  private logPerformance(operation: string, startTime: number): void {
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime;
      if (duration > 100) { // Log slow operations
        console.warn(`Slow ${operation}: ${duration}ms`);
      }
    }
  }

  destroy(): void {
    // Clear all timeouts and caches
    if (this.highlightTimeout) {
      clearTimeout(this.highlightTimeout);
    }

    // Clear DOM references
    if (this.highlightContainer && this.highlightContainer.parentNode) {
      this.highlightContainer.parentNode.removeChild(this.highlightContainer);
    }

    // Clear memory
    this.highlightCache.clear();
    this.highlightContainer = null;
    this.editor = null;
    this.lastHighlightedText = '';
    this.isHighlighting = false;
    this.lastChangeTime = 0;
  }
}
