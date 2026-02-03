import React, { ReactNode } from 'react';
import { insertPageBreakCommand } from './PageBreakPlugin';
import './PageBreakStyles.css';

interface PageBreakPluginProviderProps {
  children: ReactNode;
}

/**
 * PageBreakPluginProvider
 *
 * Registers page break commands and injects CSS for visual markers.
 * Also handles keyboard shortcuts for page break insertion.
 */
export const PageBreakPluginProvider: React.FC<PageBreakPluginProviderProps> = ({ children }) => {
  const [focusedPageBreak, setFocusedPageBreak] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    // Register page break insertion command
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertPageBreak', insertPageBreakCommand);
    }

    // Track focused page break elements
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList?.contains('rte-page-break')) {
        setFocusedPageBreak(target);
        target.classList.add('rte-page-break-selected');
      }
    };

    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList?.contains('rte-page-break')) {
        setFocusedPageBreak(null);
        target.classList.remove('rte-page-break-selected');
      }
    };

    // Handle keyboard shortcuts and deletion
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Insert page break with Ctrl+Shift+P (or Cmd+Shift+P on Mac)
      if (modifier && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        insertPageBreakCommand();
        return;
      }

      // Handle Delete or Backspace on focused page break
      if (focusedPageBreak && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        
        // Move cursor to previous element before deletion
        const prevElement = focusedPageBreak.previousElementSibling;
        if (prevElement) {
          const selection = window.getSelection();
          if (selection) {
            const range = document.createRange();
            range.selectNodeContents(prevElement as HTMLElement);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        
        // Remove the page break
        focusedPageBreak.remove();
        setFocusedPageBreak(null);
        return;
      }

      // Prevent any text input on focused page break
      if (focusedPageBreak && e.key === 'Enter') {
        e.preventDefault();
        return;
      }

      // Block all printable character input on page break
      if (focusedPageBreak && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedPageBreak]);

  return <>{children}</>;
};
