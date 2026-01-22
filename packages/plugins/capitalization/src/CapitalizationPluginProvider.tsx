import React, { ReactNode } from 'react';

interface CapitalizationPluginProviderProps {
  children: ReactNode;
}

export const CapitalizationPluginProvider: React.FC<CapitalizationPluginProviderProps> = ({ children }) => {
  const commandRegistered = React.useRef(false);

  // Register command immediately when component mounts
  React.useLayoutEffect(() => {
    if (!commandRegistered.current && typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setCapitalization', (value: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        if (selectedText) {
          let newText: string;

          switch (value) {
            case 'lowercase':
              newText = selectedText.toLowerCase();
              break;
            case 'uppercase':
              newText = selectedText.toUpperCase();
              break;
            case 'titlecase':
              newText = selectedText.replace(/\w\S*/g, (txt) =>
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
              );
              break;
            default:
              return;
          }

          // Replace the selected text
          range.deleteContents();
          const textNode = document.createTextNode(newText);
          range.insertNode(textNode);

          // Restore selection to the end of the inserted text
          selection.removeAllRanges();
          const newRange = document.createRange();
          newRange.setStartAfter(textNode);
          newRange.setEndAfter(textNode);
          selection.addRange(newRange);
        }
      });
      commandRegistered.current = true;
    }
  }, []);

  return <>{children}</>;
};
