/**
 * Line Numbers Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

export class LineNumbersExtension implements EditorExtension {
  public readonly name = 'line-numbers';
  private editor: EditorCore | null = null;
  private lineNumbersElement: HTMLElement | null = null;
  private isEnabled = true;

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Create line numbers container
    this.createLineNumbers();

    // Register commands
    editor.registerCommand('toggleLineNumbers', () => {
      this.toggle();
    });

    // Listen for content changes to update line numbers
    editor.on('change', () => {
      this.updateLineNumbers();
    });

    // Initial update
    this.updateLineNumbers();
  }

  private createLineNumbers(): void {
    if (!this.editor) return;

    const view = this.editor.getView();
    const container = view['container'] as HTMLElement;
    if (!container) return;

    // Create line numbers element
    this.lineNumbersElement = document.createElement('div');
    this.lineNumbersElement.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 50px;
      background: var(--editor-gutter-background, #252526);
      color: var(--editor-gutter-foreground, #858585);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 21px;
      padding: 0;
      text-align: right;
      border-right: 1px solid var(--editor-gutter-border, #3e3e42);
      user-select: none;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;
    `;

    // Insert before content
    const contentElement = view.getContentElement();
    if (contentElement && contentElement.parentNode) {
      contentElement.parentNode.insertBefore(this.lineNumbersElement, contentElement);
      contentElement.style.marginLeft = '60px';
    }
  }

  private updateLineNumbers(): void {
    if (!this.lineNumbersElement || !this.editor || !this.isEnabled) return;

    const lineCount = this.editor.getValue().split('\n').length;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

    this.lineNumbersElement.innerHTML = lineNumbers
      .map(num => `<div style="height: 21px; line-height: 21px; padding-right: 12px;">${num}</div>`)
      .join('');
  }

  private toggle(): void {
    this.isEnabled = !this.isEnabled;

    if (this.lineNumbersElement) {
      this.lineNumbersElement.style.display = this.isEnabled ? 'block' : 'none';
    }

    const contentElement = this.editor.getView().getContentElement();
    if (contentElement) {
      contentElement.style.marginLeft = this.isEnabled ? '60px' : '0';
    }

    this.updateLineNumbers();
  }

  destroy(): void {
    if (this.lineNumbersElement && this.lineNumbersElement.parentNode) {
      this.lineNumbersElement.parentNode.removeChild(this.lineNumbersElement);
    }
    this.lineNumbersElement = null;
    this.editor = null;
  }
}
