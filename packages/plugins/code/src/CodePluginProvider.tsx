import React, { ReactNode, useRef, useState } from 'react';
import { SourceEditorDialog } from './SourceEditorDialog';

interface CodePluginProviderProps {
  children: ReactNode;
}

interface SelectionBookmark {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
  collapsed: boolean;
}

export const CodePluginProvider: React.FC<CodePluginProviderProps> = ({ children }) => {
  const [isSourceEditorOpen, setIsSourceEditorOpen] = useState(false);
  const [currentHtml, setCurrentHtml] = useState('');
  const selectionBookmarkRef = useRef<SelectionBookmark | null>(null);
  const commandRegistered = useRef(false);

  // Register command immediately when component mounts
  React.useLayoutEffect(() => {
    if (!commandRegistered.current && typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('toggleSourceView', () => {
        openSourceEditor();
      });
      commandRegistered.current = true;
    }
  }, []);

  // Serialize editor content to HTML string
  const serializeEditorContent = (): string => {
    const editorElement = document.querySelector('.rte-content') as HTMLElement;
    if (!editorElement) return '';

    // Clone the content to avoid modifying the original
    const clonedContent = editorElement.cloneNode(true) as HTMLElement;

    // Remove any RTE-specific classes or elements that shouldn't be in the source
    clonedContent.querySelectorAll('.rte-floating-toolbar, .rte-selection-marker').forEach(el => el.remove());

    // Return the inner HTML
    return clonedContent.innerHTML;
  };

  // Parse HTML string and replace editor content
  const parseHTMLToEditor = (html: string): void => {
    const editorElement = document.querySelector('.rte-content') as HTMLElement;
    if (!editorElement) return;

    // Sanitize and set the HTML
    editorElement.innerHTML = sanitizeHTML(html);

    // Restore selection if we have a bookmark
    if (selectionBookmarkRef.current) {
      restoreSelection(selectionBookmarkRef.current);
      selectionBookmarkRef.current = null;
    }
  };

  // Sanitize HTML to prevent XSS
  const sanitizeHTML = (html: string): string => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove dangerous elements and attributes
    const dangerousElements = tempDiv.querySelectorAll('script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]');
    dangerousElements.forEach(el => el.remove());

    // Remove dangerous attributes
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      // Remove event handlers
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        // Remove javascript: URLs
        if (attr.name === 'href' || attr.name === 'src') {
          if (attr.value.startsWith('javascript:')) {
            el.removeAttribute(attr.name);
          }
        }
      });
    });

    return tempDiv.innerHTML;
  };

  // Save current selection as a bookmark
  const saveSelection = (): SelectionBookmark | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      collapsed: range.collapsed
    };
  };

  // Restore selection from bookmark
  const restoreSelection = (bookmark: SelectionBookmark): void => {
    try {
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.setStart(bookmark.startContainer, bookmark.startOffset);
      range.setEnd(bookmark.endContainer, bookmark.endOffset);

      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      // Selection restoration failed, ignore
      console.warn('Failed to restore selection:', error);
    }
  };

  // Open source editor
  const openSourceEditor = (): void => {
    // Save current selection
    selectionBookmarkRef.current = saveSelection();

    // Serialize current content
    const html = serializeEditorContent();
    setCurrentHtml(html);
    setIsSourceEditorOpen(true);
  };

  // Apply source changes
  const applySourceChanges = (html: string): void => {
    try {
      parseHTMLToEditor(html);

      // Push undo snapshot (this would integrate with the editor's undo system)
      // For now, we'll just close the dialog
      setIsSourceEditorOpen(false);

      // Focus back to editor
      const editorElement = document.querySelector('.rte-content') as HTMLElement;
      if (editorElement) {
        editorElement.focus();
      }
    } catch (error) {
      console.error('Failed to apply source changes:', error);
      alert('Failed to apply changes. Please check your HTML syntax.');
    }
  };

  // Cancel source editor
  const cancelSourceEditor = (): void => {
    setIsSourceEditorOpen(false);
    selectionBookmarkRef.current = null;
  };

  return (
    <>
      {children}
      <SourceEditorDialog
        isOpen={isSourceEditorOpen}
        onClose={() => setIsSourceEditorOpen(false)}
        onSave={applySourceChanges}
        onCancel={cancelSourceEditor}
        initialHtml={currentHtml}
      />
    </>
  );
};
