import React, { useState, useEffect, useRef } from 'react';
import {
  Template,
  getAllTemplates,
  getTemplateCategories,
  searchTemplates,
  insertTemplateAtCursor,
  replaceDocumentWithTemplate
} from './TemplatePlugin';

/**
 * Template Dialog Component
 * 
 * - Category filtering
 * - Search functionality
 * - Preview pane
 * - Replace/Insert options
 * - Existing content warning
 */
const TemplateDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInsertAtCursor?: (template: Template) => void;
}> = ({ isOpen, onClose, onInsertAtCursor }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [insertMode, setInsertMode] = useState<'insert' | 'replace'>('insert');
  const [showWarning, setShowWarning] = useState(false);

  const categories = getTemplateCategories();
  const allTemplates = getAllTemplates();

  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    // Filter templates
    let filtered = allTemplates;

    if (searchTerm.trim()) {
      filtered = searchTemplates(searchTerm);
    } else if (selectedCategory) {
      filtered = allTemplates.filter(t => t.category === selectedCategory);
    }

    setFilteredTemplates(filtered);
    if (filtered.length > 0) {
      setSelectedTemplate(filtered[0]);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedCategory, searchTerm, allTemplates]);

  const handleInsert = () => {
    console.log("Insert mode:", insertMode);
    if (!selectedTemplate) return;

    if (insertMode === 'replace') {
      const editor = document.querySelector('[contenteditable="true"]');
      if (editor?.innerHTML?.trim()) {
        setShowWarning(true);
        return;
      }
      replaceDocumentWithTemplate(selectedTemplate, { setValue: (html: string) => {
        const editor = document.querySelector('[contenteditable="true"]');
        if (editor) editor.innerHTML = html;
      }});
      onClose();
    } else {
      if (onInsertAtCursor) {
        onInsertAtCursor(selectedTemplate);
      }
      onClose();
    }
  };

  const handleConfirmReplace = () => {
    if (selectedTemplate) {
      const editor = document.querySelector('[contenteditable="true"]');
      if (editor) {
        editor.innerHTML = selectedTemplate.html;
        setShowWarning(false);
        onClose();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showWarning) {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div className="rte-dialog rte-template-dialog" onClick={(e) => e.stopPropagation()}>
        {showWarning ? (
          <>
            <div className="rte-dialog-header">
              <h2>Replace Document?</h2>
            </div>
            <div className="rte-dialog-body">
              <p>This will replace your current document content. Continue?</p>
            </div>
            <div className="rte-dialog-footer">
              <button onClick={() => setShowWarning(false)} className="rte-button-secondary">
                Cancel
              </button>
              <button onClick={handleConfirmReplace} className="rte-button-primary">
                Replace
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="rte-dialog-header">
              <h2>Insert Template</h2>
              <button className="rte-dialog-close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="rte-dialog-body">
              {/* Search */}
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="rte-input"
                aria-label="Search templates"
              />

              {/* Category Tabs */}
              <div className="rte-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`rte-tab ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Template List */}
              <div className="rte-template-list">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`rte-template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplate(template)}
                      onDoubleClick={handleInsert}
                    >
                      <div className="template-name">{template.name}</div>
                      {template.description && (
                        <div className="template-description">{template.description}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rte-empty-state">No templates found</div>
                )}
              </div>

              {/* Preview */}
              {selectedTemplate && (
                <div className="rte-template-preview">
                  <strong>Preview:</strong>
                  <div
                    className="template-preview-content"
                    dangerouslySetInnerHTML={{ __html: selectedTemplate.html }}
                  />
                </div>
              )}

              {/* Insert Mode Toggle */}
              <div className="rte-insert-mode">
                <label>
                  <input
                    type="radio"
                    value="insert"
                    checked={insertMode === 'insert'}
                    onChange={(e) => setInsertMode(e.target.value as any)}
                  />
                  Insert at cursor
                </label>
                <label>
                  <input
                    type="radio"
                    value="replace"
                    checked={insertMode === 'replace'}
                    onChange={(e) => setInsertMode(e.target.value as any)}
                  />
                  Replace document
                </label>
              </div>
            </div>

            <div className="rte-dialog-footer">
              <button onClick={onClose} className="rte-button-secondary">
                Cancel
              </button>
              <button onClick={handleInsert} className="rte-button-primary" disabled={!selectedTemplate}>
                {insertMode === 'insert' ? 'Insert' : 'Replace'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Template Plugin Provider
 */
interface TemplatePluginProviderProps {
  children?: React.ReactNode;
}

export const TemplatePluginProvider: React.FC<TemplatePluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Store the selection range before opening dialog
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    // Register insert command
    (window as any).registerEditorCommand?.('insertTemplate', () => {
      // Save the current selection range before opening dialog
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      } else {
        savedRangeRef.current = null;
      }
      setIsDialogOpen(true);
    });
  }, []);

  // Custom insert handler to restore selection before inserting
  const handleInsertAtCursor = (template: Template) => {
    // Restore the saved selection range
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
    insertTemplateAtCursor(template);
  };

  return (
    <>
      {children}
      <TemplateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onInsertAtCursor={handleInsertAtCursor}
      />
      <style>{`
        .rte-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }

        .rte-dialog {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .rte-dialog-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rte-dialog-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .rte-dialog-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rte-dialog-close:hover {
          color: #333;
        }

        .rte-dialog-body {
          padding: 16px;
          overflow-y: auto;
          flex: 1;
        }

        .rte-dialog-footer {
          padding: 12px 16px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .rte-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rte-button-primary {
          background-color: #1976d2;
          color: white;
        }

        .rte-button-primary:hover {
          background-color: #1565c0;
        }

        .rte-button-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .rte-button-secondary:hover {
          background-color: #eeeeee;
        }

        .rte-template-dialog {
          width: 600px;
          max-height: 700px;
        }

        .rte-template-list {
          border: 1px solid #ddd;
          border-radius: 4px;
          max-height: 250px;
          overflow-y: auto;
          margin: 12px 0;
        }

        .rte-template-item {
          padding: 12px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .rte-template-item:hover,
        .rte-template-item.selected {
          background-color: #f5f5f5;
        }

        .template-name {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .template-description {
          font-size: 12px;
          color: #999;
        }

        .rte-template-preview {
          padding: 12px;
          background-color: #fafafa;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-top: 12px;
          max-height: 200px;
          overflow-y: auto;
        }

        .template-preview-content {
          font-size: 13px;
          line-height: 1.5;
          margin-top: 8px;
        }

        .template-preview-content * {
          margin: 4px 0;
        }

        .rte-insert-mode {
          margin-top: 12px;
          padding: 12px;
          background-color: #f5f5f5;
          border-radius: 4px;
          display: flex;
          gap: 16px;
        }

        .rte-insert-mode label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
        }

        .rte-insert-mode input {
          margin-right: 6px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default TemplateDialog;
