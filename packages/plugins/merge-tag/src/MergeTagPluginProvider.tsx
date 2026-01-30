import React, { useState, useEffect, useRef } from 'react';
import { MergeTag, MERGE_TAG_CATEGORIES, insertMergeTagCommand } from './MergeTagPlugin';

/**
 * Merge Tag Dialog Component
 * 
 * - Category tabs for filtering
 * - Search across all tags
 * - Preview pane
 * - Keyboard navigation
 * - Accessibility compliant
 */
const MergeTagDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInsert?: (tag: MergeTag | null) => void;
}> = ({ isOpen, onClose, onInsert }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('USER');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState<MergeTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<MergeTag | null>(null);

  const categories = Object.entries(MERGE_TAG_CATEGORIES).map(([key, value]) => ({
    key,
    ...value
  }));

  const currentCategoryTags = MERGE_TAG_CATEGORIES[selectedCategory as keyof typeof MERGE_TAG_CATEGORIES]?.tags || [];

  useEffect(() => {
    // Filter tags by search term and category
    let filtered = currentCategoryTags;

    if (searchTerm.trim()) {
      filtered = filtered.filter(tag =>
        tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTags(filtered);
    if (filtered.length > 0) {
      setSelectedTag(filtered[0]);
    }
  }, [selectedCategory, searchTerm, currentCategoryTags]);

  const handleInsert = () => {
    if (selectedTag && onInsert) {
      onInsert(selectedTag);
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div className="rte-dialog rte-merge-tag-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rte-dialog-header">
          <h2>Insert Merge Tag</h2>
          <button className="rte-dialog-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="rte-dialog-body">
          {/* Search */}
          <input
            type="text"
            placeholder="Search merge tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="rte-input"
            aria-label="Search merge tags"
          />

          {/* Category Tabs */}
          <div className="rte-tabs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`rte-tab ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
                aria-label={`${cat.name} category`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tag List */}
          <div className="rte-merge-tag-list">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <div
                  key={tag.key}
                  className={`rte-merge-tag-item ${selectedTag?.key === tag.key ? 'selected' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                  onDoubleClick={handleInsert}
                >
                  <div className="tag-label">{tag.label}</div>
                  {tag.preview && <div className="tag-preview">{tag.preview}</div>}
                  {tag.description && <div className="tag-description">{tag.description}</div>}
                </div>
              ))
            ) : (
              <div className="rte-empty-state">No merge tags found</div>
            )}
          </div>

          {/* Preview */}
          {selectedTag && (
            <div className="rte-merge-tag-preview">
              <strong>Preview:</strong> {`{{ ${selectedTag.label} }}`}
            </div>
          )}
        </div>

        <div className="rte-dialog-footer">
          <button onClick={onClose} className="rte-button-secondary">
            Cancel
          </button>
          <button onClick={handleInsert} className="rte-button-primary" disabled={!selectedTag}>
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Merge Tag Plugin Provider
 * 
 * Manages dialog state and command registration
 */
interface MergeTagPluginProviderProps {
  children?: React.ReactNode;
}

export const MergeTagPluginProvider: React.FC<MergeTagPluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Store the selection range before opening dialog
  const savedRangeRef = useRef<Range | null>(null);

  useEffect(() => {
    // Register insert command
    (window as any).registerEditorCommand?.('insertMergeTag', () => {
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
  const handleInsertMergeTag = (tag: MergeTag | null) => {
    // Restore the saved selection range
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
    // Insert the merge tag
    if (tag) {
      insertMergeTagCommand(tag);
    }
    setIsDialogOpen(false);
  };

  return (
    <>
      {children}
      {/* Pass custom insert handler to dialog */}
      <MergeTagDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onInsert={handleInsertMergeTag}
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

        .rte-merge-tag {
          background-color: #e3f2fd;
          border: 1px solid #bbdefb;
          border-radius: 3px;
          padding: 2px 6px;
          margin: 0 2px;
          display: inline-block;
          white-space: nowrap;
          font-weight: 500;
          color: #1976d2;
        }

        .rte-merge-tag:hover {
          background-color: #bbdefb;
          cursor: pointer;
        }

        .rte-merge-tag-dialog {
          width: 500px;
          max-height: 600px;
        }

        .rte-merge-tag-list {
          border: 1px solid #ddd;
          border-radius: 4px;
          max-height: 300px;
          overflow-y: auto;
          margin: 12px 0;
        }

        .rte-merge-tag-item {
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .rte-merge-tag-item:hover,
        .rte-merge-tag-item.selected {
          background-color: #f5f5f5;
        }

        .tag-label {
          font-weight: 600;
          color: #333;
        }

        .tag-preview {
          font-size: 12px;
          color: #999;
          margin-top: 2px;
        }

        .tag-description {
          font-size: 12px;
          color: #aaa;
          margin-top: 2px;
        }

        .rte-merge-tag-preview {
          padding: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
        }

        .rte-tabs {
          display: flex;
          gap: 8px;
          margin: 12px 0;
          border-bottom: 2px solid #eee;
        }

        .rte-tab {
          padding: 8px 12px;
          background: none;
          border: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          color: #666;
          font-weight: 500;
          transition: all 0.2s;
        }

        .rte-tab:hover {
          color: #333;
        }

        .rte-tab.active {
          color: #1976d2;
          border-bottom-color: #1976d2;
        }
      `}</style>
    </>
  );
};

export default MergeTagDialog;
