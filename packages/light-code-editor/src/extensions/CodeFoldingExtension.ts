/**
 * Code Folding Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, FoldRange, Position } from '../types';

export class CodeFoldingExtension implements EditorExtension {
  public readonly name = 'code-folding';
  private editor: EditorCore | null = null;
  private foldIndicators: HTMLElement[] = [];
  private foldingUI: HTMLElement | null = null;

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Register folding commands
    editor.registerCommand('fold', () => {
      this.foldAtCursor();
    });

    editor.registerCommand('unfold', () => {
      this.unfoldAtCursor();
    });

    editor.registerCommand('foldAll', () => {
      this.foldAll();
    });

    editor.registerCommand('unfoldAll', () => {
      this.unfoldAll();
    });

    // Keyboard shortcuts
    editor.on('keydown', (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === '[') {
        event.preventDefault();
        this.foldAtCursor();
        return false;
      } else if (event.ctrlKey && event.shiftKey && event.key === ']') {
        event.preventDefault();
        this.unfoldAtCursor();
        return false;
      }
    });

    // Listen for content changes to update fold indicators
    editor.on('change', () => {
      this.updateFoldIndicators();
    });

    // Initial setup
    this.createFoldingUI();
    this.updateFoldIndicators();
  }

  private createFoldingUI(): void {
    if (!this.editor) return;

    const view = this.editor.getView();
    const container = view['container'] as HTMLElement;
    if (!container) return;

    this.foldingUI = document.createElement('div');
    this.foldingUI.style.cssText = `
      position: absolute;
      left: 40px;
      top: 0;
      bottom: 0;
      width: 20px;
      pointer-events: none;
      z-index: 2;
    `;

    container.appendChild(this.foldingUI);
  }

  private updateFoldIndicators(): void {
    if (!this.editor || !this.foldingUI) return;

    // Clear existing indicators
    this.foldingUI.innerHTML = '';
    this.foldIndicators = [];

    const text = this.editor.getValue();
    const lines = text.split('\n');

    // Find foldable regions (simplified - could be extended for different languages)
    const foldableLines = this.findFoldableLines(lines);

    foldableLines.forEach(lineIndex => {
      this.createFoldIndicator(lineIndex);
    });
  }

  private findFoldableLines(lines: string[]): number[] {
    const foldableLines: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Simple folding rules - can be extended
      if (line.startsWith('{') || line.startsWith('function') ||
          line.startsWith('class') || line.startsWith('if') ||
          line.includes('=>') || line.startsWith('for') ||
          line.startsWith('while') || line.startsWith('try')) {
        foldableLines.push(i);
      }
    }

    return foldableLines;
  }

  private createFoldIndicator(lineIndex: number): void {
    if (!this.foldingUI) return;

    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      top: ${lineIndex * 21}px;
      width: 20px;
      height: 21px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      color: var(--editor-gutter-foreground, #858585);
      font-size: 10px;
      user-select: none;
    `;

    indicator.innerHTML = '▶'; // Right arrow for collapsed state
    indicator.title = 'Click to fold/unfold code block';

    indicator.addEventListener('click', () => {
      this.toggleFoldAtLine(lineIndex);
    });

    this.foldingUI.appendChild(indicator);
    this.foldIndicators.push(indicator);
  }

  private toggleFoldAtLine(lineIndex: number): void {
    if (!this.editor) return;

    const folds = this.editor.getFolds();
    const existingFold = folds.find(fold => fold.start.line === lineIndex);

    if (existingFold) {
      this.editor.unfold(existingFold);
    } else {
      // Create a fold range (simplified - find matching closing brace)
      const text = this.editor.getValue();
      const lines = text.split('\n');

      // Simple folding - fold until next closing brace or indentation decreases
      let endLine = lineIndex + 1;
      let indentLevel = this.getIndentLevel(lines[lineIndex]);

      for (let i = lineIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        const lineIndent = this.getIndentLevel(line);

        if (line.trim().startsWith('}')) {
          endLine = i;
          break;
        }

        if (line.trim() !== '' && lineIndent <= indentLevel) {
          endLine = i;
          break;
        }

        endLine = i + 1;
      }

      if (endLine > lineIndex + 1) {
        this.editor.fold({
          start: { line: lineIndex, column: 0 },
          end: { line: endLine, column: 0 }
        });
      }
    }

    this.updateFoldIndicators();
  }

  private getIndentLevel(line: string): number {
    let indent = 0;
    for (const char of line) {
      if (char === ' ') {
        indent++;
      } else if (char === '\t') {
        indent += 2; // Assume tab = 2 spaces
      } else {
        break;
      }
    }
    return indent;
  }

  private foldAtCursor(): void {
    if (!this.editor) return;

    const cursor = this.editor.getCursor();
    this.toggleFoldAtLine(cursor.position.line);
  }

  private unfoldAtCursor(): void {
    if (!this.editor) return;

    const cursor = this.editor.getCursor();
    const folds = this.editor.getFolds();
    const foldAtCursor = folds.find(fold =>
      cursor.position.line >= fold.start.line &&
      cursor.position.line <= fold.end.line
    );

    if (foldAtCursor) {
      this.editor.unfold(foldAtCursor);
      this.updateFoldIndicators();
    }
  }

  private foldAll(): void {
    if (!this.editor) return;

    const text = this.editor.getValue();
    const lines = text.split('\n');
    const foldableLines = this.findFoldableLines(lines);

    foldableLines.forEach(lineIndex => {
      // Check if not already folded
      const folds = this.editor!.getFolds();
      const existingFold = folds.find(fold => fold.start.line === lineIndex);

      if (!existingFold) {
        this.toggleFoldAtLine(lineIndex);
      }
    });
  }

  private unfoldAll(): void {
    if (!this.editor) return;

    const folds = this.editor.getFolds();
    folds.forEach(fold => {
      this.editor!.unfold(fold);
    });

    this.updateFoldIndicators();
  }

  destroy(): void {
    if (this.foldingUI && this.foldingUI.parentNode) {
      this.foldingUI.parentNode.removeChild(this.foldingUI);
    }
    this.foldingUI = null;
    this.foldIndicators = [];
    this.editor = null;
  }
}
