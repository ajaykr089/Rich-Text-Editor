/**
 * Syntax Highlighting Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

export class SyntaxHighlightingExtension implements EditorExtension {
  public readonly name = 'syntax-highlighting';
  private editor: EditorCore | null = null;
  private highlightContainer: HTMLElement | null = null;
  private currentTheme = 'dark';

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Register syntax highlighting commands
    editor.registerCommand('highlightSyntax', () => {
      this.highlightSyntax();
    });

    // Listen for theme changes - we'll handle this differently
    editor.on('change', () => {
      this.highlightSyntax();
    });

    // Create syntax highlighting overlay
    this.createHighlightingOverlay();

    // Initial highlighting
    setTimeout(() => this.highlightSyntax(), 100);
  }

  private createHighlightingOverlay(): void {
    if (!this.editor) return;

    const view = this.editor.getView();
    const contentElement = view.getContentElement();
    if (!contentElement || !contentElement.parentNode) return;

    // Create highlighting overlay
    this.highlightContainer = document.createElement('div');
    this.highlightContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 50px; /* Account for line numbers */
      right: 0;
      bottom: 0;
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

    // Insert the overlay as a sibling to content element
    contentElement.parentNode.insertBefore(this.highlightContainer, contentElement);
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

  destroy(): void {
    if (this.highlightContainer && this.highlightContainer.parentNode) {
      this.highlightContainer.parentNode.removeChild(this.highlightContainer);
    }
    this.highlightContainer = null;
    this.editor = null;
  }
}
