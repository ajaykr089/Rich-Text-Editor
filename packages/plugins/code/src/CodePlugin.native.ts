import { Plugin } from '@editora/core';
import {
  createEditor,
  EditorCore,
  LineNumbersExtension,
  ThemeExtension,
  ReadOnlyExtension,
  SearchExtension,
  BracketMatchingExtension,
  CodeFoldingExtension,
  SyntaxHighlightingExtension
} from '@editora/light-code-editor';

/**
 * Code Plugin - Framework Agnostic
 * 
 * Adds HTML source view functionality.
 * Opens a dialog to edit the raw HTML source of the editor content.
 * No React dependency required.
 */
export const CodePlugin = (): Plugin => ({
  name: 'code',
  
  // Toolbar button configuration
  toolbar: [
    {
      label: 'Source',
      command: 'toggleSourceView',
      type: 'button',
      icon: '<>',
      shortcut: 'Mod-Shift-S'
    }
  ],
  
  // Native command implementations
  commands: {
    /**
     * Toggle HTML source view
     * Opens a dialog to edit raw HTML
     */
    toggleSourceView: () => {
      // Find the editor container and content area
      const findEditorContent = (): HTMLElement | null => {
        // Try to find the editor container first
        const editorContainer = document.querySelector('[data-editora-editor]');
        if (editorContainer) {
          const contentEl = editorContainer.querySelector('.rte-content') as HTMLElement;
          if (contentEl) return contentEl;
        }
        
        // Fallback: search from current selection
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          let current = selection.anchorNode instanceof HTMLElement 
            ? selection.anchorNode 
            : selection.anchorNode.parentElement;
          
          while (current) {
            if (current.classList?.contains('rte-content')) {
              return current;
            }
            current = current.parentElement;
          }
        }
        
        // Last resort: find any .rte-content
        return document.querySelector('.rte-content') as HTMLElement;
      };
      
      const contentElement = findEditorContent();
      
      if (!contentElement) {
        console.error('[CodePlugin] Editor content area not found');
        alert('Editor content area not found. Please click inside the editor first.');
        return false;
      }
      
      // Get current HTML
      const currentHtml = contentElement.innerHTML;
      
      // Format HTML for better readability
      const formatHTML = (html: string): string => {
        let formatted = '';
        let indentLevel = 0;
        const indentSize = 2;
        const tokens = html.split(/(<\/?[a-zA-Z][^>]*>)/);

        for (const token of tokens) {
          if (!token.trim()) continue;

          if (token.match(/^<\/[a-zA-Z]/)) {
            indentLevel = Math.max(0, indentLevel - 1);
            formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
          } else if (token.match(/^<[a-zA-Z]/) && !token.match(/\/>$/)) {
            formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
            indentLevel++;
          } else if (token.match(/^<[a-zA-Z].*\/>$/)) {
            formatted += '\n' + ' '.repeat(indentLevel * indentSize) + token;
          } else {
            formatted += token.trim();
          }
        }
        return formatted.trim();
      };
      
      // Create source editor dialog
      const createSourceDialog = () => {
        let editorInstance: EditorCore | null = null;
        let currentTheme = 'dark';
        let isReadOnly = false;
        let isFullscreen = false;
        let hasUnsavedChanges = false;
        const originalHtml = currentHtml;
        const overlay = document.createElement('div');
        overlay.className = 'rte-source-editor-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'rte-source-editor-modal';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'source-editor-title');
        
        const header = document.createElement('div');
        header.className = 'rte-source-editor-header';
        header.innerHTML = `
          <h2 id="source-editor-title">Source Editor</h2>
          <div class="rte-source-editor-header-toolbar">
            <button class="rte-source-editor-toolbar-btn theme-toggle-btn" title="Switch theme">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </button>
            <button class="rte-source-editor-toolbar-btn readonly-toggle-btn" title="Toggle read-only">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
          <div class="rte-source-editor-header-actions">
            <button class="rte-source-editor-fullscreen-btn" title="Toggle fullscreen">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
            <button class="rte-source-editor-close-btn" aria-label="Close source editor">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        `;
        
        const body = document.createElement('div');
        body.className = 'rte-source-editor-body';
        
        const content = document.createElement('div');
        content.className = 'rte-source-editor-content';
        
        const warning = document.createElement('div');
        warning.className = 'rte-source-editor-warning';
        warning.textContent = '⚠️ Advanced users only. Invalid HTML may break the editor.';
        
        const editorContainer = document.createElement('div');
        editorContainer.className = 'rte-source-editor-light-editor';
        editorContainer.style.height = '400px';
        
        content.appendChild(warning);
        content.appendChild(editorContainer);
        body.appendChild(content);
        
        const footer = document.createElement('div');
        footer.className = 'rte-source-editor-footer';
        footer.innerHTML = `
          <div class="rte-source-editor-footer-info">
            <span class="unsaved-changes" style="display: none;">• Unsaved changes</span>
          </div>
          <div class="rte-source-editor-footer-actions">
            <button class="rte-source-editor-btn rte-source-editor-btn-cancel">Cancel</button>
            <button class="rte-source-editor-btn rte-source-editor-btn-save">Save</button>
          </div>
        `;
        
        // Assemble dialog
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        overlay.appendChild(dialog);
        
        // Add CSS link if not already present
        if (!document.querySelector('link[href*="SourceEditorDialog.css"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = '/packages/plugins/code/src/SourceEditorDialog.css';
          document.head.appendChild(cssLink);
        }
        
        document.body.appendChild(overlay);
        
        // Initialize code editor
        try {
          editorInstance = createEditor(editorContainer, {
            value: formatHTML(currentHtml),
            theme: 'dark',
            readOnly: false,
            extensions: [
              new LineNumbersExtension(),
              new ThemeExtension(),
              new ReadOnlyExtension(),
              new BracketMatchingExtension(),
              new SearchExtension(),
              new CodeFoldingExtension(),
              new SyntaxHighlightingExtension()
            ]
          });

          // Track changes
          editorInstance.on('change', () => {
            const newContent = editorInstance?.getValue() || '';
            hasUnsavedChanges = newContent !== formatHTML(originalHtml);
            const unsavedLabel = footer.querySelector('.unsaved-changes') as HTMLElement;
            if (unsavedLabel) {
              unsavedLabel.style.display = hasUnsavedChanges ? 'inline' : 'none';
            }
          });

          setTimeout(() => editorInstance?.focus(), 100);
        } catch (err) {
          console.error('Failed to initialize code editor:', err);
        }
        
        // Event handlers
        const updateUnsavedState = () => {
          const unsavedLabel = footer.querySelector('.unsaved-changes') as HTMLElement;
          if (unsavedLabel) {
            unsavedLabel.style.display = hasUnsavedChanges ? 'inline' : 'none';
          }
        };
        
        const toggleTheme = () => {
          currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
          editorInstance?.setTheme(currentTheme);
          const themeBtn = header.querySelector('.theme-toggle-btn');
          if (themeBtn && currentTheme === 'light') {
            themeBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            `;
          }
        };
        
        const toggleReadOnly = () => {
          isReadOnly = !isReadOnly;
          editorInstance?.setReadOnly(isReadOnly);
          const readonlyBtn = header.querySelector('.readonly-toggle-btn');
          if (readonlyBtn) {
            if (isReadOnly) {
              readonlyBtn.classList.add('active');
              readonlyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              `;
            } else {
              readonlyBtn.classList.remove('active');
              readonlyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              `;
            }
          }
        };
        
        const toggleFullscreen = () => {
          isFullscreen = !isFullscreen;
          if (isFullscreen) {
            overlay.classList.add('fullscreen');
            editorContainer.style.height = 'calc(100vh - 200px)';
          } else {
            overlay.classList.remove('fullscreen');
            editorContainer.style.height = '400px';
          }
          const fullscreenBtn = header.querySelector('.rte-source-editor-fullscreen-btn');
          if (fullscreenBtn) {
            fullscreenBtn.innerHTML = isFullscreen ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>
              </svg>
            ` : `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            `;
          }
        };
        
        const closeDialog = () => {
          if (editorInstance) {
            editorInstance.destroy();
            editorInstance = null;
          }
          document.body.removeChild(overlay);
        };
        
        const handleCancel = () => {
          if (hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
              return;
            }
          }
          closeDialog();
        };
        
        const handleSave = () => {
          try {
            const htmlContent = editorInstance?.getValue() || '';
            
            // Basic HTML sanitization
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            const dangerous = tempDiv.querySelectorAll('script, iframe[src^="javascript:"], object, embed');
            dangerous.forEach(el => el.remove());
            
            contentElement.innerHTML = tempDiv.innerHTML;
            hasUnsavedChanges = false;
            closeDialog();
          } catch (error) {
            alert('Failed to update HTML. Please check your syntax.');
            console.error('HTML update error:', error);
          }
        };
        
        // Attach event listeners
        header.querySelector('.theme-toggle-btn')?.addEventListener('click', toggleTheme);
        header.querySelector('.readonly-toggle-btn')?.addEventListener('click', toggleReadOnly);
        header.querySelector('.rte-source-editor-fullscreen-btn')?.addEventListener('click', toggleFullscreen);
        header.querySelector('.rte-source-editor-close-btn')?.addEventListener('click', closeDialog);
        footer.querySelector('.rte-source-editor-btn-cancel')?.addEventListener('click', handleCancel);
        footer.querySelector('.rte-source-editor-btn-save')?.addEventListener('click', handleSave);
        
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) closeDialog();
        });
        
        // Keyboard shortcuts
        const escHandler = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeDialog();
            document.removeEventListener('keydown', escHandler);
          }
        };
        document.addEventListener('keydown', escHandler);
      };
      
      createSourceDialog();
      return true;
    }
  },
  
  // Keyboard shortcuts
  keymap: {
    'Mod-Shift-s': 'toggleSourceView',
    'Mod-Shift-S': 'toggleSourceView'
  }
});
