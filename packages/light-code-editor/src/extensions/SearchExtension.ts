/**
 * Search Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, SearchResult, SearchOptions } from '../types';

export class SearchExtension implements EditorExtension {
  public readonly name = 'search';
  private editor: EditorCore | null = null;
  private searchUI: HTMLElement | null = null;
  private isVisible = false;
  private currentResults: SearchResult[] = [];
  private currentIndex = -1;

  setup(editor: EditorCore): void {
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

    // Keyboard shortcuts
    editor.on('keydown', (event) => {
      if (event.ctrlKey && event.key === 'f') {
        event.preventDefault();
        this.showSearch();
        return false;
      } else if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        this.showReplace();
        return false;
      } else if (event.key === 'F3' || (event.ctrlKey && event.key === 'g')) {
        event.preventDefault();
        this.findNext();
        return false;
      } else if (event.shiftKey && event.key === 'F3') {
        event.preventDefault();
        this.findPrev();
        return false;
      } else if (event.key === 'Escape' && this.isVisible) {
        this.hideSearch();
        return false;
      }
    });
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
    // For now, just show search. Replace functionality can be extended
    const replaceInput = this.searchUI?.querySelector('.search-replace-input') as HTMLInputElement;
    if (replaceInput) {
      replaceInput.style.display = 'block';
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

    const view = this.editor.getView();
    const container = view['container'] as HTMLElement;
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

    this.currentResults = this.editor.search(query, { caseSensitive: false });
    this.currentIndex = this.currentResults.length > 0 ? 0 : -1;

    this.updateHighlights();
    this.updateStatus(`${this.currentResults.length} matches`);
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

  private replaceAll(query: string, replacement: string): void {
    if (!this.editor || !query.trim()) return;

    const count = this.editor.replaceAll(query, replacement);
    this.updateStatus(`Replaced ${count} occurrences`);
  }

  private updateHighlights(): void {
    this.clearHighlights();

    if (this.currentResults.length === 0 || this.currentIndex === -1) return;

    // Highlight current result (simplified - would need DOM manipulation)
    const result = this.currentResults[this.currentIndex];
    this.editor.setCursor(result.range.start);
    this.editor.setSelection(result.range);
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
