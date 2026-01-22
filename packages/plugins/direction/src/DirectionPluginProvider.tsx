import React, { ReactNode } from 'react';

interface DirectionPluginProviderProps {
  children: ReactNode;
}

export const DirectionPluginProvider: React.FC<DirectionPluginProviderProps> = ({ children }) => {
  const commandRegisteredLTR = React.useRef(false);
  const commandRegisteredRTL = React.useRef(false);

  // Register commands immediately when component mounts
  React.useLayoutEffect(() => {
    if (!commandRegisteredLTR.current && typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setDirectionLTR', () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let element: Node | null = range.commonAncestorContainer;

        // If it's a text node, get the parent element
        if (element && element.nodeType === Node.TEXT_NODE) {
          element = element.parentElement;
        }

        // Find the nearest block-level element (paragraph, div, etc.)
        while (element && element !== document.body) {
          const htmlElement = element as HTMLElement;
          if (htmlElement.tagName && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'].includes(htmlElement.tagName)) {
            // Remove the dir attribute
            htmlElement.removeAttribute('dir');
            break;
          }
          element = htmlElement.parentElement;
        }
      });
      commandRegisteredLTR.current = true;
    }

    if (!commandRegisteredRTL.current && typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setDirectionRTL', () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let element: Node | null = range.commonAncestorContainer;

        // If it's a text node, get the parent element
        if (element && element.nodeType === Node.TEXT_NODE) {
          element = element.parentElement;
        }

        // Find the nearest block-level element (paragraph, div, etc.)
        while (element && element !== document.body) {
          const htmlElement = element as HTMLElement;
          if (htmlElement.tagName && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'].includes(htmlElement.tagName)) {
            // Set the dir attribute to "rtl"
            htmlElement.setAttribute('dir', 'rtl');
            break;
          }
          element = htmlElement.parentElement;
        }
      });
      commandRegisteredRTL.current = true;
    }
  }, []);

  return <>{children}</>;
};
