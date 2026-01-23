/**
 * Search Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorAPI, SearchResult, SearchOptions } from '../types';

export class SearchExtension implements EditorExtension {
  public readonly name = 'search';
  private editor: EditorAPI | null = null;
  private searchUI: HTMLElement | null = null;
  private isVisible = false;
  private currentResults: SearchResult[] = [];
  private currentIndex = -1;

  setup(editor: EditorAPI): void {
    this.editor = editor;

    // Register search commands
    editor.registerCommand('find', () => {
      this.showSearch();
    });

    editor.registerCommand('findNext', () => {
      this.findNext();
    });

    editor.registerCommand('findPrev', () => {
      this.findPrev();
    });

    editor.registerCommand('replace', () => {
      this.showReplace();
    });

    editor.registerCommand('replaceAll', (query: string, replacement: string) => {
      this.replaceAll(query, replacement);
    });

    // Keyboard shortcuts are now handled by KeymapExtension
    // The commands are registered above and will be triggered by the keymap
  }

  private showSearch(): void {
    if (!this.editor) return;

    if (!this.searchUI) {
      this.createSearchUI();
    }

    this.isVisible = true;
    if (this.searchUI) {
      this.searchUI.style.display = 'block';
      const input = this.searchUI.querySelector('input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  }

  private showReplace(): void {
    this.showSearch();
    // Show replace input
    const replaceInput = this.searchUI?.querySelector('.search-replace-input') as HTMLInputElement;
    if (replaceInput) {
      replaceInput.style.display = 'block';
      replaceInput.focus();
    }

    // Update UI to show replace mode
    const statusDiv = this.searchUI?.querySelector('.search-status') as HTMLElement;
    if (statusDiv) {
      statusDiv.textContent = 'Replace mode - Enter to replace, Shift+Enter to replace all';
    }
  }

  private hideSearch(): void {
    this.isVisible = false;
    if (this.searchUI) {
      this.searchUI.style.display = 'none';
    }
    this.clearHighlights();
  }

  private createSearchUI(): void {
    if (!this.editor) return;

    const container = document.querySelector('.rte-source-editor-modal') as HTMLElement;
    if (!container) return;

    this.searchUI = document.createElement('div');
    this.searchUI.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--editor-background, #1e1e1e);
      border: 1px solid var(--editor-gutter-border, #3e3e42);
      border-radius: 4px;
      padding: 8px;
      z-index: 1000;
      display: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      min-width: 250px;
    `;

    this.searchUI.innerHTML = `
      <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
        <input type="text" placeholder="Find..." style="
          flex: 1;
          padding: 4px 8px;
          background: var(--editor-gutter-background, #252526);
          color: var(--editor-foreground, #f8f9fa);
          border: 1px solid var(--editor-gutter-border, #3e3e42);
          border-radius: 3px;
          font-size: 12px;
          outline: none;
        " />
        <button class="search-prev" style="
          padding: 2px 6px;
          background: var(--editor-gutter-background, #252526);
          color: var(--editor-gutter-foreground, #858585);
          border: 1px solid var(--editor-gutter-border, #3e3e42);
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">↑</button>
        <button class="search-next" style="
          padding: 2px 6px;
          background: var(--editor-gutter-background, #252526);
          color: var(--editor-gutter-foreground, #858585);
          border: 1px solid var(--editor-gutter-border, #3e3e42);
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">↓</button>
        <button class="search-close" style="
          padding: 2px 6px;
          background: var(--editor-gutter-background, #252526);
          color: var(--editor-gutter-foreground, #858585);
          border: 1px solid var(--editor-gutter-border, #3e3e42);
          border-radius: 3px;
          cursor: pointer;
          font-size: 11px;
        ">×</button>
      </div>
      <div class="search-status" style="
        font-size: 11px;
        color: var(--editor-gutter-foreground, #858585);
        text-align: center;
      "></div>
      <input type="text" class="search-replace-input" placeholder="Replace with..." style="
        width: 100%;
        padding: 4px 8px;
        background: var(--editor-gutter-background, #252526);
        color: var(--editor-foreground, #f8f9fa);
        border: 1px solid var(--editor-gutter-border, #3e3e42);
        border-radius: 3px;
        font-size: 12px;
        outline: none;
        display: none;
        margin-top: 4px;
      " />
    `;

    // Add event listeners
    const input = this.searchUI.querySelector('input') as HTMLInputElement;
    const replaceInput = this.searchUI.querySelector('.search-replace-input') as HTMLInputElement;
    const prevBtn = this.searchUI.querySelector('.search-prev') as HTMLButtonElement;
    const nextBtn = this.searchUI.querySelector('.search-next') as HTMLButtonElement;
    const closeBtn = this.searchUI.querySelector('.search-close') as HTMLButtonElement;

    input.addEventListener('input', () => {
      this.performSearch(input.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.findPrev();
        } else {
          this.findNext();
        }
      }
    });

    replaceInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          // Replace all occurrences
          this.replaceAll(input.value, replaceInput.value);
        } else {
          // Replace current occurrence
          this.replaceCurrent(input.value, replaceInput.value);
        }
      }
    });

    prevBtn.addEventListener('click', () => this.findPrev());
    nextBtn.addEventListener('click', () => this.findNext());
    closeBtn.addEventListener('click', () => this.hideSearch());

    container.appendChild(this.searchUI);
  }

  private performSearch(query: string): void {
    if (!this.editor || !query.trim()) {
      this.clearHighlights();
      this.updateStatus('');
      return;
    }

    // Simple search implementation
    const text = this.editor.getValue();
    const results: SearchResult[] = [];
    let index = text.toLowerCase().indexOf(query.toLowerCase());

    while (index !== -1) {
      const startPos = this.getPositionFromOffset(text, index);
      const endPos = this.getPositionFromOffset(text, index + query.length);
      results.push({
        range: { start: startPos, end: endPos },
        match: text.substring(index, index + query.length)
      });
      index = text.toLowerCase().indexOf(query.toLowerCase(), index + 1);
    }

    this.currentResults = results;
    this.currentIndex = this.currentResults.length > 0 ? 0 : -1;

    this.updateHighlights();
    this.updateStatus(`${this.currentResults.length} matches`);
  }

  private getPositionFromOffset(text: string, offset: number): { line: number; column: number } {
    const lines = text.substring(0, offset).split('\n');
    const line = lines.length - 1;
    const column = lines[lines.length - 1].length;
    return { line, column };
  }

  private findNext(): void {
    if (this.currentResults.length === 0) return;

    this.currentIndex = (this.currentIndex + 1) % this.currentResults.length;
    this.updateHighlights();
  }

  private findPrev(): void {
    if (this.currentResults.length === 0) return;

    this.currentIndex = this.currentIndex <= 0 ?
      this.currentResults.length - 1 :
      this.currentIndex - 1;
    this.updateHighlights();
  }

  private replaceCurrent(query: string, replacement: string): void {
    if (!this.editor || !query.trim() || this.currentIndex === -1) return;

    const result = this.currentResults[this.currentIndex];
    if (!result) return;

    // Calculate offset from position
    const text = this.editor.getValue();
    const offset = this.getOffsetFromPosition(text, result.range.start);

    // Replace the current match
    const before = text.substring(0, offset);
    const after = text.substring(offset + query.length);
    const newText = before + replacement + after;

    this.editor.setValue(newText);

    // Update search results after replacement
    this.performSearch(query);

    this.updateStatus(`Replaced current occurrence`);
  }

  private replaceAll(query: string, replacement: string): void {
    if (!this.editor || !query.trim()) return;

    let text = this.editor.getValue();
    let count = 0;
    let index = text.toLowerCase().indexOf(query.toLowerCase());

    while (index !== -1) {
      text = text.substring(0, index) + replacement + text.substring(index + query.length);
      count++;
      index = text.toLowerCase().indexOf(query.toLowerCase(), index + replacement.length);
    }

    if (count > 0) {
      this.editor.setValue(text);
      this.updateStatus(`Replaced ${count} occurrences`);
    }
  }

  private getOffsetFromPosition(text: string, position: { line: number; column: number }): number {
    const lines = text.split('\n');
    let offset = 0;

    // Add lengths of all previous lines plus newlines
    for (let i = 0; i < position.line; i++) {
      offset += lines[i].length + 1; // +1 for newline
    }

    // Add column position on current line
    offset += position.column;

    return offset;
  }

  private updateHighlights(): void {
    this.clearHighlights();

    if (this.currentResults.length === 0 || this.currentIndex === -1) return;

    // For now, just update the status - full highlighting would require DOM manipulation
    const result = this.currentResults[this.currentIndex];
    this.updateStatus(`${this.currentResults.length} matches (showing ${this.currentIndex + 1}/${this.currentResults.length})`);
  }

  private clearHighlights(): void {
    // Clear any existing highlights
    // This would need DOM manipulation to remove highlight spans
  }

  private updateStatus(text: string): void {
    const statusDiv = this.searchUI?.querySelector('.search-status') as HTMLElement;
    if (statusDiv) {
      statusDiv.textContent = text;
    }
  }

  destroy(): void {
    if (this.searchUI && this.searchUI.parentNode) {
      this.searchUI.parentNode.removeChild(this.searchUI);
    }
    this.searchUI = null;
    this.editor = null;
  }
}
