import React, { useState, useEffect, useRef } from 'react';
import './SourceEditorDialog.css';

// Import the lightweight code editor library and all extensions
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
} from '@rte-editor/light-code-editor';

interface SourceEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (html: string) => void;
  initialHtml: string;
  onCancel?: () => void;
}

export const SourceEditorDialog: React.FC<SourceEditorDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHtml,
  onCancel
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorCore | null>(null);
  const originalHtmlRef = useRef(initialHtml);

  // Handle dialog opening/closing and loading state
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
    } else {
      // Cleanup when dialog closes
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    }
  }, [isOpen]);

  // Initialize editor when DOM element becomes available
  useEffect(() => {
    if (isOpen && editorRef.current && !editorInstanceRef.current && isLoading) {
      try {
        const editor = createEditor(editorRef.current, {
          value: initialHtml,
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

        // Setup change tracking
        editor.on('change', () => {
          const newContent = editor.getValue();
          setHasUnsavedChanges(newContent !== originalHtmlRef.current);
        });

        editorInstanceRef.current = editor;
        setIsLoading(false);

        // Focus the editor
        setTimeout(() => {
          try {
            editor.focus();
          } catch (focusErr) {
            console.warn('Failed to focus editor:', focusErr);
          }
        }, 100);

      } catch (err: any) {
        console.error('Failed to initialize code editor:', err);
        setError(`Failed to initialize code editor: ${err.message}`);
        setIsLoading(false);
      }
    }
  }, [isOpen, editorRef.current, isLoading, initialHtml]);

  // Update editor content when initialHtml changes
  useEffect(() => {
    console.log(
      "SourceEditorDialog: initialHtml changed, updating editor content.",
      editorInstanceRef.current,
      isOpen,
      initialHtml,
    );
    if (editorInstanceRef.current && isOpen) {
      // Format HTML for better readability in the editor
      const formattedHtml = formatHTMLForEditor(initialHtml);
      console.log("Formatted HTML for editor:", formattedHtml);
      editorInstanceRef.current.setValue(formattedHtml);
      originalHtmlRef.current = initialHtml;
      setHasUnsavedChanges(false);
    }
  }, [editorInstanceRef.current, initialHtml, isOpen]);

  // Function to format HTML for better readability in the editor
  const formatHTMLForEditor = (html: string): string => {
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
      // Content (preserve whitespace)
      else {
        formatted += token.trim();
      }
    }

    return formatted.trim();
  };

  const handleSave = () => {
    if (error || !editorInstanceRef.current) return;

    try {
      const htmlContent = editorInstanceRef.current.getValue();

      // Basic HTML sanitization
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // Remove dangerous elements
      const dangerous = tempDiv.querySelectorAll('script, iframe[src^="javascript:"], object, embed');
      dangerous.forEach(el => el.remove());

      const sanitized = tempDiv.innerHTML;
      onSave(sanitized);
      setHasUnsavedChanges(false);
      onClose();
    } catch (err: any) {
      console.error('Error saving HTML:', err);
      setError('Failed to save HTML. Please check your syntax.');
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }

    onCancel?.();
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setTheme(newTheme);
    }
  };

  const toggleReadOnly = () => {
    const newReadOnly = !isReadOnly;
    setIsReadOnly(newReadOnly);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setReadOnly(newReadOnly);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`rte-source-editor-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="rte-source-editor-modal" role="dialog" aria-modal="true" aria-labelledby="source-editor-title">
        <div className="rte-source-editor-header">
          <h2 id="source-editor-title">Source Editor</h2>
          <div className="rte-source-editor-header-toolbar">
            <button
              onClick={toggleTheme}
              className="rte-source-editor-toolbar-btn"
              title={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
              disabled={isLoading}
            >
              {currentTheme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleReadOnly}
              className={`rte-source-editor-toolbar-btn ${isReadOnly ? 'active' : ''}`}
              title={isReadOnly ? 'Make editable' : 'Make read-only'}
              disabled={isLoading}
            >
              {isReadOnly ? '🔒' : '✏️'}
            </button>
          </div>
          <div className="rte-source-editor-header-actions">
            <button
              onClick={toggleFullscreen}
              className="rte-source-editor-fullscreen-btn"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '⊡' : '⊞'}
            </button>
            <button
              onClick={onClose}
              className="rte-source-editor-close-btn"
              aria-label="Close source editor"
            >
              ×
            </button>
          </div>
        </div>

        <div className="rte-source-editor-body">
          {isLoading && (
            <div className="rte-source-editor-loading">
              <div className="rte-source-editor-spinner"></div>
              <p>Loading code editor...</p>
            </div>
          )}

          {error && (
            <div className="rte-source-editor-error" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

            <div className="rte-source-editor-content">
              <div className="rte-source-editor-warning">
                ⚠️ Advanced users only. Invalid HTML may break the editor.
              </div>
              <div
                ref={editorRef}
                className="rte-source-editor-light-editor"
                style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '400px' }}
              />
            </div>
        </div>

        <div className="rte-source-editor-footer">
          <div className="rte-source-editor-footer-info">
            {hasUnsavedChanges && <span className="unsaved-changes">• Unsaved changes</span>}
          </div>
          <div className="rte-source-editor-footer-actions">
            <button
              onClick={handleCancel}
              className="rte-source-editor-btn rte-source-editor-btn-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rte-source-editor-btn rte-source-editor-btn-save"
              disabled={isLoading || !!error}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
